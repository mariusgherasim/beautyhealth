// ============================================================
// BANNERE AFILIATE — fișier editabil de Marius
// ============================================================
//
// DIMENSIUNI ACCEPTATE PE SITE (standard IAB, deja folosite de 2Performant):
//   - 728 x 90   (leaderboard)      → afișat sus, lățime completă, doar pe desktop
//   - 300 x 250  (medium rectangle) → afișat în listă/grilă și pe mobil
//   - 300 x 600  (half page)        → afișat în listă/grilă, mai înalt
// Orice banner cu alte dimensiuni va fi afișat scalat proporțional
// (max-width 100%), dar cele 3 de mai sus arată cel mai bine.
//
// CUM ADAUGI UN BANNER NOU:
// 1. Copiezi un bloc { ... } existent și-l lipești în listă
// 2. Schimbi: id (unic!), merchant, categories, image_url, affiliate_url,
//    width, height, active_from, active_until
// 3. Salvezi, commit + push — bannerul apare pe site la următorul deploy
//
// CÂMPURI:
//   id           - identificator unic (orice text scurt, fără spații)
//   merchant     - numele comerciantului (pentru organizare, ex: "farmec.ro")
//   categories   - pe ce pagini de categorie apare; slug-urile valide:
//                  vitamine-suplimente, ingrijire-ten, ingrijire-corp,
//                  ingrijire-par, machiaj, igiena-orala, parfumuri,
//                  mama-si-copilul, cosmetice-barbati
//                  + "homepage" pentru pagina principală
//   image_url    - URL-ul imaginii bannerului (de la 2Performant)
//   affiliate_url- linkul de afiliat (event.2performant.com/...)
//   width/height - dimensiunile bannerului în pixeli
//   active_from  - data de la care e activ (format: "YYYY-MM-DD")
//   active_until - data până la care e activ INCLUSIV (format: "YYYY-MM-DD")
//                  Pune null dacă nu are dată de expirare.
//
// Bannerele expirate sau care n-au intrat încă în perioada activă NU apar
// pe site (filtrarea se face automat, pe data vizitatorului).
// ============================================================

