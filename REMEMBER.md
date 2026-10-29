# BeautyHealth — REMEMBER.md

*Actualizat: 18 octombrie 2026 — versiune unică. `REMEMBER-updated.md` a fost unit aici și se șterge.*

Site afiliat de comparare prețuri pentru Frumusețe & Sănătate, la
**https://beauty-healths.com** (mutat de pe `beautyhealth.gherasimmarius.com` în octombrie 2026).
Face parte din familia de site-uri gherasimmarius: **styleaccessories.eu** (ceasuri, bijuterii,
încălțăminte — fostele shop + style), **carti.gherasimmarius.com**, **beauty-healths.com**.
Astro static + GitHub Pages + DNS Squarespace + 2Performant.

---

## 0. Stare curentă și rutina de lucru (citește întâi asta)

| | |
|---|---|
| Domeniu | `beauty-healths.com` (`public/CNAME`) |
| Repo | `mariusgherasim/beautyhealth` — branch `main` |
| Folder local | `C:\FOLDER DE LUCRU\PAUL MELINTE\SITE BEAUTY_HEALTH\beautyhealth-site-git` |
| Tehnologie | Astro 7, Node ≥ 22.12, `@astrojs/sitemap` |
| Publicare | **doar manual**, `git push` de pe laptop. Singurul workflow e `.github/workflows/deploy.yml` (build + deploy la push). `update-prices.yml` a fost eliminat pe 16.10.2026. |
| Prețuri | vin din feed-urile XML prin `sync-feeds-local.cjs` (`price_source: "feed"`). Scraping-ul automat de prețuri nu mai rulează. |
| Produse | ~46.400 active (oct 2026) |

### Categorii (12)
Vitamine & Suplimente · Îngrijire ten · Îngrijire corp · Îngrijire păr · Machiaj · Igienă orală ·
Parfumuri · Mama și copilul · Cosmetice bărbați · Wellness · **Cuplu & Intimitate** · **Dispozitive medicale**

Fiecare categorie are **Tipuri** (`src/data/tipuri.js`, minimum 5 produse) și **Branduri**
(`src/data/brands.js`, logo-uri în `public/logos/`, 122 logo-uri). Reîncadrarea produselor se face
la build în `src/data/catalog.mjs` — `products.json` nu se modifică acolo.
Adrese: `/{categorie}/`, `/{categorie}/tip/{tip}/`, `/{categorie}/brand/{brand}/`, `/oferte/`, `/oferte/{categorie}/`.

### Surse (feed-uri 2Performant) — fișierele pe care le pui în folder

| Magazin | Fișier feed | Ce intră pe site |
|---|---|---|
| drmax.ro | `feed_585a1cd31.xml` + `feed_09eca89e8.xml` + `feed_dc6bbc64e.xml` (se unesc automat) | tot catalogul, încadrat pe categorii |
| springfarma.com | `feed_436edea46.xml` | farmacie, filtrat Beauty & Health |
| notino.ro | `feed_235256a01.xml` | parfumuri (toate), machiaj top 5.000, ten/păr top 1.000 |
| PARFLAB.ro | `feed_5544111cd.xml` | parfumuri (decant-uri) |
| farmec.ro | `feed_eb530f914.xml` | ten, machiaj, corp, păr |
| infinitelove.ro | `feed_9d5a36a0f.xml` | parfumuri |
| endro.ro | `feed_9c297a4fb.xml` | cosmetice naturale |
| boabe.ro | `feed_c143969aa.xml` | wellness (cafea) |
| detoxmed.ro | `feed_fd8dad9ff.xml` | wellness (detox) |
| longevity-boost.com | `feed_5d8022816.xml` | vitamine & suplimente |
| **picadili.ro** | **`feed_f741a4c2e.xml`** | **DOAR manichiura** → Machiaj, tipul „Ojă & Unghii" (~380 produse) |

Dacă lipsește un feed, scriptul sare peste magazinul acela și continuă.

### Picadili — feed comun cu styleaccessories.eu (din 18.10.2026)
- **Același fișier** `feed_f741a4c2e.xml` se pune în **ambele** foldere: `beautyhealth-site-git` și `shoes-site`.
- Pe **beauty-healths.com** intră doar produsele de manichiură: categoriile din feed „Accesorii unghii" și „Manichiura", plus titlurile cu unghii / ojă / rubber base / tipsuri / geluri / pile / cuticule / pigmenți / sclipici / strasuri / top coat / base coat.
- Pe **styleaccessories.eu** intră restul (bijuterii argint, genți, portofele, curele, ochelari, lenjerie), iar manichiura e exclusă automat — cele două site-uri nu se suprapun.
- Regula e în `sync-feeds-local.cjs`: `PICADILI_CATEGORII`, `PICADILI_TITLU`, funcția `isPicadiliManichiura()`. Produsele Picadili care nu mai sunt de manichiură sau au dispărut din feed devin `draft: true`.
- Id-uri: `picadili-{product_id}`, `source_site: "picadili.ro"`, `category: ["machiaj"]`, `subcategory_raw` = categoria din feed.

### Rutina de actualizare produse
```cmd
cd "C:\FOLDER DE LUCRU\PAUL MELINTE\SITE BEAUTY_HEALTH\beautyhealth-site-git"
git pull
```
1. Pui feed-urile noi în folder (tabelul de mai sus).
2. Rulezi sincronizarea:
```cmd
node sync-feeds-local.cjs
```
   Doar unele surse: `node sync-feeds-local.cjs --surse=drmax,picadili` · test fără salvare: `--dry-run`
3. Verifici local (opțional): `npm run dev` → http://localhost:4321
4. Publici:
```cmd
git add src/data/products.json
git commit -m "chore: sync feeds local"
git push
```
Pe GitHub → **Actions** → bulina verde (~1–2 minute).

**Pentru alte fișiere** (bannere, texte, scripturi): `git add` cu numele exact al fiecărui fișier, de ex.
`git add src/data/banners.js sync-feeds-local.cjs`.

> `.gitignore` conține acum corect `feed_*.xml` (înainte era scris `"*.xml"` cu ghilimele și **nu funcționa** — de aceea feed-urile ajunseseră în repo). Feed-urile vechi au fost scoase din repo cu `git rm --cached feed_*.xml`. Regula de prudență rămâne: preferă `git add <fișier>` în loc de `git add -A`.

### Integrări (valori curente)
| Serviciu | Valoare |
|---|---|
| GA4 | `G-HS59YL4Y3D` (flux gherasimmarius.com, cross-domain cu styleaccessories.eu și gherasimmarius.com) |
| Trustpilot | profil `beauty-healths.com`, businessUnitId `6ad21e64dea7b17b7f0585d7`, token `5d8638c8-df43-434b-b812-50901f6b578f`, template Review Collector, locale `ro-RO` |
| MailerLite | formularul „Nu rata ofertele" `193157177015273136` (embed `43814132`) |
| Search Console | `beauty-healths.com`, sitemap `sitemap-index.xml` |

### Stickere
Stickerele promo (colț jos) și bara Trustpilot sunt în `src/layouts/Layout.astro`. Butonul ✕ ascunde doar pe pagina curentă; la pagina următoare reapar. Fiecare sticker se ascunde singur după data de final din scriptul lui. Pe mobil Trustpilot devine bară jos, iar stickerele urcă deasupra ei.

---

> **Notă:** secțiunile de mai jos sunt istoricul proiectului (deciziile și ghidurile acumulate de la lansare). Unde ceva s-a schimbat de atunci, informația curentă e cea din secțiunea 0 de mai sus.

### Taburile laterale „🏷️ Oferte" și „% Promoții" (din 29.10.2026)
- Pe marginea din dreapta a tuturor paginilor, în `src/layouts/Layout.astro`: **Oferte** (navy, sus, cu numărul de produse reduse → `/oferte/`) și **Promoții** (roșu, dedesubt → `/promotii/`).
- Pe mobil (≤640 px) stau în același loc și se schimbă între ele la 2 secunde, ca să nu se aglomereze cu stickerul Dumo.
- Tabul Oferte nu apare pe paginile `/oferte/…`; tabul Promoții nu apare pe `/promotii/`. Numărul de pe tabul Oferte se actualizează singur la fiecare build.

### Secțiunea Ghiduri (din 26.10.2026)
- Pagina listă: `/ghiduri/` (`src/pages/ghiduri/index.astro`); link „📖 Ghiduri" în meniul de sus și coloana „Ghiduri" din footer.
- Ghidurile: `/ghiduri/note-parfum-varf-inima-baza/` (lead magnet: fișă de testare printabilă + formular de abonare) și `/ghiduri/parfum-edp-edt/` (mutat din `public/ghid-parfum-edp-edt.html`, care acum doar redirecționează aici).
- **Ghid nou** = pagină în `src/pages/ghiduri/{slug}.astro` + o intrare în `src/data/ghiduri.js` (titlu, descriere, minute, categorii). Apare singur pe `/ghiduri/` și în blocul „📖 Ghiduri utile" de pe paginile categoriilor (și tipurilor) din `categorii`.
- Emailul ghidului de note: `ghid-note-parfum-email.html` (în rădăcina repo-ului, nu se publică pe site).

## Surse de produse (merchant-i 2Performant)

| Merchant | Produse active | Categorie principală |
|---|---|---|
| notino.ro | variabil (limitat — parfumuri toate, machiaj top 5k, ten/păr top 1k) | Parfumuri, Machiaj, Îngrijire ten, Îngrijire păr |
| springfarma.com | ~12.500 (din ~14.150 in feed, dupa filtrare) | Farmacie completă — filtrat doar Beauty&Health |
| infinitelove.ro | 348 (din 544, restul inactive la sursă) | Parfumuri |
| farmec.ro | 114 (din 128 active în feed, restul excluse) | Ten, Machiaj, Corp, Păr (Gerovital) |
| boabe.ro | variabil | Wellness (cafea de specialitate) |
| endro.ro | variabil | Cosmetice naturale (ten, corp) |
| longevity-boost.com | 0 active momentan (15 în feed, neactivate de merchant) | Vitamine & Suplimente (longevitate) |
| detoxmed.ro | 15 | Wellness (sucuri detox, programe detox) |
| PARFLAB.ro | 2.456 | Parfumuri (decant-uri / mostre) |
| drmax.ro | ~28.600 | Catalog complet (3 feed-uri unite), din 17.10.2026 |
| picadili.ro | ~380 | Doar manichiură → Machiaj (feed comun cu styleaccessories.eu), din 18.10.2026 |

