// Branduri cu pagina proprie pe site.
// URL-ul generat: /{categorie}/brand/{brand-slug}/ (ex: /parfumuri/brand/dior/)
// Adauga un brand nou: adauga un obiect in lista, cu name, slug, categories.

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

  // --- Parfumuri ---
  { name: 'HERMÈS', slug: 'hermes', categories: ['parfumuri'] },
  { name: 'GUERLAIN', slug: 'guerlain', categories: ['parfumuri','machiaj','ingrijire-ten'] },
  { name: 'VERSACE', slug: 'versace', categories: ['parfumuri'] },
  { name: 'DIOR', slug: 'dior', categories: ['parfumuri','machiaj','ingrijire-ten'] },
  { name: 'CALVIN KLEIN', slug: 'calvin-klein', categories: ['parfumuri'] },
  { name: 'DOLCE&GABBANA', slug: 'dolce-gabbana', categories: ['parfumuri','machiaj'] },
  { name: 'HUGO BOSS', slug: 'hugo-boss', categories: ['parfumuri','cosmetice-barbati'] },
  { name: 'ARMANI', slug: 'armani', categories: ['parfumuri'] },
  { name: 'JEAN PAUL GAULTIER', slug: 'jean-paul-gaultier', categories: ['parfumuri'] },
  { name: 'TOM FORD', slug: 'tom-ford', categories: ['parfumuri'] },
  { name: 'CHLOÉ', slug: 'chloe', categories: ['parfumuri'] },
  { name: 'RABANNE', slug: 'rabanne', categories: ['parfumuri'] },
  { name: 'BURBERRY', slug: 'burberry', categories: ['parfumuri'] },
  { name: 'GIVENCHY', slug: 'givenchy', categories: ['parfumuri','machiaj'] },
  { name: 'GUCCI', slug: 'gucci', categories: ['parfumuri'] },
  { name: 'YVES SAINT LAURENT', slug: 'yves-saint-laurent', categories: ['parfumuri','machiaj'] },
  { name: 'CAROLINA HERRERA', slug: 'carolina-herrera', categories: ['parfumuri'] },
  { name: 'CREED', slug: 'creed', categories: ['parfumuri'] },
  { name: 'VICTORIA\'S SECRET', slug: 'victorias-secret', categories: ['parfumuri'] },
  { name: 'GUESS', slug: 'guess', categories: ['parfumuri'] },
  { name: 'MONTALE', slug: 'montale', categories: ['parfumuri'] },
  { name: 'LATTAFA', slug: 'lattafa', categories: ['parfumuri'] },
  { name: 'YANKEE CANDLE', slug: 'yankee-candle', categories: ['parfumuri'] },

  // --- Machiaj & Îngrijire ten ---
  { name: 'BOBBI BROWN', slug: 'bobbi-brown', categories: ['machiaj','ingrijire-ten'] },
  { name: 'SISLEY', slug: 'sisley', categories: ['parfumuri','machiaj','ingrijire-ten'] },
  { name: 'LANCÔME', slug: 'lancome', categories: ['parfumuri','machiaj','ingrijire-ten'] },
  { name: 'NARS', slug: 'nars', categories: ['machiaj'] },
  { name: 'CLARINS', slug: 'clarins', categories: ['ingrijire-ten','ingrijire-corp','parfumuri'] },
  { name: 'CLINIQUE', slug: 'clinique', categories: ['ingrijire-ten','machiaj'] },
  { name: 'ESTÉE LAUDER', slug: 'estee-lauder', categories: ['ingrijire-ten','machiaj','parfumuri'] },
  { name: 'MAC COSMETICS', slug: 'mac-cosmetics', categories: ['machiaj'] },

  // --- Îngrijire ten/corp ---
  { name: 'URIAGE', slug: 'uriage', categories: ['ingrijire-ten','ingrijire-corp'] },
  { name: 'AVÈNE', slug: 'avene', categories: ['ingrijire-ten','ingrijire-corp'] },
  { name: 'ZIAJA', slug: 'ziaja', categories: ['ingrijire-ten','ingrijire-corp','ingrijire-par'] },
];

export function getBrandBySlug(slug) {
  return brands.find(b => b.slug === slug);
}

export function getBrandsForCategory(categorySlug) {
  return brands.filter(b => b.categories.includes(categorySlug));
}
