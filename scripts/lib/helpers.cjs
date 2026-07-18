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
      return str.slice(offset + 1).includes(',') ? '' : m;
    })
    .replace(',', '.');
  const match = cleaned.match(/[\d.]+/);
  return match ? parseFloat(match[0]) : null;
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

// User-Agent de browser real (Chrome pe Windows) - un UA care se auto-declara
// bot ("BeautyHealthBot/1.0") e blocat automat de multe protectii anti-bot
// (Cloudflare, WAF-uri) inainte sa ajunga macar la continutul paginii.
const BROWSER_HEADERS = {
  'User-Agent':
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
  'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
  'Accept-Language': 'ro-RO,ro;q=0.9,en-US;q=0.8,en;q=0.7',
};

/** Reincearca o functie async de max N ori, cu backoff exponential. */
async function withRetry(fn, retries = 2, baseDelayMs = 500) {
  let lastErr;
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      return await fn();
    } catch (err) {
      lastErr = err;
      if (attempt < retries) {
        await sleep(baseDelayMs * Math.pow(2, attempt));
      }
    }
  }
  throw lastErr;
}

module.exports = { createLimiter, parsePrice, sleep, BROWSER_HEADERS, withRetry };
