// generate-beautyhealth-email.cjs
// Generează emailul cu top reduceri parfumuri BeautyHealth
// Rulare: node generate-beautyhealth-email.cjs
// Output: beautyhealth-email-output.html — copiezi HTML-ul în blocul Custom HTML din MailerLite

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

// ---- 1. Parfumuri cu reducere ----
const TOP_N = 12;

const active = products.filter(
  (p) =>
    p.draft === false &&
    p.availability &&
    p.price &&
    p.old_price &&
    p.old_price > p.price &&
    Array.isArray(p.category) &&
    p.category.includes("parfumuri")
);

if (active.length === 0) {
  console.log("Nu există parfumuri cu reducere. Nimic de generat.");
  process.exit(0);
}

const maxPct = Math.max(...active.map((p) => (1 - p.price / p.old_price) * 100));
const maxSum = Math.max(...active.map((p) => p.old_price - p.price));

active.forEach((p) => {
  p._pct = Math.round((1 - p.price / p.old_price) * 100);
  p._sum = Math.round(p.old_price - p.price);
  p._score = 0.6 * (p._pct / maxPct) + 0.4 * (p._sum / maxSum);
});

function seededShuffle(arr, seed) {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) hash = (hash * 31 + seed.charCodeAt(i)) | 0;
  let rngState = Math.abs(hash) || 1;
  const rng = () => {
    rngState = (rngState * 1103515245 + 12345) & 0x7fffffff;
    return rngState / 0x7fffffff;
  };
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

const today = new Date().toISOString().slice(0, 10);
const pool = active.sort((a, b) => b._score - a._score).slice(0, 40);
const parfumuri = seededShuffle(pool, `${today}-parfumuri`).slice(0, TOP_N);

console.log(`\nParfumuri selectate: ${parfumuri.length}`);

// ---- 2. Banner ----
const todayStr = new Date().toISOString().slice(0, 10);
const emailBanners = banners.filter((b) => {
  if (!b.image_url || !b.affiliate_url) return false;
  if (!b.channels || !b.channels.includes("email")) return false;
  if (b.active_from && b.active_from > todayStr) return false;
  if (b.active_until && b.active_until < todayStr) return false;
  return !b.categories || b.categories.includes("parfumuri") || b.categories.includes("homepage");
});

let chosenBanner = null;
if (emailBanners.length > 0) {
  let hash = 0;
  const seed = `${today}-banner-parfumuri`;
  for (let i = 0; i < seed.length; i++) hash = (hash * 31 + seed.charCodeAt(i)) | 0;
  chosenBanner = emailBanners[Math.abs(hash) % emailBanners.length];
}
console.log(`Banner ales: ${chosenBanner ? chosenBanner.id : "niciun banner"}`);

// ---- 3. Subiect + Preheader ----
const brands = [...new Set(parfumuri.map((p) => p.brand).filter(Boolean))].slice(0, 3);
const maxDiscount = Math.max(...parfumuri.map((p) => p._pct));
const maxEconomy = Math.max(...parfumuri.map((p) => p._sum));

const subject = `Reduceri până la ${maxDiscount}% la parfumuri premium — ${brands.join(", ")} și altele`;
const preheader = `Economisești până la ${maxEconomy} RON azi — stoc limitat, verifică înainte să dispară`;

// ---- 4. HTML ----
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
  return `
    <td style="width:50%; padding:8px; vertical-align:top;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${WHITE}; border:1px solid ${BORDER}; border-radius:3px; overflow:hidden;">
        <tr>
          <td style="padding:6px 10px 4px 10px;">
            <span style="display:inline-block; background:${RED}; color:#ffffff; font-family:${FONT_BODY}; font-size:11px; font-weight:bold; padding:3px 9px; border-radius:12px;">-${p._pct}%</span>
          </td>
        </tr>
        <tr>
          <td style="padding:0;">
            <a href="${p.affiliate_url}" target="_blank" style="text-decoration:none;">
              <img src="${p.image_url}" alt="${p.title}" width="100%" style="display:block; width:100%; height:auto;" />
            </a>
          </td>
        </tr>
        <tr>
          <td style="padding:10px 12px;">
            <div style="font-family:${FONT_BODY}; font-size:11px; color:${WARM_MID}; text-transform:uppercase; letter-spacing:0.06em;">${p.brand || ""}</div>
            <div style="font-family:${FONT_BODY}; font-weight:bold; font-size:14px; color:${NAVY}; margin:4px 0;">${shortTitle}</div>
            <div style="font-family:${FONT_BODY}; font-size:12px; margin:6px 0 4px 0; border-top:1px dashed ${BORDER}; padding-top:8px;">
              <span style="color:${WARM_MID}; text-decoration:line-through;">${p.old_price.toFixed(2)} RON</span>
              &nbsp;&nbsp;
              <span style="background:${GOLD}; color:#ffffff; font-weight:bold; padding:4px 10px; border-radius:3px; font-size:14px;">${p.price.toFixed(2)} RON</span>
            </div>
            <div style="font-family:${FONT_BODY}; font-size:11px; color:${RED}; margin:4px 0 8px 0;">Economisești ${p._sum} RON</div>
            <a href="${p.affiliate_url}" target="_blank" style="display:block; text-align:center; background:${NAVY}; color:#ffffff; font-family:${FONT_BODY}; font-size:12px; font-weight:bold; text-decoration:none; padding:10px; border-radius:3px; margin-top:4px;">Vezi oferta →</a>
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
        <img src="${chosenBanner.image_url}" alt="BeautyHealth — Parfumuri" style="display:block; width:100%; max-width:600px; height:auto; margin:0 auto; border-radius:4px;" />
      </a>
    </td>
  </tr>` : "";

