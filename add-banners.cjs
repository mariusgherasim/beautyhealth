// add-banners.cjs
// ============================================================
// Script interactiv pentru adaugarea bannerelor in banners.js
// Parsează linkurile HTML de la 2Performant și le adaugă automat
//
// Rulare: node add-banners.cjs
//
// Cum folosești:
// 1. Rulezi scriptul
// 2. Lipești linkurile HTML (unul sau mai multe) când ți se cere
// 3. Scriptul le parsează, îți arată ce a găsit și te întreabă
//    data de expirare și categoriile
// 4. Salvează automat în src/data/banners.js
// ============================================================

const fs = require("fs");
const path = require("path");
const readline = require("readline");

const BANNERS_PATH = path.join(__dirname, "src", "data", "banners.js");

// ---- Utilitare ----
function parseHtmlBanners(html) {
  const results = [];
  // Gaseste toate perechile <a href="..."><img .../></a>
  const linkRx = /<a\s+href="([^"]+)"[^>]*>[\s\S]*?<img\s([^>]+)\/?>[\s\S]*?<\/a>/gi;
  let m;
  while ((m = linkRx.exec(html)) !== null) {
    const href = m[1];
    const imgAttrs = m[2];

    const srcMatch = imgAttrs.match(/src="([^"]+)"/i);
    const altMatch = imgAttrs.match(/alt="([^"]+)"/i);
    const widthMatch = imgAttrs.match(/width="(\d+)px?"/i);
    const heightMatch = imgAttrs.match(/height="(\d+)px?"/i);

    if (!srcMatch || !widthMatch || !heightMatch) continue;

    const imageUrl = srcMatch[1];
    const affiliateUrl = href;
    const width = parseInt(widthMatch[1]);
    const height = parseInt(heightMatch[1]);
    const altText = altMatch ? altMatch[1].trim() : "";

    // Extrage merchant din alt sau din campaign_unique
    let merchant = altText || "necunoscut";
    // Curata: "farmec.ro " -> "farmec.ro"
    merchant = merchant.trim().replace(/\/$/, "");
    if (!merchant.includes(".")) merchant = merchant + ".ro";

    // Extrage unique din URL
    const uniqueMatch = affiliateUrl.match(/unique=([a-f0-9]+)/);
    const unique = uniqueMatch ? uniqueMatch[1] : null;

    results.push({ imageUrl, affiliateUrl, width, height, merchant, unique });
  }
  return results;
}

function detectChannels(width, height) {
  if (width === 728 && height === 90) return ["site"];
  if (width === 300 && height === 250) return ["site", "email", "facebook", "instagram"];
  if (width === 300 && height === 600) return ["site", "email"];
  if (width === 160 && height === 600) return ["facebook"];
  if (width === height) return ["instagram", "facebook"]; // patrat
  if (height > width) return ["instagram", "facebook"]; // portret
  return ["facebook", "instagram"]; // non-standard
}

function detectNote(width, height) {
  const standard = [
    [728, 90], [300, 250], [300, 600], [160, 600]
  ];
  const isStandard = standard.some(([w, h]) => w === width && h === height);
  if (!isStandard) return "social media — format non-standard IAB, nu se afiseaza pe site";
  return null;
}

function readExistingBanners(content) {
  // Extrage toate id-urile si unique-urile existente
  const ids = new Set();
  const uniques = new Set();
  for (const m of content.matchAll(/id:\s*"([^"]+)"/g)) ids.add(m[1]);
  for (const m of content.matchAll(/unique=([a-f0-9]+)/g)) uniques.add(m[1]);
  return { ids, uniques };
}

function getNextId(content, merchant, width, height) {
  const prefix = merchant.replace(".ro", "").replace(".com", "");
  const slug = `${prefix}-${width}x${height}`;
  const letters = "abcdefghijklmnopqrstuvwxyz";
  for (const letter of letters) {
    const candidate = `${slug}-${letter}`;
    if (!content.includes(`"${candidate}"`)) return candidate;
  }
  return `${slug}-${Date.now()}`;
}

function detectCategories(merchant) {
  const m = merchant.toLowerCase();
  if (m.includes("farmec")) return ["ingrijire-ten", "ingrijire-corp", "ingrijire-par", "machiaj", "cosmetice-barbati", "homepage"];
  if (m.includes("notino")) return ["parfumuri", "machiaj", "ingrijire-ten", "ingrijire-par", "homepage"];
  if (m.includes("infinite")) return ["parfumuri", "homepage"];
  if (m.includes("springfarma")) return ["vitamine-suplimente", "homepage"];
  return ["homepage"];
}

function formatBanner(banner) {
  const { id, merchant, categories, imageUrl, affiliateUrl, width, height, activeFrom, activeUntil, channels, note } = banner;
  const until = activeUntil ? `"${activeUntil}"` : "null";
  const noteStr = note ? `\n    note: "${note}",` : "";
  return `  {
    id: "${id}",
    merchant: "${merchant}",
    categories: ${JSON.stringify(categories)},
    image_url: "${imageUrl}",
    affiliate_url: "${affiliateUrl}",
    width: ${width}, height: ${height},
    active_from: "${activeFrom}", active_until: ${until},
    channels: ${JSON.stringify(channels)},${noteStr}
  }`;
}

// ---- Readline ----
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function ask(question) {
  return new Promise((resolve) => rl.question(question, resolve));
}

