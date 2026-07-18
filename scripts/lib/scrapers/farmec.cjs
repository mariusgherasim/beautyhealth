const { parsePrice } = require('../helpers.cjs');

// CORECTAT (18.07.2026): farmec.ro e o aplicatie JavaScript (SPA) - raspunsul
// brut de la server e doar "You need to enable JavaScript to run this app.",
// fara continut real. cheerio/axios NU pot randa JS, deci nu vor gasi
// niciodata pretul, indiferent de selector. Solutia: Playwright (browser
// headless real), doar pentru aceasta sursa - celelalte 3 raman pe
// cheerio/axios (mult mai rapide, si merg bine acolo unde site-ul e
// randat server-side).
//
// Selectoare confirmate cu HTML real trimis de Marius (Inspect Element,
// deci DUPA randare JS): .ProductPrice-PriceValue (curent),
// .ProductPrice-HighPrice (vechi, doar cand exista reducere).
const PRICE_SELECTOR = '.ProductPrice-PriceValue';
const OLD_PRICE_SELECTOR = '.ProductPrice-HighPrice';

async function scrapeOne(product, browser) {
  const page = await browser.newPage({
    userAgent:
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
  });
  try {
    await page.goto(product.official_url, { waitUntil: 'networkidle', timeout: 25000 });
    // asteapta explicit elementul de pret, ca sa nu citim pagina inainte sa
    // se termine randarea JS (react/vue etc.)
    await page.waitForSelector(PRICE_SELECTOR, { timeout: 10000 }).catch(() => {});

    const priceText = await page.locator(PRICE_SELECTOR).first().textContent().catch(() => null);
    const oldPriceText = await page.locator(OLD_PRICE_SELECTOR).first().textContent().catch(() => null);

    const price = parsePrice(priceText);
    const oldPrice = parsePrice(oldPriceText);

    if (price == null) {
      throw new Error(`Nu am gasit pret pentru ${product.official_url} (pagina JS - selector sau timing de verificat)`);
    }

    return {
      price,
      old_price: oldPrice && oldPrice > price ? oldPrice : null,
      availability: true,
    };
  } finally {
    await page.close();
  }
}

module.exports = { scrapeOne, source: 'farmec.ro', needsBrowser: true };