*(Istoric — din 16.10.2026 prețul vine din feed, prin `sync-feeds-local.cjs`; scraping-ul automat a fost oprit.)* **IMPORTANT (regula inițială): nu folosi niciodată feed-ul XML 2Performant ca sursă de preț** —
prețurile din feed întârzie față de site-ul oficial. Feed-ul e folosit doar
pentru import inițial/bulk. Prețul zilnic vine din scraping direct pe
`official_url`.

## Decizie de arhitectură: fără pagini individuale de produs

Cu zeci de mii de produse active, generarea unei pagini Astro per produs ar face
build-ul foarte lent și ar produce un sitemap uriaș cu SEO slab per produs
individual. Am ales varianta paginilor de categorie:

- Fiecare produs apare doar ca și card în lista paginată a categoriei lui
  (`/vitamine-suplimente/`, `/vitamine-suplimente/2/`, etc., 24 produse/pagină).
- Click pe card → direct la link-ul de afiliat (fără pagină intermediară pe
  site).
- SEO-ul se face la nivel de **categorie**, nu de produs: title + meta
  description unice per categorie (`src/data/categories.js`), bloc editorial
  de 200-400 cuvinte pe prima pagină a fiecărei categorii, schema.org
  `CollectionPage` + `BreadcrumbList` + `ItemList`, `rel=prev/next` între
  paginile de listă.
- Dacă vrei ulterior pagini individuale pentru un top de produse "vedetă"
  (ca `featured` la shop), se poate adăuga separat fără să afecteze restul.

## Categorii (inițial 10 — acum 12, vezi secțiunea 0)

Vitamine & Suplimente · Îngrijire ten · Îngrijire corp · Mama și copilul
· Îngrijire păr · Machiaj · Igienă orală · Parfumuri · Cosmetice bărbați
· **Wellness** (cafea specialitate boabe.ro + sucuri detox detoxmed.ro)

Mapările exacte sursă → categorie sunt în `sync-feeds-local.cjs`, funcțiile
`get{Sursa}Category()`.

## Ce am construit (cod, gata de push pe GitHub)

- Proiect Astro 4.x complet funcțional, build testat local (566+ pagini, ~3s).
- `src/data/products.json` — sursa unică de adevăr (45.734 produse, din care ~37.490 active).
- `src/data/categories.js` — metadate SEO per categorie.
- Pagini de categorie paginate cu SEO complet (`src/pages/[category]/[...page].astro`).
- Homepage cu hero + grid de categorii + counts live.
- Politica de confidențialitate + Termeni și condiții (GDPR).
- Meta tags: Open Graph + Google tag (gtag.js) cu measurement ID
  **G-HS59YL4Y3D** (același ID folosit la toate site-urile, diferențiat prin
  hostname — la fel ca la shop/carti).
- Cookie consent banner (localStorage, fără cookie-uri terțe înainte de
  acceptare — de extins dacă vrei blocare completă GA înainte de consimțământ).
- Newsletter — placeholder de formular, **de înlocuit cu embed-ul real
  MailerLite** (vezi mai jos, faci asta ghidat).
- Header/Footer cu linkuri către celelalte site-uri din ecosistem
  (gherasimmarius.com, shop, carti, copywriting).
- `scripts/update-prices.cjs` + 3 module de scraper (springfarma, minuneanaturii,
  infinitelove) — **selectoarele CSS sunt PRESUPUNERI, nu confirmate** (nu am
  acces din sandbox la aceste domenii ca să inspectez direct HTML-ul real).
- `.github/workflows/update-prices.yml` — cron zilnic 03:00 UTC.
- `.github/workflows/deploy.yml` — build + deploy automat pe GitHub Pages la
  fiecare push pe `main`.
- `public/CNAME` cu `beautyhealth.gherasimmarius.com`.

## Căutare live per categorie (implementată)

Fiecare pagină de categorie are un câmp de căutare deasupra listei de produse.
Caută în **toate** produsele din categorie (nu doar în pagina curentă din
paginare), filtrând după titlu și brand, insensibil la majuscule/diacritice.

**Cum funcționează tehnic:**
- La build, se generează câte un fișier JSON static per categorie
  (`/category-data/{slug}.json`, via `src/pages/category-data/[category].json.js`)
  cu câmpurile minime necesare (id, title, brand, price, old_price, image_url,
  affiliate_url) pentru toate produsele active din categoria respectivă.
- Componenta `src/components/CategorySearch.astro` afișează inputul de
  căutare; la prima tastare încarcă (o singură dată, cache în memorie) JSON-ul
  categoriei curente, apoi filtrează client-side pe măsură ce utilizatorul
  tastează (debounce 250ms).
- Stilul cardului de produs a fost mutat din stil scoped Astro (`ProductCard.astro`)
  în `src/styles/global.css`, ca să arate identic atât la cardurile randate de
  Astro (paginare normală), cât și la cele injectate prin JS (rezultate căutare).
- Limitare: rezultatele afișate sunt plafonate la 200, ca să nu blocheze
  browserul la căutări foarte generice (ex. termen de o literă).

### TODO cross-proiect: de adăugat aceeași căutare live și la shop + carti

Marius a cerut ca aceeași funcționalitate de căutare live (nu Ctrl+F din
browser, care caută doar în pagina curentă) să fie adăugată și la:
- **shop.gherasimmarius.com** (ceasuri & ochelari)
- **carti.gherasimmarius.com** (ÎncăUnCapitol)

Abordarea de mai sus (JSON per categorie/colecție generat la build + input de
căutare cu fetch lazy + filtrare client-side) e portabilă 1:1 la ambele —
ambele au deja `products.json`/`books.json` ca sursă unică de adevăr și
pagini paginate pe colecții. La shop, colecțiile sunt cele 7 existente
(ceasuri, ochelari-de-soare, sub-150-lei, etc.); la cărți, probabil pe
categorie de carte sau pe editură. De implementat quando se lucrează din nou
pe acele proiecte.

## De reținut: comparare săptămânală feed-uri vs products.json

Săptămânal, de comparat fișierele `.xml` primite de la fiecare comerciant/merchant
(2Performant) cu `products.json` curent, ca să prindem:
- produse noi apărute în feed, care nu sunt încă în catalog;
- produse dispărute/dezactivate în feed (`product_active=false`), care ar
  trebui scoase sau marcate `draft: true`;
- categorii noi apărute în feed (custom_field1/category) care nu se
  încadrează încă în whitelist-ul de categorii — de verificat dacă se
  potrivesc într-o categorie existentă sau dacă e nevoie de una nouă.

Procesul folosit până acum (vezi și sesiunea de adăugare farmec.ro): Marius
trimite feed-ul XML nou, Claude îl filtrează după logica KEEP_MAP existentă,
generează lista de produse excluse (xlsx, cu motiv), face merge în
`products.json` cu id-uri prefixate `{sursa}-{product_id}` (ca să nu existe
coliziuni), și livrează `products.json` actualizat.

## Ce fișiere înlocuiești efectiv după un update de produse

La un update normal de produse (feed nou sau re-scraping), **singurul fișier
care se schimbă e `src/data/products.json`**. Restul arhivei (`.astro`,
componente, `categories.js`, scripturi, workflow-uri) rămâne identic — arhiva
completă e livrată doar din comoditate (ca să nu fie nevoie să umbli separat
prin fișiere), nu pentru că s-ar fi schimbat altceva. Dacă ai deja proiectul
funcțional local/pe GitHub, e suficient să înlocuiești doar
`src/data/products.json` cu fișierul nou și să faci commit + push — nu ai
nevoie să dezarhivezi toată arhiva mare peste proiectul existent.

---

## ★ Ghid: cum adaugi un brand nou cu pagina proprie pe site

Aceasta este procedura completă pentru a adăuga un brand nou (ex. ENDRO,
NIVEA, CERAVE etc.) astfel încât să apară corect în secțiunea **Branduri**
de pe paginile de categorie și să aibă pagina lui proprie `/[cat]/brand/[slug]/`.

### Fișierele implicate (în ordine)

#### 1. `src/data/subcategories.js` — OBLIGATORIU dacă brandul apare deja în fișier ca `type: 'brand'`

Verifică dacă brandul există deja cu `type: 'brand'` (unele branduri au
fost adăugate inițial în subcategories ca tip greșit). Dacă există cu
`type: 'tip'`, schimbă în `type: 'brand'`. Dacă nu există deloc, nu
trebuie adăugat aici — brandul se gestionează exclusiv prin `brands.js`.

Exemplu de intrare corectă în subcategories.js (pentru un brand existent acolo):
```js
{ name: 'ENDRO', slug: 'endro', type: 'brand', categories: ['ingrijire-ten','ingrijire-corp'], keywords: ['endro'] },
```

#### 2. `src/data/brands.js` — OBLIGATORIU

Adaugă brandul în array-ul `brands`. Câmpurile obligatorii:
- `name` — numele afișat pe site (majuscule, cu diacritice dacă e cazul)
- `slug` — URL-ul brandului (litere mici, cratime în loc de spații/caractere speciale)
- `categories` — lista de slug-uri de categorii unde apare brandul

```js
// Adaugă în secțiunea corespunzătoare (Cerute de Marius / Parfumuri / Machiaj etc.)
{ name: 'ENDRO', slug: 'endro', categories: ['ingrijire-ten','ingrijire-corp'] },
```

**Atenție:** dacă nu adaugi brandul aici, el nu va apărea niciodată în
secțiunea "Branduri" de pe paginile de categorie și nu va exista nicio
pagină `/brand/[slug]/` generată.

#### 3. `src/pages/[category]/brand/[brand]/[...page].astro` — OBLIGATORIU dacă brandul are un nume nestandard în câmpul `brand` din products.json

Funcția `getStaticPaths` filtrează produsele per brand printr-un set de
`if (brand.slug === '...')` cu logică personalizată. Dacă brandul tău are
exact același nume în `products.json` ca `name` din `brands.js` (majuscule
identice), atunci fallback-ul `pb.includes(brandNameVariants)` îl prinde
automat și **nu trebuie să adaugi nimic**.

Dacă brandul are variații de scriere în feed (ex. "LA ROCHE-POSAY" vs
"LA ROCHE POSAY"), adaugă un case explicit:

```js
if (brand.slug === 'noul-brand') return pb.includes('VARIANTA DIN FEED');
```

Locul unde se adaugă — imediat înainte de linia `return pb.includes(brandNameVariants);`:
```js
if (brand.slug === 'guess') return pb.includes('GUESS');
if (brand.slug === 'endro') return pb.includes('ENDRO');   // ← exemplu adăugat
return pb.includes(brandNameVariants);  // fallback generic
```

#### 4. `src/pages/[category]/[...page].astro` — NU trebuie modificat

