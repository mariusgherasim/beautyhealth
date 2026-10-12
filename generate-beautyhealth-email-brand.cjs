// generate-beautyhealth-email-brand.cjs
// Email BeautyHealth — 20 parfumuri aleatorii dintr-un brand ales aleator
// Brand ales doar din brandurile definite in brands.js cu pagina proprie pe site
// Rulare: node generate-beautyhealth-email-brand.cjs
// Output: beautyhealth-email-brand-output.html

const fs = require("fs");

const products = JSON.parse(fs.readFileSync("src/data/products.json", "utf8"));

// Citeste banners.js
let banners = [];
try {
  const raw = fs.readFileSync("src/data/banners.js", "utf8");
  const match = raw.match(/export const banners = (\[[\s\S]*\]);/);
  if (match) {
    const cleaned = match[1]
      .replace(/\/\/[^\n]*/g, "")
      .replace(/,(\s*[}\]])/g, "$1");
    banners = JSON.parse(cleaned);
  }
} catch (e) {
  console.warn("Nu am putut citi banners.js:", e.message);
}

// ---- Branduri eligibile — doar cele din brands.js cu pagina pe site ----
// match: cuvinte cheie pentru a gasi produsele brandului in products.json
// slug: URL-ul paginii de brand pe site
const ELIGIBLE_BRANDS = [
  { name: "HERMÈS",              slug: "hermes",             match: ["HERM", "HERMES"] },
  { name: "GUERLAIN",            slug: "guerlain",           match: ["GUERLAIN"] },
  { name: "VERSACE",             slug: "versace",            match: ["VERSACE"] },
  { name: "DIOR",                slug: "dior",               match: ["DIOR"] },
  { name: "CALVIN KLEIN",        slug: "calvin-klein",       match: ["CALVIN"] },
  { name: "DOLCE&GABBANA",       slug: "dolce-gabbana",      match: ["DOLCE"] },
  { name: "HUGO BOSS",           slug: "hugo-boss",          match: ["HUGO"] },
  { name: "ARMANI",              slug: "armani",             match: ["ARMANI"] },
  { name: "JEAN PAUL GAULTIER",  slug: "jean-paul-gaultier", match: ["GAULTIER", "JEAN PAUL"] },
  { name: "TOM FORD",            slug: "tom-ford",           match: ["TOM FORD"] },
  { name: "CHLOÉ",               slug: "chloe",              match: ["CHLO"] },
  { name: "RABANNE",             slug: "rabanne",            match: ["RABANNE"] },
  { name: "BURBERRY",            slug: "burberry",           match: ["BURBERRY"] },
  { name: "GIVENCHY",            slug: "givenchy",           match: ["GIVENCHY"] },
  { name: "GUCCI",               slug: "gucci",              match: ["GUCCI"] },
  { name: "YVES SAINT LAURENT",  slug: "yves-saint-laurent", match: ["YVES"] },
  { name: "CAROLINA HERRERA",    slug: "carolina-herrera",   match: ["CAROLINA"] },
  { name: "CREED",               slug: "creed",              match: ["CREED"] },
  { name: "VICTORIA'S SECRET",   slug: "victorias-secret",   match: ["VICTORIA"] },
  { name: "GUESS",               slug: "guess",              match: ["GUESS"] },
  { name: "MONTALE",             slug: "montale",            match: ["MONTALE"] },
  { name: "LATTAFA",             slug: "lattafa",            match: ["LATTAFA"] },
  // YANKEE CANDLE exclus intentionat
  { name: "INFINITE LOVE",       slug: "infinite-love",      match: ["INFINITE"] },
];

const MIN_PRODUCTS = 20;

// ---- 1. Parfumuri active per brand ----
const parfumuri = products.filter(
  (p) =>
    p.draft === false &&
    p.availability &&
    p.price &&
    Array.isArray(p.category) &&
    p.category.includes("parfumuri") &&
    p.brand
);

function matchesBrand(p, brandDef) {
  const pb = p.brand.toUpperCase();
  return brandDef.match.some((kw) => pb.includes(kw.toUpperCase()));
}

// Filtreaza brandurile cu >= MIN_PRODUCTS parfumuri active
const eligibleWithProducts = ELIGIBLE_BRANDS
  .map((b) => ({
    ...b,
    products: parfumuri.filter((p) => matchesBrand(p, b)),
  }))
  .filter((b) => b.products.length >= MIN_PRODUCTS);

