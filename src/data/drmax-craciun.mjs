// ============================================================
// CADOURI DE CRĂCIUN LA DR. MAX — 16 noiembrie – 31 decembrie 2026
// Folosit de src/pages/cadouri-craciun-dr-max.astro (pagina) și de stickerul din Layout.astro.
//
// Produsele vin din feedul Dr. Max (catalogul site-ului), alese la fiecare build după
// brandurile și tipurile de produse din campanie. Dacă Dr. Max adaugă în feed produse noi
// de la aceste branduri, apar singure pe pagină.
// Prețurile și reducerile din OFERTE sunt cele anunțate de Dr. Max pentru campanie
// (mesajul din 2Performant, 14.11.2026) — nu le calculăm noi.
// ============================================================
import { produse } from './catalog.mjs';

export const START = '2026-11-16T00:00:00+02:00';
export const END = '2026-12-31T23:59:59+02:00';
export const URL_PAGINA = '/cadouri-craciun-dr-max/';

// Quicklink 2Performant spre landing page-ul campaniei (drmax.ro/cadouri)
const ql = (cale) => `https://event.2performant.com/events/click?ad_type=quicklink&aff_code=676a7e7d9&unique=6390e3cfb&redirect_to=https%253A//www.drmax.ro${cale}`;
export const LINK_DRMAX = ql('/cadouri');

const dm = produse.filter((p) => p.source_site === 'drmax.ro' && p.availability);
const T = (p) => p.title || '';
const S = (p) => p.subcategory_raw || '';
const are = (p, c) => (p.category || []).includes(c);

const BRAND_PARFUM = /\b(calvin klein|davidoff|escada|joop!?|vera wang|sentio)\b/i;
const eUnisex = (p) => /unisex|\bck (all|be|one)\b/i.test(T(p));
const eBarbat = (p) => !eUnisex(p) && /barbat|\bmen\b|\bhomme\b|\(m\)/i.test(`${T(p)} ${S(p)}`);
const eFemeie = (p) => !eUnisex(p) && !eBarbat(p) && /dama|femei|woman|\(w\)/i.test(`${T(p)} ${S(p)}`);

const parfumuri = dm.filter((p) => are(p, 'parfumuri') && BRAND_PARFUM.test(T(p)));
// parfumurile de brand întâi (Calvin Klein, Davidoff, Escada, Joop!, Vera Wang), apoi Sentio; în fiecare, de la ieftin la scump
const ordine = (a, b) => (/sentio/i.test(T(a)) - /sentio/i.test(T(b))) || a.price - b.price;
const ieftin = (a, b) => a.price - b.price;
const MAX = 24;

export const GRUPE = [
  {
    id: 'ea', pentru: 'Pentru ea', titlu: 'Parfumuri pentru ea',
    desc: 'Calvin Klein, Escada, Vera Wang, Davidoff și Sentio.',
    produse: parfumuri.filter(eFemeie).sort(ordine),
  },
  {
    id: 'ea-seturi', pentru: 'Pentru ea', titlu: 'Seturi de îngrijire și machiaj pentru ea',
    desc: 'Seturi Korres pentru ten, palete și seturi Magic Studio, calendare de Advent și seturi cadou.',
    produse: dm.filter((p) => !eBarbat(p) && !are(p, 'cosmetice-barbati') && (
      /^set\b.*korres/i.test(T(p)) || /magic studio/i.test(T(p)) || /advent/i.test(T(p)) || /\bset cadou\b/i.test(T(p))
    )).sort(ieftin),
  },
  {
    id: 'el', pentru: 'Pentru el', titlu: 'Parfumuri și seturi pentru el',
    desc: 'Calvin Klein, Davidoff, Joop! și Sentio, plus seturi de îngrijire pentru bărbați.',
    produse: [
      ...parfumuri.filter(eBarbat).sort(ordine),
      ...dm.filter((p) => !are(p, 'parfumuri') && ((are(p, 'cosmetice-barbati') && /\b(set|trusa)\b/i.test(T(p))) || (/idc institute/i.test(T(p)) && /barbat/i.test(T(p))))).sort(ieftin),
    ],
  },
  {
    id: 'unisex', pentru: 'Unisex', titlu: 'Cadouri unisex și de răsfăț',
    desc: 'Parfumuri unisex, seturi IDC Institute și gelurile de duș Biovène, de la 19,99 lei.',
    produse: [
      ...parfumuri.filter(eUnisex).sort(ordine),
      ...dm.filter((p) => /\bidc institute\b/i.test(T(p)) && /\b(set|trusa|cutie)\b/i.test(T(p)) && !/barbat/i.test(T(p))).sort(ieftin),
      ...dm.filter((p) => /\bbiovene\b/i.test(T(p))).sort(ieftin),
    ],
  },
  {
    id: 'copii', pentru: 'Pentru copii', titlu: 'Cadouri pentru copii',
    desc: 'Jucării pentru cei mici și dermatocosmetice pentru copii.',
    produse: dm.filter((p) => are(p, 'mama-si-copilul') && (/jucari/i.test(S(p)) || (/dermatocosmetice pentru copii/i.test(S(p)) && /\b(set|parfum)\b/i.test(T(p))))).sort(ieftin),
  },
  {
    id: 'bunici', pentru: 'Pentru bunici', titlu: 'Cadouri practice pentru bunici',
    desc: 'Tensiometre și aparate de masaj, cadouri de folosit în fiecare zi.',
    produse: dm.filter((p) => !are(p, 'mama-si-copilul') && /^(tensiometru|aparat de masaj|perna (electrica|de masaj))/i.test(T(p))).sort(ieftin),
  },
].map((g) => ({ ...g, total: g.produse.length, produse: g.produse.slice(0, MAX) })).filter((g) => g.produse.length);

// Ofertele anunțate de Dr. Max (prețuri de campanie). `cauta` găsește produsul în catalog;
// dacă nu e (încă) în feed, butonul duce la landing page-ul campaniei.
const OFERTE_ANUNTATE = [
  { nume: 'Davidoff Champion Man EDT 90 ml', pret: '99,99', reducere: '−74%', cauta: /davidoff champion/i },
  { nume: 'Joop! Homme Wild EDT 125 ml', pret: '119,99', reducere: '−67%', cauta: /joop.*wild/i },
  { nume: 'Calvin Klein Eternity Air Woman EDP 100 ml', pret: '149,99', reducere: '−66%', cauta: /parfum pentru femei eternity air, 100ml/i },
  { nume: 'Escada Celebrate N.O.W. Woman EDP 80 ml', pret: '149,99', reducere: '−66%', cauta: /celebrate n\.?o\.?w/i },
  { nume: 'Calvin Klein Obsession Men EDT 75 ml', pret: '99,99', reducere: '−64%', cauta: /obsession for men, 75ml/i },
  { nume: 'IDC Institute Candy Set', pret: '19,99', reducere: '−60%', cauta: /idc institute.*candy|candy.*idc institute/i },
];
export const OFERTE = OFERTE_ANUNTATE.map((o) => {
  const p = dm.find((x) => o.cauta.test(T(x)));
  return { ...o, link: p ? p.affiliate_url : LINK_DRMAX, imagine: p ? p.image_url : null, inCatalog: !!p };
});

export const NR_PRODUSE = GRUPE.reduce((s, g) => s + g.total, 0);