Pagina de categorie afișează brandurile automat prin `getBrandsForCategory(categorySlug)`
și filtrează subcategoriile cu `.filter(s => s.type === 'tip')` — deci
brandurile din `brands.js` apar automat la "Branduri", fără nicio
modificare manuală.

#### 5. `src/pages/[category]/sub/[sub]/[...page].astro` — NU trebuie modificat

Generarea rutelor `/sub/[slug]/` exclude automat orice subcategorie cu
`type: 'brand'` prin `.filter(s => s.type !== 'brand')` — deci un brand
nou nu va genera accidental o rută `/sub/[slug]/`.

### Rezumat: ce modifici pentru un brand nou

| Fișier | Modificare necesară | Obligatoriu? |
|--------|---------------------|-------------|
| `src/data/brands.js` | Adaugă obiect `{ name, slug, categories }` | ✅ DA |
| `src/pages/[category]/brand/[brand]/[...page].astro` | Adaugă `if (brand.slug === '...')` doar dacă numele din feed diferă față de `name` din brands.js | Doar dacă e cazul |
| `src/data/subcategories.js` | Verifică / corectează `type` dacă brandul există deja acolo | Doar dacă e cazul |
| `src/pages/[category]/[...page].astro` | Nimic | ❌ NU |
| `src/pages/[category]/sub/[sub]/[...page].astro` | Nimic | ❌ NU |

### Exemplu complet — adăugare brand NIVEA

**Pas 1 — `src/data/brands.js`:**
```js
{ name: 'NIVEA', slug: 'nivea', categories: ['ingrijire-corp','ingrijire-ten'] },
```

**Pas 2 — verifică în `products.json`** cum apare brandul în câmpul `brand`:
```
grep -i "nivea" src/data/products.json | grep '"brand"'
```
Dacă apare exact `"NIVEA"` → fallback-ul generic funcționează, nu mai
modifici `brand/[brand]/[...page].astro`.
Dacă apare `"Nivea GmbH"` sau altceva → adaugi case explicit în brand page.

**Pas 3 — commit + push:**
```powershell
git pull
git add src/data/brands.js
git commit -m "feat: brand nou NIVEA pe ingrijire-corp si ingrijire-ten"
git push
```

### Fix aplicat în sesiunea 12.10.2026 — ENDRO apărea la „Tipuri" în loc de „Branduri"

**Cauza rădăcină:** ENDRO exista în `subcategories.js` cu `type: 'brand'`
(corect), dar:
1. Lipsea complet din `brands.js` → nu apărea la "Branduri"
2. `getStaticPaths` din `sub/[sub]/[...page].astro` nu excludea brandurile
   → genera ruta `/sub/endro/` (greșit)
3. `getSubcategoriesForCategory()` în pagina de categorie returna ALL tipurile
   fără filtrare → Endro apărea la "Tipuri" (greșit)
4. Lipsea case-ul `endro` în filtrul din `brand/[brand]/[...page].astro`
   → pagina de brand ar fi găsit 0 produse

**Fix-urile aplicate (toate 4 fișiere):**

`src/data/brands.js` — adăugat:
```js
{ name: 'ENDRO', slug: 'endro', categories: ['ingrijire-ten','ingrijire-corp'] },
```

`src/pages/[category]/[...page].astro` — linia 31:
```js
// Înainte:
const catSubs = getSubcategoriesForCategory(categorySlug);
// După:
const catSubs = getSubcategoriesForCategory(categorySlug).filter(s => s.type === 'tip');
```

`src/pages/[category]/sub/[sub]/[...page].astro` — linia 16:
```js
// Înainte:
for (const sub of subcategories) {
// După:
for (const sub of subcategories.filter(s => s.type !== 'brand')) {
```

`src/pages/[category]/brand/[brand]/[...page].astro` — adăugat înainte de fallback:
```js
if (brand.slug === 'endro') return pb.includes('ENDRO');
```

---

## ★ Ghid: cum adaugi un magazine (merchant) nou în sync-feeds-local.cjs

Procedura completă pentru a adăuga un merchant nou din 2Performant.

### Pași

**1. Identifici feed-ul** — descărcați de la 2Performant, are un ID în numele
fișierului (ex. `feed_5d8022816.xml`).

**2. Identifici tipul de produse** din primele câteva `<item>` (title,
campaign_name, description) — astfel alegi categoria.

**3. Adaugi în `FEED_CONFIG`:**
```js
"nou-merchant.ro": {
  files: ["feed_nou-merchant.xml", "feed_IDXXXXXX.xml"],
  type: "nou-merchant",
},
```

**4. Adaugi funcția de mapare categorie** (după celelalte `get*Category`):
```js
function getNouMerchantCategory(catRaw) {
  if (!catRaw) return "wellness"; // categoria default
  const c = catRaw.toLowerCase();
  if (c.includes("parfum")) return "parfumuri";
  return "wellness";
}
```

**5. Adaugi blocul `else if`** în secțiunea de procesare per sursă:
```js
else if (config.type === "nou-merchant") {
  const feedActive = {}, feedAllPids = new Set();
  for (const item of rawItems) {
    const pid = extractField(item, "product_id");
    feedAllPids.add(pid);
    if (extractField(item, "product_active") === "true") feedActive[pid] = item;
  }
  for (const p of products) {
    if (p.source_site !== source) continue;
    const pid = p.id.replace("nou-merchant-", "");
    if (feedActive[pid]) { updateProduct(p, feedActive[pid]); updated++; }
    else if (!feedAllPids.has(pid)) { p.availability = false; p.draft = true; deactivated++; }
  }
  for (const [pid, item] of Object.entries(feedActive)) {
    if (jsonPids.has(pid)) continue;
    const cat = getNouMerchantCategory(extractField(item, "category"));
    const np = makeProduct(source, pid, item, cat, existingSlugs);
    np.id = `nou-merchant-${pid}`;
    if (!isDryRun) products.push(np);
    added++;
  }
}
```

**6. Rulezi:** `node sync-feeds-local.cjs --surse=nou-merchant`

**7. Livrezi products.json actualizat** (vezi Situația 7 din ghidul Git).

### Magazine adăugate și tipul lor de produse

| Merchant | type în FEED_CONFIG | Fișiere feed acceptate | Categorie |
|---|---|---|---|
| notino.ro | notino | feed_notino.xml, feed_235256a01.xml | parfumuri, machiaj, ingrijire-ten, ingrijire-par |
| springfarma.com | springfarma | feed_springfarma.xml, feed_436edea46.xml | vitamine-suplimente (și altele) |
| farmec.ro | farmec | feed_farmec.xml, feed_eb530f914.xml | ingrijire-ten, corp, par, machiaj |
| infinitelove.ro | infinitelove | feed_infinitelove.xml, feed_9d5a36a0f.xml | parfumuri |
| boabe.ro | boabe | feed_boabe.xml, feed_c143969aa.xml | wellness |
| endro.ro | endro | feed_endro.xml, feed_9c297a4fb.xml | ingrijire-ten, corp |
| longevity-boost.com | longevity-boost | feed_longevity-boost.xml, feed_5d8022816.xml | vitamine-suplimente |
| detoxmed.ro | detoxmed | feed_detoxmed.xml, feed_fd8dad9ff.xml | wellness |
| PARFLAB.ro | parflab | feed_parflab.xml, feed_5544111cd.xml | parfumuri |
| drmax.ro | drmax | feed_585a1cd31.xml + feed_09eca89e8.xml + feed_dc6bbc64e.xml (unite) | toate categoriile (getDrmaxCategory) |
| picadili.ro | picadili | feed_picadili.xml, feed_f741a4c2e.xml | machiaj — doar manichiura (isPicadiliManichiura) |

---

## Incident (16.07.2026): prima rulare reală de update-prices a eșuat masiv

*(Istoric — `update-prices.yml` a fost eliminat pe 16.10.2026; prețurile vin acum din feed-uri.)*

Prima rulare reală a `update-prices.yml` a dat **221 produse actualizate din
13.533** (13.312 eșuate) — foarte probabil blocare anti-bot (Cloudflare/WAF)
pe springfarma.com (12.500 din cele 13.533 produse), declanșată de un burst
de request-uri rapide de pe IP-ul GitHub Actions. Job-ul a durat doar ~10
minute pentru 13.533 request-uri, ceea ce e suspect de rapid — semn că
majoritatea au primit rapid un refuz, nu răspunsul real.

**Bonus prost:** din cauza structurii workflow-ului, pasul de "Commit
modificări" a fost **sărit automat** (GitHub Actions oprește implicit restul
job-ului dacă un pas anterior "eșuează", iar scriptul iese cu exit code 1
când peste 10% din request-uri eșuează) — deci nici cele 221 de prețuri
actualizate cu succes nu s-au salvat.

**Fix-uri aplicate:**
1. **Workflow (`update-prices.yml`)**: pasul de update are acum
   `continue-on-error: true`, iar commit-ul rulează cu `if: always()` —
   actualizările parțiale se salvează mereu, indiferent de rata de eșec.
   Verificarea "peste 10% eșuate → fail vizibil" s-a mutat într-un pas
   separat, DUPĂ commit, ca job-ul să tot apară roșu în Actions (vizibilitate
   utilă), dar fără să mai coste actualizările reușite.
2. **Headere de browser real** (`BROWSER_HEADERS` în `helpers.cjs`) — am
   renunțat la User-Agent-ul auto-declarat `BeautyHealthBot/1.0` (multe
   protecții anti-bot blochează automat orice UA care nu arată ca un browser),
   în favoarea unui UA Chrome/Windows real + headere Accept/Accept-Language.
3. **Retry cu backoff exponențial** (`withRetry` în `helpers.cjs`, 2
   reîncercări) — aplicat pe toate cele 4 scraper-e.
4. **Concurență și delay separate PER SURSĂ** (`SOURCE_CONFIG` în
   `update-prices.cjs`) — springfarma (cea mai mare, probabil cea mai
   protejată) are acum concurență 3 + delay 700ms; celelalte 3 surse au
   concurență 4 + delay 400ms (înainte era o singură valoare globală,
   concurență 8 + delay 200ms pentru toate).
5. **Circuit breaker per sursă** — dacă o sursă acumulează 25 de eșecuri
   consecutive, se presupune blocare activă și se sar produsele rămase din
   acea sursă (apar în raport ca "skipped", nu se mai insistă ore întregi
   degeaba).
6. **Logging direct în consola Actions** — primele 10 erori (id + motiv) se
   afișează direct în output-ul job-ului, plus un breakdown ok/failed/skipped
   per sursă, ca să nu mai fie nevoie să depindem de `update-report.json`
   fiind commis ca să vedem ce s-a întâmplat.

