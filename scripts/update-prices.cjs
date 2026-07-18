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

// Concurenta si delay PER SURSA. springfarma/minuneanaturii au tiparul unui
// rate-limit clasic (merg bine primele ~90-100 request-uri, apoi 403 solid) -
// concurenta redusa drastic + delay mare, ca sa stam sub orice prag de genul
// "X request-uri/minut". cooldownMs = cat asteptam dupa ce circuit breaker-ul
// se declanseaza, inainte sa incercam din nou (nu renuntam definitiv).
const SOURCE_CONFIG = {
  'springfarma.com': { scraper: springfarma, concurrency: 1, delayMs: 2500, cooldownMs: 5 * 60 * 1000, maxCooldowns: 3 },
  'minuneanaturii.ro': { scraper: minuneanaturii, concurrency: 1, delayMs: 2000, cooldownMs: 5 * 60 * 1000, maxCooldowns: 3 },
  'infinitelove.ro': { scraper: infinitelove, concurrency: 4, delayMs: 400, cooldownMs: 0, maxCooldowns: 0 },
  'farmec.ro': { scraper: farmec, concurrency: 2, delayMs: 500, cooldownMs: 0, maxCooldowns: 0 }, // Playwright = mai greu, browser real per request
};

// Circuit breaker: daca o sursa acumuleaza atatea esecuri CONSECUTIVE, o consideram
// blocata si sarim peste restul produselor ei (economisim timp + nu mai lovim un site
// care ne-a blocat deja).
const CIRCUIT_BREAKER_THRESHOLD = 25;

// Filtrare optionala de surse via --sources=site1.com,site2.com (CLI) sau
// variabila de mediu UPDATE_PRICES_SOURCES. Fara filtru => toate sursele.
// Folosit ca sa separam sursele care merg din GitHub Actions (infinitelove,
// farmec) de cele blocate acolo si rulate local (springfarma, minuneanaturii)
// - vezi "npm run update-prices:cloud" / "npm run update-prices:local" in
// package.json si sectiunea despre rulare locala din REMEMBER.md.
function getSourceFilter() {
  const cliArg = process.argv.find((a) => a.startsWith('--sources='));
  const raw = cliArg ? cliArg.split('=')[1] : process.env.UPDATE_PRICES_SOURCES;
  if (!raw) return null;
  return raw.split(',').map((s) => s.trim()).filter(Boolean);
}

async function main() {
  const products = JSON.parse(fs.readFileSync(PRODUCTS_PATH, 'utf-8'));
  const sourceFilter = getSourceFilter();
  const toUpdate = products.filter(
    (p) => !p.draft && (!sourceFilter || sourceFilter.includes(p.source_site))
  );

  if (sourceFilter) {
    console.log(`Filtru de surse activ: ${sourceFilter.join(', ')}`);
  }
  console.log(`Produse de actualizat: ${toUpdate.length} din ${products.length} total`);

  // Prioritizare: cele mai vechi verificate primele (niciodata verificate =
  // cele mai prioritare). Fara asta, la fiecare rulare care nu apuca sa
  // termine tot catalogul (ex. springfarma, 12.500 produse), s-ar bloca
  // mereu pe aceleasi primele produse din lista, iar restul n-ar fi
  // actualizate NICIODATA. Cu prioritizarea asta, acoperirea se roteste
  // treptat prin tot catalogul, chiar daca fiecare rulare acopera doar o
  // felie din el (din cauza cooldown-urilor / circuit breaker).
  toUpdate.sort((a, b) => {
    const aTime = a.last_price_check ? new Date(a.last_price_check).getTime() : 0;
    const bTime = b.last_price_check ? new Date(b.last_price_check).getTime() : 0;
    return aTime - bTime;
  });

  const bySource = {};
  for (const p of toUpdate) {
    (bySource[p.source_site] ||= []).push(p);
  }

  // Porneste un browser Playwright DOAR daca vreo sursa are needsBrowser
  // (in acest moment doar farmec.ro, fiind SPA JS) - celelalte raman rapide,
  // pe cheerio/axios, fara sa astepte dupa Chromium.
  let browser = null;
  if (Object.entries(bySource).some(([site]) => SOURCE_CONFIG[site]?.scraper.needsBrowser)) {
    const { chromium } = require('playwright');
    browser = await chromium.launch();
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
    let circuitOpenUntil = 0; // 0 = inchis (functioneaza normal); Infinity = deschis definitiv
    let cooldownCount = 0;
    let processedCount = 0;

    // Heartbeat: afiseaza progres la fiecare 30 secunde, indiferent cate
    // s-au procesat - ca sa fie clar ca scriptul e viu, nu agatat (bug
    // real gasit in productie: fara asta, un run de ore intregi arata
    // identic cu unul blocat, din exterior).
    const heartbeat = setInterval(() => {
      const pct = ((processedCount / sourceProducts.length) * 100).toFixed(1);
      const cooldownNote = Date.now() < circuitOpenUntil ? ' [IN COOLDOWN]' : '';
      console.log(
        `  ... ${sourceSite}: ${processedCount}/${sourceProducts.length} procesate (${pct}%) - ${sourceReport.ok} ok, ${sourceReport.failed} esuate pana acum${cooldownNote}`
      );
    }, 30000);

    await Promise.all(
      sourceProducts.map((product) =>
        limit(async () => {
          if (Date.now() < circuitOpenUntil) {
            sourceReport.skipped++;
            report.skipped++;
            processedCount++;
            return;
          }
          try {
            const result = config.scraper.needsBrowser
              ? await config.scraper.scrapeOne(product, browser)
              : await config.scraper.scrapeOne(product);
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
            if (consecutiveFailures >= CIRCUIT_BREAKER_THRESHOLD && Date.now() >= circuitOpenUntil) {
              consecutiveFailures = 0;
              if (config.cooldownMs > 0 && cooldownCount < config.maxCooldowns) {
                cooldownCount++;
                circuitOpenUntil = Date.now() + config.cooldownMs;
                console.error(
                  `  [COOLDOWN ${cooldownCount}/${config.maxCooldowns}] ${sourceSite}: prea multe esecuri consecutive ` +
                  `(posibil rate-limit) - pauza ${Math.round(config.cooldownMs / 60000)} min, apoi reincerc.`
                );
              } else {
                circuitOpenUntil = Infinity;
                console.error(
                  `  [CIRCUIT BREAKER PERMANENT] ${sourceSite}: prea multe esecuri, cooldown-uri epuizate - ` +
                  `sar peste restul produselor din aceasta sursa pentru rularea curenta.`
                );
              }
            }
          } finally {
            processedCount++;
            await sleep(config.delayMs);
          }
        })
      )
    );

    clearInterval(heartbeat);
    console.log(`  ${sourceSite}: ${sourceReport.ok} ok, ${sourceReport.failed} esuate, ${sourceReport.skipped} sarite (circuit breaker/cooldown)`);
  }

  if (browser) await browser.close();

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
