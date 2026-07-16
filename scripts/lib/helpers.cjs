// Helpers comune pentru toate scraper-ele de preț.

/** Limitator simplu de concurență, fără dependințe externe (înlocuiește p-limit). */
function createLimiter(concurrency) {
  let active = 0;
  const queue = [];
  const next = () => {
    if (active >= concurrency || queue.length === 0) return;
    active++;
    const { fn, resolve, reject } = queue.shift();
    fn()
      .then(resolve, reject)
      .finally(() => {
        active--;
        next();
      });
  };
  return (fn) =>
    new Promise((resolve, reject) => {
      queue.push({ fn, resolve, reject });
      next();
    });
}

/** Extrage un număr dintr-un text de tip "129,99 Lei" / "129.99 RON" etc. */
function parsePrice(text) {
  if (!text) return null;
  const cleaned = text
    .replace(/\s/g, '')
    .replace(/(lei|ron|€|eur)/gi, '')
    .replace(/\./g, (m, offset, str) => {
      // dacă e separator de mii (ex: 1.299,99) elimină punctul; altfel îl păstrează ca zecimală
      return str.slice(offset + 1).includes(',') ? '' : m;
    })
    .replace(',', '.');
  const match = cleaned.match(/[\d.]+/);
  return match ? parseFloat(match[0]) : null;
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

module.exports = { createLimiter, parsePrice, sleep };