**De monitorizat la următoarea rulare** (manuală, din Actions → Run workflow,
înainte să aștepți cron-ul de la 03:00): dacă rata de eșec rămâne mare chiar
și cu header-ele de browser real, e un semn puternic că springfarma.com
folosește o protecție mai serioasă (challenge JS, care cheerio/axios nu poate
rezolva) — în cazul ăsta ar trebui reconsiderat Playwright DOAR pentru
springfarma (nu pentru toate sursele), sau o frecvență mai rară de scraping.

**Actualizare diagnostic (18.07.2026, după a doua rulare — 548 ok / 83 failed / 12.902 skipped):**

Am investigat direct (accesând paginile eu însumi, din alt mediu decât GitHub
Actions) și am identificat **3 cauze complet diferite**, ascunse în spatele
aceluiași simptom ("eșuează"):

1. **farmec.ro — REZOLVAT.** Nu era deloc problemă de blocare sau selector —
   farmec.ro e o aplicație JavaScript (SPA). Răspunsul brut al serverului e
   literal `"You need to enable JavaScript to run this app."`, fără conținut
   real. cheerio/axios nu execută JS, deci nu puteau găsi niciodată prețul,
   indiferent de selector — HTML-ul trimis inițial de Marius venea din
   Inspect Element (DOM-ul *după* randarea JS în browser), nu din răspunsul
   brut. **Fix:** am reintrodus Playwright, dar DOAR pentru farmec.ro
   (celelalte 3 surse rămân pe cheerio/axios, mult mai rapide). Concurență
   redusă la 2 pentru farmec (Playwright = browser real per request, mult
   mai costisitor ca resurse decât un simplu HTTP request).

2. **springfarma.com — NEREZOLVAT, necesită decizie de infrastructură.**
   Am accesat o pagină de produs direct — merge perfect, fără nicio blocare,
   preț vizibil clar în HTML brut server-side. Deci NU e problemă de
   selector, headere sau JS. E aproape sigur că **IP-ul serverelor GitHub
   Actions e blocat** de protecția lor anti-bot (foarte comun: multe WAF-uri
   blochează automat game de IP-uri cunoscute ale providerilor cloud/CI).
   0 din câte a încercat au trecut — blocare imediată, nu graduală, ceea ce
   sugerează blocare statică pe IP/ASN, nu rate-limiting.

3. **minuneanaturii.ro — parțial, aceeași cauză probabilă.** 200 din 576 au
   trecut înainte de blocare (circuit breaker a oprit restul) — posibil
   rate-limiting ceva mai permisiv decât la springfarma, dar tot pare
   IP-based (am accesat eu o pagină fără nicio problemă).

**Decizie luată (18.07.2026): Varianta B — rulare locală programată.**
GitHub Actions se ocupă doar de infinitelove.ro + farmec.ro (merg perfect din
cloud). springfarma.com + minuneanaturii.ro rulează local, pe calculatorul lui
Marius, programat prin Windows Task Scheduler.

**Ce s-a schimbat în cod:**
- `scripts/update-prices.cjs` acceptă acum un filtru de surse:
  `--sources=site1.com,site2.com` (sau variabila de mediu
  `UPDATE_PRICES_SOURCES`). Fără filtru, rulează toate sursele (util pentru
  testare manuală completă).
- `package.json` are 2 script-uri noi:
  - `npm run update-prices:cloud` → doar infinitelove.ro + farmec.ro
    (folosit de GitHub Actions)
  - `npm run update-prices:local` → doar springfarma.com + minuneanaturii.ro
    (folosit local, programat)
- `.github/workflows/update-prices.yml` rulează acum `update-prices:cloud`,
  nu toate sursele.
- `scripts/update-prices-local.bat` — script Windows gata de folosit pentru
  Task Scheduler (vezi pașii de configurare mai jos).

### Configurare rulare locală programată (o singură dată)

**Pasul 1 — Confirmă/configurează git local.** Dacă ai încărcat codul pe
GitHub prin interfața web (drag-and-drop), folderul local **nu e conectat**
la repo prin git — trebuie clonat din nou, într-un loc dedicat:

```powershell
cd "C:\FOLDER DE LUCRU\PAUL MELINTE\SITE BEAUTY_HEALTH"
git clone https://github.com/mariusgherasim/beautyhealth.git beautyhealth-site
cd beautyhealth-site
npm install
```

(Dacă folderul existent e deja un clone git funcțional — verifici cu
`git status` în el, dacă nu dă eroare "not a git repository" — poți sări
peste acest pas și folosi folderul existent.)

**Pasul 2 — Configurează un Personal Access Token pentru push automat.**
Task Scheduler rulează fără tine prezent, deci git are nevoie de credențiale
salvate, nu de login interactiv:
1. GitHub → Settings (contul tău, nu repo-ul) → Developer settings →
   Personal access tokens → Fine-grained tokens → Generate new token
2. Acces doar la repo-ul `beautyhealth` (sau `mariusgherasim/beautyhealth`),
   permisiune **Contents: Read and write**
3. Copiezi token-ul generat (apare o singură dată!)
4. La primul `git push` manual din acel folder, când Windows/Git cere
   user+parolă, pui: **username-ul de GitHub** la user, iar la parolă **lipești
   token-ul** (nu parola reală de cont) — Git Credential Manager (vine cu Git
   for Windows) îl salvează automat, deci rulările programate ulterioare nu
   vor mai cere nimic.

**Pasul 3 — Testează manual scriptul înainte de a-l programa:**
```powershell
cd "C:\FOLDER DE LUCRU\PAUL MELINTE\SITE BEAUTY_HEALTH\beautyhealth-site"
scripts\update-prices-local.bat
```
Confirmă că rulează fără erori și că vezi commit-ul apărând pe GitHub.

**Pasul 4 — Programează în Task Scheduler:**
1. Deschizi **Task Scheduler** (caută în Start)
2. **Create Basic Task** → nume: "BeautyHealth - update preturi local"
3. Trigger: **Daily**, ora la alegere (recomandat: o oră când calculatorul e
   sigur pornit și conectat la internet — de ex. dimineața, când începi lucrul)
4. Action: **Start a program** → Program/script:
   `C:\FOLDER DE LUCRU\PAUL MELINTE\SITE BEAUTY_HEALTH\beautyhealth-site\scripts\update-prices-local.bat`
5. Finish. Poți testa imediat cu click-dreapta pe task → **Run**.

**Incident 2 (18.07.2026): rulare locală blocată 30+ minute, fără nicio eroare**

Prima rulare locală (după varianta B de mai sus) a rămas blocată pe
springfarma.com timp de 30+ minute, fără nicio eroare, fără progres, fără
declanșarea circuit breaker-ului. Cauză: `axios`-ul are propriul `timeout`,
dar e cunoscut că nu garantează oprirea în toate cazurile — dacă o conexiune
rămâne "agățată" la nivel de socket/rețea (ex: un firewall care dropează
pachete silențios, în loc să refuze conexiunea), timeout-ul axios poate să nu
se declanșeze niciodată.

**Fix:** `withHardTimeout()` în `helpers.cjs` — un `Promise.race()` care
garantează oprirea execuției după N milisecunde, **indiferent** ce face
codul de dedesubt. Aplicat peste fiecare request individual (per încercare,
în interiorul `withRetry`) în toate cele 4 scraper-e: 20s pentru cele 3 pe
cheerio/axios, 40s pentru farmec.ro (Playwright, are nevoie de mai mult timp
per pagină). Testat explicit cu un promise care nu se rezolvă niciodată —
confirmat că se oprește garantat, la timpul exact setat.

**Limitare cunoscută, acceptată:** dacă timeout-ul dur se declanșează pe
farmec.ro (Playwright), pagina de browser deschisă (`page`) ar putea rămâne
"agățată" pe fundal (nu se apucă `page.close()` din `finally` dacă operația
care a agățat-o nu se termină niciodată) — acceptabil pe termen scurt
(circuit breaker-ul oprește sursa după 25 eșecuri oricum), dar de revizitat
dacă devine problemă de memorie la rulări lungi repetate.

**Bonus adăugat în aceeași rundă de fix-uri:** heartbeat de progres — scriptul
afișează acum, la fiecare 30 secunde, câte produse s-au procesat din sursa
curentă (procent + ok/eșuate până acum), ca să nu mai pară "blocat" din
exterior în timpul unei rulări lungi și legitime.

**Actualizare 3 (18.07.2026): confirmat — pare rate-limit, nu blocare permanentă**

Cu heartbeat-ul de progres funcțional, rularea locală a arătat clar tiparul:
**springfarma** — primele 88 de request-uri au trecut perfect (0 eșecuri),
apoi a început să pice constant cu 403 între request-ul 88 și 155.
**minuneanaturii** — la fel, primele 101 au trecut, apoi 403 solid. Asta NU
arată ca o blocare permanentă (care ar respinge totul de la primul request) —
arată exact ca un **rate limit clasic**: X request-uri permise într-o
fereastră de timp, apoi blocare temporară. La concurență 3 + delay 700ms
(springfarma), rata efectivă era ~100-120 request-uri/minut — foarte posibil
peste un prag tipic de gen "100/minut".

**Fix-uri aplicate (nu mai e nevoie de proxy sau self-hosted runner, cel
puțin ca prim pas):**
1. **Concurență redusă drastic** pentru springfarma (1, față de 3) și
   minuneanaturii (1, față de 4), cu delay mult mai mare (2500ms, respectiv
   2000ms) — rata efectivă scade la ~20-30 request-uri/minut, sub majoritatea
   pragurilor tipice de rate-limit.
2. **Cooldown-and-resume în loc de circuit breaker permanent** — când o
   sursă acumulează 25 de eșecuri consecutive, scriptul NU mai renunță definitiv:
   face o pauză de 5 minute, apoi reia încercările. Se repetă de maxim 3 ori
   (`maxCooldowns` în `SOURCE_CONFIG`) per sursă per rulare; după al 3-lea
   cooldown eșuat, abia atunci renunță definitiv pentru rularea curentă
   (ca să nu ruleze la infinit dacă e într-adevăr o blocare permanentă, nu
   doar rate-limit).
3. **Prioritizare pe "cel mai vechi verificat primul"** — produsele sunt
   sortate înainte de procesare după `last_price_check` (cele niciodată
   verificate sunt tratate ca fiind cele mai vechi, deci cele mai
   prioritare). Fără asta, fiecare rulare care nu apucă să termine tot
   catalogul (aproape sigur cazul la 12.500 produse springfarma) ar bloca
   mereu pe aceleași primele produse din listă, iar restul catalogului n-ar
   fi actualizat NICIODATĂ. Cu prioritizarea asta, acoperirea se rotește
   treptat prin tot catalogul, chiar dacă fiecare rulare acoperă doar o
   felie din el.