if (eligibleWithProducts.length === 0) {
  console.log("Nu există branduri eligibile cu >= " + MIN_PRODUCTS + " parfumuri active.");
  process.exit(0);
}

console.log(`\nBranduri eligibile: ${eligibleWithProducts.length}`);
eligibleWithProducts.forEach((b) => console.log(`  ${b.products.length}  ${b.name}`));

// ---- 2. Alege brand aleator ----
const chosen = eligibleWithProducts[Math.floor(Math.random() * eligibleWithProducts.length)];
const brandProducts = chosen.products;

console.log(`\nBrand ales: ${chosen.name} (${brandProducts.length} parfumuri disponibile)`);

// ---- 3. Selecteaza 20 produse: cu reducere primele, restul aleator ----
const withDiscount = brandProducts
  .filter((p) => p.old_price && p.old_price > p.price)
  .map((p) => ({
    ...p,
    _pct: Math.round((1 - p.price / p.old_price) * 100),
    _sum: Math.round(p.old_price - p.price),
  }))
  .sort((a, b) => b._pct - a._pct);

const withoutDiscount = brandProducts
  .filter((p) => !p.old_price || p.old_price <= p.price)
  .map((p) => ({ ...p, _pct: 0, _sum: 0 }));

// Shuffle withoutDiscount
for (let i = withoutDiscount.length - 1; i > 0; i--) {
  const j = Math.floor(Math.random() * (i + 1));
  [withoutDiscount[i], withoutDiscount[j]] = [withoutDiscount[j], withoutDiscount[i]];
}

const selected = [...withDiscount, ...withoutDiscount].slice(0, 20);
const hasDiscount = withDiscount.length > 0;
const maxDiscount = hasDiscount ? Math.max(...withDiscount.map((p) => p._pct)) : 0;

console.log(`Produse selectate: ${selected.length} (${withDiscount.length} cu reducere, ${selected.length - Math.min(withDiscount.length, selected.length)} fara reducere)`);

// ---- 4. Banner ----
const todayStr = new Date().toISOString().slice(0, 10);
const emailBanners = banners.filter((b) => {
  if (!b.image_url || !b.affiliate_url) return false;
  if (!b.channels || !b.channels.includes("email")) return false;
  if (b.active_from && b.active_from > todayStr) return false;
  if (b.active_until && b.active_until < todayStr) return false;
  return !b.categories || b.categories.includes("parfumuri") || b.categories.includes("homepage");
});

const chosenBanner = emailBanners.length > 0
  ? emailBanners[Math.floor(Math.random() * emailBanners.length)]
  : null;
console.log(`Banner ales: ${chosenBanner ? chosenBanner.id : "niciun banner"}`);

// ---- 5. Subiect + Preheader ----
const subject = hasDiscount
  ? `${chosen.name} — ${selected.length} parfumuri, reduceri până la ${maxDiscount}% | BeautyHealth`
  : `Descoperă colecția ${chosen.name} — ${selected.length} parfumuri selectate | BeautyHealth`;

const preheader = hasDiscount
  ? `Parfumuri ${chosen.name} cu reducere + toată colecția — prețuri comparate zilnic`
  : `Toată colecția ${chosen.name} într-un singur loc — prețuri comparate zilnic pe BeautyHealth`;

// ---- 6. HTML ----
const NAVY = "#0B1F4A";
const GOLD = "#C4883A";
const CREAM = "#F7F4EF";
const WHITE = "#FFFFFF";
const WARM_MID = "#6B5B4E";
const BORDER = "#E0D8CF";
const RED = "#B94040";
const FONT_DISPLAY = "Georgia, 'Times New Roman', serif";
const FONT_BODY = "Arial, Helvetica, sans-serif";

function truncateTitle(title, maxLen = 55) {
  if (!title || title.length <= maxLen) return title;
  return title.slice(0, maxLen).trim() + "…";
}

