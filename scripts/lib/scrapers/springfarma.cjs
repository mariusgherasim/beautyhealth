const axios = require('axios');
const cheerio = require('cheerio');

// CONFIRMAT cu HTML real trimis de Marius (produs #9622, 16.07.2026).
// Magento: pretul e in atributul data-price-amount, mult mai sigur decat
// parsarea textului (evita probleme cu separator zecimal/spatii/nbsp).
const PRICE_SELECTOR = '[data-price-type="finalPrice"]';
const OLD_PRICE_SELECTOR = '[data-price-type="oldPrice"]';

// TODO: NU inca confirmat - presupunere, de verificat cu Inspect Element pe
// o pagina reala cu produs indisponibil (nu am avut un exemplu de asta).
const OUT_OF_STOCK_SELECTOR = '.stock.unavailable, .out-of-stock';

async function scrapeOne(product) {
  const res = await axios.get(product.official_url, {
    timeout: 15000,
    headers: { 'User-Agent': 'Mozilla/5.0 (compatible; BeautyHealthBot/1.0)' },
  });
  const $ = cheerio.load(res.data);

  if ($(OUT_OF_STOCK_SELECTOR).length > 0) {
    return { price: product.price, old_price: product.old_price, availability: false };
  }

  const priceAttr = $(PRICE_SELECTOR).first().attr('data-price-amount');
  const oldPriceAttr = $(OLD_PRICE_SELECTOR).first().attr('data-price-amount');

  const price = priceAttr ? parseFloat(priceAttr) : null;
  const oldPrice = oldPriceAttr ? parseFloat(oldPriceAttr) : null;

  if (price == null) {
    throw new Error(`Nu am gasit pret pentru ${product.official_url} (selector de verificat)`);
  }

  return {
    price,
    old_price: oldPrice && oldPrice > price ? oldPrice : null,
    availability: true,
  };
}

module.exports = { scrapeOne, source: 'springfarma.com' };
