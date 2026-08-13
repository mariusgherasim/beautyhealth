// ============================================================
// BANNERE AFILIATE — fișier editabil de Marius
// ============================================================
//
// DIMENSIUNI ACCEPTATE PE SITE (standard IAB):
//   - 728 x 90   (leaderboard)      → afișat sus, lățime completă, doar pe desktop
//   - 300 x 250  (medium rectangle) → afișat în listă/grilă și pe mobil
//   - 300 x 600  (half page)        → afișat în listă/grilă, mai înalt
//
// CÂMPUL channels — unde poate fi folosit bannerul:
//   site      = afișat pe beautyhealth.gherasimmarius.com
//   email     = poate fi inclus în emailuri cu oferte (MailerLite)
//   facebook  = dimensiune compatibilă cu reclame/postări Facebook
//   instagram = dimensiune compatibilă cu postări Instagram Feed
//
// Regulă automată după dimensiune:
//   728x90  → ["site"]
//   300x250 → ["site","email","facebook","instagram"]
//   300x600 → ["site","email"]
//
// TikTok NU e inclus — folosește exclusiv format vertical 9:16.
//
// CUM ADAUGI UN BANNER NOU:
// 1. Copiezi un bloc { ... } și-l lipești în listă
// 2. Completezi toate câmpurile (id unic!, merchant, categories,
//    image_url, affiliate_url, width, height, active_from,
//    active_until, channels)
// 3. Salvezi → commit + push → apare la următorul deploy
// ============================================================