function productCard(p) {
  const shortTitle = truncateTitle(p.title);
  const hasOld = p.old_price && p.old_price > p.price;
  return `
    <td style="width:50%; padding:8px; vertical-align:top;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0"
        style="background:${WHITE}; border:1px solid ${BORDER}; border-radius:3px; overflow:hidden;">
        <tr>
          <td style="padding:6px 10px 4px 10px; min-height:24px;">
            ${hasOld
              ? `<span style="display:inline-block; background:${RED}; color:#ffffff; font-family:${FONT_BODY}; font-size:11px; font-weight:bold; padding:3px 9px; border-radius:12px;">-${p._pct}%</span>`
              : `<span style="display:inline-block; font-size:11px; color:transparent;">·</span>`}
          </td>
        </tr>
        <tr>
          <td style="padding:0;">
            <a href="${p.affiliate_url}" target="_blank" style="text-decoration:none;">
              <img src="${p.image_url || ''}" alt="${shortTitle}"
                width="100%" style="display:block; width:100%; height:auto;" />
            </a>
          </td>
        </tr>
        <tr>
          <td style="padding:10px 12px;">
            <div style="font-family:${FONT_BODY}; font-size:11px; color:${WARM_MID};
              text-transform:uppercase; letter-spacing:0.06em;">${p.brand || ""}</div>
            <div style="font-family:${FONT_BODY}; font-weight:bold; font-size:13px;
              color:${NAVY}; margin:4px 0;">${shortTitle}</div>
            <div style="font-family:${FONT_BODY}; font-size:12px; margin:6px 0 4px 0;
              border-top:1px dashed ${BORDER}; padding-top:8px;">
              ${hasOld
                ? `<span style="color:${WARM_MID}; text-decoration:line-through;">${p.old_price.toFixed(2)} RON</span>
                   &nbsp;&nbsp;
                   <span style="background:${GOLD}; color:#ffffff; font-weight:bold;
                     padding:4px 10px; border-radius:3px; font-size:13px;">${p.price.toFixed(2)} RON</span>`
                : `<span style="background:${GOLD}; color:#ffffff; font-weight:bold;
                     padding:4px 10px; border-radius:3px; font-size:13px;">${p.price.toFixed(2)} RON</span>`}
            </div>
            ${hasOld
              ? `<div style="font-family:${FONT_BODY}; font-size:11px; color:${RED}; margin:4px 0 8px 0;">Economisești ${p._sum} RON</div>`
              : `<div style="margin:4px 0 8px 0;"></div>`}
            <a href="${p.affiliate_url}" target="_blank"
              style="display:block; text-align:center; background:${NAVY}; color:#ffffff;
              font-family:${FONT_BODY}; font-size:12px; font-weight:bold;
              text-decoration:none; padding:10px; border-radius:3px;">
              Vezi oferta →
            </a>
          </td>
        </tr>
      </table>
    </td>`;
}

function productRows(items) {
  const rows = [];
  for (let i = 0; i < items.length; i += 2) {
    const pair = items.slice(i, i + 2);
    const cells = pair.map(productCard).join("");
    const filler = pair.length === 1 ? `<td style="width:50%;"></td>` : "";
    rows.push(`<tr>${cells}${filler}</tr>`);
  }
  return rows.join("\n");
}

const bannerHtml = chosenBanner ? `
  <tr>
    <td colspan="2" style="padding:12px 8px 16px 8px; text-align:center;">
      <a href="${chosenBanner.affiliate_url}" target="_blank" rel="nofollow noopener">
        <img src="${chosenBanner.image_url}" alt="BeautyHealth — Parfumuri"
          style="display:block; width:100%; max-width:600px; height:auto; margin:0 auto; border-radius:4px;" />
      </a>
    </td>
  </tr>` : "";

const CROSS_BRAND_OPTIN_URL = "https://preview.mailerlite.io/forms/1999265/193604931012265713/share";

const html = `
<table role="presentation" width="100%" cellpadding="0" cellspacing="0"
  style="max-width:600px; margin:0 auto; font-family:Arial,sans-serif; background:${CREAM};">

  <!-- HEADER -->
  <tr>
    <td colspan="2" style="background:${NAVY}; padding:24px 16px; text-align:center;">
      <div style="font-family:${FONT_DISPLAY}; font-size:28px; color:#ffffff; letter-spacing:-0.5px;">
        beauty<span style="color:${GOLD};">health</span>
      </div>
      <div style="font-size:11px; color:rgba(255,255,255,0.6); letter-spacing:4px;
        text-transform:uppercase; margin-top:4px;">PARFUMURI &amp; ÎNGRIJIRE PREMIUM</div>
    </td>
  </tr>

  <!-- INTRO -->
  <tr>
    <td colspan="2" style="background:${WHITE}; padding:20px 16px 12px 16px;
      text-align:center; border-bottom:1px solid ${BORDER};">
      <div style="font-family:${FONT_BODY}; font-size:11px; color:${WARM_MID};
        text-transform:uppercase; letter-spacing:0.15em; margin-bottom:8px;">Selecția zilei</div>
      <h1 style="font-family:${FONT_DISPLAY}; color:${NAVY}; font-size:22px;
        margin:0 0 8px 0;">${chosen.name}</h1>
      <p style="font-family:${FONT_BODY}; font-size:13px; color:${WARM_MID}; margin:0;">
        ${selected.length} parfumuri selectate din colecție${hasDiscount ? ` — inclusiv ${withDiscount.length} cu reducere` : ""}
      </p>
    </td>
  </tr>

  <!-- BANNER -->
  ${bannerHtml}

  <!-- TITLU -->
  <tr>
    <td colspan="2" style="padding:20px 8px 8px 8px; text-align:center;">
      <h2 style="font-family:${FONT_DISPLAY}; color:${NAVY}; font-size:18px;
        margin:0; border-top:2px solid ${GOLD}; padding-top:14px;">
        🌸 Colecție ${chosen.name}
      </h2>
    </td>
  </tr>

  <!-- PRODUSE -->
  ${productRows(selected)}

  <!-- CTA -->
  <tr>
    <td colspan="2" style="padding:16px 8px; text-align:center;">
      <a href="https://beautyhealth.gherasimmarius.com/parfumuri/brand/${chosen.slug}/"
        target="_blank"
        style="display:inline-block; background:${GOLD}; color:#ffffff;
        font-family:${FONT_BODY}; font-size:13px; font-weight:bold;
        text-decoration:none; padding:12px 28px; border-radius:3px;">
        Vezi toată colecția ${chosen.name} →
      </a>
    </td>
  </tr>

  <!-- FOOTER -->
  <tr>
    <td colspan="2" style="padding:16px 8px 20px 8px; text-align:center;
      border-top:1px solid ${BORDER};">
      <p style="font-family:${FONT_BODY}; font-size:11px; color:${WARM_MID};
        margin:0 0 6px 0;">
        Vrei să primești și noutăți din alte proiecte Marius Gherasim
        (asigurări, cărți, health &amp; beauty)?
      </p>
      <a href="${CROSS_BRAND_OPTIN_URL}" target="_blank"
        style="font-family:${FONT_BODY}; font-size:11px; color:${NAVY};
        text-decoration:underline;">Abonează-te aici →</a>
      <p style="font-family:${FONT_BODY}; font-size:10px; color:#aaaaaa; margin:16px 0 0 0;">
        Prețurile și disponibilitatea pot varia față de site-ul partenerului.<br/>
        Nu mai vrei aceste emailuri?
        <a href="{$unsubscribe}" style="color:#aaaaaa; text-decoration:underline;">
          Dezabonează-te aici</a>.
      </p>
    </td>
  </tr>

</table>`.trim();

// ---- 7. Output ----
const output = `SUBIECT (copiază în câmpul Subject din MailerLite):
${subject}

PREHEADER (copiază în câmpul Preheader din MailerLite):
${preheader}

NOTĂ: Brand: ${chosen.name} | Slug: ${chosen.slug} | ${selected.length} produse (${withDiscount.length} cu reducere) | Banner: ${chosenBanner ? chosenBanner.id : "niciun banner"}

⏰ Nu uita: în MailerLite, adaugă blocul nativ "Countdown" deasupra blocului Custom HTML.

========================================
COD HTML (copiază tot ce urmează în editorul Custom HTML din MailerLite):
========================================

${html}
`;

fs.writeFileSync("beautyhealth-email-brand-output.html", output, "utf8");
console.log(`\n✅ Generat: beautyhealth-email-brand-output.html`);
console.log(`🏷️  Brand: ${chosen.name} → /parfumuri/brand/${chosen.slug}/`);
console.log(`📧 Subiect: ${subject}`);
console.log(`📦 Produse: ${selected.length} (${withDiscount.length} cu reducere)`);
console.log(`\n⏰ Nu uita: adaugă blocul "Countdown" în MailerLite deasupra blocului Custom HTML.\n`);