function askMultiline(prompt) {
  return new Promise((resolve) => {
    console.log(prompt);
    console.log('(Lipeste linkurile HTML, apoi apasa Enter de doua ori cand ai terminat)');
    let lines = [];
    let emptyCount = 0;
    rl.on("line", function handler(line) {
      if (line === "") {
        emptyCount++;
        if (emptyCount >= 2) {
          rl.removeListener("line", handler);
          resolve(lines.join("\n"));
        }
      } else {
        emptyCount = 0;
        lines.push(line);
      }
    });
  });
}

// ---- Main ----
async function main() {
  console.log("\n╔══════════════════════════════════════════════════╗");
  console.log("║     ADD-BANNERS — Adaugare bannere in banners.js  ║");
  console.log("╚══════════════════════════════════════════════════╝\n");

  if (!fs.existsSync(BANNERS_PATH)) {
    console.error(`❌ Nu gasesc banners.js la: ${BANNERS_PATH}`);
    process.exit(1);
  }

  const content = fs.readFileSync(BANNERS_PATH, "utf8");
  const { ids, uniques } = readExistingBanners(content);
  console.log(`📋 banners.js curent: ${ids.size} bannere\n`);

  // Citeste HTML-ul
  const html = await askMultiline("\n📥 Lipeste linkurile HTML ale bannerelor:");

  if (!html.trim()) {
    console.log("❌ Niciun link detectat.");
    rl.close(); return;
  }

  const parsed = parseHtmlBanners(html);
  if (parsed.length === 0) {
    console.log("❌ Nu am putut parsa niciun banner. Verifica formatul HTML.");
    rl.close(); return;
  }

  console.log(`\n✅ Am detectat ${parsed.length} banner(e):\n`);
  parsed.forEach((b, i) => {
    const exists = b.unique && uniques.has(b.unique) ? " ⚠️  EXISTA DEJA" : " ✨ NOU";
    console.log(`  ${i + 1}. ${b.merchant} — ${b.width}×${b.height}${exists}`);
    console.log(`     ${b.imageUrl}`);
  });

  const newBanners = parsed.filter((b) => !b.unique || !uniques.has(b.unique));
  if (newBanners.length === 0) {
    console.log("\n⚠️  Toate bannerele există deja în fisier. Nimic de adaugat.");
    rl.close(); return;
  }

  console.log(`\n➕ De adaugat: ${newBanners.length} banner(e) noi\n`);

  // Data de expirare
  const today = new Date().toISOString().slice(0, 10);
  const untilInput = await ask(`📅 Data de expirare (YYYY-MM-DD) sau Enter pentru "fara termen": `);
  const activeUntil = untilInput.trim() || null;

  // Construieste bannerele noi
  const bannersToAdd = [];
  for (const b of newBanners) {
    const id = getNextId(content + bannersToAdd.map(x => x.id).join(""), b.merchant, b.width, b.height);
    const channels = detectChannels(b.width, b.height);
    const note = detectNote(b.width, b.height);
    const categories = detectCategories(b.merchant);

    bannersToAdd.push({
      id,
      merchant: b.merchant,
      categories,
      imageUrl: b.imageUrl,
      affiliateUrl: b.affiliateUrl,
      width: b.width,
      height: b.height,
      activeFrom: today,
      activeUntil,
      channels,
      note,
    });
  }

  // Preview
  console.log("\n📋 Preview bannere de adaugat:\n");
  for (const b of bannersToAdd) {
    console.log(`  ID: ${b.id}`);
    console.log(`  Dimensiune: ${b.width}×${b.height}`);
    console.log(`  Channels: ${b.channels.join(", ")}`);
    console.log(`  Active until: ${b.activeUntil || "fara termen"}`);
    if (b.note) console.log(`  Note: ${b.note}`);
    console.log();
  }

  const confirm = await ask("💾 Salvezi in banners.js? (Enter = Da / n = Nu): ");
  if (confirm.trim().toLowerCase() === "n") {
    console.log("❌ Anulat. Nimic nu a fost salvat.");
    rl.close(); return;
  }

  // Adauga in fisier
  const newEntries = bannersToAdd.map(formatBanner).join(",\n");
  const insertAt = content.rfind ? content.lastIndexOf("\n];") : content.lastIndexOf("\n];");

  // Detecteaza daca ultimul banner are virgula
  const beforeClose = content.slice(0, insertAt).trimEnd();
  const needsComma = !beforeClose.endsWith(",");

  const finalContent = content.slice(0, insertAt) +
    (needsComma ? "," : "") +
    "\n\n  // ── adaugate " + today + " ─────────────────────────────\n" +
    newEntries + ",\n" +
    "\n];";

  // Valideaza JS
  const { execSync } = require("child_process");
  try {
    execSync(`node --input-type=module`, { input: finalContent, stdio: ["pipe", "pipe", "pipe"] });
  } catch (e) {
    console.error("❌ Eroare sintaxa JS! Nu am salvat. Verifica manual.");
    console.error(e.stderr?.toString().slice(0, 200));
    rl.close(); return;
  }

  fs.writeFileSync(BANNERS_PATH, finalContent, "utf8");

  console.log(`\n✅ Salvat! ${bannersToAdd.length} banner(e) adaugate in banners.js`);
  console.log(`\n📌 IDs adaugate:`);
  bannersToAdd.forEach((b) => console.log(`   ${b.id}`));
  console.log(`\n⏭️  Acum faci:`);
  console.log(`   git pull -X ours`);
  console.log(`   git add src/data/banners.js`);
  console.log(`   git commit -m "feat: bannere noi (${bannersToAdd.map(b=>b.id).join(", ")})"`)
  console.log(`   git push\n`);

  rl.close();
}

main().catch((e) => { console.error(e); rl.close(); });
