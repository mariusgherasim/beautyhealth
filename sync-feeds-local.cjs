// sync-feeds-local.cjs
// ============================================================
// Script de sincronizare locala products.json cu feed-urile XML
// Compara fiecare feed XML cu products.json si:
//   - Actualizeaza preturile pentru produsele existente
//   - Adauga produsele noi din feed care lipsesc din JSON
//   - Dezactiveaza (draft: true) produsele din JSON absente din feed
//
// Rulare:
//   node sync-feeds-local.cjs
//
// Optiuni:
//   node sync-feeds-local.cjs --surse=notino,infinitelove
//   node sync-feeds-local.cjs --surse=springfarma,farmec
//   node sync-feeds-local.cjs --surse=boabe,endro
//   node sync-feeds-local.cjs --dry-run   (afiseaza ce ar face, fara sa salveze)
//
// Feed-uri necesare (pune-le in acelasi folder cu scriptul):
//   feed_notino.xml          → notino.ro
//   feed_springfarma.xml     → springfarma.com
//   feed_farmec.xml          → farmec.ro
//   feed_infinitelove.xml    → infinitelove.ro
//   feed_c143969aa.xml       → boabe.ro
//   feed_9c297a4fb.xml       → endro.ro
//
// Output: src/data/products.json (actualizat direct)
//         sync-report.json (raport detaliat)
// ============================================================

const fs = require("fs");
const path = require("path");

// ---- Configurare ----
const PRODUCTS_PATH = path.join(__dirname, "src", "data", "products.json");
const REPORT_PATH = path.join(__dirname, "sync-report.json");

// Limite Notino (ca sa nu umflam fisierul)
const NOTINO_LIMITS = {
  parfumuri: null,       // toate
  machiaj: 5000,         // top 5000 pret desc
  "ingrijire-ten": 1000,
  "ingrijire-par": 1000,
};

// Feed-uri disponibile — numele fisierului XML si sursa corespunzatoare
const FEED_CONFIG = {
  "notino.ro": {
    files: ["feed_notino.xml", "feed_235256a01.xml", "feed_235256a01_1.xml"],
    type: "notino",
  },
  "springfarma.com": {
    files: ["feed_springfarma.xml", "feed_436edea46.xml", "feed_436edea46_1.xml"],
    type: "springfarma",
  },
  "farmec.ro": {
    files: ["feed_farmec.xml", "feed_eb530f914.xml", "feed_eb530f914_1.xml"],
    type: "farmec",
  },
  "infinitelove.ro": {
    files: ["feed_infinitelove.xml", "feed_9d5a36a0f.xml", "feed_9d5a36a0f_1.xml"],
    type: "infinitelove",
  },
  "boabe.ro": {
    files: ["feed_boabe.xml", "feed_c143969aa.xml"],
    type: "boabe",
  },
  "endro.ro": {
    files: ["feed_endro.xml", "feed_9c297a4fb.xml"],
    type: "endro",
  },
};

// ---- Argumente CLI ----
const args = process.argv.slice(2);
const isDryRun = args.includes("--dry-run");
const surseArg = args.find((a) => a.startsWith("--surse="));
const surseFilter = surseArg
  ? surseArg.replace("--surse=", "").split(",").map((s) => s.trim())
  : null;

if (isDryRun) console.log("\n⚠️  DRY RUN — nu se salveaza nimic\n");
if (surseFilter) console.log(`\nFiltru surse: ${surseFilter.join(", ")}\n`);

// ---- Utilitare ----
function slugify(s) {
  return s
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-zA-Z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .toLowerCase()
    .slice(0, 80);
}

function parsePrice(val) {
  const f = parseFloat(val);
  return isNaN(f) ? null : f;
}

function decodeHtml(s) {
  if (!s) return "";
  return s
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, " ");
}

function extractField(item, name) {
  const m = item.match(new RegExp(`<${name}>([\\s\\S]*?)<\\/${name}>`));
  return m ? decodeHtml(m[1].trim()) : null;
}

function parseXmlItems(content) {
  const items = [];
  const rx = /<item>([\s\S]*?)<\/item>/g;
  let m;
  while ((m = rx.exec(content)) !== null) {
    items.push(m[1]);
  }
  return items;
}

function findFeedFile(config) {
  for (const filename of config.files) {
    const p = path.join(__dirname, filename);
    if (fs.existsSync(p)) return p;
  }
  return null;
}

function getNotioCategory(catString) {
  if (!catString) return null;
  const first = catString.split(" - ")[0].trim();
  const map = {
    Parfumuri: "parfumuri",
    Machiaj: "machiaj",
    "Îngrijire ten": "ingrijire-ten",
    "Îngrijirea părului": "ingrijire-par",
    "Parfumuri pentru casa": "parfumuri",
  };
  return map[first] || null;
}