const CROSS_BRAND_OPTIN_URL = "https://preview.mailerlite.io/forms/1999265/193604931012265713/share";

const html = `
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px; margin:0 auto; font-family:Arial,sans-serif; background:${CREAM};">

  <!-- HEADER -->
  <tr>
    <td colspan="2" style="background:${NAVY}; padding:24px 16px; text-align:center;">
      <div style="font-family:${FONT_DISPLAY}; font-size:28px; color:#ffffff; letter-spacing:-0.5px;">beauty<span style="color:${GOLD};">health</span></div>
      <div style="font-size:11px; color:rgba(255,255,255,0.6); letter-spacing:4px; text-transform:uppercase; margin-top:4px;">PARFUMURI &amp; ÎNGRIJIRE PREMIUM</div>
    </td>
  </tr>

  <!-- INTRO -->
  <tr>
    <td colspan="2" style="background:${WHITE}; padding:20px 16px 12px 16px; text-align:center; border-bottom:1px solid ${BORDER};">
      <h1 style="font-family:${FONT_DISPLAY}; color:${NAVY}; font-size:20px; margin:0 0 8px 0;">${subject}</h1>
      <p style="font-family:${FONT_BODY}; font-size:13px; color:${WARM_MID}; margin:0;">${preheader}</p>
    </td>
  </tr>

  <!-- BANNER -->
  ${bannerHtml}

  <!-- TITLU -->
  <tr>
    <td colspan="2" style="padding:20px 8px 8px 8px; text-align:center;">
      <h2 style="font-family:${FONT_DISPLAY}; color:${NAVY}; font-size:18px; margin:0; border-top:2px solid ${GOLD}; padding-top:14px;">🌸 Top Reduceri Parfumuri</h2>
    </td>
  </tr>

  <!-- PRODUSE -->
  ${productRows(parfumuri)}

  <!-- CTA -->
  <tr>
    <td colspan="2" style="padding:16px 8px; text-align:center;">
      <a href="https://beautyhealth.gherasimmarius.com/oferte/parfumuri/" target="_blank" style="display:inline-block; background:${GOLD}; color:#ffffff; font-family:${FONT_BODY}; font-size:13px; font-weight:bold; text-decoration:none; padding:12px 28px; border-radius:3px;">
        Vezi toate ofertele la parfumuri →
      </a>
    </td>
  </tr>

  <!-- FOOTER -->
  <tr>
    <td colspan="2" style="padding:16px 8px 20px 8px; text-align:center; border-top:1px solid ${BORDER};">
      <p style="font-family:${FONT_BODY}; font-size:11px; color:${WARM_MID}; margin:0 0 6px 0;">Vrei să primești și noutăți din alte proiecte Marius Gherasim (asigurări, cărți, health &amp; beauty)?</p>
      <a href="${CROSS_BRAND_OPTIN_URL}" target="_blank" style="font-family:${FONT_BODY}; font-size:11px; color:${NAVY}; text-decoration:underline;">Abonează-te aici →</a>
      <p style="font-family:${FONT_BODY}; font-size:10px; color:#aaaaaa; margin:16px 0 0 0;">
        Prețurile și disponibilitatea pot varia față de site-ul partenerului.<br/>
        Nu mai vrei aceste emailuri? <a href="{$unsubscribe}" style="color:#aaaaaa; text-decoration:underline;">Dezabonează-te aici</a>.
      </p>
    </td>
  </tr>

</table>`.trim();

// ---- 5. Output ----
const output = `SUBIECT (copiază în câmpul Subject din MailerLite):
${subject}

PREHEADER (copiază în câmpul Preheader din MailerLite):
${preheader}

NOTĂ: ${parfumuri.length} parfumuri | Banner: ${chosenBanner ? chosenBanner.id : "niciun banner"}

⏰ Nu uita: în MailerLite, adaugă blocul nativ "Countdown" deasupra blocului Custom HTML.

========================================
COD HTML (copiază tot ce urmează în editorul Custom HTML din MailerLite):
========================================

${html}
`;

fs.writeFileSync("beautyhealth-email-output.html", output, "utf8");
console.log(`\n✅ Generat: beautyhealth-email-output.html`);
console.log(`📧 Subiect: ${subject}`);
console.log(`👀 Preheader: ${preheader}`);
console.log(`📦 Parfumuri: ${parfumuri.length}`);
console.log(`\n⏰ Nu uita: adaugă blocul "Countdown" în MailerLite deasupra blocului Custom HTML.\n`);
