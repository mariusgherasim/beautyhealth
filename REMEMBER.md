# BeautyHealth — REMEMBER.md

Site afiliat de comparare prețuri pentru Frumusețe & Sănătate, la
`beautyhealth.gherasimmarius.com`. Al treilea site din familia
shop/carti/beautyhealth, aceeași arhitectură de bază (Astro static + GitHub
Pages + Squarespace DNS + 2Performant).

## Surse de produse (4 merchant-i 2Performant)

| Merchant | Produse active | Categorie principală |
|---|---|---|
| minuneanaturii.ro | 576 | Vitamine & suplimente (ceaiuri ayurvedice) |
| springfarma.com | ~12.500 (din ~14.150 in feed, dupa filtrare) | Farmacie completă — filtrat doar Beauty&Health |
| infinitelove.ro | 348 (din 544, restul inactive la sursă) | Parfumuri |
| farmec.ro | 114 (din 128 active în feed, restul excluse) | Ten, Machiaj, Corp, Păr (Gerovital) |

**Total produse active: 13.533** (fără pagină individuală de produs — vezi
decizia de arhitectură de mai jos). Alte **1.867 produse excluse** în total
(1.853 de la primele 3 surse + 14 de la farmec.ro) — vezi
`produse-excluse-beautyhealth.xlsx` și `produse-excluse-farmec.xlsx` livrate
separat, cu motiv per produs (dispozitive medicale, categorie "Cuplu și sex"
— exclusă implicit ca sensibilă la brand, produse de curățenie casnică
Nufăr/Triumf și insecticide Insect-Tox de la farmec.ro, produse inactive la
sursă, necategorizate).

**IMPORTANT: nu folosi niciodată feed-ul XML 2Performant ca sursă de preț** —
prețurile din feed întârzie față de site-ul oficial. Feed-ul e folosit doar
pentru import inițial/bulk. Prețul zilnic vine din scraping direct pe
`official_url`.

## Decizie de arhitectură: fără pagini individuale de produs

Cu ~13.400 produse active, generarea unei pagini Astro per produs ar face
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

## Categorii (9)

Vitamine & Suplimente (5.543) · Îngrijire ten (2.614) · Îngrijire corp (1.479)
· Mama și copilul (1.468) · Îngrijire păr (1.066) · Machiaj (423, categorie
nouă propusă — nu exista în discuția inițială cu Marius, dar era un bucket
prea mare ca să-l bagi la "Îngrijire ten") · Igienă orală (403) · Parfumuri
(396) · Cosmetice bărbați (27).

Mapările exacte custom_field1/custom_field2 → categorie sunt în
`build_products.py` (scriptul folosit o singură dată la import inițial) —
păstrează-l dacă vrei să re-imporți un feed nou cu aceeași logică.

## Ce am construit (cod, gata de push pe GitHub)

- Proiect Astro 4.x complet funcțional, build testat local (566 pagini, ~3s).
- `src/data/products.json` — sursa unică de adevăr (13.419 produse active).
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

## Incident (16.07.2026): prima rulare reală de update-prices a eșuat masiv

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
springfarma (nu pentru toate sursele), sau o frecvență mai rară de scraping
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
   sursă acumulează 25 eșecuri consecutive, scriptul NU mai renunță definitiv:
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
   infinitelove, farmec). Selectoare actualizate și testate:
   - **minuneanaturii.ro**: preț din atributul `content` al
     `.product-price[itemprop="price"]`; preț vechi din `.regular-price`;
     stoc verificat prin text `/in stoc/i` în `#product-availability`.
   - **springfarma.com**: preț din atributul `data-price-amount` al
     `[data-price-type="finalPrice"]`; preț vechi din
     `[data-price-type="oldPrice"]`. Selectorul de "stoc epuizat" rămâne
     **nesigur** — nu am avut un exemplu, e doar o presupunere
     (`.stock.unavailable, .out-of-stock`).
   - **infinitelove.ro**: confirmat că e randat server-side (nu are nevoie de
     JS/Playwright) — am simplificat scraper-ul la cheerio/axios, ca la
     celelalte. Preț din `ins .woocommerce-Price-amount` (sau
     `.price > .woocommerce-Price-amount` dacă nu există reducere), preț
     vechi din `del .woocommerce-Price-amount`.
   - **farmec.ro** (merchant nou, adăugat ulterior): scraper nou creat,
     preț din `.ProductPrice-PriceValue`, preț vechi din
     `.ProductPrice-HighPrice`.
   - Am eliminat complet dependința de **Playwright** din proiect (nu mai e
     necesară pentru nicio sursă) — scraping-ul e mai rapid și workflow-ul
     GitHub Actions nu mai instalează Chromium.
   - Fișierele din `scripts/lib/` au fost redenumite din `.js` în `.cjs`
     (proiectul Astro are `"type": "module"` în `package.json`, ceea ce
     făcea ca `require()` din `update-prices.cjs` să nu găsească exporturile
     corect — bug prins și reparat acum, înainte să apuce să rămână
     nedescoperit până la prima rulare reală în GitHub Actions).