function getSpringfarmaCategory(catRaw) {
  if (!catRaw) return "vitamine-suplimente";
  const c = catRaw.toLowerCase();
  if (["vitamine", "supliment", "mineral"].some((k) => c.includes(k))) return "vitamine-suplimente";
  if (["machiaj", "make"].some((k) => c.includes(k))) return "machiaj";
  if (["par", "păr"].some((k) => c.includes(k))) return "ingrijire-par";
  if (c.includes("corp")) return "ingrijire-corp";
  if (["ten", "fata", "față"].some((k) => c.includes(k))) return "ingrijire-ten";
  if (["mama", "copil", "bebe"].some((k) => c.includes(k))) return "mama-si-copilul";
  if (["oral", "dinti"].some((k) => c.includes(k))) return "igiena-orala";
  if (["barbat", "bărbat"].some((k) => c.includes(k))) return "cosmetice-barbati";
  return "vitamine-suplimente";
}

function getFarmecCategory(catRaw) {
  if (!catRaw) return "ingrijire-ten";
  const c = catRaw.toLowerCase();
  if (["machiaj", "make"].some((k) => c.includes(k))) return "machiaj";
  if (["par", "păr"].some((k) => c.includes(k))) return "ingrijire-par";
  if (c.includes("corp")) return "ingrijire-corp";
  if (["barbat", "bărbat"].some((k) => c.includes(k))) return "cosmetice-barbati";
  return "ingrijire-ten";
}

function getEndroCategory(catRaw) {
  if (!catRaw) return "ingrijire-ten";
  const c = catRaw.toLowerCase();
  // Corp și păr
  if (c.includes("șampoane") || c.includes("sampoane")) return "ingrijire-par";
  if (c.includes("corp")) return "ingrijire-corp";
  // Deodorante → ingrijire-corp (fara subcategorie separata)
  if (c.includes("deodorant")) return "ingrijire-corp";
  // Pastă de dinți → igiena-orala
  if (c.includes("past") && c.includes("din")) return "igiena-orala";
  if (c.includes("refill")) return "igiena-orala";
  // Tot ce tine de fata + rutine → ingrijire-ten
  if (c.includes("rutine") || c.includes("rutin")) return "ingrijire-ten";
  if (c.includes("crem") || c.includes("ser") || c.includes("cur") || c.includes("noapte")) return "ingrijire-ten";
  return "ingrijire-ten";
}

function updateProduct(p, item) {
  const fp = parsePrice(extractField(item, "price")) || 0;
  const fo = parsePrice(extractField(item, "old_price"));
  const imgs = (extractField(item, "image_urls") || "").split(",");
  p.price = fp;
  p.old_price = fo && fo > fp ? fo : null;
  p.availability = true;
  p.draft = false;
  p.price_source = "feed";
  if (imgs[0] && imgs[0].trim()) p.image_url = imgs[0].trim();
  delete p.description;
}

function makeProduct(source, pid, item, category, existingSlugs) {
  const fp = parsePrice(extractField(item, "price")) || 0;
  const fo = parsePrice(extractField(item, "old_price"));
  const imgs = (extractField(item, "image_urls") || "").split(",");
  const title = extractField(item, "title") || "";
  const prefix = source.replace(".ro", "").replace(".com", "");

  let base = slugify(title || `produs-${pid}`);
  let slug = base;
  let i = 2;
  while (existingSlugs.has(slug)) {
    slug = `${base}-${i++}`;
  }
  existingSlugs.add(slug);

  return {
    id: `${prefix}-${pid}`,
    source_site: source,
    brand: extractField(item, "brand") || "",
    title,
    category: Array.isArray(category) ? category : [category],
    subcategory_raw: extractField(item, "category"),
    price: fp,
    old_price: fo && fo > fp ? fo : null,
    currency: "RON",
    availability: true,
    draft: false,
    image_url: imgs[0] && imgs[0].trim() ? imgs[0].trim() : null,
    official_url: extractField(item, "url"),
    affiliate_url: extractField(item, "aff_code"),
    featured: false,
    slug,
    price_source: "feed",
  };
}

// ---- Main ----
console.log("📦 Citesc products.json...");
const products = JSON.parse(fs.readFileSync(PRODUCTS_PATH, "utf8"));
const existingSlugs = new Set(products.map((p) => p.slug).filter(Boolean));

// Sterge descrierile din toate produsele existente
let descRemoved = 0;
for (const p of products) {
  if (p.description !== undefined) {
    delete p.description;
    descRemoved++;
  }
}
if (descRemoved > 0) console.log(`  🗑️  Sters description din ${descRemoved} produse existente`);

console.log(`  Total produse: ${products.length}\n`);

const report = {
  timestamp: new Date().toISOString(),
  dry_run: isDryRun,
  sources: {},
};

