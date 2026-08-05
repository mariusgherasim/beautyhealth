// Subcategorii de tip produs (ex: /ingrijire-ten/crema-antirid/).
// Filtrarea produselor se face prin keywords in titlu sau subcategory_raw.
// Adauga o subcategorie noua: adauga un obiect in lista.

export const subcategories = [
  {
    slug: 'crema-antirid',
    name: 'Cremă Antirid',
    seoTitle: 'Cremă Antirid — Prețuri și Oferte',
    metaDescription: 'Creme antirid comparate ca preț, de la branduri dermatologice și de lux.',
    intro: 'Câte creme antirid ai încercat fără să compari prețul mai întâi? Găsești aici o selecție comparată zilnic, de la formule dermatologice până la îngrijire premium.',
    keywords: ['antirid','anti-rid','anti rid','wrinkle','retinol','lifting','fermitate','anti-age','anti age','antiaging'],
    categories: ['ingrijire-ten'],
  },
  {
    slug: 'crema-hidratanta',
    name: 'Cremă Hidratantă',
    seoTitle: 'Cremă Hidratantă — Prețuri și Oferte',
    metaDescription: 'Creme hidratante pentru față comparate ca preț. Formule pentru ten uscat, mixt sau sensibil.',
    intro: 'Hidratarea zilnică a tenului nu ar trebui să fie scumpă — sau măcar ar trebui să știi ce plătești. Iată selecția comparată de creme hidratante.',
    keywords: ['hidratant','hydra','moistur','aqua cream','water cream','umectant','hidratare intensa'],
    categories: ['ingrijire-ten'],
  },
  {
    slug: 'ser',
    name: 'Ser',
    seoTitle: 'Seruri pentru față — Prețuri și Oferte',
    metaDescription: 'Seruri pentru față comparate ca preț: vitamina C, acid hialuronic, retinol și multe altele.',
    intro: 'Serul e produsul cu cea mai mare concentrație de activi din rutina ta — dar și cel mai ușor de cumpărat la suprapreț. Compară înainte să cumperi.',
    keywords: ['ser ','serum','esenta','essence','booster','concentrate','acid hialuronic','vitamina c','niacinamida'],
    categories: ['ingrijire-ten', 'ingrijire-par'],
  },
  {
    slug: 'crema-de-noapte',
    name: 'Cremă de Noapte',
    seoTitle: 'Cremă de Noapte — Prețuri și Oferte',
    metaDescription: 'Creme de noapte pentru regenerarea tenului, comparate ca preț.',
    intro: 'Pielea se regenerează cel mai bine noaptea — iar crema de noapte potrivită face diferența. Iată selecția comparată.',
    keywords: ['noapte','night cream','nocturna','nocturn','overnight','noaptea'],
    categories: ['ingrijire-ten'],
  },
  {
    slug: 'balsam',
    name: 'Balsam',
    seoTitle: 'Balsam de Păr — Prețuri și Oferte',
    metaDescription: 'Balsamuri și condiționere pentru păr, comparate ca preț.',
    intro: 'Balsamul potrivit pentru tipul tău de păr — fără să plătești în exces. Selecție comparată zilnic.',
    keywords: ['balsam','conditioner','balsam de par','after shave balsam','balsam hidratant'],
    categories: ['ingrijire-par', 'ingrijire-ten'],
  },
  {
    slug: 'masca-de-fata',
    name: 'Mască de Față',
    seoTitle: 'Măști de Față — Prețuri și Oferte',
    metaDescription: 'Măști de față și de păr comparate ca preț, de la branduri premium și farmaceutice.',
    intro: 'O mască bună de față nu trebuie să coste o avere. Compară înainte să cumperi.',
    keywords: ['masca','mask','maska','tratament intensiv','masca faciala','masca de fata'],
    categories: ['ingrijire-ten', 'ingrijire-par'],
  },
];

export function getSubcategoryBySlug(slug) {
  return subcategories.find(s => s.slug === slug);
}

export function getSubcategoriesForCategory(categorySlug) {
  return subcategories.filter(s => s.categories.includes(categorySlug));
}
