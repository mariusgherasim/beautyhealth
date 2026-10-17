// Branduri afisate pe randul "Branduri" al fiecarei categorii + pagina proprie.
// URL generat: /{categorie}/brand/{brand-slug}/  (ex: /parfumuri/brand/dior/)
//
// Un produs apartine brandului daca numele brandului din feed CONTINE numele
// brandului sau unul dintre aliasuri (fara diacritice si punctuatie).
//   ex: 'GIORGIO ARMANI' si 'Armani' -> ARMANI ;  'BaByliss PRO' -> BABYLISS PRO
//
// Adauga un brand nou: un obiect cu name, slug, categories (si aliases, optional).
// Logo: pune fisierul in public/logos/{slug}.svg sau .png (ex: public/logos/vichy.png).
// Fara logo, se afiseaza numele brandului.

export const brands = [
  // --- Cerute de Marius ---
  { name: 'APIVITA', slug: 'apivita', categories: ['ingrijire-ten','ingrijire-corp','ingrijire-par'] },
  { name: 'VICHY', slug: 'vichy', categories: ['ingrijire-ten','ingrijire-corp'] },
  { name: 'SESDERMA', slug: 'sesderma', categories: ['ingrijire-ten'] },
  { name: 'FARMEC', slug: 'farmec', categories: ['ingrijire-ten','ingrijire-corp','machiaj','cosmetice-barbati'] },
  { name: 'BIODERMA', slug: 'bioderma', categories: ['ingrijire-ten','ingrijire-corp'] },
  { name: 'COSMETIC PLANT', slug: 'cosmetic-plant', categories: ['ingrijire-ten','ingrijire-corp'] },
  { name: 'LA ROCHE POSAY', slug: 'la-roche-posay', aliases: ['LA ROCHE'], categories: ['ingrijire-ten','ingrijire-corp'] },
  { name: 'INFINITE LOVE', slug: 'infinite-love', aliases: ['INFINITE'], categories: ['parfumuri'] },
  { name: 'PHILIPS AVENT', slug: 'philips-avent', aliases: ['PHILIPS'], categories: ['mama-si-copilul'] },
  { name: 'ENDRO', slug: 'endro', categories: ['ingrijire-ten','ingrijire-corp'] },

  // --- Parfumuri clasice (deja existente) ---
  { name: 'HERMÈS', slug: 'hermes', aliases: ['HERMES'], categories: ['parfumuri'] },
  { name: 'GUERLAIN', slug: 'guerlain', categories: ['parfumuri','machiaj','ingrijire-ten'] },
  { name: 'VERSACE', slug: 'versace', categories: ['parfumuri'] },
  { name: 'DIOR', slug: 'dior', categories: ['parfumuri','machiaj','ingrijire-ten'] },
  { name: 'CALVIN KLEIN', slug: 'calvin-klein', aliases: ['CALVIN'], categories: ['parfumuri'] },
  { name: 'DOLCE&GABBANA', slug: 'dolce-gabbana', aliases: ['DOLCE'], categories: ['parfumuri','machiaj'] },
  { name: 'HUGO BOSS', slug: 'hugo-boss', aliases: ['HUGO'], categories: ['parfumuri','cosmetice-barbati'] },
  { name: 'ARMANI', slug: 'armani', categories: ['parfumuri'] },
  { name: 'JEAN PAUL GAULTIER', slug: 'jean-paul-gaultier', aliases: ['GAULTIER', 'JEAN PAUL'], categories: ['parfumuri'] },
  { name: 'TOM FORD', slug: 'tom-ford', categories: ['parfumuri'] },
  { name: 'CHLOÉ', slug: 'chloe', aliases: ['CHLOE'], categories: ['parfumuri'] },
  { name: 'RABANNE', slug: 'rabanne', categories: ['parfumuri'] },
  { name: 'BURBERRY', slug: 'burberry', categories: ['parfumuri'] },
  { name: 'GIVENCHY', slug: 'givenchy', categories: ['parfumuri','machiaj'] },
  { name: 'GUCCI', slug: 'gucci', categories: ['parfumuri'] },
  { name: 'YVES SAINT LAURENT', slug: 'yves-saint-laurent', aliases: ['YVES SAINT LAURENT', 'YSL'], categories: ['parfumuri','machiaj'] },
  { name: 'CAROLINA HERRERA', slug: 'carolina-herrera', categories: ['parfumuri'] },
  { name: 'CREED', slug: 'creed', categories: ['parfumuri'] },
  { name: "VICTORIA'S SECRET", slug: 'victorias-secret', aliases: ['VICTORIA S SECRET', 'VICTORIAS SECRET'], categories: ['parfumuri'] },
  { name: 'GUESS', slug: 'guess', categories: ['parfumuri'] },
  { name: 'MONTALE', slug: 'montale', categories: ['parfumuri'] },
  { name: 'LATTAFA', slug: 'lattafa', categories: ['parfumuri'] },
  { name: 'YANKEE CANDLE', slug: 'yankee-candle', aliases: ['YANKEE'], categories: ['parfumuri'] },

  // --- Parfumuri nișă & lux — PARFLAB.ro ---
  { name: 'TIZIANA TERENZI', slug: 'tiziana-terenzi', aliases: ['TIZIANA'], categories: ['parfumuri'] },           // 280 produse
  { name: 'AMOUAGE', slug: 'amouage', categories: ['parfumuri'] },                             // 164
  { name: 'BVLGARI', slug: 'bvlgari', categories: ['parfumuri'] },                             // 124
  { name: 'MANCERA', slug: 'mancera', categories: ['parfumuri'] },                             // 116
  { name: "ETAT LIBRE D'ORANGE", slug: 'etat-libre-dorange', aliases: ['ETAT LIBRE'], categories: ['parfumuri'] },     // 104
  { name: 'V CANTO', slug: 'v-canto', aliases: ['V CANTO'], categories: ['parfumuri'] },                             // 100 (V CANTO by TERENZI)
  { name: 'NISHANE', slug: 'nishane', categories: ['parfumuri'] },                             // 100
  { name: 'LOUIS VUITTON', slug: 'louis-vuitton', aliases: ['LOUIS VUITTON', 'LV'], categories: ['parfumuri'] },                 // 88
  { name: 'MAISON FRANCIS KURKDJIAN', slug: 'maison-francis-kurkdjian', aliases: ['KURKDJIAN', 'MAISON FRANCIS'], categories: ['parfumuri'] }, // 84
  { name: 'TOSKOVAT', slug: 'toskovat', categories: ['parfumuri'] },                           // 80
  { name: 'BORNTOSTANDOUT', slug: 'borntostandout', categories: ['parfumuri'] },               // 72
  { name: 'KAJAL', slug: 'kajal', categories: ['parfumuri'] },                                 // 64
  { name: 'JO MALONE', slug: 'jo-malone', categories: ['parfumuri'] },                         // 64
  { name: 'ESCENTRIC MOLECULES', slug: 'escentric-molecules', aliases: ['ESCENTRIC'], categories: ['parfumuri'] },     // 64
  { name: 'PRADA', slug: 'prada', categories: ['parfumuri'] },                                 // 64
  { name: 'MAISON CRIVELLI', slug: 'maison-crivelli', aliases: ['CRIVELLI'], categories: ['parfumuri'] },             // 64
  { name: 'EX NIHILO', slug: 'ex-nihilo', aliases: ['EX NIHILO', 'EXNIHILO'], categories: ['parfumuri'] },                         // 56
  { name: 'BDK PARFUMS', slug: 'bdk-parfums', aliases: ['BDK'], categories: ['parfumuri'] },                     // 44
  { name: 'XERJOFF', slug: 'xerjoff', categories: ['parfumuri'] },                             // 44
  { name: 'PARFUMS DE MARLY', slug: 'parfums-de-marly', aliases: ['DE MARLY'], categories: ['parfumuri'] },           // 44
  { name: 'LIQUIDES IMAGINAIRES', slug: 'liquides-imaginaires', aliases: ['LIQUIDES'], categories: ['parfumuri'] },   // 44
  { name: 'MATIERE PREMIERE', slug: 'matiere-premiere', aliases: ['MATIERE'], categories: ['parfumuri'] },           // 32
  { name: 'BYREDO', slug: 'byredo', categories: ['parfumuri'] },                               // 32
  { name: 'INITIO', slug: 'initio', categories: ['parfumuri'] },                               // 28 (INITIO PARFUMES PRIVES)
  { name: 'FREDERIC MALLE', slug: 'frederic-malle', aliases: ['FREDERIC MALLE'], categories: ['parfumuri'] },               // 28
  { name: 'CLIVE CHRISTIAN', slug: 'clive-christian', aliases: ['CLIVE'], categories: ['parfumuri'] },             // 24
  { name: 'KILIAN', slug: 'kilian', categories: ['parfumuri'] },                               // 20
  { name: 'ORTO PARISI', slug: 'orto-parisi', aliases: ['ORTO PARISI', 'ORTOPARISI'], categories: ['parfumuri'] },                     // 16
  { name: 'BOADICEA', slug: 'boadicea', categories: ['parfumuri'] },                           // 12
  { name: 'LE LABO', slug: 'le-labo', categories: ['parfumuri'] },                             // 8
  { name: 'VALENTINO', slug: 'valentino', categories: ['parfumuri'] },                         // 8
  { name: 'MEMO', slug: 'memo', categories: ['parfumuri'] },                                   // 4
  { name: 'THOMAS KOSMALA', slug: 'thomas-kosmala', aliases: ['KOSMALA'], categories: ['parfumuri'] },               // 4
  { name: 'FRAGRANCE DU BOIS', slug: 'fragrance-du-bois', categories: ['parfumuri'] },         // 4
  { name: 'NASOMATTO', slug: 'nasomatto', categories: ['parfumuri'] },                         // 4

  // --- Machiaj & Îngrijire ten ---
  { name: 'BOBBI BROWN', slug: 'bobbi-brown', aliases: ['BOBBI'], categories: ['machiaj','ingrijire-ten'] },
  { name: 'SISLEY', slug: 'sisley', categories: ['parfumuri','machiaj','ingrijire-ten'] },
  { name: 'LANCÔME', slug: 'lancome', aliases: ['LANCOME'], categories: ['parfumuri','machiaj','ingrijire-ten'] },
  { name: 'NARS', slug: 'nars', categories: ['machiaj'] },
  { name: 'CLARINS', slug: 'clarins', categories: ['ingrijire-ten','ingrijire-corp','parfumuri'] },
  { name: 'CLINIQUE', slug: 'clinique', categories: ['ingrijire-ten','machiaj'] },
  { name: 'ESTÉE LAUDER', slug: 'estee-lauder', aliases: ['ESTEE LAUDER'], categories: ['ingrijire-ten','machiaj','parfumuri'] },
  { name: 'MAC COSMETICS', slug: 'mac-cosmetics', aliases: ['MAC COSMETICS'], categories: ['machiaj'] },

  // --- Îngrijire ten/corp ---
  { name: 'URIAGE', slug: 'uriage', categories: ['ingrijire-ten','ingrijire-corp'] },
  { name: 'AVÈNE', slug: 'avene', aliases: ['AVENE'], categories: ['ingrijire-ten','ingrijire-corp'] },
  { name: 'ZIAJA', slug: 'ziaja', categories: ['ingrijire-ten','ingrijire-corp','ingrijire-par'] },

  // --- Vitamine & Suplimente ---
  { name: 'HERBAGETICA', slug: 'herbagetica', categories: ['vitamine-suplimente'] },
  { name: 'ZDROVIT', slug: 'zdrovit', categories: ['vitamine-suplimente', 'igiena-orala'] },
  { name: 'DACIA PLANT', slug: 'dacia-plant', categories: ['vitamine-suplimente'] },
  { name: 'ALEVIA', slug: 'alevia', categories: ['vitamine-suplimente', 'wellness'] },
  { name: 'PLANTEXTRAKT', slug: 'plantextrakt', categories: ['vitamine-suplimente'] },
  { name: 'COSMO PHARM', slug: 'cosmo-pharm', aliases: ['COSMOPHARM'], categories: ['vitamine-suplimente'] },
  { name: 'STEAUA DIVINĂ', slug: 'steaua-divina', categories: ['vitamine-suplimente', 'wellness'] },
  { name: 'SUN WAVE PHARMA', slug: 'sun-wave-pharma', categories: ['vitamine-suplimente'] },
  { name: 'NATURALIS', slug: 'naturalis', categories: ['vitamine-suplimente'] },
  { name: 'FARES', slug: 'fares', categories: ['vitamine-suplimente', 'wellness'] },
  { name: 'SOLGAR', slug: 'solgar', categories: ['vitamine-suplimente'] },
  { name: 'ARONIA CHARLOTTENBURG', slug: 'aronia-charlottenburg', categories: ['vitamine-suplimente'] },
  { name: 'FAUNUS PLANT', slug: 'faunus-plant', categories: ['vitamine-suplimente', 'wellness'] },
  { name: 'NOW FOODS', slug: 'now-foods', categories: ['vitamine-suplimente'] },
  { name: 'HOFIGAL', slug: 'hofigal', categories: ['vitamine-suplimente'] },

  // --- Igienă Orală ---
  { name: 'SUNSTAR GUM', slug: 'sunstar-gum', categories: ['igiena-orala'] },
  { name: 'HISMILE', slug: 'hismile', categories: ['igiena-orala'] },
  { name: 'SWISSDENT', slug: 'swissdent', categories: ['igiena-orala'] },
  { name: 'JORDAN', slug: 'jordan', categories: ['igiena-orala'] },
  { name: 'TRISA', slug: 'trisa', categories: ['igiena-orala'] },
  { name: 'DR. MAYER', slug: 'dr-mayer', categories: ['igiena-orala'] },
  { name: 'PIERRE FABRE', slug: 'pierre-fabre', categories: ['igiena-orala'] },
  { name: 'SENSODYNE', slug: 'sensodyne', categories: ['igiena-orala'] },
  { name: 'PARODONTAX', slug: 'parodontax', categories: ['igiena-orala'] },
  { name: 'COREGA', slug: 'corega', categories: ['igiena-orala'] },
  { name: 'KIN', slug: 'kin', categories: ['igiena-orala'] },
  { name: 'GC DENTAL', slug: 'gc-dental', categories: ['igiena-orala'] },
  { name: 'ELMEX', slug: 'elmex', categories: ['igiena-orala'] },
  { name: 'ORAL-B', slug: 'oral-b', categories: ['igiena-orala'] },

  // --- Wellness ---
  { name: 'NIAVIS', slug: 'niavis', categories: ['wellness'] },
  { name: 'JUSTIN PHARMA', slug: 'justin-pharma', categories: ['wellness'] },
  { name: 'SOLARIS', slug: 'solaris', categories: ['wellness'] },
  { name: 'YOGI TEA', slug: 'yogi-tea', categories: ['wellness'] },
  { name: 'SOIL', slug: 'soil', categories: ['wellness'] },
  { name: 'PRONAT', slug: 'pronat', categories: ['wellness'] },
  { name: 'ORGANIC INDIA', slug: 'organic-india', categories: ['wellness'] },
  { name: 'REPUBLICA BIO', slug: 'republica-bio', categories: ['wellness'] },
  { name: 'MAYAM', slug: 'mayam', categories: ['wellness'] },
  { name: 'GUIDO', slug: 'guido', categories: ['wellness'] },
  { name: 'TORRAS', slug: 'torras', categories: ['wellness'] },

  // --- Mama și Copilul (PHILIPS AVENT e mai sus) ---
  { name: 'SUAVINEX', slug: 'suavinex', categories: ['mama-si-copilul'] },
  { name: 'PUR BABY', slug: 'pur-baby', aliases: ['PUR'], categories: ['mama-si-copilul'] },
  { name: 'APPEKIDS', slug: 'appekids', categories: ['mama-si-copilul'] },
  { name: 'HUGGIES', slug: 'huggies', categories: ['mama-si-copilul'] },
  { name: 'NUK', slug: 'nuk', categories: ['mama-si-copilul'] },
  { name: 'TOMMEE TIPPEE', slug: 'tommee-tippee', categories: ['mama-si-copilul'] },
  { name: 'NESTLÉ', slug: 'nestle', categories: ['mama-si-copilul'] },
  { name: 'LANSINOH', slug: 'lansinoh', categories: ['mama-si-copilul'] },
  { name: 'HIPP', slug: 'hipp', categories: ['mama-si-copilul'] },
  { name: 'MUSTELA', slug: 'mustela', categories: ['mama-si-copilul'] },
  { name: 'EASYCARE', slug: 'easycare', categories: ['mama-si-copilul'] },
  { name: 'PAMPERS', slug: 'pampers', categories: ['mama-si-copilul'] },
  { name: 'ZULUFF', slug: 'zuluff', categories: ['mama-si-copilul'] },
  { name: 'INUWET', slug: 'inuwet', categories: ['mama-si-copilul'] },

  // --- Cosmetice Bărbați (FARMEC și HUGO BOSS sunt mai sus) ---
  { name: 'BRAUN', slug: 'braun', categories: ['cosmetice-barbati'] },
  { name: 'PHILIPS', slug: 'philips', categories: ['cosmetice-barbati'] },
  { name: 'GEROVITAL MEN', slug: 'gerovital-men', categories: ['cosmetice-barbati'] },
  { name: 'BABYLISS PRO', slug: 'babyliss-pro', categories: ['cosmetice-barbati'] },
  { name: 'MÜHLE', slug: 'muhle', categories: ['cosmetice-barbati'] },
  { name: 'REMINGTON', slug: 'remington', categories: ['cosmetice-barbati'] },

  // --- Cuplu & Intimitate ---
  { name: 'SHUNGA', slug: 'shunga', categories: ['cuplu-intimitate'] },
  { name: 'WOW TECH', slug: 'wow-tech', categories: ['cuplu-intimitate'] },
  { name: 'ORGIE', slug: 'orgie', categories: ['cuplu-intimitate'] },
  { name: 'DUREX', slug: 'durex', categories: ['cuplu-intimitate'] },
  { name: 'SVAKOM', slug: 'svakom', categories: ['cuplu-intimitate'] },
  { name: 'FUN FACTORY', slug: 'fun-factory', categories: ['cuplu-intimitate'] },
  { name: 'SATISFYER', slug: 'satisfyer', categories: ['cuplu-intimitate'] },
  { name: 'RITEX', slug: 'ritex', categories: ['cuplu-intimitate'] },

  // --- Dispozitive Medicale ---
  { name: 'HARTMANN', slug: 'hartmann', categories: ['dispozitive-medicale'] },
  { name: 'RAYAT', slug: 'rayat', categories: ['dispozitive-medicale'] },
  { name: 'SENI', slug: 'seni', categories: ['dispozitive-medicale'] },
  { name: 'TRIAMED', slug: 'triamed', categories: ['dispozitive-medicale'] },
  { name: 'B.WELL', slug: 'b-well', aliases: ['BWELL'], categories: ['dispozitive-medicale'] },
  { name: 'FDI MEDICAL', slug: 'fdi-medical', categories: ['dispozitive-medicale'] },
  { name: 'MX HEALTH', slug: 'mx-health', categories: ['dispozitive-medicale'] },
  { name: 'TENA', slug: 'tena', categories: ['dispozitive-medicale'] },
  { name: 'SCUDOTEX', slug: 'scudotex', categories: ['dispozitive-medicale'] },
  { name: 'RELAXSAN', slug: 'relaxsan', categories: ['dispozitive-medicale'] },
  { name: 'SCHOLL', slug: 'scholl', categories: ['dispozitive-medicale'] },
  { name: 'URGO', slug: 'urgo', categories: ['dispozitive-medicale'] },
];


export function getBrandBySlug(slug) {
  return brands.find(b => b.slug === slug);
}

export function getBrandsForCategory(categorySlug) {
  return brands.filter(b => b.categories.includes(categorySlug));
}