// ---- Procesare per sursa ----
for (const [source, config] of Object.entries(FEED_CONFIG)) {
  // Filtru surse din CLI
  if (surseFilter) {
    const sourceName = source.replace(".ro", "").replace(".com", "");
    if (!surseFilter.some((f) => sourceName.includes(f) || source.includes(f))) continue;
  }

  const feedPath = findFeedFile(config);
  if (!feedPath) {
    console.log(`⚠️  ${source}: niciun fisier feed gasit (cautat: ${config.files.join(", ")})`);
    continue;
  }

  console.log(`\n=== ${source.toUpperCase()} ===`);
  console.log(`  Feed: ${path.basename(feedPath)}`);

  const content = fs.readFileSync(feedPath, "utf8");
  const rawItems = parseXmlItems(content);
  const activeItems = rawItems.filter((i) => extractField(i, "product_active") === "true");
  console.log(`  Feed: ${rawItems.length} total, ${activeItems.length} active`);

  const jsonProducts = products.filter((p) => p.source_site === source);
  const prefix = source.replace(".ro", "").replace(".com", "");
  const jsonPids = new Set(jsonProducts.map((p) => p.id.replace(`${prefix}-`, "")));

  let updated = 0, added = 0, deactivated = 0;

  // ---- NOTINO: cu limite pe categorii ----
  if (config.type === "notino") {
    const byCategory = {};
    for (const item of activeItems) {
      const cat = getNotioCategory(extractField(item, "category"));
      if (!cat) continue;
      if (!byCategory[cat]) byCategory[cat] = [];
      byCategory[cat].push(item);
    }

    const selectedPids = new Set();
    const selectedByCat = {};

    for (const [cat, items] of Object.entries(byCategory)) {
      const limit = NOTINO_LIMITS[cat];
      let selected = items;
      if (limit) {
        selected = items
          .sort((a, b) => (parsePrice(extractField(b, "price")) || 0) - (parsePrice(extractField(a, "price")) || 0))
          .slice(0, limit);
      }
      selectedByCat[cat] = selected;
      for (const item of selected) selectedPids.add(extractField(item, "product_id"));
    }

    const feedDict = {};
    for (const item of activeItems) {
      feedDict[extractField(item, "product_id")] = item;
    }

    for (const p of products) {
      if (p.source_site !== source) continue;
      const pid = p.id.replace("notino-", "");
      if (!selectedPids.has(pid)) {
        p.availability = false; p.draft = true; deactivated++;
      } else if (feedDict[pid]) {
        updateProduct(p, feedDict[pid]); updated++;
      }
    }

    for (const [cat, items] of Object.entries(selectedByCat)) {
      for (const item of items) {
        const pid = extractField(item, "product_id");
        if (jsonPids.has(pid)) continue;
        const np = makeProduct(source, pid, item, cat, existingSlugs);
        np.id = `notino-${pid}`;
        if (!isDryRun) products.push(np);
        added++;
      }
    }
  }
  // ---- INFINITELOVE ----
  else if (config.type === "infinitelove") {
    const feedDict = {};
    const feedAllPids = new Set();
    for (const item of rawItems) {
      const pid = extractField(item, "product_id");
      feedAllPids.add(pid);
      if (extractField(item, "product_active") === "true") feedDict[pid] = item;
    }

    for (const p of products) {
      if (p.source_site !== source) continue;
      const pid = p.id.replace("infinitelove-", "");
      if (feedDict[pid]) { updateProduct(p, feedDict[pid]); updated++; }
      else { p.availability = false; p.draft = true; p.price_source = "feed"; deactivated++; }
    }

    for (const [pid, item] of Object.entries(feedDict)) {
      if (jsonPids.has(pid)) continue;
      const np = makeProduct(source, pid, item, "parfumuri", existingSlugs);
      np.id = `infinitelove-${pid}`;
      if (!isDryRun) products.push(np);
      added++;
    }
  }
  // ---- SPRINGFARMA ----
  else if (config.type === "springfarma") {
    const feedActive = {};
    const feedAllPids = new Set();
    for (const item of rawItems) {
      const pid = extractField(item, "product_id");
      feedAllPids.add(pid);
      if (extractField(item, "product_active") === "true") feedActive[pid] = item;
    }

    for (const p of products) {
      if (p.source_site !== source) continue;
      const pid = p.id.replace("springfarma-", "");
      if (feedActive[pid]) { updateProduct(p, feedActive[pid]); updated++; }
      else if (!feedAllPids.has(pid)) { p.availability = false; p.draft = true; deactivated++; }
    }

    for (const [pid, item] of Object.entries(feedActive)) {
      if (jsonPids.has(pid)) continue;
      const cat = getSpringfarmaCategory(extractField(item, "category"));
      const np = makeProduct(source, pid, item, cat, existingSlugs);
      np.id = `springfarma-${pid}`;
      if (!isDryRun) products.push(np);
      added++;
    }
  }
  // ---- FARMEC ----
  else if (config.type === "farmec") {
    const feedActive = {};
    const feedAllPids = new Set();
    for (const item of rawItems) {
      const pid = extractField(item, "product_id");
      feedAllPids.add(pid);
      if (extractField(item, "product_active") === "true") feedActive[pid] = item;
    }

    for (const p of products) {
      if (p.source_site !== source) continue;
      const pid = p.id.replace("farmec-", "");
      if (feedActive[pid]) { updateProduct(p, feedActive[pid]); updated++; }
      else if (!feedAllPids.has(pid)) { p.availability = false; p.draft = true; deactivated++; }
    }

    for (const [pid, item] of Object.entries(feedActive)) {
      if (jsonPids.has(pid)) continue;
      const cat = getFarmecCategory(extractField(item, "category"));
      const np = makeProduct(source, pid, item, cat, existingSlugs);
      np.id = `farmec-${pid}`;
      if (!isDryRun) products.push(np);
      added++;
    }
  }
  // ---- BOABE.RO (wellness / cafea specialitate) ----
  else if (config.type === "boabe") {
    const feedActive = {};
    const feedAllPids = new Set();
    for (const item of rawItems) {
      const pid = extractField(item, "product_id");
      feedAllPids.add(pid);
      if (extractField(item, "product_active") === "true") feedActive[pid] = item;
    }

    for (const p of products) {
      if (p.source_site !== source) continue;
      const pid = p.id.replace("boabe-", "");
      if (feedActive[pid]) { updateProduct(p, feedActive[pid]); updated++; }
      else if (!feedAllPids.has(pid)) { p.availability = false; p.draft = true; deactivated++; }
    }

    for (const [pid, item] of Object.entries(feedActive)) {
      if (jsonPids.has(pid)) continue;
      // Toate produsele boabe.ro merg la wellness
      const np = makeProduct(source, pid, item, "wellness", existingSlugs);
      np.id = `boabe-${pid}`;
      if (!isDryRun) products.push(np);
      added++;
    }
  }
  // ---- ENDRO.RO (cosmetice naturale) ----
  else if (config.type === "endro") {
    const feedActive = {};
    const feedAllPids = new Set();
    for (const item of rawItems) {
      const pid = extractField(item, "product_id");
      feedAllPids.add(pid);
      if (extractField(item, "product_active") === "true") feedActive[pid] = item;
    }

    for (const p of products) {
      if (p.source_site !== source) continue;
      const pid = p.id.replace("endro-", "");
      if (feedActive[pid]) { updateProduct(p, feedActive[pid]); updated++; }
      else if (!feedAllPids.has(pid)) { p.availability = false; p.draft = true; deactivated++; }
    }

    for (const [pid, item] of Object.entries(feedActive)) {
      if (jsonPids.has(pid)) continue;
      const cat = getEndroCategory(extractField(item, "category"));
      const np = makeProduct(source, pid, item, cat, existingSlugs);
      np.id = `endro-${pid}`;
      if (!isDryRun) products.push(np);
      added++;
    }
  }

  console.log(`  ✅ actualizate: ${updated} | ➕ adaugate: ${added} | 🗑️  dezactivate: ${deactivated}`);
  report.sources[source] = { updated, added, deactivated };
}

