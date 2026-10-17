// Metadata pentru fiecare categorie: SEO (title, meta description), H1, breadcrumbs
// si textul de prezentare de deasupra listei de produse.
//
// {N} se inlocuieste automat la build cu numarul real de produse active din
// categorie, rotunjit (ex: "peste 15.900"). Nu mai trebuie actualizat de mana.

export const categories = [
  {
    slug: 'vitamine-suplimente',
    name: 'Vitamine & Suplimente',
    seoTitle: 'Vitamine și Suplimente — Prețuri și Oferte 2026',
    metaDescription:
      '{N} de vitamine și suplimente comparate: imunitate, energie, somn, digestie, articulații. Prețuri de la mai multe farmacii online.',
    intro:
      'Câte suplimente ai încercat deja fără să vezi vreo diferență? Cât de des te-ai întrebat dacă vitamina pe care o iei chiar face ceva, sau doar îți golește portofelul? Aici am adunat {N} de produse din categoria vitamine și suplimente — de la multivitamine și imunitate, până la susținere pentru somn, digestie, inimă și articulații — de la mai multe farmacii online, ca să poți compara rapid și să alegi informat.',
  },
  {
    slug: 'ingrijire-ten',
    name: 'Îngrijire Ten',
    seoTitle: 'Îngrijire Ten — Creme, Seruri și Protecție Solară 2026',
    metaDescription:
      '{N} de produse de îngrijire a tenului: creme de zi și de noapte, seruri, protecție solară, demachiante. Prețuri comparate.',
    intro:
      'Ai câte o cremă pentru fiecare anotimp, dar tot nu ești sigură care ți se potrivește? Câte produse "minune" ai încercat până acum? Am strâns {N} de produse pentru îngrijirea tenului — creme, seruri, protecție solară, demachiante și tratamente — ca să le poți compara rapid, după preț și tip de piele.',
  },
  {
    slug: 'ingrijire-corp',
    name: 'Îngrijire Corp',
    seoTitle: 'Îngrijire Corp — Geluri de Duș, Loțiuni și Deodorante 2026',
    metaDescription:
      '{N} de produse de îngrijire corporală: geluri de duș, loțiuni, deodorante, igienă intimă și feminină, epilare. Prețuri comparate.',
    intro:
      'Rutina ta de îngrijire corporală se rezumă la un singur produs de ani de zile? {N} de opțiuni te așteaptă aici — geluri de duș, loțiuni, deodorante, îngrijire pentru mâini și picioare, epilare și multe altele — toate cu prețuri comparate.',
  },
  {
    slug: 'ingrijire-par',
    name: 'Îngrijire Păr',
    seoTitle: 'Îngrijire Păr — Șampoane, Balsamuri, Vopsele și Aparate 2026',
    metaDescription:
      '{N} de produse pentru păr: șampoane, balsamuri, măști, vopsele, styling și aparate de coafat. Prețuri comparate.',
    intro:
      'Câte șampoane ai schimbat până acum în căutarea celui potrivit? {N} de produse pentru păr — șampoane, balsamuri, măști, vopsele, styling și aparate de coafat — comparate după preț, ca să nu mai ghicești.',
  },
  {
    slug: 'machiaj',
    name: 'Machiaj',
    seoTitle: 'Machiaj — Produse de Make-up la Preț Bun 2026',
    metaDescription:
      '{N} de produse de machiaj comparate ca preț: fond de ten, rimel, ruj, farduri, ojă și accesorii.',
    intro:
      'Câte produse de machiaj ai cumpărat doar pentru că erau "la ofertă", ca apoi să le uiți în sertar? {N} de produse de make-up — de la fond de ten și rimel, la ruj, farduri și ojă — comparate ca preț, ca să alegi cu cap, nu din impuls.',
  },
  {
    slug: 'igiena-orala',
    name: 'Igienă Orală',
    seoTitle: 'Igienă Orală — Paste de Dinți, Periuțe și Apă de Gură 2026',
    metaDescription:
      '{N} de produse de igienă orală comparate ca preț: paste de dinți, periuțe manuale și electrice, apă de gură, ață dentară.',
    intro:
      'Când ai schimbat ultima oară periuța de dinți? Câte paste de dinți ai încercat fără să știi de fapt ce diferență fac? Aici găsești {N} de produse de igienă orală, comparate ca preț.',
  },
  {
    slug: 'parfumuri',
    name: 'Parfumuri',
    seoTitle: 'Parfumuri — Prețuri și Oferte 2026',
    metaDescription:
      '{N} de parfumuri comparate ca preț: damă, bărbați, unisex, seturi cadou și parfumuri de casă.',
    intro:
      'Câte parfumuri ai cumpărat doar după ambalaj, ca apoi să nu te mai regăsești în ele? {N} de parfumuri — damă, bărbați, unisex, de nișă, seturi cadou și lumânări parfumate — comparate ca preț, de la mai mulți retaileri.',
  },
  {
    slug: 'mama-si-copilul',
    name: 'Mama și Copilul',
    seoTitle: 'Mama și Copilul — Îngrijire Bebeluși, Hrănire și Alăptare 2026',
    metaDescription:
      '{N} de produse pentru mama și copil: îngrijire bebeluși, biberoane, scutece, alăptare, hrană și siguranță. Prețuri comparate.',
    intro:
      'Câte ore ai petrecut deja căutând produsul potrivit pentru cel mic? {N} de produse pentru mama și copil — de la îngrijire bebeluși și biberoane, la alăptare, hrană și siguranță — comparate ca preț, într-un singur loc.',
  },
  {
    slug: 'cosmetice-barbati',
    name: 'Cosmetice Bărbați',
    seoTitle: 'Cosmetice pentru Bărbați — Ras, Barbă și Îngrijire 2026',
    metaDescription:
      '{N} de produse pentru bărbați: ras și barbierit, îngrijirea bărbii, aparate de ras și tuns, îngrijire față. Prețuri comparate.',
    intro:
      'Rutina ta de îngrijire se rezumă la săpun și atât? {N} de produse dedicate bărbaților — ras și barbierit, îngrijirea bărbii, aparate de ras și tuns, creme de față — comparate ca preț.',
  },
  {
    slug: 'wellness',
    name: 'Wellness',
    seoTitle: 'Wellness — Nutriție Sănătoasă, Ceaiuri și Uleiuri Esențiale 2026',
    metaDescription:
      '{N} de produse pentru starea de bine: nutriție sănătoasă, ceaiuri, cafea, uleiuri esențiale și programe detox. Prețuri comparate.',
    intro:
      'Câte dimineți ai început cu ceva ales la întâmplare? Dacă starea ta de bine contează, ce mănânci și ce bei contează la fel de mult ca ce aplici pe piele. Am adunat {N} de produse wellness — nutriție sănătoasă, ceaiuri, cafea, uleiuri esențiale și programe detox — comparate ca preț.',
  },
  {
    slug: 'cuplu-intimitate',
    name: 'Cuplu & Intimitate',
    seoTitle: 'Cuplu & Intimitate — Prezervative, Lubrifianți și Accesorii 2026',
    metaDescription:
      '{N} de produse pentru cuplu și intimitate: prezervative, lubrifianți, accesorii, fertilitate. Prețuri comparate, comandă discretă.',
    intro:
      'Câte produse intime ai amânat să cumperi doar pentru că nu voiai să le cauți la raft? {N} de produse pentru cuplu și intimitate — prezervative, lubrifianți, accesorii, uleiuri de masaj și fertilitate — comparate ca preț, de la magazine online care livrează discret.',
  },
  {
    slug: 'dispozitive-medicale',
    name: 'Dispozitive Medicale',
    seoTitle: 'Dispozitive Medicale — Tensiometre, Ciorapi Compresivi și Pansamente 2026',
    metaDescription:
      '{N} de dispozitive și consumabile medicale: tensiometre, termometre, ciorapi compresivi, plasturi, incontinență, orteze. Prețuri comparate.',
    intro:
      'Cât ai plătit ultima oară pentru un tensiometru sau o pereche de ciorapi compresivi — și știi cât costa în altă parte? {N} de dispozitive și consumabile medicale — aparate de măsurat, plasturi și pansamente, incontinență, orteze și mobilitate — comparate ca preț.',
  },
];

export function getCategoryBySlug(slug) {
  return categories.find((c) => c.slug === slug);
}
