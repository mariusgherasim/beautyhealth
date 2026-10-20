// CATALOG — punctul unic prin care paginile site-ului citesc produsele.
// Se calculeaza o singura data la build:
//   1. Produsele active (fara draft) din products.json
//   2. Reclasificarea in categoriile finale (reguli mai jos)
//   3. Tipurile fiecarui produs (din tipuri.js) si brandurile (din brands.js)
//
// products.json ramane neschimbat — reclasificarea se face doar aici, deci
// regulile se pot modifica oricand, fara sa rulezi din nou sincronizarea.

import productsData from './products.json';
import { categories } from './categories.js';
import { tipuri, MIN_PRODUSE_TIP } from './tipuri.js';
import { brands } from './brands.js';
import { norm, matchKw, any, brandKey, niceCount } from './text.mjs';

// ── REGULI DE RECLASIFICARE ─────────────────────────────────────────────
const KW_CUPLU = ['cuplu si sex', 'prezervativ', 'condom', 'vibrator', 'vibratoare', 'potenta', 'disfunctii erectile', 'erectil', 'sex power', 'libido', 'afrodisiac', 'accesorii sexuale'];
const BRAND_CUPLU = ['SHUNGA EROTIC ART', 'SHUNGA', 'WOW TECH', 'DUREX', 'SATISFYER', 'WE VIBE', 'WOMANIZER', 'ORGIE', 'SVAKOM', 'FUN FACTORY', 'ROMP', 'MONAMI'];
const KW_NU_CUPLU = ['oftalm', 'ocular', 'oculare', 'ochi', 'potent c'];
const KW_SARCINA = ['test de sarcina', 'teste de sarcina', 'ovulatie'];
const KW_MEDICAL = ['dispozitive medicale', 'ciorapi compresivi', 'aparate medicale si de masurat', 'teste rapide si organizatoare', 'dispozitive ajutatoare', 'produse incontinenta', 'tehnico medicale', 'recuperare si ingrijire la domiciliu', 'suporturi ortopedice', 'talonete ortopedice', 'incaltaminte ortopedica'];
const KW_WELLNESS = ['nutritie sanatoasa', 'bio si wellness', 'uleiuri esentiale si aromaterapie', 'seminte si nuci'];
const KW_BARBATI = ['spume de ras', 'spuma de ras', 'gel de ras', 'crema de ras', 'aparat de ras', 'aparat de barbierit', 'aparat de tuns', 'aparate de ras si tuns', 'masina de tuns', 'trimmer', 'after shave', 'aftershave', 'dupa ras', 'barbierit', 'men=', 'homme', 'pentru barbati', 'barbati=', 'barba=', 'beard'];
const CAT_INGRIJIRE = ['ingrijire-ten', 'ingrijire-corp', 'ingrijire-par'];

function reclasifica(p, text, raw) {
  let cats = [...(p.category || [])];

  // Parfumurile (ex. Infinite Love) ajunse la Ingrijire Par
  if (cats.includes('ingrijire-par') && (p.source_site === 'infinitelove.ro' || (matchKw(raw, 'parfumuri') && !matchKw(raw, 'parfumuri pentru casa')))) {
    cats = cats.filter((c) => c !== 'ingrijire-par');
    if (!cats.includes('parfumuri')) cats.push('parfumuri');
  }
  // Teste de sarcina si ovulatie -> Mama si Copilul
  if (any(text, KW_SARCINA)) return ['mama-si-copilul'];
  // Cuplu & Intimitate (exclusiv)
  if (cats.some((c) => c !== 'parfumuri') && !any(text, KW_NU_CUPLU) &&
      (any(text, KW_CUPLU) || BRAND_CUPLU.includes(brandKey(p.brand)) || (matchKw(text, 'lubrifiant') && !matchKw(text, 'lubrifiante')))) {
    return ['cuplu-intimitate'];
  }
  // Dispozitive Medicale (exclusiv)
  if (any(raw, KW_MEDICAL)) return ['dispozitive-medicale'];
  // Vitamine -> Wellness (nutritie, bio, uleiuri esentiale, ceaiuri)
  if (cats.includes('vitamine-suplimente') && (any(raw, KW_WELLNESS) || matchKw(norm(p.title), 'ceai'))) {
    cats = cats.filter((c) => c !== 'vitamine-suplimente');
    if (!cats.includes('wellness')) cats.push('wellness');
  }
  // Produsele pentru barbati apar si in Cosmetice Barbati
  if (cats.some((c) => CAT_INGRIJIRE.includes(c)) && any(text, KW_BARBATI)) {
    if (!cats.includes('cosmetice-barbati')) cats.push('cosmetice-barbati');
  }
  return cats;
}