**Consecință practică acceptată:** cu ratele astea mult mai mici, o rulare
completă a catalogului springfarma (12.500 produse) ar dura ore, chiar și
fără blocare — nerealist pentru o rulare zilnică unică. Combinat cu
cooldown-urile, o rulare zilnică va acoperi probabil doar câteva sute de
produse din springfarma (restul rămân cu prețul din ziua anterioară, nu
"neactualizate" complet). Cu prioritizarea pe cel mai vechi verificat, tot
catalogul se va roti complet pe parcursul a mai multe zile/săptămâni —
acceptabil pentru un site de comparare de prețuri, unde actualizarea
zilnică 100% nu e critică.

**De monitorizat la rulările următoare:** dacă tiparul se repetă (merge
o vreme, se blochează, cooldown-ul de 5 min chiar ajută să treacă mai
departe) → teoria de rate-limit e confirmată, setările curente sunt
suficiente. Dacă cooldown-ul NU ajută (tot blochează imediat după reluare,
indiferent de pauză) → atunci chiar e ceva mai permanent (posibil blocare pe
sesiune/cookie, nu doar pe rată), și discutăm Playwright sau proxy ca pas
următor.

## Sistem de bannere afiliate (implementat 20.07.2026)

Bannere 2Performant afișate pe homepage, paginile de categorie și între
rezultatele căutării, cu perioadă de valabilitate controlată de Marius.

**Fișierul pe care Marius îl editează: `src/data/banners.js`** — conține
documentație completă în comentarii (cum adaugi banner nou, câmpuri, etc.).
După editare: commit + push → bannerele noi apar la următorul deploy.

**Dimensiuni acceptate** (standard IAB, cele folosite de 2Performant):
728×90 (leaderboard — afișat sus pe pagini), 300×250 (medium rectangle),
300×600 (half page). Alte dimensiuni sunt scalate proporțional (max-width
100%), dar cele 3 standard arată cel mai bine.

**Mapare pe categorii:** fiecare banner are lista lui de categorii
(`categories`) — bannerele farmec.ro apar pe ingrijire-ten/corp/par, machiaj,
cosmetice-barbati + homepage; bannerele infinitelove.ro (când vor fi
adăugate) pe parfumuri + homepage. Slug „homepage" = pagina principală.

**Perioadă de valabilitate:** `active_from` / `active_until` (format
YYYY-MM-DD, `active_until: null` = fără expirare). **Filtrarea după dată se
face CLIENT-SIDE** (în browserul vizitatorului), nu la build — decizie
deliberată: site-ul e static și se reconstruiește doar la push, deci o
filtrare la build ar lăsa bannere expirate afișate până la următorul
deploy; client-side, expiră exact în ziua setată, automat.

**Rotație:** dacă mai multe bannere sunt active pentru același slot, se
alege unul aleatoriu la fiecare încărcare de pagină (client-side).

**Plasare:** categorie = leaderboard 728×90 deasupra titlului + un slot
general înainte de newsletter; homepage = leaderboard după hero + slot
general înainte de newsletter; căutare = un banner activ clonat după al
12-lea rezultat (refolosește bannerele deja randate pe pagină, deci
respectă automat aceleași reguli de dată/categorie).

Fără tracking GA4 pe bannere (decizia lui Marius — doar link simplu de
afiliat).

**Verificare rapidă după deploy (2-3 minute):** deschide
`https://beautyhealth.gherasimmarius.com/machiaj/` — ar trebui să vezi un
banner farmec deasupra titlului "Machiaj". Refresh de câteva ori — bannerul
se schimbă aleatoriu (rotația funcționează). Pe Parfumuri și Vitamine nu
apare nimic — corect, acolo nu-s definite bannere încă. **Confirmat
funcțional pe site-ul live (20.07.2026).**

**Workflow pentru adăugare/modificare bannere (Marius, periodic):**
editezi doar `src/data/banners.js` (are instrucțiuni complete în
comentarii), apoi:
```powershell
git add src/data/banners.js
git commit -m "chore: bannere noi"
git push
```
Pentru bannere cu perioadă limitată (oferte), setezi `active_from` și
`active_until` — expiră singure, exact în ziua stabilită, fără să mai fie
nevoie de vreo intervenție.

## Ce rămâne de făcut manual (nu pot face eu asta)

1. ~~**Selectoare CSS de preț**~~ — **REZOLVAT (16.07.2026)**. Marius a trimis
   HTML real pentru toate cele 4 surse (springfarma, minuneanaturii,
   infinitelove, farmec). Selectoare actualizate și testate.
2. **MailerLite** — creezi grup nou "BEAUTYHEALTH" + formular nou (double
   opt-in activ, sender `office@gherasimmarius.com`, ca la shop). Te ghidez
   pas cu pas când ești gata. Apoi înlocuim placeholder-ul din
   `src/components/Newsletter.astro` cu embed-ul JSONP real.
3. ~~**Logo**~~ — **REZOLVAT (16.07.2026)**. Concept original, creat de Claude
   după un research rapid al site-urilor sursă. Fișiere:
   - `public/logo-beautyhealth.svg` — varianta navy, pt fundaluri deschise
   - `public/logo-beautyhealth-white.svg` — varianta albă, folosită în
     header (fundal navy)
   - `public/favicon.svg` — doar iconița, pe fundal navy plin, rotunjit
4. **Google Analytics 4** — property-ul e comun (G-HS59YL4Y3D), tag-ul e deja
   pus în cod. Cât timp nu există o campanie Google Ads dedicată, se procedează
   ca la cărți — FĂRĂ stream nou. **Manual, în GA4 → Admin → Events:** creezi
   cele 3 evenimente (`bh_affiliate_click`, `bh_category_page_view`,
   `bh_newsletter_signup`) și le marchezi ca **Key Event**.
5. ~~**Google Search Console**~~ — **REZOLVAT (Oct 2026)**. Verificat și sitemap
   submis. Vezi secțiunea dedicată mai jos.
6. **GitHub** — repo nou, upload prin interfața web sau `git push`.
   Nu uita `.github/` (ascuns, verifică să se încarce și el).
7. **DNS Squarespace** — CNAME către GitHub Pages, la fel ca la celelalte
   3 site-uri.
8. **Verificare mobil** — layout-ul e responsive, merită un test real pe
   telefon după deploy.

## Tools & tehnologii folosite aici

- Astro 7 (inițial 4.x), static output, `@astrojs/sitemap`
- Scraping: axios + cheerio (springfarma, minuneanaturii — site-uri statice),
  Playwright (farmec.ro — SPA care necesită JS)
- GitHub Actions doar pentru build/deploy la push (cron-ul de prețuri a fost eliminat pe 16.10.2026)

---

## Ghid comenzi Git — situații frecvente și ce face fiecare comandă

Acest ghid documentează comenzile git folosite în mod repetat pe proiectul
beautyhealth, cu explicații pentru fiecare situație. Folderul de lucru pentru
toate comenzile de mai jos este întotdeauna:

```
C:\FOLDER DE LUCRU\PAUL MELINTE\SITE BEAUTY_HEALTH\beautyhealth-site-git
```

---

### Ce este git pull, git add, git commit, git push — pe scurt

| Comandă | Ce face |
|---|---|
| `git pull` | Aduce modificările de pe GitHub (cloud) pe calculatorul tău local. **Rulează întotdeauna PRIMUL**, înainte să trimiți ceva. |
| `git add <fisier>` | Marchează fișierul pentru a fi inclus în următorul commit. Fără `add`, fișierul nu se trimite nicăieri. |
| `git commit -m "mesaj"` | Salvează local un "snapshot" cu toate fișierele adăugate (`add`). Mesajul descrie ce ai schimbat. |
| `git push` | Trimite commit-urile locale pe GitHub (cloud). Abia acum apar modificările pe site (declanșează deploy automat). |

**Ordinea corectă întotdeauna:** `pull` → `add` → `commit` → `push`

---

### Situația 1 — Trimiți fișiere noi sau modificate pe GitHub

**Când:** ori de câte ori ai primit fișiere noi de la Claude (cod, bannere,
products.json corectat etc.) și vrei să le publici pe site.

```powershell
cd "C:\FOLDER DE LUCRU\PAUL MELINTE\SITE BEAUTY_HEALTH\beautyhealth-site-git"
git pull
git add src/data/banners.js
git commit -m "feat: 3 bannere noi farmec (728x90, 300x600, 300x250)"
git push
```

**Poți adăuga mai multe fișiere în același commit:**
```powershell
git add src/data/products.json scripts/update-prices.cjs
git commit -m "fix: preturi infinitelove din feed + exclus din scraping zilnic"
git push
```

**`-m "mesaj"`** — mesajul e doar pentru istoricul tău (git log), nu apare
pe site. Scrie ceva scurt și descriptiv: ce ai schimbat și de ce.

---

### Situația 2 — git pull dă eroare: "would be overwritten by merge"

**Când apare:**
```
error: Your local changes to the following files would be overwritten by merge:
        src/data/products.json
Please commit your changes or stash them before you merge.
Aborting
```

**Ce înseamnă:** ai modificări locale nesalvate (de ex. scriptul de update
prețuri a scris în `products.json` local), iar GitHub are o versiune diferită
a aceluiași fișier. Git refuză să suprascrie fișierul tău local fără să-l
salvezi mai întâi.

**Soluție:** comite mai întâi fișierul local, apoi faci pull:
```powershell
git add src/data/products.json
git commit -m "chore: products.json actualizat local"
git pull --no-rebase
git push
```

---

### Situația 3 — git pull --no-rebase dă conflict pe products.json

**Când apare** (după ce ai urmat situația 2):
```
CONFLICT (content): Merge conflict in src/data/products.json
Automatic merge failed; fix conflicts and then commit the result.
```

**Ce înseamnă:** atât versiunea ta locală, cât și cea din cloud (GitHub
Actions) au modificat `products.json` în același timp, iar git nu știe pe
care s-o păstreze. `products.json` e un fișier generat automat (nu editat
manual), deci nu are sens să "împletim" linii — alegem una din versiuni
integral.

**Cazul cel mai frecvent — păstrezi versiunea TA locală** (de ex. ai
corectat prețurile infinitelove și nu vrei să le suprascrie versiunea din
cloud):
```powershell
git checkout --ours src/data/products.json
git add src/data/products.json
git commit -m "merge: pastrat products.json local (preturi corecte)"
git push
```

**Dacă există conflict și pe update-report.json** (se întâmplă uneori):
```powershell
git checkout --ours src/data/products.json
git checkout --ours update-report.json
git add src/data/products.json update-report.json
git commit -m "merge: pastrat products.json local (preturi infinitelove corectate din feed)"
git push
```