2. **MailerLite** — creezi grup nou "BEAUTYHEALTH" + formular nou (double
   opt-in activ, sender `office@gherasimmarius.com`, ca la shop). Te ghidez
   pas cu pas când ești gata. Apoi înlocuim placeholder-ul din
   `src/components/Newsletter.astro` cu embed-ul JSONP real.
3. ~~**Logo**~~ — **REZOLVAT (16.07.2026)**. Concept original, creat de Claude
   după un research rapid al site-urilor sursă (springfarma - verde, minunea
   naturii - verde/curcubeu naturist, farmec - brand tradițional, infinitelove
   - parfumerie). Diferențiere deliberată: paletă navy + auriu (deja folosită
   pe site), nu verde ca aproape toată concurența "de farmacie" — semnalează
   "comparator curatoriu/premium", nu încă un site de farmacie. Fișiere:
   - `public/logo-beautyhealth.svg` — varianta navy, pt fundaluri deschise
   - `public/logo-beautyhealth-white.svg` — varianta albă, folosită în
     header (fundal navy)
   - `public/favicon.svg` — doar iconița, pe fundal navy plin, rotunjit
   Simbol: o formă abstractă de petală/frunză împletită cu o picătură,
   sugerând dualitatea frumusețe+sănătate. Wordmark: "beauty" (navy/alb) +
   "health" (auriu), font serif Georgia, subtitlu "FRUMUSETE SI SANATATE".
4. **Google Analytics 4** — property-ul e comun (G-HS59YL4Y3D), tag-ul e deja
   pus în cod. **Clarificare (16.07.2026):** streamul separat creat la shop
   (measurement ID diferit, G-VQW0LXD8Y8) a fost necesar EXCLUSIV pentru
   legarea contului Google Ads de conversia `affiliate_click` (Ads are nevoie
   de un stream a cărui adresă să corespundă exact hostname-ului) — nu pentru
   analiză în sine. La cărți nu s-a făcut acest pas (nu rulează Google Ads
   acolo) și funcționează corect fără. **Decizie pentru beautyhealth:** cât
   timp nu există o campanie Google Ads dedicată, se procedează ca la cărți —
   FĂRĂ stream nou. Tag-ul comun raportează automat, diferențiat prin
   hostname. Dacă apare vreodată un plan de Google Ads pentru beautyhealth,
   abia atunci se creează un stream dedicat, cu același scop tehnic ca la shop.
   Ce rămâne totuși de făcut, indiferent de stream (independent, la nivel de
   proprietate GA4):
   - **Codul e gata (16.07.2026)** — toate 3 evenimentele se declanșează
     deja pe site, confirmate în build:
     - `bh_affiliate_click` — delegare globală de click în `Layout.astro`,
       pe orice `.product-card` (funcționează atât pe cardurile din
       paginare, cât și pe cele injectate de căutare), cu parametri
       `product_id`, `product_title`, `product_price`.
     - `bh_category_page_view` — în `[category]/[...page].astro`, cu
       parametri `category` și `page_number`.
     - `bh_newsletter_signup` — în `Newsletter.astro`, pe submit-ul
       formularului. **ATENȚIE:** când înlocuiești formularul placeholder
       cu embed-ul real MailerLite, păstrează acest event listener (sau
       unul echivalent legat de formularul real) — altfel semnalul se
       pierde silențios.
   - **Manual, în GA4 → Admin → Events:** creezi cele 3 evenimente
     (`Create event` sau pur și simplu așteptând să apară automat din
     trafic real, GA4 le detectează din `gtag('event', ...)`), apoi le
     marchezi ca **Key Event** (toggle "Mark as key event").