export const banners = [
  // ---------- farmec.ro ----------
  {
    id: "farmec-300x600-a",
    merchant: "farmec.ro",
    categories: ["ingrijire-ten", "ingrijire-corp", "ingrijire-par", "machiaj", "cosmetice-barbati", "homepage"],
    image_url: "https://img.2performant.com/system/paperclip/banner_pictures/pics/271226/original/271226.jpg",
    affiliate_url: "https://event.2performant.com/events/click?ad_type=banner&unique=997b3623f&aff_code=676a7e7d9&campaign_unique=1dfbc028f",
    width: 300,
    height: 600,
    active_from: "2026-07-20",
    active_until: null
  },
  {
    id: "farmec-300x250-a",
    merchant: "farmec.ro",
    categories: ["ingrijire-ten", "ingrijire-corp", "ingrijire-par", "machiaj", "cosmetice-barbati", "homepage"],
    image_url: "https://img.2performant.com/system/paperclip/banner_pictures/pics/270786/original/270786.png",
    affiliate_url: "https://event.2performant.com/events/click?ad_type=banner&unique=07d519c9f&aff_code=676a7e7d9&campaign_unique=1dfbc028f",
    width: 300,
    height: 250,
    active_from: "2026-07-20",
    active_until: null
  },
  {
    id: "farmec-728x90-a",
    merchant: "farmec.ro",
    categories: ["ingrijire-ten", "ingrijire-corp", "ingrijire-par", "machiaj", "cosmetice-barbati", "homepage"],
    image_url: "https://img.2performant.com/system/paperclip/banner_pictures/pics/270753/original/270753.png",
    affiliate_url: "https://event.2performant.com/events/click?ad_type=banner&unique=08c14e808&aff_code=676a7e7d9&campaign_unique=1dfbc028f",
    width: 728,
    height: 90,
    active_from: "2026-07-20",
    active_until: null
  },
  {
    id: "farmec-300x250-b",
    merchant: "farmec.ro",
    categories: ["ingrijire-ten", "ingrijire-corp", "ingrijire-par", "machiaj", "cosmetice-barbati", "homepage"],
    image_url: "https://img.2performant.com/system/paperclip/banner_pictures/pics/270752/original/270752.png",
    affiliate_url: "https://event.2performant.com/events/click?ad_type=banner&unique=b76f3c822&aff_code=676a7e7d9&campaign_unique=1dfbc028f",
    width: 300,
    height: 250,
    active_from: "2026-07-20",
    active_until: null
  },
  {
    id: "farmec-728x90-b",
    merchant: "farmec.ro",
    categories: ["ingrijire-ten", "ingrijire-corp", "ingrijire-par", "machiaj", "cosmetice-barbati", "homepage"],
    image_url: "https://img.2performant.com/system/paperclip/banner_pictures/pics/270702/original/270702.jpg",
    affiliate_url: "https://event.2performant.com/events/click?ad_type=banner&unique=0b87cb90b&aff_code=676a7e7d9&campaign_unique=1dfbc028f",
    width: 728,
    height: 90,
    active_from: "2026-07-20",
    active_until: null
  },
  {
    id: "farmec-300x600-b",
    merchant: "farmec.ro",
    categories: ["ingrijire-ten", "ingrijire-corp", "ingrijire-par", "machiaj", "cosmetice-barbati", "homepage"],
    image_url: "https://img.2performant.com/system/paperclip/banner_pictures/pics/270701/original/270701.jpg",
    affiliate_url: "https://event.2performant.com/events/click?ad_type=banner&unique=3de465904&aff_code=676a7e7d9&campaign_unique=1dfbc028f",
    width: 300,
    height: 600,
    active_from: "2026-07-20",
    active_until: null
  },
  {
    id: "farmec-300x250-c",
    merchant: "farmec.ro",
    categories: ["ingrijire-ten", "ingrijire-corp", "ingrijire-par", "machiaj", "cosmetice-barbati", "homepage"],
    image_url: "https://img.2performant.com/system/paperclip/banner_pictures/pics/270700/original/270700.jpg",
    affiliate_url: "https://event.2performant.com/events/click?ad_type=banner&unique=32263cd80&aff_code=676a7e7d9&campaign_unique=1dfbc028f",
    width: 300,
    height: 250,
    active_from: "2026-07-20",
    active_until: null
  },
  {
    id: "farmec-728x90-c",
    merchant: "farmec.ro",
    categories: ["ingrijire-ten", "ingrijire-corp", "ingrijire-par", "machiaj", "cosmetice-barbati", "homepage"],
    image_url: "https://img.2performant.com/system/paperclip/banner_pictures/pics/270620/original/270620.png",
    affiliate_url: "https://event.2performant.com/events/click?ad_type=banner&unique=c63710478&aff_code=676a7e7d9&campaign_unique=1dfbc028f",
    width: 728,
    height: 90,
    active_from: "2026-07-20",
    active_until: null
  },
  {
    id: "farmec-300x600-c",
    merchant: "farmec.ro",
    categories: ["ingrijire-ten", "ingrijire-corp", "ingrijire-par", "machiaj", "cosmetice-barbati", "homepage"],
    image_url: "https://img.2performant.com/system/paperclip/banner_pictures/pics/270619/original/270619.png",
    affiliate_url: "https://event.2performant.com/events/click?ad_type=banner&unique=d763fc53e&aff_code=676a7e7d9&campaign_unique=1dfbc028f",
    width: 300,
    height: 600,
    active_from: "2026-07-20",
    active_until: null
  },
  {
    id: "farmec-300x250-d",
    merchant: "farmec.ro",
    categories: ["ingrijire-ten", "ingrijire-corp", "ingrijire-par", "machiaj", "cosmetice-barbati", "homepage"],
    image_url: "https://img.2performant.com/system/paperclip/banner_pictures/pics/270618/original/270618.png",
    affiliate_url: "https://event.2performant.com/events/click?ad_type=banner&unique=2bca23b1b&aff_code=676a7e7d9&campaign_unique=1dfbc028f",
    width: 300,
    height: 250,
    active_from: "2026-07-20",
    active_until: null
  },

  // ---------- farmec.ro — bannere noi (adaugate 22.07.2026) ----------
  {
    id: "farmec-728x90-d",
    merchant: "farmec.ro",
    categories: ["ingrijire-ten", "ingrijire-corp", "ingrijire-par", "machiaj", "cosmetice-barbati", "homepage"],
    image_url: "https://img.2performant.com/system/paperclip/banner_pictures/pics/271414/original/271414.png",
    affiliate_url: "https://event.2performant.com/events/click?ad_type=banner&unique=d6fa81fda&aff_code=676a7e7d9&campaign_unique=1dfbc028f",
    width: 728,
    height: 90,
    active_from: "2026-07-22",
    active_until: null
  },
  {
    id: "farmec-300x600-d",
    merchant: "farmec.ro",
    categories: ["ingrijire-ten", "ingrijire-corp", "ingrijire-par", "machiaj", "cosmetice-barbati", "homepage"],
    image_url: "https://img.2performant.com/system/paperclip/banner_pictures/pics/271226/original/271226.jpg",
    affiliate_url: "https://event.2performant.com/events/click?ad_type=banner&unique=997b3623f&aff_code=676a7e7d9&campaign_unique=1dfbc028f",
    width: 300,
    height: 600,
    active_from: "2026-07-22",
    active_until: null
  },
  {
    id: "farmec-300x250-e",
    merchant: "farmec.ro",
    categories: ["ingrijire-ten", "ingrijire-corp", "ingrijire-par", "machiaj", "cosmetice-barbati", "homepage"],
    image_url: "https://img.2performant.com/system/paperclip/banner_pictures/pics/270786/original/270786.png",
    affiliate_url: "https://event.2performant.com/events/click?ad_type=banner&unique=07d519c9f&aff_code=676a7e7d9&campaign_unique=1dfbc028f",
    width: 300,
    height: 250,
    active_from: "2026-07-22",
    active_until: null
  },

  // ---------- infinitelove.ro (de completat când primești bannerele) ----------
  // {
  //   id: "infinitelove-300x250-a",
  //   merchant: "infinitelove.ro",
  //   categories: ["parfumuri", "homepage"],
  //   image_url: "https://img.2performant.com/...",
  //   affiliate_url: "https://event.2performant.com/events/click?...",
  //   width: 300,
  //   height: 250,
  //   active_from: "2026-08-01",
  //   active_until: "2026-08-31"
  // },
];
