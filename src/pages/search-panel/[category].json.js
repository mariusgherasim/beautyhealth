import fs from 'node:fs';
import path from 'node:path';
import { categories } from '../../data/categories.js';
import { produseTip, produseBrand, tipuriCategorie, brandsCategorie } from '../../data/catalog.mjs';

// Datele ferestrei de cautare: tipurile si brandurile categoriei, fiecare cu
// pana la 12 produse (cu imagine), alese aleator la fiecare build.
// Fereastra afiseaza 6 tipuri + 6 branduri aleatorii si 8 produse aleatorii din fiecare.
const PRODUSE_PE_GRUP = 12;
const LOGO_EXT = ['svg', 'png', 'webp', 'jpg'];

export function getStaticPaths() {
  return categories.map((c) => ({ params: { category: c.slug } }));
}

function amesteca(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const scurt = (p) => ({
  id: p.id,
  t: p.title,
  b: p.brand || '',
  pr: p.price,
  op: p.old_price && p.old_price > p.price ? p.old_price : null,
  img: p.image_url,
  u: p.affiliate_url,
});

function mostra(list) {
  return amesteca(list.filter((p) => p.image_url && p.affiliate_url)).slice(0, PRODUSE_PE_GRUP).map(scurt);
}

function logoPentru(slug) {
  for (const ext of LOGO_EXT) {
    if (fs.existsSync(path.join(process.cwd(), 'public', 'logos', `${slug}.${ext}`))) return `/logos/${slug}.${ext}`;
  }
  return null;
}

export async function GET({ params }) {
  const cat = params.category;
  const tipuri = tipuriCategorie(cat)
    .map((t) => ({ slug: t.slug, name: t.name, url: `/${cat}/tip/${t.slug}/`, count: t.count, p: mostra(produseTip(cat, t.slug)) }))
    .filter((g) => g.p.length > 0);
  const branduri = brandsCategorie(cat)
    .map((b) => ({ slug: b.slug, name: b.name, url: `/${cat}/brand/${b.slug}/`, count: b.count, logo: logoPentru(b.slug), p: mostra(produseBrand(cat, b.slug)) }))
    .filter((g) => g.p.length > 0);

  return new Response(JSON.stringify({ tipuri, branduri }), {
    headers: { 'Content-Type': 'application/json' },
  });
}
