// ============================================================
// PROMOȚII ȘI CODURI DE REDUCERE — fișier editabil de Marius
// ============================================================
// Apar pe pagina /promotii/ (link din sticker-ul „% Promoții” de pe toate paginile).
//
// CÂMPURI:
//   id         unic, fără spații (ex: "drmax-promo-50")
//   magazin    numele afișat (ex: "Dr. Max")
//   domeniu    site-ul magazinului (ex: "drmax.ro")
//   titlu      titlul ofertei
//   descriere  1–2 fraze
//   reducere   textul din eticheta mare (ex: "-50%", "-28 lei", "Ofertă") — sau null
//   cod        codul de reducere, dacă există (ex: "DETOX10") — sau null pentru oferte fără cod.
//              Când există cod, cardul arată „••••10 Afișează codul”: la click apare fereastra
//              cu codul și „Copiază codul”; după copiere revine la card, unde clientul apasă
//              „Vezi oferta” și lipește codul în coș pe site-ul magazinului.
//   cod_text   (opțional) textul de deasupra codului (ex: "Încă 10% reducere EXTRA cu codul")
//   link       linkul de afiliat (quicklink 2Performant)
//   expira     data de final "YYYY-MM-DD" (inclusiv) — sau null dacă nu știm.
//              După această dată oferta dispare singură de pe site.
//   categorii  categoriile site-ului unde e relevantă (pentru filtre)
//   verificat  data la care ai verificat oferta pe site-ul magazinului
//
// Folosește doar coduri primite în 2Performant pentru contul tău și verifică în
// condițiile campaniei că sunt permise site-urile de cupoane.
// ============================================================

export const promotii = [
  {
    id: "drmax-promo-50",
    magazin: "Dr. Max",
    domeniu: "drmax.ro",
    titlu: "Promo Dr. Max: produse la jumătate de preț",
    descriere: "Selecție de suplimente și produse de îngrijire Dr. Max cu reducere de 50% față de prețul original.",
    reducere: "-50%",
    cod: null,
    link: "https://event.2performant.com/events/click?ad_type=quicklink&aff_code=676a7e7d9&unique=6390e3cfb&redirect_to=https%253A//www.drmax.ro/promo-dr-max",
    expira: null,
    categorii: ["vitamine-suplimente", "ingrijire-ten", "ingrijire-corp"],
    verificat: "2026-10-22",
  },
  {
    id: "drmax-pachete-de-grija",
    magazin: "Dr. Max",
    domeniu: "drmax.ro",
    titlu: "Pachete de grijă Dr. Max",
    descriere: "Produse care se completează, vândute la pachet mai ieftin. De exemplu, Silimarină Premium + Anghinare 250 mg: 39,98 lei în loc de 67,98 lei.",
    reducere: "-41%",
    cod: null,
    link: "https://event.2performant.com/events/click?ad_type=quicklink&aff_code=676a7e7d9&unique=6390e3cfb&redirect_to=https%253A//www.drmax.ro/pachete-de-grija",
    expira: "2026-10-31",
    categorii: ["vitamine-suplimente"],
    verificat: "2026-10-22",
  },
  {
    id: "drmax-ofertele-lunii",
    magazin: "Dr. Max",
    domeniu: "drmax.ro",
    titlu: "Ofertele lunii la Dr. Max",
    descriere: "Produsele de farmacie, dermatocosmetice și suplimentele aflate luna aceasta la preț redus.",
    reducere: "Ofertă",
    cod: null,
    link: "https://event.2performant.com/events/click?ad_type=quicklink&aff_code=676a7e7d9&unique=6390e3cfb&redirect_to=https%253A//www.drmax.ro/ofertele-lunii",
    expira: null,
    categorii: ["vitamine-suplimente", "ingrijire-ten", "mama-si-copilul"],
    verificat: "2026-10-22",
  },
  {
    id: "farmec-complete-care-30",
    magazin: "Farmec",
    domeniu: "farmec.ro",
    titlu: "Complete Care: -30% la îngrijirea tenului",
    descriere: "Reducere de 30% direct în preț la gama Farmec Complete Care pentru îngrijirea tenului.",
    reducere: "-30%",
    cod: null,
    link: "https://event.2performant.com/events/click?ad_type=quicklink&aff_code=676a7e7d9&unique=1dfbc028f&redirect_to=https%253A//www.farmec.ro/promo/complete-care",
    expira: "2026-11-01",
    categorii: ["ingrijire-ten"],
    verificat: "2026-10-22",
  },
  {
    id: "detoxmed-programe-20",
    magazin: "DetoxMed",
    domeniu: "detoxmed.ro",
    titlu: "Programe detox DetoxMed cu 20% reducere",
    descriere: "Programele Intensiv, Moderat și Ușor, cu sucuri crude presate la rece livrate în toată țara, de la 496 lei.",
    reducere: "-20%",
    cod: "DETOX10",
    cod_text: "Încă 10% reducere EXTRA la toate produsele, cu codul",
    link: "https://event.2performant.com/events/click?ad_type=quicklink&aff_code=676a7e7d9&unique=7875d2dab&redirect_to=https%253A//detoxmed.ro/product-category/programe-detoxmed/",
    expira: null,
    categorii: ["wellness"],
    verificat: "2026-10-22",
  },
];
