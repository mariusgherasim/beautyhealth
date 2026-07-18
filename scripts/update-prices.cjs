#!/usr/bin/env node
/**
 * Actualizare zilnica de preturi pentru BeautyHealth.
 * Ruleaza automat prin GitHub Actions (.github/workflows/update-prices.yml) la 03:00 UTC.
 *
 * IMPORTANT: nu foloseste feed-ul XML de la 2Performant ca sursa de pret (preturile din
 * feed intarzie fata de site-ul oficial) - scraping direct pe official_url, la fel ca la
 * shop.gherasimmarius.com si carti.gherasimmarius.com.
 *
 * Toate cele 4 surse (springfarma, minuneanaturii, infinitelove, farmec) sunt randate
 * server-side, deci merg toate cu cheerio/axios - nu e nevoie de Playwright/Chromium.
 *
 * ISTORIC (16.07.2026): prima rulare reala a esuat masiv (221 ok / 13312 esuate din
 * 13533), foarte probabil blocare anti-bot (Cloudflare/WAF) pe springfarma.com dupa un
 * burst initial de request-uri de pe IP-ul GitHub Actions. Fix-uri aplicate:
 *   - User-Agent de browser real (nu mai auto-declaram "BeautyHealthBot") + headere
 *     Accept/Accept-Language, in helpers.cjs (BROWSER_HEADERS).
 *   - Retry cu backoff exponential per request (withRetry in helpers.cjs).
 *   - Concurenta si delay separate PER SURSA (springfarma - cea mai mare si probabil
 *     cea mai protejata - are concurenta mai mica si delay mai mare).
 *   - "Circuit breaker": daca o sursa acumuleaza prea multe esecuri consecutive,
 *     restul produselor din sursa aia sunt sarite (nu mai insistam degeaba ore
 *     intregi impotriva unui blocaj activ) - apar in raport ca "skipped".
 *   - Primele erori se afiseaza direct in consola Actions (nu doar in update-report.json,
 *     care oricum nu se mai pierde acum - vezi fix-ul din workflow: commit-ul ruleaza
 *     mereu, chiar daca scriptul iese cu cod de eroare).
 */

const fs = require('fs');
const path = require('path');
const { createLimiter, sleep, withRetry } = require('./lib/helpers.cjs');

const springfarma = require('./lib/scrapers/springfarma.cjs');
const minuneanaturii = require('./lib/scrapers/minuneanaturii.cjs');
const infinitelove = require('./lib/scrapers/infinitelove.cjs');
const farmec = require('./lib/scrapers/farmec.cjs');

const PRODUCTS_PATH = path.join(__dirname, '../src/data/products.json');
const REPORT_PATH = path.join(__dirname, '../update-report.json');

// Concurenta si delay PER SURSA - springfarma e mult mai mare (~12.500 produse)
// si mai probabil sa aiba protectie anti-bot, deci mai conservator acolo.
const SOURCE_CONFIG = {
  'springfarma.com': { scraper: springfarma, concurrency: 3, delayMs: 700 },
  'minuneanaturii.ro': { scraper: minuneanaturii, concurrency: 4, delayMs: 400 },
  'infinitelove.ro': { scraper: infinitelove, concurrency: 4, delayMs: 400 },
  'farmec.ro': { scraper: farmec, concurrency: 4, delayMs: 400 },
};

// Circuit breaker: daca o sursa acumuleaza atatea esecuri CONSECUTIVE, o consideram
// blocata si sarim peste restul produselor ei (economisim timp + nu mai lovim un site
// care ne-a blocat deja).
const CIRCUIT_BREAKER_THRESHOLD = 25;

async function main() {
  const products = JSON.parse(fs.readFileSync(PRODUCTS_PATH, 'utf-8'));
  const toUpdate = products.filter((p) => !p.draft);

  console.log(`Produse de actualizat: ${toUpdate.length} din ${products.length} total`);

  const bySource = {};
  for (const p of toUpdate) {
    (bySource[p.source_site] ||= []).push(p);
  }

  const report = { started_at: new Date().toISOString(), ok: 0, failed: 0, skipped: 0, errors: [], by_source: {} };

  for (const [sourceSite, sourceProducts] of Object.entries(bySource)) {
    const config = SOURCE_CONFIG[sourceSite];
    const sourceReport = { total: sourceProducts.length, ok: 0, failed: 0, skipped: 0 };
    report.by_source[sourceSite] = sourceReport;

    if (!config) {
      sourceReport.skipped = sourceProducts.length;
      report.skipped += sourceProducts.length;
      report.errors.push({ id: sourceProducts[0].id, reason: 'sursa necunoscuta: ' + sourceSite });
      continue;
    }

    console.log(`\n--- ${sourceSite}: ${sourceProducts.length} produse (concurenta ${config.concurrency}, delay ${config.delayMs}ms) ---`);

    const limit = createLimiter(config.concurrency);
    let consecutiveFailures = 0;
    let circuitOpen = false;

    await Promise.all(
      sourceProducts.map((product) =>
        limit(async () => {
          if (circuitOpen) {
            sourceReport.skipped++;
            report.skipped++;
            return;
          }
          try {
            const result = await config.scraper.scrapeOne(product);
            product.price = result.price;
            product.old_price = result.old_price;
            product.availability = result.availability;
            product.last_price_check = new Date().toISOString();
            sourceReport.ok++;
            report.ok++;
            consecutiveFailures = 0;
          } catch (err) {
            sourceReport.failed++;
            report.failed++;
            consecutiveFailures++;
            report.errors.push({ id: product.id, url: product.official_url, reason: err.message });
            if (consecutiveFailures >= CIRCUIT_BREAKER_THRESHOLD && !circuitOpen) {
              circuitOpen = true;
              console.error(
                `  [CIRCUIT BREAKER] ${sourceSite}: ${consecutiveFailures} esecuri consecutive - ` +
                `sar peste restul produselor din aceasta sursa (probabil blocare anti-bot).`
              );
            }
          } finally {
            await sleep(config.delayMs);
          }
        })
      )
    );

    console.log(`  ${sourceSite}: ${sourceReport.ok} ok, ${sourceReport.failed} esuate, ${sourceReport.skipped} sarite (circuit breaker)`);
  }

  fs.writeFileSync(PRODUCTS_PATH, JSON.stringify(products, null, 0), 'utf-8');
  report.finished_at = new Date().toISOString();
  fs.writeFileSync(REPORT_PATH, JSON.stringify(report, null, 2), 'utf-8');

  console.log(`\n=== Actualizare completa: ${report.ok} ok, ${report.failed} esuate, ${report.skipped} sarite ===`);

  if (report.errors.length > 0) {
    console.log('\nPrimele 10 erori (motiv):');
    for (const e of report.errors.slice(0, 10)) {
      console.log(`  - ${e.id}: ${e.reason}`);
    }
  }

  const totalAttempted = report.ok + report.failed;
  if (totalAttempted > 0 && report.failed / totalAttempted > 0.1) {
    console.error('\nATENTIE: peste 10% dintre request-uri au esuat - verifica selectoarele CSS sau o posibila blocare anti-bot.');
    process.exitCode = 1;
  }
}

main().catch((err) => {
  console.error('Eroare fatala in update-prices.cjs:', err);
  process.exitCode = 1;
});