// ---- Sumar final ----
const active = products.filter((p) => !p.draft);
const withOld = active.filter((p) => p.old_price).length;
const sizeMB = (JSON.stringify(products, null, 0).length / 1e6).toFixed(1);

console.log(`\n========================================`);
console.log(`  Total produse: ${products.length}`);
console.log(`  Active: ${active.length}`);
console.log(`  Cu old_price (reducere): ${withOld}`);
console.log(`  Marime fisier: ${sizeMB} MB`);
console.log(`========================================\n`);

report.summary = {
  total: products.length,
  active: active.length,
  with_old_price: withOld,
  size_mb: parseFloat(sizeMB),
};

// ---- Salvare ----
if (!isDryRun) {
  fs.writeFileSync(PRODUCTS_PATH, JSON.stringify(products, null, 0), "utf8");
  fs.writeFileSync(REPORT_PATH, JSON.stringify(report, null, 2), "utf8");
  console.log(`✅ Salvat: ${PRODUCTS_PATH}`);
  console.log(`📋 Raport: ${REPORT_PATH}`);
  console.log(`\n⏭️  Acum faci: git pull -X ours && git add src/data/products.json && git commit -m "chore: sync feeds local" && git push\n`);
} else {
  console.log(`⚠️  DRY RUN — nimic nu a fost salvat.\n`);
}
