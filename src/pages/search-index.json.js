import { categories } from '../data/categories.js';
import { produse } from '../data/catalog.mjs';

// Index compact pentru cautarea din prima pagina (toate produsele active).
// Se descarca doar cand vizitatorul incepe sa scrie. Ca sa fie mic:
//  - categoriile sunt indici in lista "c"
//  - imaginile sunt impartite in prefix (lista "ip") + restul adresei
//  - linkurile 2Performant pastreaza doar codurile (campania in lista "cu")
// Format produs: [titlu, brand, [categorii], pret, pret_vechi, prefix_img, rest_img, campanie, cod_link]
//   campanie = -1 inseamna ca cod_link e adresa completa (link care nu e 2Performant).
const AFF = /^https:\/\/event\.2performant\.com\/events\/click\?ad_type=product_store&unique=([^&]+)&aff_code=676a7e7d9&campaign_unique=([^&]+)$/;

export async function GET() {
  const catIdx = new Map(categories.map((c, i) => [c.slug, i]));
  const ip = [], ipIdx = new Map();
  const cu = [], cuIdx = new Map();
  const idx = (list, map, v) => {
    if (!map.has(v)) { map.set(v, list.length); list.push(v); }
    return map.get(v);
  };

  const p = [];
  for (const x of produse) {
    if (!x.affiliate_url) continue;
    const img = x.image_url || '';
    const cut = img.lastIndexOf('/') + 1;
    const m = AFF.exec(x.affiliate_url);
    p.push([
      x.title,
      x.brand || '',
      x.category.map((c) => catIdx.get(c)).filter((i) => i !== undefined),
      x.price,
      x.old_price && x.old_price > x.price ? x.old_price : 0,
      idx(ip, ipIdx, img.slice(0, cut)),
      img.slice(cut),
      m ? idx(cu, cuIdx, m[2]) : -1,
      m ? m[1] : x.affiliate_url,
    ]);
  }

  const c = categories.map((k) => [k.slug, k.name]);
  return new Response(JSON.stringify({ c, ip, cu, p }), { headers: { 'Content-Type': 'application/json' } });
}