**`--ours`** = "ia versiunea MEA locală, ignoră ce vine din cloud"
**`--theirs`** = "ia versiunea DIN CLOUD, ignoră ce am eu local" (folosit
când vrei să preiei ce a scris GitHub Actions, de ex. prețurile actualizate
automat din cloud)

---

### Situația 4 — git push dă eroare: "rejected / non-fast-forward"

**Când apare:**
```
! [rejected]        main -> main (non-fast-forward)
error: failed to push some refs to '...'
hint: Updates were rejected because the tip of your current branch is behind
```

**Ce înseamnă:** GitHub are commit-uri noi (de ex. scraper-ul local a mai
trimis un checkpoint, sau GitHub Actions a făcut un commit automat) pe care
tu nu le ai local. Git refuză push-ul ca să nu suprascrii accidental aceste
commit-uri noi.

**Soluție:** `git pull --no-rebase` mai întâi, apoi push:
```powershell
git pull --no-rebase
git push
```

Dacă pull-ul dă conflict, urmezi Situația 3 de mai sus.

---

### Situația 5 — Vrei să vezi ce s-a schimbat înainte să faci push

**Verifici ce fișiere au modificări locale nesalvate:**
```powershell
git status
```

Arată:
- `modified:` — fișiere existente cu modificări
- `Untracked files:` — fișiere noi, neincluse încă în git (atenție: **nu**
  include `node_modules/` sau `logs/` — sunt în `.gitignore`)

**Verifici istoricul ultimelor commit-uri:**
```powershell
git log --oneline -10
```

Arată ultimele 10 commit-uri cu mesajele lor. Util ca să confirmi că un
commit a ajuns pe GitHub (dacă apare în listă, a fost trimis).

**Verifici ce conține un fișier specific:**
```powershell
type src\data\banners.js
```

---

### Situația 6 — Actualizare prețuri infinitelove (manual, săptămânal)

**Când:** săptămânal, când primești feed-ul XML nou de la infinitelove.ro
prin 2Performant, sau când observi diferențe mari de preț între site-ul tău
și site-ul oficial infinitelove.ro.

**De ce manual:** infinitelove.ro e un site WooCommerce cu variante de produs
(30ml/50ml/100ml) — prețul variantei se încarcă prin JavaScript, iar scraper-ul
nostru (cheerio/axios) nu execută JS, deci ar citi mereu un preț greșit.
**infinitelove.ro este exclus din scraping-ul zilnic automat.**

**Procesul:** trimiți feed-ul XML lui Claude (sau versiunea actualizată a
lui `feed_9d5a36a0f.xml`), iar Claude face merge în `products.json` cu
prețurile corecte. Primești fișierul `products-beautyhealth-updated.json`,
îl salvezi ca `src/data/products.json` și:

```powershell
cd "C:\FOLDER DE LUCRU\PAUL MELINTE\SITE BEAUTY_HEALTH\beautyhealth-site-git"
git pull
git add src/data/products.json
git commit -m "chore: actualizare preturi infinitelove din feed saptamanal"
git push
```

Dacă `git pull` dă conflict (Situația 3), folosești `--ours` pentru a păstra
versiunea ta cu prețurile corecte.

---

### Situația 7 — Înlocuire products.json și push (fluxul complet)

**Când:** ori de câte ori primești un fișier `products-beautyhealth-updated.json`
nou de la Claude (actualizare feed-uri, corectare prețuri etc.) și vrei să-l
publici pe site.

**Pasul 1 — Copiezi fișierul în folderul corect**

Deschizi `cmd` și navighezi la folderul de date:
```cmd
cd "C:\FOLDER DE LUCRU\PAUL MELINTE\SITE BEAUTY_HEALTH\beautyhealth-site-git\src\data"
```

Ștergi fișierul vechi și redenumești pe cel nou:
```cmd
del products.json
ren "products-beautyhealth-updated.json" "products.json"
```

Verifici că a mers (ar trebui să apară ~35-40MB și data de azi):
```cmd
dir products.json
```

**Pasul 2 — Faci pull, add, commit, push**

```cmd
cd "C:\FOLDER DE LUCRU\PAUL MELINTE\SITE BEAUTY_HEALTH\beautyhealth-site-git"
git pull -X ours
git add src/data/products.json
git commit -m "chore: actualizare toate sursele din feed"
git push
```

**Dacă vrei să incluzi și `banners.js` sau `sync-feeds-local.cjs` în același commit:**
```cmd
git add src/data/products.json sync-feeds-local.cjs
git commit -m "chore: actualizare produse + 3 magazine noi"
git push
```

**Alternativă din PowerShell:**
```powershell
cd "C:\FOLDER DE LUCRU\PAUL MELINTE\SITE BEAUTY_HEALTH\beautyhealth-site-git"
Copy-Item "$env:USERPROFILE\Downloads\products-beautyhealth-updated.json" "src\data\products.json" -Force
git pull -X ours
git add src/data/products.json
git commit -m "chore: actualizare toate sursele din feed"
git push
```

---

### Referință rapidă — comenzile pe care le vei folosi cel mai des

```powershell
# Trimitere fișiere noi/modificate pe GitHub (fluxul normal)
git pull
git add <fisier1> <fisier2>
git commit -m "descriere scurta"
git push

# Rezolvare conflict pe products.json (păstrezi versiunea locală)
git checkout --ours src/data/products.json
git add src/data/products.json
git commit -m "merge: pastrat products.json local"
git push

# Rezolvare "rejected" la push
git pull --no-rebase
# (daca da conflict, aplici --ours ca mai sus)
git push

# Verificare stare curentă
git status
git log --oneline -5
```

---

### Notă despre warning-urile LF/CRLF

La aproape orice `git add` pe Windows vei vedea:
```
warning: in the working copy of 'fisier.js', LF will be replaced by CRLF
```
**Ignoră-le complet** — sunt inofensive. E o diferență de format de linie
între Linux (LF, cum generează Claude și GitHub Actions) și Windows (CRLF).
Git le convertează automat și corect, fișierele funcționează identic pe
ambele sisteme.

---

### Situația 8 — vim se deschide la git pull sau git merge

**Când apare:** `git pull` găsește modificări pe GitHub și deschide editorul vim
pentru a confirma mesajul de merge. Arată un ecran negru cu text și `~` pe linii.

**Rezolvare rapidă:**
1. Apasă **Esc** (o dată)
2. Apasă **Shift+Z** de două ori rapid (**ZZ** cu majuscule)
3. Vim se închide și merge-ul continuă automat

**Alternativă dacă ZZ nu merge:**
```cmd
REM Inchide fereastra cmd, deschide una noua, apoi:
cd "C:\FOLDER DE LUCRU\PAUL MELINTE\SITE BEAUTY_HEALTH\beautyhealth-site-git"
git commit --no-edit
git push
```

**Prevenire pe viitor:**
```cmd
git config --global core.editor "notepad"
```

---

### Situația 9 — git push respins din cauza unui fișier mare (>100MB)

**Când apare:**
```
remote: error: File feed_235256a01.xml is 197.01 MB; this exceeds GitHub's file size limit of 100.00 MB
remote: error: GH001: Large files detected.
! [remote rejected] main -> main (pre-receive hook declined)
```

**Ce înseamnă:** un fișier XML (feed de la merchant) a intrat accidental într-un
commit. GitHub refuză fișierele peste 100MB.

**Soluție — scoate fișierul din ultimul commit și adaugă-l în .gitignore:**
```powershell
# 1. Scoate fișierul din ultimul commit (fără să-l ștergi de pe disk)
git rm --cached feed_235256a01.xml

# 2. Adaugă în .gitignore ca să nu mai intre niciodată
echo "feed_*.xml" >> .gitignore
git add .gitignore

# 3. Amendează commitul (înlocuiește-l fără fișierul mare)
git commit --amend --no-edit

# 4. Push
git push
```

**Prevenire:** feed-urile XML de la merchants sunt fișiere locale de lucru
(folosite de `sync-feeds-local.cjs`), nu fac parte din codul site-ului.
**NICIODATĂ nu face `git add -A` sau `git add .` în folderul beautyhealth** —
folosește mereu `git add <fisier-specific>`, ca să nu incluzi accidental
feed-urile XML.

Asigură-te că `.gitignore` conține:
```
feed_*.xml
```

Verifici cu:
```powershell
type .gitignore
```

---

## UTM-uri pentru BeautyHealth — toate canalele media

UTM-urile sunt parametri adăugați la linkurile pe care le distribui pe social
media, newsletter, WhatsApp etc., ca să poți vedea în **GA4 exact de unde
vine traficul** pe site — câți vizitatori vin din Facebook vs TikTok vs
newsletter, pe ce pagini ajung, și câte click-uri pe produse generează fiecare
canal.

### Structura unui link cu UTM

```
https://beautyhealth.gherasimmarius.com/ingrijire-ten/?utm_source=facebook&utm_medium=social&utm_campaign=gerovital-creme
```

Parametrii:
- **`utm_source`** — platforma (facebook, tiktok, instagram etc.)
- **`utm_medium`** — tipul de canal (social, email, message, story, bio)
- **`utm_campaign`** — campania sau postarea specifică (denumire scurtă, fără spații)
- **`utm_content`** *(opțional)* — diferențiezi 2 linkuri din același canal (ex. story vs. feed)

**Reguli de formare:**
- Scrie totul cu **litere mici**, fără spații (folosește `-` între cuvinte)
- Fii consecvent — dacă azi scrii `facebook`, nu scrie `Facebook` mâine
- `utm_campaign` descrie **ce promovezi** (ex. `vitamine-iarna`, `parfumuri-vara`, `oferta-farmec`)

---

### Tabel complet UTM-uri per canal

| Canal | `utm_source` | `utm_medium` | Exemplu `utm_campaign` |
|---|---|---|---|
| **Facebook — profil personal** | `facebook` | `social` | `oferta-saptamana`, `parfumuri-vara` |
| **Facebook — postare în grup** | `facebook-grup` | `social` | `grup-beauty-ro`, `grup-mame` |
| **Facebook — Stories** | `facebook` | `story` | `farmec-reduceri` |
| **Facebook — Messenger** | `messenger` | `message` | `recomandare-produs` |
| **Instagram — feed** | `instagram` | `social` | `vitamine-iarna` |
| **Instagram — Stories** | `instagram` | `story` | `ingrijire-ten` |
| **Instagram — bio link** | `instagram` | `bio` | `beautyhealth-homepage` |
| **TikTok — bio link** | `tiktok` | `bio` | `beautyhealth-homepage` |
| **TikTok — video** | `tiktok` | `social` | `gerovital-review` |
| **WhatsApp — mesaj direct** | `whatsapp` | `message` | `recomandare-produs` |
| **WhatsApp — Status** | `whatsapp` | `story` | `oferta-saptamana` |
| **WhatsApp — grup** | `whatsapp-grup` | `message` | `grup-beauty` |
| **LinkedIn** | `linkedin` | `social` | `sanatate-suplimente` |
| **Newsletter MailerLite** | `mailerlite` | `email` | `newsletter-iulie-2026` |
| **SMS / mesaj text** | `sms` | `message` | `oferta-flash` |
| **Alte site-uri / bloguri** | `guest-post` | `referral` | `articol-blog-beauty` |

