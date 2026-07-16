// Metadata pentru fiecare categorie: folosit pentru SEO (title, meta description),
// H1, breadcrumbs și blocul editorial de deasupra listei de produse.
// De completat/ajustat textul editorial pe măsură ce site-ul crește.

export const categories = [
  {
    slug: "vitamine-suplimente",
    name: "Vitamine & Suplimente",
    seoTitle: "Vitamine și Suplimente — Prețuri și Oferte 2026",
    metaDescription:
      "Peste 5.500 de vitamine și suplimente comparate: imunitate, energie, somn, digestie. Prețuri actualizate zilnic de la mai mulți retaileri.",
    intro:
      "Câte suplimente ai încercat deja fără să vezi vreo diferență? Cât de des te-ai întrebat dacă vitamina pe care o iei chiar face ceva, sau doar îți golește portofelul? Aici am adunat peste 5.500 de produse din categoria vitamine și suplimente — de la multivitamine și imunitate, până la susținere pentru somn, digestie și energie — cu prețuri actualizate zilnic, ca să poți compara rapid și să alegi informat."
  },
  {
    slug: "ingrijire-ten",
    name: "Îngrijire Ten",
    seoTitle: "Îngrijire Ten — Creme, Seruri și Protecție Solară 2026",
    metaDescription:
      "Peste 2.600 de produse de îngrijire a tenului: creme de zi și de noapte, seruri, protecție solară, demachiante. Prețuri actualizate zilnic.",
    intro:
      "Ai câte o cremă pentru fiecare anotimp, dar tot nu ești sigură care ți se potrivește? Câte produse „minune” ai încercat până acum? Am strâns peste 2.600 de produse pentru îngrijirea tenului — creme, seruri, protecție solară, demachiante și tratamente — ca să le poți compara rapid, după preț și tip de piele."
  },
  {
    slug: "ingrijire-corp",
    name: "Îngrijire Corp",
    seoTitle: "Îngrijire Corp — Loțiuni, Săpunuri și Îngrijire Intimă 2026",
    metaDescription:
      "Peste 1.400 de produse de îngrijire corporală: loțiuni, geluri de duș, deodorante, îngrijire intimă. Prețuri actualizate zilnic.",
    intro:
      "Rutina ta de îngrijire corporală se rezumă la un singur produs de ani de zile? Peste 1.400 de opțiuni te așteaptă aici — loțiuni, geluri de duș, deodorante, îngrijire pentru mâini și picioare, și multe altele — toate cu prețuri comparate zilnic."
  },
  {
    slug: "ingrijire-par",
    name: "Îngrijire Păr",
    seoTitle: "Îngrijire Păr — Șampoane, Balsamuri și Tratamente 2026",
    metaDescription:
      "Peste 1.000 de produse pentru îngrijirea părului: șampoane, balsamuri, măști, vopsele. Prețuri actualizate zilnic.",
    intro:
      "Câte șampoane ai schimbat până acum în căutarea celui potrivit? Peste 1.000 de produse pentru păr — șampoane, balsamuri, măști și tratamente — comparate după preț, ca să nu mai ghicești."
  },
  {
    slug: "machiaj",
    name: "Machiaj",
    seoTitle: "Machiaj — Produse de Make-up la Preț Bun 2026",
    metaDescription:
      "Peste 400 de produse de machiaj comparate ca preț: fond de ten, rimel, ruj și multe altele.",
    intro:
      "Câte produse de machiaj ai cumpărat doar pentru că erau „la ofertă”, ca apoi să le uiți în sertar? Peste 400 de produse de make-up, comparate ca preț, ca să alegi cu cap, nu din impuls."
  },
  {
    slug: "igiena-orala",
    name: "Igienă Orală",
    seoTitle: "Igienă Orală — Paste de Dinți, Periuțe și Apă de Gură 2026",
    metaDescription:
      "Produse de igienă orală comparate ca preț: paste de dinți, periuțe, apă de gură.",
    intro:
      "Când ai schimbat ultima oară periuța de dinți? Câte paste de dinți ai încercat fără să știi de fapt ce diferență fac? Aici găsești produsele de igienă orală comparate ca preț, actualizate zilnic."
  },
  {
    slug: "parfumuri",
    name: "Parfumuri",
    seoTitle: "Parfumuri — Prețuri și Oferte 2026",
    metaDescription:
      "Aproape 400 de parfumuri comparate ca preț, de la mostre la sticle mari.",
    intro:
      "Câte parfumuri ai cumpărat doar după ambalaj, ca apoi să nu te mai regăsești în ele? Aproape 400 de parfumuri, de la mostre la sticle mari, comparate ca preț."
  },
  {
    slug: "mama-si-copilul",
    name: "Mama și Copilul",
    seoTitle: "Mama și Copilul — Îngrijire Bebeluși și Suplimente 2026",
    metaDescription:
      "Peste 1.400 de produse pentru mama și copil: îngrijire bebeluși, suplimente pentru sarcină, puericultură. Prețuri actualizate zilnic.",
    intro:
      "Câte ore ai petrecut deja căutând produsul potrivit pentru cel mic? Peste 1.400 de produse pentru mama și copil — de la îngrijire bebeluși, la suplimente pentru sarcină și puericultură — comparate ca preț, într-un singur loc."
  },
  {
    slug: "cosmetice-barbati",
    name: "Cosmetice Bărbați",
    seoTitle: "Cosmetice pentru Bărbați — Ras, Îngrijire și Barbierit 2026",
    metaDescription: "Produse cosmetice pentru bărbați: ras, barbierit, îngrijire.",
    intro:
      "Rutina ta de îngrijire se rezumă la săpun și atât? Iată câteva produse dedicate special bărbaților — ras, barbierit și îngrijire — comparate ca preț."
  }
];

export function getCategoryBySlug(slug) {
  return categories.find((c) => c.slug === slug);
}
