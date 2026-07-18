const axios = require('axios');
const cheerio = require('cheerio');
const { parsePrice, BROWSER_HEADERS, withRetry } = require('../helpers.cjs');

// CONFIRMAT cu HTML real trimis de Marius (16.07.2026).
// <ins class="ProductPrice-Price"><span class="ProductPrice-PriceValue">
// = pret curent. <del class="ProductPrice-HighPrice"> = pret vechi (doar cand
// exista reducere).
const PRICE_SELECTOR = '.ProductPrice-PriceValue';
const OLD_PRICE_SELECTOR = '.ProductPrice-HighPrice';

async function scrapeOne(product) {
  const res = await withRetry(() =>
    axios.get(product.official_url, {
      timeout: 15000,
      headers: BROWSER_HEADERS,
    })
  );
  const $ = cheerio.load(res.data);

  const priceText = $(PRICE_SELECTOR).first().text();
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

module.exports = { scrapeOne, source: 'farmec.ro' };
