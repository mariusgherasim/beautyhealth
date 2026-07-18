const axios = require('axios');
const cheerio = require('cheerio');
const { parsePrice, BROWSER_HEADERS, withRetry, withHardTimeout } = require('../helpers.cjs');

// CONFIRMAT cu HTML real trimis de Marius (produs #3058, 16.07.2026). PrestaShop.
// Pretul curent e in atributul "content" (mai sigur decat text), pretul vechi
// doar ca text.
const PRICE_SELECTOR = '.product-price[itemprop="price"]';
const OLD_PRICE_SELECTOR = '.regular-price';

// Text de referinta gasit in exemplul "in stoc": "In stoc - livrare imediata"
// intr-un <span id="product-availability">. Presupunem ca varianta de "stoc
// epuizat" nu contine "In stoc" in text - de reconfirmat daca apar erori.
const AVAILABILITY_SELECTOR = '#product-availability';

async function scrapeOne(product) {
  const res = await withRetry(() =>
    withHardTimeout(
      axios.get(product.official_url, {
        timeout: 15000,
        headers: BROWSER_HEADERS,
      }),
      20000,
      product.official_url
    )
  );
  const $ = cheerio.load(res.data);

  const priceAttr = $(PRICE_SELECTOR).first().attr('content');
  const price = priceAttr ? parseFloat(priceAttr) : parsePrice($(PRICE_SELECTOR).first().text());

  const oldPriceText = $(OLD_PRICE_SELECTOR).first().text();
  const oldPrice = parsePrice(oldPriceText);

  if (price == null) {
    throw new Error(`Nu am gasit pret pentru ${product.official_url} (selector de verificat)`);
  }

  const availabilityText = $(AVAILABILITY_SELECTOR).first().text();
  const availability = /in stoc/i.test(availabilityText) || availabilityText.trim() === '';

  return {
    price,
    old_price: oldPrice && oldPrice > price ? oldPrice : null,
    availability,
  };
}

module.exports = { scrapeOne, source: 'minuneanaturii.ro' };