// ── BRANDURI: potrivire nume produs -> brand ─────────────────────────────
const brandMatchers = brands.map((b) => ({
  brand: b,
  keys: [b.name, ...(b.aliases || [])].map((n) => ' ' + brandKey(n) + ' '),
}));
function brandsOf(p) {
  const pb = ' ' + brandKey(p.brand) + ' ';
  if (pb.trim() === '') return [];
  return brandMatchers.filter((m) => m.keys.some((k) => pb.includes(k))).map((m) => m.brand.slug);
}

// ── CONSTRUIRE CATALOG ──────────────────────────────────────────────────
const t0 = Date.now();
export const produse = [];
for (const p of productsData) {
  if (p.draft) continue;
  const raw = norm(p.subcategory_raw || '');
  const text = norm((p.title || '') + ' ' + (p.subcategory_raw || ''));
  const category = reclasifica(p, text, raw);
  const tip = [];
  for (const c of category) {
    for (const t of tipuri[c] || []) {
      if (any(text, t.kw)) tip.push(`${c}/${t.slug}`);
    }
  }
  produse.push({ ...p, category, tipuri: tip, branduri: brandsOf(p) });
}

const byCategory = new Map(categories.map((c) => [c.slug, []]));
for (const p of produse) for (const c of p.category) byCategory.get(c)?.push(p);

const byTip = new Map();
for (const p of produse) for (const k of p.tipuri) {
  if (!byTip.has(k)) byTip.set(k, []);
  byTip.get(k).push(p);
}

const byBrand = new Map();
for (const p of produse) for (const b of p.branduri) for (const c of p.category) {
  const k = `${c}/${b}`;
  if (!byBrand.has(k)) byBrand.set(k, []);
  byBrand.get(k).push(p);
}
console.log(`[catalog] ${produse.length} produse active clasificate in ${Date.now() - t0} ms`);

// ── API pentru pagini ───────────────────────────────────────────────────
export const produseCategorie = (cat) => byCategory.get(cat) || [];
export const produseTip = (cat, tip) => byTip.get(`${cat}/${tip}`) || [];
export const produseBrand = (cat, brand) => byBrand.get(`${cat}/${brand}`) || [];

// Tipurile afisate (cel putin MIN_PRODUSE_TIP produse), in ordinea din tipuri.js
export function tipuriCategorie(cat) {
  return (tipuri[cat] || [])
    .map((t) => ({ ...t, count: produseTip(cat, t.slug).length }))
    .filter((t) => t.count >= MIN_PRODUSE_TIP);
}

// Brandurile afisate pe randul categoriei (doar cele cu produse), in ordinea din brands.js
export function brandsCategorie(cat) {
  return brands
    .filter((b) => b.categories.includes(cat))
    .map((b) => ({ ...b, count: produseBrand(cat, b.slug).length }))
    .filter((b) => b.count > 0);
}

// Inlocuieste {N} cu numarul real ("peste 15.900 de produse" / "28 de produse" / "12 produse")
export function cuNumar(text, n) {
  const nr = niceCount(n);
  // In romana, numerele terminate in 01-19 nu primesc "de" (12 produse, 610 produse, dar 28 de produse)
  const afisat = Number(nr.replace(/\D/g, ''));
  const faraDe = afisat % 100 >= 1 && afisat % 100 <= 19;
  return text.replace(/\{N\}( de )?/g, (m, de, offset) => {
    // majuscula la inceput de text sau dupa . ? !
    const inainte = text.slice(0, offset).trimEnd();
    const start = inainte === '' || /[.?!]$/.test(inainte);
    const v = start ? nr.charAt(0).toUpperCase() + nr.slice(1) : nr;
    return de ? (faraDe ? `${v} ` : `${v} de `) : v;
  });
}

// ── OFERTE (prima pagina + /oferte/) ────────────────────────────────────
// Apar doar produsele reduse care costa, dupa reducere, cel putin PRET_MINIM_OFERTA lei.
// Produsele mai ieftine raman pe site, in categoria lor, dar nu apar la oferte.
export const PRET_MINIM_OFERTA = 50;
export const esteOferta = (p) =>
  p.availability && p.old_price && p.old_price > p.price && p.price >= PRET_MINIM_OFERTA;

// Ofertele, cu % si suma economisita, sortate dupa cea mai mare reducere
export function oferte(lista = produse) {
  return lista
    .filter(esteOferta)
    .map((p) => ({
      ...p,
      _pct: Math.round((1 - p.price / p.old_price) * 100),
      _sum: Math.round(p.old_price - p.price),
    }))
    .sort((a, b) => b._pct - a._pct);
}

// Categoriile care au cel putin o oferta (pentru linkurile /oferte/{categorie}/)
export function categoriiCuOferte() {
  return categories.filter((c) => produseCategorie(c.slug).some(esteOferta));
}