---

### Exemple de linkuri complete, gata de copiat

**Facebook (postare normală pe profil):**
```
https://beautyhealth.gherasimmarius.com/?utm_source=facebook&utm_medium=social&utm_campaign=oferta-saptamana
```

**Instagram bio (link fix, spre homepage):**
```
https://beautyhealth.gherasimmarius.com/?utm_source=instagram&utm_medium=bio&utm_campaign=beautyhealth-homepage
```

**TikTok bio (link fix, spre homepage):**
```
https://beautyhealth.gherasimmarius.com/?utm_source=tiktok&utm_medium=bio&utm_campaign=beautyhealth-homepage
```

**WhatsApp mesaj direct (recomandare produs):**
```
https://beautyhealth.gherasimmarius.com/vitamine-suplimente/?utm_source=whatsapp&utm_medium=message&utm_campaign=recomandare-produs
```

**Newsletter MailerLite:**
```
https://beautyhealth.gherasimmarius.com/machiaj/?utm_source=mailerlite&utm_medium=email&utm_campaign=newsletter-iulie-2026
```

### Generator rapid de UTM — fără să scrii manual

```
https://ga-dev-tools.google.com/campaign-url-builder/
```

---

## 11. Trimiterea emailurilor BeautyHealth în MailerLite

### Frecvență recomandată
- **Manual**, când vrei tu — o dată/săptămână sau mai rar
- **Ziua optimă**: marți sau joi
- **Ora optimă**: 14:00 (vârf de comenzi conform datelor BusinessLeague)
- A doua fereastră bună: 20:00-23:00

### Flux complet pas cu pas

**Pasul 1 — Generezi HTML-ul**
```cmd
cd "C:\FOLDER DE LUCRU\PAUL MELINTE\SITE BEAUTY_HEALTH\beautyhealth-site-git"
node generate-beautyhealth-email.cjs
```
Se creează `beautyhealth-email-output.html`. Deschizi cu Notepad/VS Code și găsești:
- **SUBIECT** — copiezi în Subject
- **PREHEADER** — copiezi în Preheader
- **COD HTML** — copiezi tot ce e după linia `===`

**Pasul 2 — Creezi campania în MailerLite**
1. MailerLite → **Campaigns** → **Create campaign**
2. Tip: **Regular campaign**
3. **Campaign name** (intern): `BeautyHealth Parfumuri — {data}`
4. **Subject line**: lipești subiectul din fișier
5. **Preheader**: lipești preheader-ul din fișier

**Pasul 3 — Construiești emailul**
1. La pasul de design alegi **Drag & drop editor**
2. Adaugi bloc **Countdown** în partea de sus (urgență)
3. Sub el adaugi bloc **Custom HTML**
4. Click pe Custom HTML → **Edit HTML** → lipești codul HTML din fișier
5. **Save**

**Pasul 4 — Configurezi trimiterea**
1. **Recipients**: selectezi lista BeautyHealth
2. **Schedule**: **Send now** sau programezi la ora dorită

### Lista de abonați
- Există deja o listă BeautyHealth în MailerLite
- Formularul de abonare e embed în site (MailerLite form ID 193157177015273136)

### Ce face scriptul automat
- Selectează top 12 parfumuri cu cel mai mare discount (old_price > price)
- Rotație zilnică deterministică — în fiecare zi apar produse diferite
- Alege automat un banner compatibil cu emailul din categoria parfumuri/homepage
- Generează subiect și preheader cu cifrele reale din acea zi

### Nu uita
- Blocul **Countdown** se adaugă DEASUPRA blocului Custom HTML în MailerLite
- Emailul conține link spre `/oferte/parfumuri/` — pagina de oferte parfumuri de pe site

---

## 12. Email brand aleator parfumuri — generate-beautyhealth-email-brand.cjs

### Ce face
Generează un email cu **20 parfumuri aleatorii dintr-un brand ales aleator**
la fiecare rulare. Brand diferit de fiecare dată — nu e deterministic pe zi.

### Cum rulezi
```cmd
cd "C:\FOLDER DE LUCRU\PAUL MELINTE\SITE BEAUTY_HEALTH\beautyhealth-site-git"
node generate-beautyhealth-email-brand.cjs
```
Output: **`beautyhealth-email-brand-output.html`** în același folder.

### Logica de selecție

**Brand:**
- Aleator pur la fiecare rulare (Math.random — brand diferit la fiecare apăsare)
- Eligibil doar dacă are **>= 20 parfumuri active**
- Dacă brandul ales are < 20 → sare automat la alt brand eligibil

**Produse (20 bucăți):**
- Cele cu reducere apar **primele** (sortate după % reducere descrescător)
- Restul completează aleator până la 20 (fără reducere)

### Diferența față de generate-beautyhealth-email.cjs

| | `email.cjs` | `email-brand.cjs` |
|---|---|---|
| Selecție | Top reduceri din toți | Brand aleator, 20 produse |
| Rotație | Zilnică deterministică | Complet aleatorie la fiecare rulare |
| Focus | Cel mai mare discount | Prezentare colecție brand |
| CTA | `/oferte/parfumuri/` | `/parfumuri/brand/{slug}/` |

### Nu uita în MailerLite
- Adaugă blocul **Countdown** DEASUPRA blocului Custom HTML în MailerLite
- CTA-ul duce pe pagina de brand: `beautyhealth.gherasimmarius.com/parfumuri/brand/{slug}/`

---

## 13. Sincronizare locală products.json cu feed-urile XML — sync-feeds-local.cjs

### Ce face
Compară feed-urile XML descărcate de la merchants cu `products.json` și:
- **Actualizează prețurile** (price + old_price) pentru produsele existente
- **Adaugă produsele noi** din feed care lipsesc din JSON
- **Dezactivează** (draft: true) produsele din JSON absente din feed
- **Șterge câmpul description** din toate produsele (reduce dimensiunea fișierului)

### Unde se află fișierul
```
beautyhealth-site-git\sync-feeds-local.cjs
```

### Cum rulezi
Pune feed-urile XML descărcate **în același folder** cu scriptul (rădăcina proiectului).
Scriptul recunoaște automat mai multe variante de nume de fișier.

```cmd
cd "C:\FOLDER DE LUCRU\PAUL MELINTE\SITE BEAUTY_HEALTH\beautyhealth-site-git"
node sync-feeds-local.cjs
```

### Opțiuni disponibile

```cmd
REM Toate sursele (default)
node sync-feeds-local.cjs

REM Doar anumite surse
node sync-feeds-local.cjs --surse=notino,infinitelove
node sync-feeds-local.cjs --surse=springfarma,farmec
node sync-feeds-local.cjs --surse=longevity-boost,detoxmed,parflab
node sync-feeds-local.cjs --surse=drmax,picadili

REM Dry run — afisaza ce ar face, fara sa salveze nimic
node sync-feeds-local.cjs --dry-run
```

### Nume de fișiere feed acceptate (oricare din variante)

| Sursă | Variante de nume acceptate |
|-------|---------------------------|
| notino.ro | `feed_notino.xml`, `feed_235256a01.xml`, `feed_235256a01_1.xml` |
| springfarma.com | `feed_springfarma.xml`, `feed_436edea46.xml`, `feed_436edea46_1.xml` |
| farmec.ro | `feed_farmec.xml`, `feed_eb530f914.xml`, `feed_eb530f914_1.xml` |
| infinitelove.ro | `feed_infinitelove.xml`, `feed_9d5a36a0f.xml`, `feed_9d5a36a0f_1.xml` |
| boabe.ro | `feed_boabe.xml`, `feed_c143969aa.xml` |
| endro.ro | `feed_endro.xml`, `feed_9c297a4fb.xml` |
| longevity-boost.com | `feed_longevity-boost.xml`, `feed_5d8022816.xml` |
| detoxmed.ro | `feed_detoxmed.xml`, `feed_fd8dad9ff.xml` |
| PARFLAB.ro | `feed_parflab.xml`, `feed_5544111cd.xml` |
| drmax.ro | `feed_585a1cd31.xml` + `feed_09eca89e8.xml` + `feed_dc6bbc64e.xml` (toate trei, se unesc) |
| picadili.ro | `feed_picadili.xml`, `feed_f741a4c2e.xml` (același fișier ca în shoes-site) |

### Output
- `src/data/products.json` — actualizat direct
- `sync-report.json` — raport detaliat cu ce s-a schimbat

### Flux complet după rulare

```cmd
git pull -X ours
git add src/data/products.json
git commit -m "chore: sync feeds local"
git push
```

### Diferența față de actualizarea prin Claude
| | Prin Claude | sync-feeds-local.cjs |
|---|---|---|
| Cine rulează | Claude (sandbox) | Tu, local pe calculator |
| Feed-uri necesare | Urcate pe Claude | Puse în folderul proiectului |
| Rezultat | Fișier de descărcat | Modifică direct src/data/products.json |
| Avantaj | Nicio instalare necesară | Mai rapid, fără upload/download |

### Limite Notino (păstrate ca la actualizarea prin Claude)
- Parfumuri: toate
- Machiaj: top 5.000 după preț descrescător
- Îngrijire ten: top 1.000
- Îngrijire păr: top 1.000

---

### ⚠️ IMPORTANT: feed-urile XML NU se commit pe GitHub

Feed-urile XML de la merchants (ex. `feed_235256a01.xml`, `feed_436edea46.xml`,
`feed_5544111cd.xml` etc.) sunt fișiere locale de lucru — pot depăși 100MB și
GitHub le respinge. **NICIODATĂ nu face `git add -A` sau `git add .`** în
folderul beautyhealth — folosește mereu `git add <fisier-specific>`.

Asigură-te că `.gitignore` conține:
```
feed_*.xml
```
Dacă ai comis accidental un fișier XML mare, vezi **Situația 9** din ghidul Git.

---

## 14. Adăugare bannere noi — add-banners.cjs

