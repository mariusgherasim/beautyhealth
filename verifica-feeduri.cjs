// VERIFICA FEED-URI — beauty-healths.com
// Ruleaza din folderul site-ului:   node verifica-feeduri.cjs
//
// Pentru fiecare fisier feed_*.xml din folder arata:
//   - ce magazine contine (unele feed-uri 2Performant amesteca mai multe magazine)
//   - cate produse sunt active / inactive (product_active true/false)
//   - cate produse inactive sunt deja pe site si cate ar fi noi
//   - 5 produse INACTIVE alese la intamplare, cu link, ca sa verifici daca se pot cumpara
// Rezultatul: un raport HTML care se deschide singur in browser.

const fs = require("fs");
const os = require("os");
const path = require("path");
const { execSync } = require("child_process");

const DIR = __dirname;
const RAPORT = path.join(os.tmpdir(), "verificare-feeduri.html");

const decode = (s) => String(s || "").replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
  .replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&#39;|&apos;/g, "'").replace(/&amp;/g, "&").trim();
const field = (it, n) => { const m = it.match(new RegExp(`<${n}>([\\s\\S]*?)<\\/${n}>`)); return m ? decode(m[1]) : ""; };
const esc = (s) => String(s ?? "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const camp = (s) => s.toLowerCase().replace(/^https?:\/\//, "").replace(/^www\./, "").replace(/\/+$/, "");

// produsele de pe site, ca sa stim ce e deja publicat
let peSite = new Map();
try {
  const products = JSON.parse(fs.readFileSync(path.join(DIR, "src", "data", "products.json"), "utf8"));
  for (const p of products) if (!p.draft) peSite.set(`${camp(p.source_site)}|${p.id.replace(/^[^-]+-/, "")}`, p);
} catch { console.log("(nu am gasit src/data/products.json — raportul nu va arata ce e deja pe site)"); }

const fisiere = fs.readdirSync(DIR).filter((f) => /^feed_.*\.xml$/i.test(f));
if (!fisiere.length) { console.log("Nu am gasit niciun fisier feed_*.xml in folder."); process.exit(1); }

const sectiuni = [];
for (const f of fisiere) {
  const items = fs.readFileSync(path.join(DIR, f), "utf8").match(/<item>[\s\S]*?<\/item>/g) || [];
  const pe = {};
  for (const it of items) {
    const c = camp(field(it, "campaign_name")) || "(fara nume)";
    (pe[c] ||= []).push(it);
  }
  const amestecat = Object.keys(pe).length > 1;
  console.log(`\n${f}: ${items.length} produse${amestecat ? "  ⚠️  CONTINE MAI MULTE MAGAZINE" : ""}`);
  let html = `<h2>${esc(f)} <small>${items.length} produse</small></h2>`;
  if (amestecat) html += `<p class="warn">⚠️ Fișierul conține produse din ${Object.keys(pe).length} magazine: ${Object.keys(pe).map(esc).join(", ")}.</p>`;
  for (const [c, list] of Object.entries(pe)) {
    const act = list.filter((it) => field(it, "product_active") === "true");
    const ina = list.filter((it) => field(it, "product_active") !== "true");
    const inaPeSite = ina.filter((it) => peSite.has(`${c}|${field(it, "product_id")}`)).length;
    console.log(`   ${c}: ${act.length} active, ${ina.length} inactive (${inaPeSite} inactive sunt deja pe site)`);
    const mostre = [...ina].sort(() => Math.random() - 0.5).slice(0, 5);
    html += `<div class="box"><h3>${esc(c)}</h3>
      <p><b>${act.length}</b> active · <b>${ina.length}</b> inactive (din care <b>${inaPeSite}</b> sunt deja pe site, <b>${ina.length - inaPeSite}</b> nu sunt)</p>
      ${mostre.length ? `<p>Deschide-le și verifică dacă se pot pune în coș:</p><ol>${mostre.map((it) => `<li><a href="${esc(field(it, "url"))}" target="_blank">${esc(field(it, "title"))}</a> — ${esc(field(it, "price"))} lei <small>(adăugat ${esc(field(it, "created_at").slice(0, 10))})</small></li>`).join("")}</ol>
      <p class="q">Se pot cumpăra? <b>DA</b> → la acest magazin luăm toate produsele. <b>NU</b> → rămân doar cele active.</p>` : "<p>Nu are produse inactive. ✅</p>"}
    </div>`;
  }
  sectiuni.push(html);
}

fs.writeFileSync(RAPORT, `<!doctype html><html lang="ro"><head><meta charset="utf-8"><title>Verificare feed-uri</title>
<style>body{font:15px system-ui,sans-serif;max-width:900px;margin:24px auto;padding:0 16px;color:#222;background:#f6f6f8}
h2{margin-top:34px;border-bottom:2px solid #ddd;padding-bottom:6px}h2 small{font-weight:400;color:#777;font-size:14px}
.box{background:#fff;border:1px solid #ddd;border-radius:10px;padding:12px 18px;margin:10px 0}h3{margin:4px 0}
.warn{background:#fff4d6;border:1px solid #e8c766;border-radius:8px;padding:8px 12px}.q{color:#555}a{color:#0b5ed8}li{margin:4px 0}</style></head>
<body><h1>Verificare feed-uri</h1><p>Pentru fiecare magazin: câte produse sunt active/inactive în feed și 5 produse <b>inactive</b> de verificat pe site-ul magazinului. Trimite-mi pe chat, pentru fiecare magazin, DA sau NU.</p>
${sectiuni.join("")}</body></html>`);
console.log(`\nRaport: ${RAPORT}`);
try { execSync(process.platform === "win32" ? `start "" "${RAPORT}"` : `xdg-open "${RAPORT}"`, { stdio: "ignore", shell: true }); } catch {}