export const banners = [

  // ── farmec.ro — adăugate 20.07.2026 ─────────────────────
  {
    id: "farmec-300x600-a",
    merchant: "farmec.ro",
    categories: ["ingrijire-ten","ingrijire-corp","ingrijire-par","machiaj","cosmetice-barbati","homepage"],
    image_url: "https://img.2performant.com/system/paperclip/banner_pictures/pics/271226/original/271226.jpg",
    affiliate_url: "https://event.2performant.com/events/click?ad_type=banner&unique=997b3623f&aff_code=676a7e7d9&campaign_unique=1dfbc028f",
    width: 300, height: 600,
    active_from: "2026-07-20", active_until: null,
    channels: ["site","email"],
  },
  {
    id: "farmec-300x250-a",
    merchant: "farmec.ro",
    categories: ["ingrijire-ten","ingrijire-corp","ingrijire-par","machiaj","cosmetice-barbati","homepage"],
    image_url: "https://img.2performant.com/system/paperclip/banner_pictures/pics/270786/original/270786.png",
    affiliate_url: "https://event.2performant.com/events/click?ad_type=banner&unique=07d519c9f&aff_code=676a7e7d9&campaign_unique=1dfbc028f",
    width: 300, height: 250,
    active_from: "2026-07-20", active_until: null,
    channels: ["site","email","facebook","instagram"],
  },
  {
    id: "farmec-728x90-a",
    merchant: "farmec.ro",
    categories: ["ingrijire-ten","ingrijire-corp","ingrijire-par","machiaj","cosmetice-barbati","homepage"],
    image_url: "https://img.2performant.com/system/paperclip/banner_pictures/pics/270753/original/270753.png",
    affiliate_url: "https://event.2performant.com/events/click?ad_type=banner&unique=08c14e808&aff_code=676a7e7d9&campaign_unique=1dfbc028f",
    width: 728, height: 90,
    active_from: "2026-07-20", active_until: null,
    channels: ["site"],
  },
  {
    id: "farmec-300x250-b",
    merchant: "farmec.ro",
    categories: ["ingrijire-ten","ingrijire-corp","ingrijire-par","machiaj","cosmetice-barbati","homepage"],
    image_url: "https://img.2performant.com/system/paperclip/banner_pictures/pics/270752/original/270752.png",
    affiliate_url: "https://event.2performant.com/events/click?ad_type=banner&unique=b76f3c822&aff_code=676a7e7d9&campaign_unique=1dfbc028f",
    width: 300, height: 250,
    active_from: "2026-07-20", active_until: null,
    channels: ["site","email","facebook","instagram"],
  },
  {
    id: "farmec-728x90-b",
    merchant: "farmec.ro",
    categories: ["ingrijire-ten","ingrijire-corp","ingrijire-par","machiaj","cosmetice-barbati","homepage"],
    image_url: "https://img.2performant.com/system/paperclip/banner_pictures/pics/270702/original/270702.jpg",
    affiliate_url: "https://event.2performant.com/events/click?ad_type=banner&unique=0b87cb90b&aff_code=676a7e7d9&campaign_unique=1dfbc028f",
    width: 728, height: 90,
    active_from: "2026-07-20", active_until: null,
    channels: ["site"],
  },
  {
    id: "farmec-300x600-b",
    merchant: "farmec.ro",
    categories: ["ingrijire-ten","ingrijire-corp","ingrijire-par","machiaj","cosmetice-barbati","homepage"],
    image_url: "https://img.2performant.com/system/paperclip/banner_pictures/pics/270701/original/270701.jpg",
    affiliate_url: "https://event.2performant.com/events/click?ad_type=banner&unique=3de465904&aff_code=676a7e7d9&campaign_unique=1dfbc028f",
    width: 300, height: 600,
    active_from: "2026-07-20", active_until: null,
    channels: ["site","email"],
  },
  {
    id: "farmec-300x250-c",
    merchant: "farmec.ro",
    categories: ["ingrijire-ten","ingrijire-corp","ingrijire-par","machiaj","cosmetice-barbati","homepage"],
    image_url: "https://img.2performant.com/system/paperclip/banner_pictures/pics/270700/original/270700.jpg",
    affiliate_url: "https://event.2performant.com/events/click?ad_type=banner&unique=32263cd80&aff_code=676a7e7d9&campaign_unique=1dfbc028f",
    width: 300, height: 250,
    active_from: "2026-07-20", active_until: null,
    channels: ["site","email","facebook","instagram"],
  },
  {
    id: "farmec-728x90-c",
    merchant: "farmec.ro",
    categories: ["ingrijire-ten","ingrijire-corp","ingrijire-par","machiaj","cosmetice-barbati","homepage"],
    image_url: "https://img.2performant.com/system/paperclip/banner_pictures/pics/270620/original/270620.png",
    affiliate_url: "https://event.2performant.com/events/click?ad_type=banner&unique=c63710478&aff_code=676a7e7d9&campaign_unique=1dfbc028f",
    width: 728, height: 90,
    active_from: "2026-07-20", active_until: null,
    channels: ["site"],
  },
  {
    id: "farmec-300x600-c",
    merchant: "farmec.ro",
    categories: ["ingrijire-ten","ingrijire-corp","ingrijire-par","machiaj","cosmetice-barbati","homepage"],
    image_url: "https://img.2performant.com/system/paperclip/banner_pictures/pics/270619/original/270619.png",
    affiliate_url: "https://event.2performant.com/events/click?ad_type=banner&unique=d763fc53e&aff_code=676a7e7d9&campaign_unique=1dfbc028f",
    width: 300, height: 600,
    active_from: "2026-07-20", active_until: null,
    channels: ["site","email"],
  },
  {
    id: "farmec-300x250-d",
    merchant: "farmec.ro",
    categories: ["ingrijire-ten","ingrijire-corp","ingrijire-par","machiaj","cosmetice-barbati","homepage"],
    image_url: "https://img.2performant.com/system/paperclip/banner_pictures/pics/270618/original/270618.png",
    affiliate_url: "https://event.2performant.com/events/click?ad_type=banner&unique=2bca23b1b&aff_code=676a7e7d9&campaign_unique=1dfbc028f",
    width: 300, height: 250,
    active_from: "2026-07-20", active_until: null,
    channels: ["site","email","facebook","instagram"],
  },

  // ── farmec.ro — adăugate 22.07.2026 ─────────────────────
  {
    id: "farmec-728x90-d",
    merchant: "farmec.ro",
    categories: ["ingrijire-ten","ingrijire-corp","ingrijire-par","machiaj","cosmetice-barbati","homepage"],
    image_url: "https://img.2performant.com/system/paperclip/banner_pictures/pics/271414/original/271414.png",
    affiliate_url: "https://event.2performant.com/events/click?ad_type=banner&unique=d6fa81fda&aff_code=676a7e7d9&campaign_unique=1dfbc028f",
    width: 728, height: 90,
    active_from: "2026-07-22", active_until: null,
    channels: ["site"],
  },
  {
    id: "farmec-300x600-d",
    merchant: "farmec.ro",
    categories: ["ingrijire-ten","ingrijire-corp","ingrijire-par","machiaj","cosmetice-barbati","homepage"],
    image_url: "https://img.2performant.com/system/paperclip/banner_pictures/pics/271226/original/271226.jpg",
    affiliate_url: "https://event.2performant.com/events/click?ad_type=banner&unique=997b3623f&aff_code=676a7e7d9&campaign_unique=1dfbc028f",
    width: 300, height: 600,
    active_from: "2026-07-22", active_until: null,
    channels: ["site","email"],
  },
  {
    id: "farmec-300x250-e",
    merchant: "farmec.ro",
    categories: ["ingrijire-ten","ingrijire-corp","ingrijire-par","machiaj","cosmetice-barbati","homepage"],
    image_url: "https://img.2performant.com/system/paperclip/banner_pictures/pics/270786/original/270786.png",
    affiliate_url: "https://event.2performant.com/events/click?ad_type=banner&unique=07d519c9f&aff_code=676a7e7d9&campaign_unique=1dfbc028f",
    width: 300, height: 250,
    active_from: "2026-07-22", active_until: null,
    channels: ["site","email","facebook","instagram"],
  },

  // ── farmec.ro — banner nou (05.08.2026) ──────────────────
  {
    id: "farmec-300x600-e",
    merchant: "farmec.ro",
    categories: ["ingrijire-ten","ingrijire-corp","ingrijire-par","machiaj","cosmetice-barbati","homepage"],
    image_url: "https://img.2performant.com/system/paperclip/banner_pictures/pics/271648/original/271648.jpg",
    affiliate_url: "https://event.2performant.com/events/click?ad_type=banner&unique=861bbd602&aff_code=676a7e7d9&campaign_unique=1dfbc028f",
    width: 300, height: 600,
    active_from: "2026-08-05", active_until: null,
    channels: ["site","email"],
  },

  // ── farmec.ro — banner nou (10.08.2026) ──────────────────
  {
    id: "farmec-300x250-e",
    merchant: "farmec.ro",
    categories: ["ingrijire-ten","ingrijire-corp","ingrijire-par","machiaj","cosmetice-barbati","homepage"],
    image_url: "https://img.2performant.com/system/paperclip/banner_pictures/pics/271789/original/271789.jpg",
    affiliate_url: "https://event.2performant.com/events/click?ad_type=banner&unique=0fc0a5984&aff_code=676a7e7d9&campaign_unique=1dfbc028f",
    width: 300, height: 250,
    active_from: "2026-08-10", active_until: "2026-08-19",
    channels: ["site","email"],
  },

  // ── notino.ro — 728×90 ───────────────────────────────────
  {
    id: "notino-728x90-a",
    merchant: "notino.ro",
    categories: ["parfumuri","machiaj","ingrijire-ten","ingrijire-par","homepage"],
    image_url: "https://img.2performant.com/system/paperclip/banner_pictures/pics/175640/original/175640.jpg",
    affiliate_url: "https://event.2performant.com/events/click?ad_type=banner&unique=186f85831&aff_code=676a7e7d9&campaign_unique=c6dae5faa",
    width: 728, height: 90,
    active_from: "2026-08-05", active_until: null,
    channels: ["site"],
  },
  {
    id: "notino-728x90-b",
    merchant: "notino.ro",
    categories: ["parfumuri","machiaj","ingrijire-ten","ingrijire-par","homepage"],
    image_url: "https://img.2performant.com/system/paperclip/banner_pictures/pics/81516/original/81516.jpg",
    affiliate_url: "https://event.2performant.com/events/click?ad_type=banner&unique=0ea65f47c&aff_code=676a7e7d9&campaign_unique=c6dae5faa",
    width: 728, height: 90,
    active_from: "2026-08-05", active_until: null,
    channels: ["site"],
  },

  // ── notino.ro — 300×600 ──────────────────────────────────
  {
    id: "notino-300x600-a",
    merchant: "notino.ro",
    categories: ["parfumuri","machiaj","ingrijire-ten","ingrijire-par","homepage"],
    image_url: "https://img.2performant.com/system/paperclip/banner_pictures/pics/175636/original/175636.jpg",
    affiliate_url: "https://event.2performant.com/events/click?ad_type=banner&unique=53b4b50d7&aff_code=676a7e7d9&campaign_unique=c6dae5faa",
    width: 300, height: 600,
    active_from: "2026-08-05", active_until: null,
    channels: ["site","email"],
  },
  {
    id: "notino-300x600-b",
    merchant: "notino.ro",
    categories: ["parfumuri","machiaj","ingrijire-ten","ingrijire-par","homepage"],
    image_url: "https://img.2performant.com/system/paperclip/banner_pictures/pics/95504/original/95504.jpg",
    affiliate_url: "https://event.2performant.com/events/click?ad_type=banner&unique=7d519c28f&aff_code=676a7e7d9&campaign_unique=c6dae5faa",
    width: 300, height: 600,
    active_from: "2026-08-05", active_until: null,
    channels: ["site","email"],
  },

  // ── notino.ro — 300×250 ──────────────────────────────────
  {
    id: "notino-300x250-a",
    merchant: "notino.ro",
    categories: ["parfumuri","machiaj","ingrijire-ten","ingrijire-par","homepage"],
    image_url: "https://img.2performant.com/system/paperclip/banner_pictures/pics/175631/original/175631.jpg",
    affiliate_url: "https://event.2performant.com/events/click?ad_type=banner&unique=b1ccff066&aff_code=676a7e7d9&campaign_unique=c6dae5faa",
    width: 300, height: 250,
    active_from: "2026-08-05", active_until: null,
    channels: ["site","email","facebook","instagram"],
  },
  {
    id: "notino-300x250-b",
    merchant: "notino.ro",
    categories: ["parfumuri","machiaj","ingrijire-ten","ingrijire-par","homepage"],
    image_url: "https://img.2performant.com/system/paperclip/banner_pictures/pics/175630/original/175630.jpg",
    affiliate_url: "https://event.2performant.com/events/click?ad_type=banner&unique=9c9fab839&aff_code=676a7e7d9&campaign_unique=c6dae5faa",
    width: 300, height: 250,
    active_from: "2026-08-05", active_until: null,
    channels: ["site","email","facebook","instagram"],
  },
  {
    id: "notino-300x250-c",
    merchant: "notino.ro",
    categories: ["parfumuri","machiaj","ingrijire-ten","ingrijire-par","homepage"],
    image_url: "https://img.2performant.com/system/paperclip/banner_pictures/pics/95502/original/95502.jpg",
    affiliate_url: "https://event.2performant.com/events/click?ad_type=banner&unique=f5c8825ba&aff_code=676a7e7d9&campaign_unique=c6dae5faa",
    width: 300, height: 250,
    active_from: "2026-08-05", active_until: null,
    channels: ["site","email","facebook","instagram"],
  },
  
  // ── infinitelove.ro (de completat cu bannere standard când primești) ──
  // Bannerele disponibile acum (1080x1080, 768x768, 1024x1024) sunt
  // formate pătrate pentru social media — nu se potrivesc ca bannere web.
  // Când primești bannere 300x250, 300x600 sau 728x90 de la ei, le adaugi
  // după modelul de mai sus cu categories: ["parfumuri", "homepage"].

  // ────────────────────────────────────────────────────────
  // BANNERE SOCIAL MEDIA — nu se afiseaza pe site
  // Foloseste channels pentru a sti unde le poti folosi.
  // ────────────────────────────────────────────────────────

  // ── notino.ro — 750×350 ──────────────────────────────────
  {
    id: "notino-750x350-a", merchant: "notino.ro",
    categories: ["parfumuri","machiaj","ingrijire-ten","ingrijire-par","homepage"],
    image_url: "https://img.2performant.com/system/paperclip/banner_pictures/pics/175643/original/175643.jpg",
    affiliate_url: "https://event.2performant.com/events/click?ad_type=banner&unique=8cefd4dd0&aff_code=676a7e7d9&campaign_unique=c6dae5faa",
    width: 750, height: 350, active_from: "2026-08-05", active_until: null,
    channels: ["facebook","instagram"], note: "social media — non-standard IAB, nu se afiseaza pe site",
  },
  {
    id: "notino-750x350-b", merchant: "notino.ro",
    categories: ["parfumuri","machiaj","ingrijire-ten","ingrijire-par","homepage"],
    image_url: "https://img.2performant.com/system/paperclip/banner_pictures/pics/175642/original/175642.jpg",
    affiliate_url: "https://event.2performant.com/events/click?ad_type=banner&unique=369df3c0b&aff_code=676a7e7d9&campaign_unique=c6dae5faa",
    width: 750, height: 350, active_from: "2026-08-05", active_until: null,
    channels: ["facebook","instagram"], note: "social media — non-standard IAB, nu se afiseaza pe site",
  },
  {
    id: "notino-750x350-c", merchant: "notino.ro",
    categories: ["parfumuri","machiaj","ingrijire-ten","ingrijire-par","homepage"],
    image_url: "https://img.2performant.com/system/paperclip/banner_pictures/pics/175641/original/175641.jpg",
    affiliate_url: "https://event.2performant.com/events/click?ad_type=banner&unique=312aa69d9&aff_code=676a7e7d9&campaign_unique=c6dae5faa",
    width: 750, height: 350, active_from: "2026-08-05", active_until: null,
    channels: ["facebook","instagram"], note: "social media — non-standard IAB, nu se afiseaza pe site",
  },
  {
    id: "notino-750x350-d", merchant: "notino.ro",
    categories: ["parfumuri","machiaj","ingrijire-ten","ingrijire-par","homepage"],
    image_url: "https://img.2performant.com/system/paperclip/banner_pictures/pics/95499/original/95499.jpg",
    affiliate_url: "https://event.2performant.com/events/click?ad_type=banner&unique=ac00f36a6&aff_code=676a7e7d9&campaign_unique=c6dae5faa",
    width: 750, height: 350, active_from: "2026-08-05", active_until: null,
    channels: ["facebook","instagram"], note: "social media — non-standard IAB, nu se afiseaza pe site",
  },
  {
    id: "notino-750x350-e", merchant: "notino.ro",
    categories: ["parfumuri","machiaj","ingrijire-ten","ingrijire-par","homepage"],
    image_url: "https://img.2performant.com/system/paperclip/banner_pictures/pics/95501/original/95501.jpg",
    affiliate_url: "https://event.2performant.com/events/click?ad_type=banner&unique=48dfbb943&aff_code=676a7e7d9&campaign_unique=c6dae5faa",
    width: 750, height: 350, active_from: "2026-08-05", active_until: null,
    channels: ["facebook","instagram"], note: "social media — non-standard IAB, nu se afiseaza pe site",
  },
  {
    id: "notino-600x250-a", merchant: "notino.ro",
    categories: ["parfumuri","machiaj","ingrijire-ten","ingrijire-par","homepage"],
    image_url: "https://img.2performant.com/system/paperclip/banner_pictures/pics/175639/original/175639.jpg",
    affiliate_url: "https://event.2performant.com/events/click?ad_type=banner&unique=16d9a3787&aff_code=676a7e7d9&campaign_unique=c6dae5faa",
    width: 600, height: 250, active_from: "2026-08-05", active_until: null,
    channels: ["facebook","instagram"], note: "social media — non-standard IAB, nu se afiseaza pe site",
  },
  {
    id: "notino-600x250-b", merchant: "notino.ro",
    categories: ["parfumuri","machiaj","ingrijire-ten","ingrijire-par","homepage"],
    image_url: "https://img.2performant.com/system/paperclip/banner_pictures/pics/175638/original/175638.jpg",
    affiliate_url: "https://event.2performant.com/events/click?ad_type=banner&unique=a95674a8a&aff_code=676a7e7d9&campaign_unique=c6dae5faa",
    width: 600, height: 250, active_from: "2026-08-05", active_until: null,
    channels: ["facebook","instagram"], note: "social media — non-standard IAB, nu se afiseaza pe site",
  },
  {
    id: "notino-600x250-c", merchant: "notino.ro",
    categories: ["parfumuri","machiaj","ingrijire-ten","ingrijire-par","homepage"],
    image_url: "https://img.2performant.com/system/paperclip/banner_pictures/pics/175637/original/175637.jpg",
    affiliate_url: "https://event.2performant.com/events/click?ad_type=banner&unique=d07cfebac&aff_code=676a7e7d9&campaign_unique=c6dae5faa",
    width: 600, height: 250, active_from: "2026-08-05", active_until: null,
    channels: ["facebook","instagram"], note: "social media — non-standard IAB, nu se afiseaza pe site",
  },
  {
    id: "notino-600x250-d", merchant: "notino.ro",
    categories: ["parfumuri","machiaj","ingrijire-ten","ingrijire-par","homepage"],
    image_url: "https://img.2performant.com/system/paperclip/banner_pictures/pics/95498/original/95498.jpg",
    affiliate_url: "https://event.2performant.com/events/click?ad_type=banner&unique=3d835656f&aff_code=676a7e7d9&campaign_unique=c6dae5faa",
    width: 600, height: 250, active_from: "2026-08-05", active_until: null,
    channels: ["facebook","instagram"], note: "social media — non-standard IAB, nu se afiseaza pe site",
  },
  {
    id: "notino-600x250-e", merchant: "notino.ro",
    categories: ["parfumuri","machiaj","ingrijire-ten","ingrijire-par","homepage"],
    image_url: "https://img.2performant.com/system/paperclip/banner_pictures/pics/95505/original/95505.jpg",
    affiliate_url: "https://event.2performant.com/events/click?ad_type=banner&unique=bcb2c17cf&aff_code=676a7e7d9&campaign_unique=c6dae5faa",
    width: 600, height: 250, active_from: "2026-08-05", active_until: null,
    channels: ["facebook","instagram"], note: "social media — non-standard IAB, nu se afiseaza pe site",
  },
  {
    id: "notino-300x300-a", merchant: "notino.ro",
    categories: ["parfumuri","machiaj","ingrijire-ten","ingrijire-par","homepage"],
    image_url: "https://img.2performant.com/system/paperclip/banner_pictures/pics/175633/original/175633.jpg",
    affiliate_url: "https://event.2performant.com/events/click?ad_type=banner&unique=74bd1c172&aff_code=676a7e7d9&campaign_unique=c6dae5faa",
    width: 300, height: 300, active_from: "2026-08-05", active_until: null,
    channels: ["facebook","instagram"], note: "social media — format patrat 1:1",
  },
  {
    id: "notino-300x300-b", merchant: "notino.ro",
    categories: ["parfumuri","machiaj","ingrijire-ten","ingrijire-par","homepage"],
    image_url: "https://img.2performant.com/system/paperclip/banner_pictures/pics/175632/original/175632.jpg",
    affiliate_url: "https://event.2performant.com/events/click?ad_type=banner&unique=312e0b875&aff_code=676a7e7d9&campaign_unique=c6dae5faa",
    width: 300, height: 300, active_from: "2026-08-05", active_until: null,
    channels: ["facebook","instagram"], note: "social media — format patrat 1:1",
  },
  {
    id: "notino-250x250-a", merchant: "notino.ro",
    categories: ["parfumuri","machiaj","ingrijire-ten","ingrijire-par","homepage"],
    image_url: "https://img.2performant.com/system/paperclip/banner_pictures/pics/81515/original/81515.jpg",
    affiliate_url: "https://event.2performant.com/events/click?ad_type=banner&unique=3ed01aa9a&aff_code=676a7e7d9&campaign_unique=c6dae5faa",
    width: 250, height: 250, active_from: "2026-08-05", active_until: null,
    channels: ["facebook","instagram"], note: "social media — format patrat 1:1",
  },
  {
    id: "notino-160x600-a", merchant: "notino.ro",
    categories: ["parfumuri","machiaj","ingrijire-ten","ingrijire-par","homepage"],
    image_url: "https://img.2performant.com/system/paperclip/banner_pictures/pics/81514/original/81514.jpg",
    affiliate_url: "https://event.2performant.com/events/click?ad_type=banner&unique=80aaa9dea&aff_code=676a7e7d9&campaign_unique=c6dae5faa",
    width: 160, height: 600, active_from: "2026-08-05", active_until: null,
    channels: ["facebook"], note: "social media — skyscraper non-standard IAB",
  },
  {
    id: "notino-160x600-b", merchant: "notino.ro",
    categories: ["parfumuri","machiaj","ingrijire-ten","ingrijire-par","homepage"],
    image_url: "https://img.2performant.com/system/paperclip/banner_pictures/pics/95506/original/95506.jpg",
    affiliate_url: "https://event.2performant.com/events/click?ad_type=banner&unique=4f49e2c10&aff_code=676a7e7d9&campaign_unique=c6dae5faa",
    width: 160, height: 600, active_from: "2026-08-05", active_until: null,
    channels: ["facebook"], note: "social media — skyscraper non-standard IAB",
  },
  {
    id: "notino-160x600-c", merchant: "notino.ro",
    categories: ["parfumuri","machiaj","ingrijire-ten","ingrijire-par","homepage"],
    image_url: "https://img.2performant.com/system/paperclip/banner_pictures/pics/95507/original/95507.jpg",
    affiliate_url: "https://event.2performant.com/events/click?ad_type=banner&unique=6f7909e1d&aff_code=676a7e7d9&campaign_unique=c6dae5faa",
    width: 160, height: 600, active_from: "2026-08-05", active_until: null,
    channels: ["facebook"], note: "social media — skyscraper non-standard IAB",
  },
  {
    id: "notino-160x600-d", merchant: "notino.ro",
    categories: ["parfumuri","machiaj","ingrijire-ten","ingrijire-par","homepage"],
    image_url: "https://img.2performant.com/system/paperclip/banner_pictures/pics/175629/original/175629.jpg",
    affiliate_url: "https://event.2performant.com/events/click?ad_type=banner&unique=d4a9da371&aff_code=676a7e7d9&campaign_unique=c6dae5faa",
    width: 160, height: 600, active_from: "2026-08-05", active_until: null,
    channels: ["facebook"], note: "social media — skyscraper non-standard IAB",
  },
  {
    id: "infinitelove-1080x1080-a", merchant: "infinitelove.ro",
    categories: ["parfumuri","homepage"],
    image_url: "https://img.2performant.com/system/paperclip/banner_pictures/pics/270794/original/270794.jpeg",
    affiliate_url: "https://event.2performant.com/events/click?ad_type=banner&unique=5486df99d&aff_code=676a7e7d9&campaign_unique=3fd6221b1",
    width: 1080, height: 1080, active_from: "2026-08-05", active_until: null,
    channels: ["instagram","facebook"], note: "social media — format patrat 1:1",
  },
  {
    id: "infinitelove-1080x1080-b", merchant: "infinitelove.ro",
    categories: ["parfumuri","homepage"],
    image_url: "https://img.2performant.com/system/paperclip/banner_pictures/pics/270792/original/270792.jpeg",
    affiliate_url: "https://event.2performant.com/events/click?ad_type=banner&unique=170088e26&aff_code=676a7e7d9&campaign_unique=3fd6221b1",
    width: 1080, height: 1080, active_from: "2026-08-05", active_until: null,
    channels: ["instagram","facebook"], note: "social media — format patrat 1:1",
  },
  {
    id: "infinitelove-1080x1080-c", merchant: "infinitelove.ro",
    categories: ["parfumuri","homepage"],
    image_url: "https://img.2performant.com/system/paperclip/banner_pictures/pics/270480/original/270480.jpeg",
    affiliate_url: "https://event.2performant.com/events/click?ad_type=banner&unique=ec95633b8&aff_code=676a7e7d9&campaign_unique=3fd6221b1",
    width: 1080, height: 1080, active_from: "2026-08-05", active_until: null,
    channels: ["instagram","facebook"], note: "social media — format patrat 1:1",
  },
  {
    id: "infinitelove-768x768-a", merchant: "infinitelove.ro",
    categories: ["parfumuri","homepage"],
    image_url: "https://img.2performant.com/system/paperclip/banner_pictures/pics/270478/original/270478.jpeg",
    affiliate_url: "https://event.2performant.com/events/click?ad_type=banner&unique=fbc671949&aff_code=676a7e7d9&campaign_unique=3fd6221b1",
    width: 768, height: 768, active_from: "2026-08-05", active_until: null,
    channels: ["instagram","facebook"], note: "social media — format patrat 1:1",
  },
  {
    id: "infinitelove-1024x1024-a", merchant: "infinitelove.ro",
    categories: ["parfumuri","homepage"],
    image_url: "https://img.2performant.com/system/paperclip/banner_pictures/pics/269587/original/269587.jpeg",
    affiliate_url: "https://event.2performant.com/events/click?ad_type=banner&unique=e6cfd1f99&aff_code=676a7e7d9&campaign_unique=3fd6221b1",
    width: 1024, height: 1024, active_from: "2026-08-05", active_until: null,
    channels: ["instagram","facebook"], note: "social media — format patrat 1:1",
  },
  {
    id: "infinitelove-1024x1024-b", merchant: "infinitelove.ro",
    categories: ["parfumuri","homepage"],
    image_url: "https://img.2performant.com/system/paperclip/banner_pictures/pics/269585/original/269585.jpeg",
    affiliate_url: "https://event.2performant.com/events/click?ad_type=banner&unique=b8062b7b6&aff_code=676a7e7d9&campaign_unique=3fd6221b1",
    width: 1024, height: 1024, active_from: "2026-08-05", active_until: null,
    channels: ["instagram","facebook"], note: "social media — format patrat 1:1",
  }
  
];