5. **Google Search Console** — trebuie verificat manual (proprietate nouă,
   verificare prin DNS TXT record pe Squarespace sau prin fișier HTML în
   `public/`). Trimite fișierul de verificare (dacă alegi metoda HTML) și-l
   pun eu în `public/`.
6. **GitHub** — repo nou, upload prin interfața web (ca de obicei) sau
   `git push` dacă preferi. Nu uita `.github/` (ascuns, verifică să se
   încarce și el).
7. **DNS Squarespace** — CNAME către GitHub Pages, la fel ca la celelalte
   3 site-uri.
8. **Verificare mobil** — layout-ul e responsive (grid auto-fill, meniu
   hamburger sub 720px), dar merită un test real pe telefon după deploy.

## Tools & tehnologii folosite aici

- Astro 4.x, static output, `@astrojs/sitemap`
- Scraping: axios + cheerio (springfarma, minuneanaturii — site-uri statice),
  Playwright (infinitelove — posibil necesar JS pentru variante de produs)
- GitHub Actions pentru build/deploy + cron zilnic de prețuri

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
Git le convertește automat și corect, fișierele funcționează identic pe
ambele sisteme.


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

**Facebook Stories:**
```
https://beautyhealth.gherasimmarius.com/parfumuri/?utm_source=facebook&utm_medium=story&utm_campaign=parfumuri-vara
```

**Instagram bio (link fix, spre homepage):**
```
https://beautyhealth.gherasimmarius.com/?utm_source=instagram&utm_medium=bio&utm_campaign=beautyhealth-homepage
```

**TikTok bio (link fix, spre homepage):**
```
https://beautyhealth.gherasimmarius.com/?utm_source=tiktok&utm_medium=bio&utm_campaign=beautyhealth-homepage
```

**WhatsApp Status (ofertă săptămânală):**
```
https://beautyhealth.gherasimmarius.com/ingrijire-ten/?utm_source=whatsapp&utm_medium=story&utm_campaign=oferta-saptamana
```

**WhatsApp mesaj direct (recomandare produs):**
```
https://beautyhealth.gherasimmarius.com/vitamine-suplimente/?utm_source=whatsapp&utm_medium=message&utm_campaign=recomandare-produs
```

**LinkedIn:**
```
https://beautyhealth.gherasimmarius.com/vitamine-suplimente/?utm_source=linkedin&utm_medium=social&utm_campaign=sanatate-suplimente
```

**Newsletter MailerLite:**
```
https://beautyhealth.gherasimmarius.com/machiaj/?utm_source=mailerlite&utm_medium=email&utm_campaign=newsletter-iulie-2026
```

---

### Cum diferențiezi 2 linkuri din același canal — utm_content

Dacă trimiți spre beautyhealth atât în feed cât și în Stories pe Instagram în
aceeași zi, folosești `utm_content` ca să le diferențiezi în GA4:

```
# Link din feed
https://beautyhealth.gherasimmarius.com/parfumuri/?utm_source=instagram&utm_medium=social&utm_campaign=parfumuri-vara&utm_content=feed

# Link din Stories
https://beautyhealth.gherasimmarius.com/parfumuri/?utm_source=instagram&utm_medium=story&utm_campaign=parfumuri-vara&utm_content=story
```

---

### Unde vezi rezultatele în GA4

**GA4 → Reports → Acquisition → Traffic acquisition**

Coloanele cheie:
- **Session source / medium** — ex. `facebook / social`, `tiktok / bio`
- **Sessions** — câte vizite a adus canalul respectiv
- **Key events** — câte click-uri pe produse (`bh_affiliate_click`) sau
  vizualizări de categorie (`bh_category_page_view`) au generat

Poți filtra după `utm_campaign` dacă vrei să compari campanii specifice:
**Explore → Free form** → dimensiune `Campaign` + metric `Key events`.

---

### Generator rapid de UTM — fără să scrii manual

Dacă vrei să generezi linkuri mai rapid fără să le construiești manual,
folosește **Google Campaign URL Builder**:
```
https://ga-dev-tools.google.com/campaign-url-builder/
```
Completezi URL-ul, sursa, mediul și campania, și generează linkul complet
cu toți parametrii gata de copiat.

