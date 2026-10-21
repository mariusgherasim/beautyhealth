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
//   node sync-feeds-local.cjs --dry-run   (afiseaza ce ar face, fara sa salveze)
//
// Feed-uri necesare (pune-le in acelasi folder cu scriptul):
//   feed_235256a01.xml   → notino.ro
//   feed_436edea46.xml   → springfarma.com
//   feed_eb530f914.xml   → farmec.ro
//   feed_9d5a36a0f.xml   → infinitelove.ro
//   feed_fd8dad9ff.xml   → detoxmed.ro
//   feed_5d8022816.xml   → longevity-boost.com
//   feed_9c297a4fb.xml   → endro.ro
//   feed_c143969aa.xml   → boabe.ro
//   feed_5544111cd.xml   → PARFLAB.ro
//   feed_585a1cd31.xml   → drmax.ro (catalog complet)
//   feed_09eca89e8.xml   → drmax.ro (branduri exclusive)
//   feed_dc6bbc64e.xml   → drmax.ro (private label)
//   (cele 3 feed-uri Dr. Max se unesc automat; produsele duble apar o singura data)
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
    defaultCategory: "parfumuri",
  },
  "springfarma.com": {
    files: ["feed_springfarma.xml", "feed_436edea46.xml", "feed_436edea46_1.xml"],
    type: "springfarma",
    defaultCategory: "vitamine-suplimente",
  },
  "farmec.ro": {
    files: ["feed_farmec.xml", "feed_eb530f914.xml", "feed_eb530f914_1.xml"],
    type: "farmec",
    defaultCategory: "ingrijire-ten",
  },
  "infinitelove.ro": {
    files: ["feed_infinitelove.xml", "feed_9d5a36a0f.xml", "feed_9d5a36a0f_1.xml"],
    type: "infinitelove",
    defaultCategory: "parfumuri",
  },
  "detoxmed.ro": {
    files: ["feed_detoxmed.xml", "feed_fd8dad9ff.xml"],
    type: "generic",
    defaultCategory: "vitamine-suplimente",
  },
  "longevity-boost.com": {
    files: ["feed_longevity-boost.xml", "feed_5d8022816.xml"],
    type: "generic",
    defaultCategory: "vitamine-suplimente",
  },
  "endro.ro": {
    files: ["feed_endro.xml", "feed_9c297a4fb.xml"],
    type: "generic",
    defaultCategory: "ingrijire-ten",
  },
  "boabe.ro": {
    files: ["feed_boabe.xml", "feed_c143969aa.xml"],
    type: "generic",
    defaultCategory: "vitamine-suplimente",
  },
  "PARFLAB.ro": {
    files: ["feed_parflab.xml", "feed_5544111cd.xml"],
    type: "generic",
    defaultCategory: "parfumuri",
  },
  "drmax.ro": {
    // mergeFiles: se citesc TOATE fisierele gasite si se unesc dupa product_id
    files: ["feed_585a1cd31.xml", "feed_09eca89e8.xml", "feed_dc6bbc64e.xml"],
    mergeFiles: true,
    type: "drmax",
    defaultCategory: "ingrijire-ten",
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

function findFeedFiles(config) {
  return config.files.map((f) => path.join(__dirname, f)).filter((p) => fs.existsSync(p));
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

// Farmec: categoria din feed e adesea numele gamei ("Game", "Gerovital Plant"), asa ca ne uitam
// si la titlu. Returneaza null pentru produsele care nu tin de beauty (curatenie, insecticide).
function getFarmecCategory(catRaw, title = "", brand = "") {
  const t = normTxt(`${catRaw || ""} ${title || ""} ${brand || ""}`);
  if (areKw(t, ["locuinta", "nufar", "insect tox", "insecticid", "desfundat", "detergent", "inalbitor", "odorizant", "curatare suprafete", "spray de curatat", "anticalcar"])) return null;
  if (areKw(t, ["pasta de dinti", "periuta", "apa de gura", "dentar"])) return "igiena-orala";
  if (areKw(t, ["kids", "copii", "bebe"])) return "mama-si-copilul";
  if (areKw(t, ["deodorant", "antiperspirant"])) return "ingrijire-corp";
  if (areKw(t, ["apa de parfum", "apa de toaleta", "eau de", "parfum pentru", "parfum de dama", "parfum barbatesc"])) return "parfumuri";
  if (areKw(t, ["make up", "machiaj", "ruj", "fond de ten", "fondotinta", "pudra", "cipria", "mascara", "rimel", "creion", "lac de unghii", "oja", "top coat", "base coat", "anticearcan", "concealer", "fard", "gloss", "beauty="])) return "machiaj";
  if (areKw(t, ["men=", "barbati", "spuma de ras", "gel de ras", "after shave", "aftershave", "barba"])) return "cosmetice-barbati";
  if (areKw(t, ["par=", "sampon", "balsam de par", "masca de par", "vopsea", "tratament expert", "scalp", "anticadere"])) return "ingrijire-par";
  if (areKw(t, ["corp", "dus=", "gel de dus", "depilat", "maini", "picioare", "sapun", "lapte de corp", "sun=", "protectie solara", "bronz"])) return "ingrijire-corp";
  return "ingrijire-ten";
}

function getGenericCategory(catRaw, defaultCategory) {
  if (!catRaw) return defaultCategory;
  const c = catRaw.toLowerCase();
  if (["parfum", "apa de"].some((k) => c.includes(k))) return "parfumuri";
  if (["machiaj", "make", "fond de ten", "ruj", "mascara"].some((k) => c.includes(k))) return "machiaj";
  if (["par", "păr", "sampon", "balsam"].some((k) => c.includes(k))) return "ingrijire-par";
  if (["corp", "crema corp", "lotiune"].some((k) => c.includes(k))) return "ingrijire-corp";
  if (["ten", "fata", "față", "serum", "toner"].some((k) => c.includes(k))) return "ingrijire-ten";
  if (["supliment", "vitamine", "mineral", "capsule", "tablete"].some((k) => c.includes(k))) return "vitamine-suplimente";
  if (["mama", "copil", "bebe"].some((k) => c.includes(k))) return "mama-si-copilul";
  if (["oral", "dinti", "pasta"].some((k) => c.includes(k))) return "igiena-orala";
  if (["barbat", "bărbat", "after shave"].some((k) => c.includes(k))) return "cosmetice-barbati";
  return defaultCategory;
}

// ---- DR. MAX: categorie din <category> + <subcategory> ----
// Potrivire fara diacritice, pe inceput de cuvant ('corp' prinde 'corporala').
function normTxt(s) {
  return " " + String(s || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, " ").trim() + " ";
}
function areKw(text, kws) {
  return kws.some((k) => {
    const whole = k.endsWith("=");
    const kk = normTxt(whole ? k.slice(0, -1) : k).trim();
    return whole ? text.includes(" " + kk + " ") : text.includes(" " + kk);
  });
}
function getDrmaxCategory(cat, sub, title) {
  const c = normTxt(cat);
  // Produsele fara subcategorie (ex. "Marci exclusive") se incadreaza dupa titlu
  const s = normTxt(sub && sub.trim() ? sub : title);
  if (areKw(c, ["suplimente alimentare", "remedii naturiste"])) return "vitamine-suplimente";
  if (areKw(c, ["mama si copilul"])) return "mama-si-copilul";
  if (areKw(c, ["tehnico medicale"])) return "dispozitive-medicale";
  if (areKw(c, ["dieta si nutritie"])) {
    if (areKw(s, ["suplimente pentru sportivi", "aminoacizi", "creatina", "gainere", "batoane proteice", "antrenament", "carnitina", "arginina", "alimente sportivi", "proteine", "electroliti", "sport=",
                  "imunitate", "anti inflamatie", "anti stres", "energie", "colagen", "fertilitate", "controlul greutatii", "pierdere in greutate", "longevitate", "pudre functionale"])) return "vitamine-suplimente";
    return "wellness";
  }
  if (areKw(c, ["subiecte tabu"])) {
    if (areKw(s, ["teste de sarcina"])) return "mama-si-copilul";
    if (areKw(s, ["tampoane", "absorbante"])) return "ingrijire-corp";
    if (areKw(s, ["incontinenta", "scutece adulti", "protectii pat"])) return "dispozitive-medicale";
    if (areKw(s, ["hemoroizi", "herpes", "respiratie"])) return "vitamine-suplimente";
    return "cuplu-intimitate";
  }
  // Frumusete si ingrijire -> dupa subcategorie (ordinea conteaza)
  if (areKw(s, ["uleiuri esentiale", "aromaterapie", "aromoterapie", "roll on uleiuri"])) return "wellness";
  if (areKw(s, ["apa de parfum", "apa de toaleta", "parfumuri", "odorizante", "lumanari", "parfumuri pentru textile"])) return "parfumuri";
  if (areKw(s, ["pentru copii", "anti paduchi"])) return "mama-si-copilul";
  if (areKw(s, ["aparat de ras femei"])) return "ingrijire-corp";
  if (areKw(s, ["barbierit", "spuma de ras", "aparate de ras", "lame de ras", "aftershave", "barba", "pentru barbati", "pamatuf", "crema de ras", "gel de ras"])) return "cosmetice-barbati";
  if (areKw(s, ["dinti", "dentar", "apa de gura", "igiena orala", "ata dentara", "dusuri bucale", "proteze"])) return "igiena-orala";
  if (areKw(s, ["fond de ten", "ruj=", "unghi", "oja", "creion", "rimel", "fard", "gloss", "corector", "pudra de fata", "pensule", "bb cream", "cc cream", "tus=", "iluminator", "bronzer", "baza de machiaj",
                "gene false", "sprancene", "bureti machiaj", "accesorii make up", "machiaj", "truse", "acetona", "pile=", "cuticule"])) return "machiaj";
  if (areKw(s, ["par=", "parului", "sampon", "balsam hidratant pentru par", "balsam pentru par", "balsam de par", "balsam cu keratina", "balsam leave in", "masti pentru par", "masti de par", "scalp", "styling", "anticadere",
                "antimatreata", "perie de par", "piepteni", "vopsea", "fixativ", "spuma de par", "gel de par", "uleiuri pentru par", "ulei de par", "pomada", "protectie termica", "bonete", "prosoape de par",
                "spray si pudra pentru volum", "accesorii par"])) return "ingrijire-par";
  if (areKw(s, ["corp", "dus=", "deodorant", "antiperspirant", "maini", "picioare", "pedichiura", "scrub", "spray de corp", "mist", "baie", "intim", "absorbant", "cupe menstruale", "chiloti menstruali",
                "tampoane si", "anticelulit", "vergeturi", "celulita", "epila", "depila", "ceara de epilat", "benzi depilatoare", "tantari", "insecte", "masaj", "after sun", "dupa plaja", "autobronzant", "sapun solid"])) return "ingrijire-corp";
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

function makeProduct(source, pid, item, category, existingSlugs, rawCategory) {
  const fp = parsePrice(extractField(item, "price")) || 0;
  const fo = parsePrice(extractField(item, "old_price"));
  const imgs = (extractField(item, "image_urls") || "").split(",");
  const title = extractField(item, "title") || "";
  const prefix = source.replace(".ro", "").replace(".com", "").toLowerCase();

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
    subcategory_raw: rawCategory !== undefined ? rawCategory : extractField(item, "category"),
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

  const feedPaths = config.mergeFiles ? findFeedFiles(config) : [findFeedFile(config)].filter(Boolean);
  if (feedPaths.length === 0) {
    console.log(`⚠️  ${source}: niciun fisier feed gasit (cautat: ${config.files.join(", ")})`);
    continue;
  }

  console.log(`\n=== ${source.toUpperCase()} ===`);
  console.log(`  Feed: ${feedPaths.map((f) => path.basename(f)).join(" + ")}`);

  // Cand sunt mai multe fisiere, un produs (product_id) apare o singura data — primul fisier are prioritate
  let rawItems = [];
  let strain = 0;
  const seenPids = new Set();
  for (const fp of feedPaths) {
    for (const it of parseXmlItems(fs.readFileSync(fp, "utf8"))) {
      // Unele feed-uri 2Performant contin produse din mai multe magazine (ex. feedul Farmec are si
      // produse Infinite Love). Pastram doar produsele magazinului curent, dupa campaign_name.
      const camp = (extractField(it, "campaign_name") || "").toLowerCase().replace(/^https?:\/\//, "").replace(/^www\./, "").replace(/\/+$/, "");
      if (camp && camp !== source.toLowerCase()) { strain++; continue; }
      const pid = extractField(it, "product_id");
      if (seenPids.has(pid)) continue;
      seenPids.add(pid);
      rawItems.push(it);
    }
  }
  const activeItems = rawItems.filter((i) => extractField(i, "product_active") === "true");
  console.log(`  Feed: ${rawItems.length} total, ${activeItems.length} active${strain ? ` (ignorate ${strain} produse din alte magazine)` : ""}`);

  const prefix = source.replace(".ro", "").replace(".com", "").toLowerCase();
  const jsonProducts = products.filter((p) => p.source_site === source);
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
      else if (!feedAllPids.has(pid)) { p.availability = false; p.draft = true; deactivated++; } // doar daca lipseste complet din feed
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
    // Curatenie: inregistrari vechi Infinite Love importate gresit ca Farmec (feedul Farmec contine si produse Infinite Love)
    for (let k = products.length - 1; k >= 0; k--) {
      const p = products[k];
      if (p.source_site === source && /infinitelove\.ro/i.test(p.official_url || "")) { products.splice(k, 1); deactivated++; }
    }
    const jsonPidsF = new Set(products.filter((p) => p.source_site === source).map((p) => p.id.replace("farmec-", "")));

    const feedActive = {};
    const feedAllPids = new Set();
    const exclude = new Set();
    for (const item of rawItems) {
      const pid = extractField(item, "product_id");
      feedAllPids.add(pid);
      // La Farmec campul product_active NU e de incredere: produse marcate "false" se pot cumpara
      // pe farmec.ro (verificat 21.10.2026). Le luam pe toate, mai putin cele care nu tin de beauty.
      if (getFarmecCategory(extractField(item, "category"), extractField(item, "title"), extractField(item, "brand"))) feedActive[pid] = item;
      else exclude.add(pid);
    }

    for (const p of products) {
      if (p.source_site !== source) continue;
      const pid = p.id.replace("farmec-", "");
      if (feedActive[pid]) { updateProduct(p, feedActive[pid]); updated++; }
      else if (exclude.has(pid) || !feedAllPids.has(pid)) { p.availability = false; p.draft = true; deactivated++; } // non-beauty sau disparut din feed
    }

    for (const [pid, item] of Object.entries(feedActive)) {
      if (jsonPidsF.has(pid)) continue;
      const cat = getFarmecCategory(extractField(item, "category"), extractField(item, "title"), extractField(item, "brand"));
      const np = makeProduct(source, pid, item, cat, existingSlugs);
      np.id = `farmec-${pid}`;
      if (!isDryRun) products.push(np);
      added++;
    }
  }
  // ---- DR. MAX (3 feed-uri unite) ----
  else if (config.type === "drmax") {
    const feedActive = {};
    for (const item of rawItems) {
      if (extractField(item, "product_active") === "true") feedActive[extractField(item, "product_id")] = item;
    }
    for (const p of products) {
      if (p.source_site !== source) continue;
      const pid = p.id.replace(`${prefix}-`, "");
      if (feedActive[pid]) { updateProduct(p, feedActive[pid]); updated++; }
      else if (!seenPids.has(pid)) { p.availability = false; p.draft = true; deactivated++; } // doar daca lipseste complet din feed
    }
    for (const [pid, item] of Object.entries(feedActive)) {
      if (jsonPids.has(pid)) continue;
      const cat = extractField(item, "category") || "";
      const sub = extractField(item, "subcategory") || "";
      const raw = sub ? `${cat} > ${sub}` : cat;
      const np = makeProduct(source, pid, item, getDrmaxCategory(cat, sub, extractField(item, "title")), existingSlugs, raw);
      if (!isDryRun) products.push(np);
      added++;
    }
  }
  // ---- GENERIC (detoxmed, longevity-boost, endro, boabe, PARFLAB si altele viitoare) ----
  else if (config.type === "generic") {
    const feedActive = {};
    const feedAllPids = new Set();
    for (const item of rawItems) {
      const pid = extractField(item, "product_id");
      feedAllPids.add(pid);
      if (extractField(item, "product_active") === "true") feedActive[pid] = item;
    }

    for (const p of products) {
      if (p.source_site !== source) continue;
      const pid = p.id.replace(`${prefix}-`, "");
      if (feedActive[pid]) { updateProduct(p, feedActive[pid]); updated++; }
      else if (!feedAllPids.has(pid)) { p.availability = false; p.draft = true; deactivated++; } // doar daca lipseste complet din feed
    }

    for (const [pid, item] of Object.entries(feedActive)) {
      if (jsonPids.has(pid)) continue;
      const cat = getGenericCategory(extractField(item, "category"), config.defaultCategory);
      const np = makeProduct(source, pid, item, cat, existingSlugs);
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
  console.log(`\n⏭️  Acum faci: git pull && git add src/data/products.json && git commit -m "chore: sync feeds local" && git push\n`);
} else {
  console.log(`⚠️  DRY RUN — nimic nu a fost salvat.\n`);
}
