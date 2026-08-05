// Branduri cu pagina proprie pe site.
// URL-ul generat: /{categorie}/{brand-slug}/ (ex: /ingrijire-ten/apivita/)
// Adauga un brand nou: adauga un obiect in lista, cu name, slug, categories.
// categories: lista de slug-uri de categorii unde apare brandul
// (daca e prezent in mai multe categorii, apare pe fiecare)

export const brands = [
  // --- Cerute de Marius ---
  { name: 'APIVITA', slug: 'apivita', categories: ['ingrijire-ten','ingrijire-corp','ingrijire-par'] },
  { name: 'VICHY', slug: 'vichy', categories: ['ingrijire-ten','ingrijire-corp'] },
  { name: 'SESDERMA', slug: 'sesderma', categories: ['ingrijire-ten'] },
  { name: 'FARMEC', slug: 'farmec', categories: ['ingrijire-ten','ingrijire-corp','machiaj','cosmetice-barbati'] },
  { name: 'BIODERMA', slug: 'bioderma', categories: ['ingrijire-ten','ingrijire-corp'] },
  { name: 'COSMETIC PLANT', slug: 'cosmetic-plant', categories: ['ingrijire-ten','ingrijire-corp'] },
  { name: 'LA ROCHE POSAY', slug: 'la-roche-posay', categories: ['ingrijire-ten','ingrijire-corp'] },
  { name: 'INFINITE LOVE', slug: 'infinite-love', categories: ['parfumuri'] },
  { name: 'PHILIPS AVENT', slug: 'philips-avent', categories: ['mama-si-copilul'] },

  // --- Propuneri suplimentare ---
  { name: 'DIOR', slug: 'dior', categories: ['parfumuri','machiaj','ingrijire-ten'] },
  { name: 'GUERLAIN', slug: 'guerlain', categories: ['parfumuri','machiaj','ingrijire-ten'] },
  { name: 'BOBBI BROWN', slug: 'bobbi-brown', categories: ['machiaj','ingrijire-ten'] },
  { name: 'SISLEY', slug: 'sisley', categories: ['parfumuri','machiaj','ingrijire-ten'] },
  { name: 'LANCÔME', slug: 'lancome', categories: ['parfumuri','machiaj','ingrijire-ten'] },
  { name: 'NARS', slug: 'nars', categories: ['machiaj'] },
  { name: 'CLARINS', slug: 'clarins', categories: ['ingrijire-ten','ingrijire-corp','parfumuri'] },
  { name: 'CLINIQUE', slug: 'clinique', categories: ['ingrijire-ten','machiaj'] },
  { name: 'ESTÉE LAUDER', slug: 'estee-lauder', categories: ['ingrijire-ten','machiaj','parfumuri'] },
  { name: 'URIAGE', slug: 'uriage', categories: ['ingrijire-ten','ingrijire-corp'] },
  { name: 'AVÈNE', slug: 'avene', categories: ['ingrijire-ten','ingrijire-corp'] },
  { name: 'ZIAJA', slug: 'ziaja', categories: ['ingrijire-ten','ingrijire-corp','ingrijire-par'] },
  { name: 'MAC COSMETICS', slug: 'mac-cosmetics', categories: ['machiaj'] },
  { name: 'YVES SAINT LAURENT', slug: 'yves-saint-laurent', categories: ['parfumuri','machiaj'] },
  { name: 'DOLCE&GABBANA', slug: 'dolce-gabbana', categories: ['parfumuri','machiaj'] },
  { name: 'VERSACE', slug: 'versace', categories: ['parfumuri'] },
  { name: 'HUGO BOSS', slug: 'hugo-boss', categories: ['parfumuri','cosmetice-barbati'] },
  { name: 'CALVIN KLEIN', slug: 'calvin-klein', categories: ['parfumuri'] },
];

export function getBrandBySlug(slug) {
  return brands.find(b => b.slug === slug);
}

export function getBrandsForCategory(categorySlug) {
  return brands.filter(b => b.categories.includes(categorySlug));
}
