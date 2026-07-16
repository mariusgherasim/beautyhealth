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
 * server-side, deci merg toate cu cheerio/axios - NU mai e nevoie de Playwright/Chromium
 * (mai rapid, mai putine dependinte, fara nevoie de "npx playwright install" in CI).
 *
 * ATENTIE LA SCARA: exista ~13.500 produse active. La 13.500 request-uri/zi, chiar cu
 * concurenta, rularea poate dura ore intregi si poate atrage rate-limiting / blocare de
 * la site-urile sursa. Recomandari:
 *   - CONCURRENCY si DELAY_MS de mai jos sunt setate conservator - ajusteaza cu grija.
 *   - Ia in calcul rotirea: nu tot catalogul in fiecare noapte, ci ex. springfarma
 *     impartit in 3-4 loturi (zile diferite ale saptamanii), pastrand celelalte 3
 *     surse (mult mai mici) zilnic.
 *   - Monitorizeaza fisierul update-report.json dupa fiecare rulare pentru erori in masa
 *     (semn ca un selector CSS s-a schimbat sau ca site-ul sursa blocheaza bot-ul).
 */

const fs = require('fs');
const path = require('path');
const { createLimiter, sleep } = require('./lib/helpers.cjs');

const springfarma = require('./lib/scrapers/springfarma.cjs');
const minuneanaturii = require('./lib/scrapers/minuneanaturii.cjs');
const infinitelove = require('./lib/scrapers/infinitelove.cjs');
const farmec = require('./lib/scrapers/farmec.cjs');

const PRODUCTS_PATH = path.join(__dirname, '../src/data/products.json');
const REPORT_PATH = path.join(__dirname, '../update-report.json');

const CONCURRENCY = 8;
const DELAY_MS = 200; // pauza mica intre request-uri, per slot de concurenta

const SCRAPERS = {
  'springfarma.com': springfarma,
  'minuneanaturii.ro': minuneanaturii,
  'infinitelove.ro': infinitelove,
  'farmec.ro': farmec,
};

async function main() {
  const products = JSON.parse(fs.readFileSync(PRODUCTS_PATH, 'utf-8'));
  // filtreaza doar produsele active (draft:false) - nu are sens sa cheltuim timp
  // de scraping pe produse care oricum nu sunt afisate pe site
  const toUpdate = products.filter((p) => !p.draft);

  console.log(`Produse de actualizat: ${toUpdate.length} din ${products.length} total`);

  const limit = createLimiter(CONCURRENCY);
  const report = { started_at: new Date().toISOString(), ok: 0, failed: 0, errors: [] };

  await Promise.all(
    toUpdate.map((product) =>
      limit(async () => {
        const scraper = SCRAPERS[product.source_site];
        if (!scraper) {
          report.failed++;
          report.errors.push({ id: product.id, reason: 'sursa necunoscuta: ' + product.source_site });
          return;
        }
        try {
          const result = await scraper.scrapeOne(product);

          product.price = result.price;
          product.old_price = result.old_price;
          product.availability = result.availability;
          product.last_price_check = new Date().toISOString();
          report.ok++;
        } catch (err) {
          report.failed++;
          report.errors.push({ id: product.id, url: product.official_url, reason: err.message });
        } finally {
          await sleep(DELAY_MS);
        }
      })
    )
  );

  fs.writeFileSync(PRODUCTS_PATH, JSON.stringify(products, null, 0), 'utf-8');
  report.finished_at = new Date().toISOString();
  fs.writeFileSync(REPORT_PATH, JSON.stringify(report, null, 2), 'utf-8');

  console.log(`Actualizare completa: ${report.ok} ok, ${report.failed} esuate.`);
  if (report.failed > toUpdate.length * 0.1) {
    console.error('ATENTIE: peste 10% dintre request-uri au esuat - verifica selectoarele CSS!');
    process.exitCode = 1;
  }
}

main().catch((err) => {
  console.error('Eroare fatala in update-prices.cjs:', err);
  process.exitCode = 1;
});
