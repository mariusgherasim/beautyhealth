import fs from 'node:fs';
import path from 'node:path';
import { categories } from '../../data/categories.js';
import { produseCategorie, produseBrand, brandsCategorie } from '../../data/catalog.mjs';

// Fereastra de sugestii de pe prima pagina: toate categoriile si toate brandurile
// de pe randurile categoriilor, fiecare cu pana la 12 produse (cu imagine).
// Fereastra afiseaza 6 categorii + 6 branduri aleatorii si 8 produse aleatorii din fiecare.
const PRODUSE_PE_GRUP = 12;
const LOGO_EXT = ['svg', 'png', 'webp', 'jpg'];

function amesteca(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
const scurt = (p) => ({
  id: p.id, t: p.title, b: p.brand || '', pr: p.price,
  op: p.old_price && p.old_price > p.price ? p.old_price : null,
  img: p.image_url, u: p.affiliate_url,
});
const mostra = (list) => amesteca(list.filter((p) => p.image_url && p.affiliate_url)).slice(0, PRODUSE_PE_GRUP).map(scurt);
function logoPentru(slug) {
  for (const ext of LOGO_EXT) {
    if (fs.existsSync(path.join(process.cwd(), 'public', 'logos', `${slug}.${ext}`))) return `/logos/${slug}.${ext}`;
  }
  return null;
}

export async function GET() {
  const tipuri = categories
    .map((c) => {
      const list = produseCategorie(c.slug);
      return { slug: c.slug, name: c.name, url: `/${c.slug}/`, count: list.length, p: mostra(list) };
    })
    .filter((g) => g.p.length > 0);

  // Un brand poate fi pe randul mai multor categorii: produsele se unesc, iar linkul
  // duce la categoria in care brandul are cele mai multe produse.
  const map = new Map();
  for (const c of categories) {
    for (const b of brandsCategorie(c.slug)) {
      const list = produseBrand(c.slug, b.slug);
      const e = map.get(b.slug) || { slug: b.slug, name: b.name, best: null, all: [] };
      e.all.push(...list);
      if (!e.best || list.length > e.best.n) e.best = { cat: c.slug, n: list.length };
      map.set(b.slug, e);
    }
  }
  const branduri = [...map.values()]
    .map((e) => {
      const unice = [...new Map(e.all.map((p) => [p.id, p])).values()];
      return { slug: e.slug, name: e.name, url: `/${e.best.cat}/brand/${e.slug}/`, count: unice.length, logo: logoPentru(e.slug), p: mostra(unice) };
    })
    .filter((g) => g.p.length > 0);

  return new Response(JSON.stringify({ tipuri, branduri }), { headers: { 'Content-Type': 'application/json' } });
}
