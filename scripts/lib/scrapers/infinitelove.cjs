const axios = require('axios');
const cheerio = require('cheerio');
const { parsePrice, BROWSER_HEADERS, withRetry, withHardTimeout } = require('../helpers.cjs');

// CONFIRMAT cu HTML real trimis de Marius (16.07.2026). WooCommerce + Elementor,
// pretul e randat server-side (nu are nevoie de JS) - am renuntat la Playwright,
// e mai rapid si mai simplu cu cheerio/axios ca la celelalte doua.
// <ins> = pret redus (daca exista oferta), <del> = pret vechi. Fara oferta,
// probabil doar span.price .woocommerce-Price-amount, fara ins/del.
const CURRENT_PRICE_SELECTOR = 'ins .woocommerce-Price-amount, .price > .woocommerce-Price-amount';
const OLD_PRICE_SELECTOR = 'del .woocommerce-Price-amount';

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

  const priceText = $(CURRENT_PRICE_SELECTOR).first().text();
  const oldPriceText = $(OLD_PRICE_SELECTOR).first().text();

  const price = parsePrice(priceText);
  const oldPrice = parsePrice(oldPriceText);

  if (price == null) {
    throw new Error(`Nu am gasit pret pentru ${product.official_url} (selector de verificat)`);
  }

  return {
    price,
    old_price: oldPrice && oldPrice > price ? oldPrice : null,
    availability: true,
  };
}

module.exports = { scrapeOne, source: 'infinitelove.ro' };