### Ce face
Script interactiv care parsează linkurile HTML de la 2Performant și le adaugă
automat în `banners.js` — fără să editezi manual fișierul.

### Unde se află fișierul
```
beautyhealth-site-git\add-banners.cjs
```

### Cum rulezi
```cmd
cd "C:\FOLDER DE LUCRU\PAUL MELINTE\SITE BEAUTY_HEALTH\beautyhealth-site-git"
node add-banners.cjs
```

### Flux interactiv
1. Scriptul îți cere să lipești linkurile HTML (unul sau mai multe deodată)
2. Dai **Enter de două ori** când ai terminat de lipit
3. Îți arată ce a detectat + dacă bannerul există deja (îl sare automat)
4. Îți cere data de expirare — `YYYY-MM-DD` sau **Enter** pentru fără termen
5. Confirmă și salvează direct în `src/data/banners.js`

### Ce detectează automat
| Câmp | Cum e detectat |
|------|----------------|
| `id` | Merchant + dimensiune + prima literă disponibilă |
| `channels` | După dimensiune: 728×90→site, 300×250→site+email+fb+ig, 300×600→site+email |
| `categories` | După merchant: farmec→ingrijire, notino→parfumuri+machiaj etc. |
| `active_from` | Data de azi |
| `note` | Automat pentru formate non-standard IAB |
| Duplicate | Detectate după `unique=` din URL — nu adaugă de două ori |

### Format link HTML acceptat (de la 2Performant)
```html
<a href="https://event.2performant.com/events/click?ad_type=banner&unique=44651c133&aff_code=...">
  <img src="https://img.2performant.com/.../272648.jpg" height="250px" width="300px" />
</a>
```

### După rulare — push pe GitHub
```cmd
git pull -X ours
git add src/data/banners.js
git commit -m "feat: bannere noi"
git push
```

---

## 15. Trustpilot — implementat 15 Oct 2026

**Profil curent:** beauty-healths.com — Business Unit ID `6ad21e64dea7b17b7f0585d7`, token `5d8638c8-df43-434b-b812-50901f6b578f` (în `Layout.astro`).
*(Istoric: profilul inițial beautyhealth.gherasimmarius.com avea Business Unit ID `6ad0a9bbc306c18a13301538`, token `feb288da-c598-4f56-889c-4b401bfb23de`.)*
**Categorie Trustpilot:** Beauty & Well-being → Cosmetics & Makeup → Cosmetics Store

### Fișier de verificare domeniu
- **Cale în proiect:** `public/395d987b-1bf4-4d15-a52e-7e61fad49755.html`
- **URL live:** `https://beautyhealth.gherasimmarius.com/395d987b-1bf4-4d15-a52e-7e61fad49755.html` ✅
- **Conținut:** text simplu `395d987b-1bf4-4d15-a52e-7e61fad49755`
- **Cum funcționează:** Trustpilot accesează URL-ul și verifică că fișierul există — domeniul e astfel confirmat ca al tău

### Widget integrat în `src/layouts/Layout.astro`

**Script bootstrap în `<head>`:**
```html
<script type="text/javascript" src="//widget.trustpilot.com/bootstrap/v5/tp.widget.bootstrap.min.js" async></script>
```

**Sticker fix centrat vertical (stânga), înainte de `</body>`:**
```html
<!-- ── TRUSTPILOT Floating Sticker ── -->
<div id="tp-sticker">
  <div class="tp-sticker-label">Recenzii clienți</div>
  <div class="trustpilot-widget"
       data-locale="en-US"
       data-template-id="56278e9abfbbba0bdcd568bc"
       data-businessunit-id="6ad0a9bbc306c18a13301538"
       data-style-height="52px"
       data-style-width="220px"
       data-token="feb288da-c598-4f56-889c-4b401bfb23de">
    <a href="https://www.trustpilot.com/review/beautyhealth.gherasimmarius.com"
       target="_blank" rel="noopener">Trustpilot</a>
  </div>
</div>
```

**CSS sticker:**
- `position: fixed; left: 12px; top: 50%; transform: translateY(-50%); z-index: 9998`
- Fundal alb, border-radius 10px, box-shadow
- Pe mobil (< 640px) devine bară fixă jos (actualizat oct 2026), iar stickerele promo urcă deasupra ei
- Nu interferează cu Farmec sticker (Farmec = bottom-right, Trustpilot = center-left)

### ⚠️ ATENȚIE: CSS transform distruge widget-ul Trustpilot

**Problema:** CSS `transform: rotate()` aplicat pe containerul widget-ului
**blochează complet randarea iframe-ului Trustpilot** (browser security sandbox
+ compositing layer). Simptom: widget-ul dispare complet de pe pagini.

**Regulă:** NICIODATĂ nu folosi `transform: rotate()` pe `#tp-sticker`
sau pe orice element părinte al widget-ului Trustpilot.

`transform: translateY(-50%)` pe `#tp-sticker` este **sigur** — translateY
nu afectează iframe-urile la fel ca rotate. Testat și confirmat funcțional.

### Extindere widget la alte site-uri din ecosistem

Același `data-businessunit-id` și `data-token` funcționează pentru toate
domeniile sub același cont Trustpilot. Fiecare domeniu nou necesită verificare
separată:

1. Trustpilot Business → Settings → Business Information → secțiunea „Domains" → Add domain
2. Primești un fișier de verificare nou (UUID diferit față de cel de pe beautyhealth)
3. Pui fișierul în `public/` al site-ului respectiv
4. Deploy → Trustpilot Business → Verify

Site-urile din ecosistem: **styleaccessories.eu** are deja profil propriu (Business Unit ID `6ad4bbc3dea7b17b7f05cfb1`, verificat prin DNS); `carti.gherasimmarius.com` încă nu are.

---

## 16. Google Search Console — Sitemap (implementat Oct 2026)

### Sitemap generat automat prin Astro

**Pachet folosit:** `@astrojs/sitemap`

**Configurare în `astro.config.mjs`:**
```js
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://beauty-healths.com',
  integrations: [sitemap()],
  // ... restul configurației
});
```

**URL sitemap live:** `https://beauty-healths.com/sitemap-index.xml` ✅ *(inițial pe beautyhealth.gherasimmarius.com)*

Sitemapul se regenerează automat la fiecare build (fiecare `git push` → deploy).
Conține toate paginile generate de Astro (categorii, brand pages, sub-categorii,
homepage, pagini statice).

### Verificare proprietate în Google Search Console

Proprietatea `beautyhealth.gherasimmarius.com` a fost verificată prin **fișier HTML**
în `public/` — același mecanism ca verificarea domeniului pe Trustpilot (pui fișierul
în `public/`, faci deploy, Google îl accesează și confirmă proprietatea).

### Submitere sitemap

1. Google Search Console → proprietatea `beautyhealth.gherasimmarius.com`
2. Meniu stânga → **Sitemaps**
3. Câmp „Add a new sitemap" → introduci: `sitemap-index.xml`
4. Click **Submit**
5. **Stare confirmată:** ✅ Submitted and indexed (Oct 2026)

### De reținut

- Sitemapul se actualizează automat la fiecare deploy — nu trebuie re-submis
  când adaugi produse sau pagini noi
- Google Search Console îl recitește periodic pe cont propriu după prima submisie
- Dacă site-ul primește erori de crawl (404, redirect loops), apar în raportul
  „Pages" din Search Console — verifică periodic

## 17. Longevity BOOST — campaniile din noiembrie 2026 (implementat 29 Oct 2026)

**C1, ofertă de sezon (1–5 nov):** -20% automat + încă 20% automat la comenzi de min. 300 lei, fără cod.
**C2, Black Friday (6–20 nov):** -35% automat + 2 produse full size cadou, la alegere, la min. 400 lei.
Produse: Antioxidants Boost, Liposomal Vitamin C Boost, Magnesium Bisglycinate Boost, Mind Forte, Se-Inositol Boost. **Vitamin D3+K2 NU e inclus la C1.** La Black Friday, D3+K2 apare printre produsele incluse în textul 2Performant pentru marketeri, dar nu și în cel pentru clienți (neclar). Cadourile Black Friday: clientul alege 2 dintre cele 6 produse individuale din gamă. Transport gratuit peste 190 lei.
Quicklink: `https://event.2performant.com/events/click?ad_type=quicklink&aff_code=676a7e7d9&unique=28cd17dbc&redirect_to=https%253A//longevity-boost.com/collections/produse`

### Reguli obligatorii Longevity (pentru orice text)
- Folosește doar mențiunile din descrierile de pe site, în forma exactă (ex. „magneziul contribuie la reducerea oboselii și extenuării”).
- Fără boli sau afecțiuni. Fără „tratează”, „vindecă”, „previne”, „detox”, „100% natural”.
- NU prezenta 1–5 nov drept „-40%”, pentru că reducerile se aplică succesiv.
- Fără numele sau imaginea cofondatoarelor.

### Ce s-a pus pe site (totul pornește și se oprește singur după dată, fără push)
- **Bannere:** în `public/banners/longevity/` (c1-*, c2-*), cu 12 intrări în `src/data/banners.js`, marcate `prioritar: true`.
  - `BannerSlot.astro` arată întâi bannerele prioritare din perioada lor.
  - Formatul 970x250 e acceptat acum în slotul de jos.
  - Data se ia după ora României.
- **Promoții:** 2 carduri în `src/data/promotii.js`. Câmp nou: **`incepe`**, data de la care apare oferta, astfel că o poți pune din timp.
  - `promotii.astro` și numărul de pe tabul „% Promoții” numără doar ofertele active azi (calculat în browser).
- **Sticker `lb-sticker`** în `Layout.astro`: precampanie 29–31 oct („în curând”, countdown „Începe în” până la 1 nov), apoi countdown până la 5 nov 23:59 (pe 5 nov anunță „Mâine începe Black Friday”), apoi până la 20 nov 23:59, apoi dispare.
  - Apare pe prima pagină și la /vitamine-suplimente/, cu excepția tipului Slăbire & Detox. Acolo ia locul stickerului DUMO.
  - Test pentru o anumită zi: `/?lbtest=2026-11-10`.
- **Emailuri:** `email-longevity-c1.html` se trimite pe 1 nov, `email-longevity-c2.html` pe 6 nov. Fiecare are 3 subiecte și 3 preheadere.
- **Texte social:** `longevity-texte-social.md`, cu postări și Story-uri pentru ambele campanii.
- **De aflat de la Longevity:** pragul de 400 lei e înainte sau după -35%? D3+K2 are -35% de Black Friday?
- **Reamintiri prin email** (fișierele nu sunt în repo): r1 pe 4 nov, r2 pe 12 nov, r3 pe 19 nov, după calendarul recomandat de Longevity.
