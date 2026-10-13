// Subcategorii de tip produs (ex: /ingrijire-ten/crema-antirid/).
// Filtrarea produselor se face prin keywords in titlu sau subcategory_raw.
// Adauga o subcategorie noua: adauga un obiect in lista.

export const subcategories = [
  // ─── Tipuri — Îngrijire Ten ───────────────────────────────────────────────
  {
    slug: 'crema-antirid',
    name: 'Cremă Antirid',
    type: 'tip',
    seoTitle: 'Cremă Antirid — Prețuri și Oferte',
    metaDescription: 'Creme antirid comparate ca preț, de la branduri dermatologice și de lux.',
    intro: 'Câte creme antirid ai încercat fără să compari prețul mai întâi? Găsești aici o selecție comparată zilnic, de la formule dermatologice până la îngrijire premium.',
    keywords: ['antirid','anti-rid','anti rid','wrinkle','retinol','lifting','fermitate','anti-age','anti age','antiaging'],
    categories: ['ingrijire-ten'],
  },
  {
    slug: 'crema-hidratanta',
    name: 'Cremă Hidratantă',
    type: 'tip',
    seoTitle: 'Cremă Hidratantă — Prețuri și Oferte',
    metaDescription: 'Creme hidratante pentru față comparate ca preț. Formule pentru ten uscat, mixt sau sensibil.',
    intro: 'Hidratarea zilnică a tenului nu ar trebui să fie scumpă — sau măcar ar trebui să știi ce plătești. Iată selecția comparată de creme hidratante.',
    keywords: ['hidratant','hydra','moistur','aqua cream','water cream','umectant','hidratare intensa'],
    categories: ['ingrijire-ten'],
  },
  {
    slug: 'ser',
    name: 'Ser',
    type: 'tip',
    seoTitle: 'Seruri pentru față — Prețuri și Oferte',
    metaDescription: 'Seruri pentru față comparate ca preț: vitamina C, acid hialuronic, retinol și multe altele.',
    intro: 'Serul e produsul cu cea mai mare concentrație de activi din rutina ta — dar și cel mai ușor de cumpărat la suprapreț. Compară înainte să cumperi.',
    keywords: ['ser ','serum','esenta','essence','booster','concentrate','acid hialuronic','vitamina c','niacinamida'],
    categories: ['ingrijire-ten', 'ingrijire-par'],
  },
  {
    slug: 'crema-de-noapte',
    name: 'Cremă de Noapte',
    type: 'tip',
    seoTitle: 'Cremă de Noapte — Prețuri și Oferte',
    metaDescription: 'Creme de noapte pentru regenerarea tenului, comparate ca preț.',
    intro: 'Pielea se regenerează cel mai bine noaptea — iar crema de noapte potrivită face diferența. Iată selecția comparată.',
    keywords: ['noapte','night cream','nocturna','nocturn','overnight','noaptea','ingrijire de noapte'],
    categories: ['ingrijire-ten'],
  },
  {
    slug: 'balsam',
    name: 'Balsam',
    type: 'tip',
    seoTitle: 'Balsam de Păr — Prețuri și Oferte',
    metaDescription: 'Balsamuri și condiționere pentru păr, comparate ca preț.',
    intro: 'Balsamul potrivit pentru tipul tău de păr — fără să plătești în exces. Selecție comparată zilnic.',
    keywords: ['balsam','conditioner','balsam de par','after shave balsam','balsam hidratant'],
    categories: ['ingrijire-par', 'ingrijire-ten'],
  },
  {
    slug: 'masca-de-fata',
    name: 'Mască de Față',
    type: 'tip',
    seoTitle: 'Măști de Față — Prețuri și Oferte',
    metaDescription: 'Măști de față și de păr comparate ca preț, de la branduri premium și farmaceutice.',
    intro: 'O mască bună de față nu trebuie să coste o avere. Compară înainte să cumperi.',
    keywords: ['masca','mask','maska','tratament intensiv','masca faciala','masca de fata'],
    categories: ['ingrijire-ten', 'ingrijire-par'],
  },

  // ─── Branduri — Îngrijire Ten + Îngrijire Corp ────────────────────────────
  {
    slug: 'endro',
    name: 'Endro',
    type: 'brand',
    seoTitle: 'Endro — Cosmetice Naturale și Eco | Prețuri și Oferte',
    metaDescription: 'Produse Endro: cosmetice naturale eco-responsabile pentru față, corp și păr. Deodorante solide, creme, seruri și rutine complete. Prețuri comparate.',
    intro: 'Știai că Endro este un brand francez de cosmetice naturale cu ambalaje reîncărcabile — unul dintre puținele branduri 100% eco-responsabile disponibile în România? De ce să plătești mai mult pentru aceleași produse, când le poți compara în avans? Găsești aici întreaga gamă Endro — de la deodorante solide și creme pentru față, până la seruri și rutine complete — cu prețuri actualizate zilnic.',
    keywords: ['endro','ENDRO'],
    categories: ['ingrijire-ten', 'ingrijire-corp'],
  },

  // ─── Tipuri — Wellness (boabe.ro + detoxmed.ro) ───────────────────────────
  {
    slug: 'detox',
    name: 'Detox',
    type: 'tip',
    seoTitle: 'Sucuri și Programe Detox — Prețuri și Oferte',
    metaDescription: 'Sucuri naturale și programe detox comparate ca preț. Formule cold-pressed pentru slăbit, revitalizare și curățare internă.',
    intro: 'Câte programe detox ai început fără să știi exact ce conțin sau cât costă în altă parte? Găsești aici sucuri naturale și kituri detox comparate ca preț — de la formule de slăbit până la cure de revitalizare completă.',
    keywords: ['detox','detoxmed','healthymed','imunomed','suc natural','suc presat','cold press','juice','slim','revitalize','revitalizare','age defy','pure revit','green glow','crud','depurativ','cleanse'],
    categories: ['wellness'],
  },
  {
    slug: 'cafea-specialitate',
    name: 'Cafea de Specialitate',
    type: 'tip',
    seoTitle: 'Cafea de Specialitate Single Origin — Prețuri și Oferte',
    metaDescription: 'Cafea boabe de specialitate single origin: Columbia, Etiopia, Kenya, Brazilia, Guatemala. Prețuri comparate de la prăjitorii artizanale.',
    intro: 'Câte pahare de cafea obișnuită ai băut astăzi fără să știi de unde vine? Cafeaua de specialitate single origin vine de la o singură fermă, dintr-o singură origine — cu trasabilitate completă de la plantație la ceașcă. De ce să plătești la fel pentru ceva complet diferit? Compară soiuri și prețuri înainte să comanzi.',
    keywords: ['cafea','coffee','boabe','single origin','specialty','specialitate','espresso','guido','roastery','decaf'],
    categories: ['wellness'],
  },
];

export function getSubcategoryBySlug(slug) {
  return subcategories.find(s => s.slug === slug);
}

export function getSubcategoriesForCategory(categorySlug) {
  return subcategories.filter(s => s.categories.includes(categorySlug));
}

export function getSubcategoriesByType(type) {
  return subcategories.filter(s => s.type === type);
}
