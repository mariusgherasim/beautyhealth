// TIPURI de produs pe fiecare categorie.
// URL generat: /{categorie}/tip/{slug}/   (ex: /ingrijire-par/tip/sampon/)
//
// Un produs intra intr-un tip daca titlul sau categoria din feed (subcategory_raw)
// contine unul dintre cuvintele cheie (kw). Un produs poate fi in mai multe tipuri.
// Un tip apare pe site doar daca are cel putin MIN_PRODUSE_TIP produse.
//
// Reguli cuvinte cheie (fara diacritice, nu conteaza literele mari/mici):
//   'imun'           -> orice cuvant care INCEPE cu "imun" (imunitate, imunomed...)
//   'ser='           -> doar cuvantul exact "ser" (nu "serie", "sertar")
//   'pasta de dinti' -> expresia exacta
//
// Optional: intro (text de prezentare). Daca lipseste, se genereaza automat.

export const MIN_PRODUSE_TIP = 5;

export const tipuri = {
  'vitamine-suplimente': [
    { slug: 'multivitamine', name: 'Multivitamine', kw: ['multivitamin', 'multi vitamin', 'complex de vitamine', 'vitamine si minerale', 'b complex'] },
    { slug: 'imunitate', name: 'Imunitate', kw: ['imun', 'echinacea', 'propolis', 'beta glucan', 'betaglucan', 'soc negru', 'elderberry', 'vitamina c', 'vitamin c'] },
    { slug: 'vitamina-d', name: 'Vitamina D', kw: ['vitamina d', 'vitamin d', 'd3=', 'd3k2', 'k2='] },
    { slug: 'magneziu-minerale', name: 'Magneziu & Minerale', kw: ['magneziu', 'magnesium', 'calciu', 'calcium', 'fier=', 'iron=', 'zinc', 'seleniu', 'potasiu', 'mineral'] },
    { slug: 'omega-3', name: 'Omega 3', kw: ['omega', 'ulei de peste', 'fish oil', 'krill', 'ulei de ficat', 'ulei din ficat'] },
    { slug: 'probiotice-digestie', name: 'Probiotice & Digestie', kw: ['probiotic', 'prebiotic', 'digest', 'enzim', 'flora intestinala', 'lactobacil', 'colon', 'tranzit', 'gastro', 'ficat', 'hepat', 'constipatie', 'meteorism', 'diaree', 'antiacide', 'paraziti intestinali', 'ulcer'] },
    { slug: 'somn-relaxare', name: 'Somn & Relaxare', kw: ['somn', 'melatonin', 'relax', 'stres', 'stress', 'valerian', 'ashwagandha', 'anxiet', 'liniste', 'insomnie', 'depresie'] },
    { slug: 'energie-memorie', name: 'Energie & Memorie', kw: ['energ', 'memori', 'ginkgo', 'ginseng', 'concentrare', 'cognitiv', 'oboseal', 'neuro', 'tonice'] },
    { slug: 'articulatii', name: 'Articulații', kw: ['articulat', 'glucozamin', 'glucosamin', 'condroitin', 'chondroitin', 'msm=', 'cartilaj', 'oase', 'osteo', 'sistemul osos', 'dureri musculare', 'carcei'] },
    { slug: 'colagen-frumusete', name: 'Colagen & Frumusețe', kw: ['colagen', 'collagen', 'biotin', 'par piele', 'piele par', 'unghii', 'forcapil', 'suplimente pentru par', 'ingrijire piele'] },
    { slug: 'slabire-detox', name: 'Slăbire & Detox', kw: ['slabi', 'slim', 'ardere', 'carnitin', 'garcinia', 'chitosan', 'detox', 'metabolism', 'silueta', 'crom='] },
    { slug: 'raceala-gripa', name: 'Răceală & Gripă', kw: ['raceal', 'gripa', 'gripal', 'tuse', 'gat=', 'durere de gat', 'dureri de gat', 'nas=', 'nazal', 'congesti', 'expector', 'antitusiv', 'pastile de supt', 'sinus', 'rinita', 'orl=', 'alergi'] },
    { slug: 'inima-circulatie', name: 'Inimă & Circulație', kw: ['inima', 'cardio', 'colesterol', 'holest', 'tensiun', 'circulat', 'vene=', 'venos', 'varice', 'lipid', 'trigliceride', 'coenzima'] },
    { slug: 'sanatatea-femeii', name: 'Sănătatea Femeii', kw: ['menstru', 'menopauz', 'ciclu=', 'pentru femei', 'feminin', 'vaginal', 'premenstrual', 'ginecolog'] },
    { slug: 'barbati', name: 'Bărbați', kw: ['prostat', 'pentru barbati', 'barbati=', 'men=', 'testosteron'] },
    { slug: 'ochi', name: 'Ochi', kw: ['ochi', 'vedere', 'lutein', 'ocular', 'pleoap', 'oftalm', 'lacrimi artificiale', 'degenerescenta maculara'] },
    { slug: 'rinichi-cai-urinare', name: 'Rinichi & Căi Urinare', kw: ['rinichi', 'urinar', 'cistit', 'merisor', 'cranberry', 'vezica', 'cai urinare', 'genito urinar', 'litiaza'] },
    { slug: 'tincturi', name: 'Tincturi', kw: ['tinctur'] },
    { slug: 'proteine-sport', name: 'Proteine & Sport', kw: ['protein', 'whey', 'creatin', 'bcaa', 'sport', 'aminoacizi', 'workout', 'antrenament', 'gainer', 'masa musculara', 'arginin'] },
    { slug: 'diabet-glicemie', name: 'Diabet & Glicemie', kw: ['diabet', 'gluco', 'glicemi'] },
    { slug: 'vitamine-copii', name: 'Vitamine Copii', kw: ['multivitamine copii', 'pentru copii', 'copii=', 'kids', 'junior', 'gummy'] },
  ],

  'ingrijire-ten': [
    { slug: 'crema-antirid', name: 'Cremă Antirid', kw: ['antirid', 'anti rid', 'wrinkle', 'retinol', 'lifting', 'fermitate', 'anti age', 'antiage', 'antiaging', 'anti aging', 'anti imbatranire'],
      intro: 'Câte creme antirid ai încercat fără să compari prețul mai întâi? Găsești aici o selecție comparată, de la formule dermatologice până la îngrijire premium.' },
    { slug: 'crema-hidratanta', name: 'Cremă Hidratantă', kw: ['hidratant', 'hydra', 'moistur', 'aqua cream', 'water cream', 'umectant'],
      intro: 'Hidratarea zilnică a tenului nu ar trebui să fie scumpă — sau măcar ar trebui să știi ce plătești. Iată selecția comparată de creme hidratante.' },
    { slug: 'ser-de-fata', name: 'Ser de Față', kw: ['ser=', 'serum', 'seruri', 'esenta', 'essence', 'booster', 'concentrat', 'acid hialuronic', 'niacinamid', 'fiole'],
      intro: 'Serul e produsul cu cea mai mare concentrație de activi din rutina ta — dar și cel mai ușor de cumpărat la suprapreț. Compară înainte să cumperi.' },
    { slug: 'crema-de-noapte', name: 'Cremă de Noapte', kw: ['noapte', 'night', 'nocturn', 'overnight'],
      intro: 'Pielea se regenerează cel mai bine noaptea — iar crema de noapte potrivită face diferența. Iată selecția comparată.' },
    { slug: 'balsam-de-buze', name: 'Balsam de Buze', kw: ['balsam de buze', 'balsam buze', 'lip balm', 'ulei de buze', 'masca buze', 'exfoliant buze', 'ingrijirea buzelor', 'buze='] },
    { slug: 'masca-de-fata', name: 'Mască de Față', kw: ['masca=', 'masti=', 'mask=', 'sheet mask', 'masca faciala'],
      intro: 'O mască bună de față nu trebuie să coste o avere. Compară înainte să cumperi.' },
    { slug: 'protectie-solara', name: 'Protecție Solară', kw: ['spf', 'solar', 'sun=', 'sunscreen', 'protectie solara', 'uv='] },
    { slug: 'demachiant-curatare', name: 'Demachiant & Curățare', kw: ['demachi', 'micelar', 'micellar', 'curatare', 'curatarea', 'cleanser', 'cleansing', 'tonic', 'toner', 'exfoli', 'peeling', 'scrub', 'apa termala', 'ape termale'] },
    { slug: 'contur-ochi', name: 'Contur Ochi', kw: ['contur ochi', 'conturul ochilor', 'zona ochilor', 'eye cream', 'eye contour', 'ser ochi', 'crema de ochi', 'pentru ochi', 'anticearcan', 'cearcan'] },
    { slug: 'acnee-imperfectiuni', name: 'Acnee & Imperfecțiuni', kw: ['acnee', 'acneic', 'acne', 'imperfectiun', 'sebo', 'pori=', 'cosuri', 'spot patch', 'blemish', 'comedoane', 'matifiant'] },
    { slug: 'crema-de-zi', name: 'Cremă de Zi', kw: ['crema de zi', 'creme de zi', 'day cream', 'creme pentru ten', 'crema de fata', 'crema fata', 'creme faciale'] },
    { slug: 'dispozitive-faciale', name: 'Dispozitive Faciale', kw: ['foreo', 'electro=', 'terapie prin lumina', 'galvanic', 'perie faciala', 'aparat', 'dispozitiv', 'led='] },
  ],

  'ingrijire-corp': [
    { slug: 'gel-de-dus', name: 'Gel de Duș', kw: ['gel de dus', 'geluri de dus', 'dus=', 'shower', 'gel de baie', 'spuma de baie', 'spumante de baie', 'bath', 'bila de baie', 'bile de baie', 'sare de baie'] },
    { slug: 'lotiune-crema-corp', name: 'Loțiune & Cremă de Corp', kw: ['lotiune de corp', 'lotiune corp', 'lotiuni', 'crema de corp', 'crema corp', 'creme de corp', 'crema hidratanta corp', 'body lotion', 'body cream', 'body milk', 'unt de corp', 'body butter', 'lapte de corp', 'lapte corp', 'balsam de corp'] },
    { slug: 'deodorant', name: 'Deodorant', kw: ['deodorant', 'antiperspirant', 'deo='] },
    { slug: 'sapun', name: 'Săpun', kw: ['sapun', 'soap'] },
    { slug: 'maini-picioare', name: 'Mâini & Picioare', kw: ['maini', 'hand=', 'picioare', 'foot=', 'calcai', 'unghii', 'pedichiur'] },
    { slug: 'ingrijire-intima', name: 'Îngrijire Intimă', kw: ['intim'] },
    { slug: 'exfoliant-corp', name: 'Exfoliant Corp', kw: ['scrub', 'exfoli', 'peeling'] },
    { slug: 'anticelulita-vergeturi', name: 'Anticelulită & Vergeturi', kw: ['celulit', 'vergetur', 'stretch mark'] },
    { slug: 'protectie-solara-corp', name: 'Protecție Solară Corp', kw: ['spf', 'solar', 'protectie solara', 'sun=', 'autobronz', 'dupa plaja', 'after sun'] },
    { slug: 'igiena-feminina', name: 'Igienă Feminină', kw: ['absorbant', 'tampoane', 'tampon', 'igiena feminina', 'menstrual', 'protej'] },
    { slug: 'uleiuri-corp-masaj', name: 'Uleiuri de Corp & Masaj', kw: ['ulei de corp', 'ulei corp', 'ulei de masaj', 'uleiuri pentru masaj', 'masaj', 'body oil', 'spray de corp', 'spray pentru corp', 'body mist'] },
    { slug: 'epilare', name: 'Epilare', kw: ['epila', 'depila', 'ceara de epilat', 'benzi depilatoare', 'aparat de ras femei'] },
    { slug: 'anti-tantari', name: 'Anti-Țânțari', kw: ['tantari', 'insecte', 'repelent'] },
  ],

  'ingrijire-par': [
    { slug: 'sampon', name: 'Șampon', kw: ['sampon', 'shampoo'] },
    { slug: 'balsam-de-par', name: 'Balsam de Păr', kw: ['balsam', 'conditioner'] },
    { slug: 'masca-de-par', name: 'Mască de Păr', kw: ['masca=', 'masti=', 'mask=', 'hair mask'] },
    { slug: 'ser-ulei-de-par', name: 'Ser & Ulei de Păr', kw: ['ser=', 'serum', 'seruri', 'ulei', 'oil=', 'fara clatire', 'leave in', 'tratament'] },
    { slug: 'vopsea-de-par', name: 'Vopsea de Păr', kw: ['vopsea', 'colorant', 'hair color', 'nuanta', 'henna', 'decolor'] },
    { slug: 'styling', name: 'Styling', kw: ['fixativ', 'spuma de par', 'gel de par', 'ceara', 'wax=', 'styling', 'spray de par', 'hairspray', 'pasta de par', 'pomada', 'protectie termica', 'texturizant'] },
    { slug: 'tratament-anticadere', name: 'Tratament Anticădere', kw: ['cadere', 'anticadere', 'hair loss', 'caderea parului', 'activatori de crestere', 'cresterea parului'] },
    { slug: 'aparate-de-coafat', name: 'Aparate de Coafat', kw: ['uscator', 'uscatoare', 'placa', 'placi', 'ondulator', 'perie cu aer', 'perii cu aer', 'multistyler', 'hair dryer', 'straightener', 'produse electronice', 'perie ionica', 'bigudiuri'] },
    { slug: 'perii-accesorii', name: 'Perii & Accesorii', kw: ['perie', 'perii', 'pieptene', 'pieptan', 'piepteni', 'agrafe', 'elastic', 'accesorii pentru par', 'accesorii par', 'clama', 'cordelut', 'bonete', 'prosoape de par'] },
  ],

  machiaj: [
    { slug: 'fond-de-ten', name: 'Fond de Ten', kw: ['fond de ten', 'foundation', 'bb cream', 'cc cream', 'skin tint', 'crema tonica', 'crema tonifianta', 'tinted'] },
    { slug: 'corector-pudra', name: 'Corector & Pudră', kw: ['corector', 'concealer', 'pudra', 'powder', 'primer', 'baza de machiaj', 'baza pentru machiaj', 'fixator', 'fixare machiaj', 'anticearcan'] },
    { slug: 'rimel', name: 'Rimel', kw: ['rimel', 'mascara'] },
    { slug: 'ruj-luciu-de-buze', name: 'Ruj & Luciu de Buze', kw: ['ruj=', 'lipstick', 'luciu', 'gloss', 'lip=', 'lips=', 'buze', 'lip balm'] },
    { slug: 'fard-de-pleoape', name: 'Fard de Pleoape', kw: ['fard de pleoape', 'farduri de ochi', 'fard de ochi', 'eyeshadow', 'eye shadow', 'paleta', 'palette'] },
    { slug: 'eyeliner-creion', name: 'Eyeliner & Creion', kw: ['eyeliner', 'eye liner', 'creion', 'kohl', 'khol', 'pencil', 'tus='] },
    { slug: 'blush-bronzer', name: 'Blush & Bronzer', kw: ['blush', 'fard de obraz', 'bronz', 'iluminator', 'highlighter', 'contour', 'autobronz'] },
    { slug: 'sprancene', name: 'Sprâncene', kw: ['spranc', 'brow=', 'brows=', 'eyebrow'] },
    { slug: 'oja-unghii', name: 'Ojă & Unghii', kw: ['oja=', 'oja semipermanenta', 'lac de unghii', 'unghi', 'nail', 'manichiur', 'cuticul', 'acetona', 'dizolvant', 'pile='] },
    { slug: 'pensule-accesorii', name: 'Pensule & Accesorii', kw: ['pensul', 'burete', 'bureti', 'oglind', 'foarfec', 'pila=', 'geanta cosmetic', 'genti cosmetice', 'ascutitoare', 'brush=', 'gene false', 'accesorii make up', 'penseta'] },
    { slug: 'seturi-machiaj', name: 'Seturi Machiaj', kw: ['set=', 'seturi', 'set cadou', 'calendar', 'advent', 'kit=', 'truse'] },
  ],

  'igiena-orala': [
    { slug: 'pasta-de-dinti', name: 'Pastă de Dinți', kw: ['pasta de dinti', 'paste de dinti', 'pasta dinti', 'pasta dentara', 'pasta gel', 'toothpaste', 'gel dentar', 'crema dentara'] },
    { slug: 'periute-de-dinti', name: 'Periuțe de Dinți', kw: ['periuta', 'periute', 'toothbrush', 'perie de dinti'] },
    { slug: 'periute-electrice-rezerve', name: 'Periuțe Electrice & Rezerve', kw: ['electric', 'rezerve', 'capete', 'sonic', 'oral b', 'irigator', 'dus bucal', 'dusuri bucale'] },
    { slug: 'apa-de-gura', name: 'Apă de Gură', kw: ['apa de gura', 'mouthwash', 'gargara', 'spray bucal', 'spray oral', 'clatire orala'] },
    { slug: 'ata-dentara-interdentare', name: 'Ață Dentară & Interdentare', kw: ['ata dentara', 'interdent', 'floss', 'scobitor'] },
    { slug: 'albire-dentara', name: 'Albire Dentară', kw: ['albire', 'albirea', 'whitening', 'white='] },
    { slug: 'proteze-dentare', name: 'Proteze Dentare', kw: ['protez', 'adeziv', 'corega', 'fixodent', 'protefix'] },
  ],

  parfumuri: [
    { slug: 'parfumuri-dama', name: 'Parfumuri Damă', kw: ['dama', 'femei', 'women', 'woman', 'pour femme', 'femme=', 'her='] },
    { slug: 'parfumuri-barbati', name: 'Parfumuri Bărbați', kw: ['barbati', 'barbat', 'men=', 'man=', 'homme', 'pour homme', 'him='] },
    { slug: 'parfumuri-unisex', name: 'Parfumuri Unisex', kw: ['unisex'] },
    { slug: 'eau-de-parfum', name: 'Eau de Parfum', kw: ['eau de parfum', 'edp=', 'apa de parfum'] },
    { slug: 'eau-de-toilette', name: 'Eau de Toilette', kw: ['eau de toilette', 'edt=', 'apa de toaleta'] },
    { slug: 'lumanari-parfum-de-casa', name: 'Lumânări & Parfum de Casă', kw: ['lumanare', 'lumanari', 'candle', 'difuzor', 'difuzoar', 'diffuser', 'parfum de camera', 'parfumuri pentru casa', 'betisoare', 'reed=', 'home fragrance', 'odorizant', 'wax melt', 'reumplere', 'rezerva', 'parfum auto', 'parfum pentru masina', 'lampa catalitic', 'tamaie', 'bakhoor', 'ulei esential', 'margele parfumate', 'parfumuri pentru textile'] },
    { slug: 'seturi-cadou', name: 'Seturi Cadou', kw: ['set=', 'seturi', 'gift', 'cadou', 'coffret'] },
    { slug: 'mostre-miniaturi', name: 'Mostre & Miniaturi', kw: ['mostra', 'sample', 'decant', 'miniatur', 'travel'] },
  ],

  'mama-si-copilul': [
    { slug: 'ingrijire-bebelusi', name: 'Îngrijire Bebeluși', kw: ['bebe', 'baby', 'nou nascut', 'infant', 'copii', 'kids', 'iritatii', 'crema de scutec', 'junior', 'scuame', 'ingrijire corp', 'ingrijire par', 'sampoane bebelusi', 'unguente'] },
    { slug: 'scutece-servetele', name: 'Scutece & Șervețele', kw: ['scutec', 'servetel', 'wipes', 'diaper', 'pampers', 'chilotei'] },
    { slug: 'biberoane-suzete', name: 'Biberoane & Suzete', kw: ['biberon', 'suzet', 'tetina', 'tetine', 'bottle', 'pacifier'] },
    { slug: 'alaptare', name: 'Alăptare', kw: ['alaptare', 'pompa de san', 'pompe de san', 'pompa san', 'breast', 'pentru san', 'pentru sani', 'lapte matern', 'mamelo'] },
    { slug: 'lapte-praf-hrana', name: 'Lapte Praf & Hrană', kw: ['lapte praf', 'formula de lapte', 'formule speciale', 'piure', 'cereale', 'hrana', 'gustare', 'biscuiti', 'meniu bebelusi', 'paste pentru bebelusi', 'iaurt'] },
    { slug: 'sarcina', name: 'Sarcină', kw: ['sarcin', 'prenatal', 'gravid', 'acid folic', 'folic', 'ovulatie', 'maternitate'] },
    { slug: 'vitamine-copii', name: 'Vitamine Copii', kw: ['vitamin', 'multivitamin', 'sirop', 'picaturi', 'omega', 'probiotic', 'imun', 'picaturi colici', 'tuse'] },
    { slug: 'ingrijire-mama', name: 'Îngrijire Mama', kw: ['lanolin', 'perineal', 'intim', 'postnatal', 'vergetur', 'masaj', 'centura gravide'] },
    { slug: 'hranire-copii', name: 'Hrănire Copii', kw: ['cana=', 'cani=', 'pahar', 'caserol', 'farfuri', 'bol=', 'lingurit', 'tacamuri', 'snack', 'vesela', 'sticla', 'sticle', 'recipiente', 'bavet'] },
    { slug: 'siguranta-camera-copilului', name: 'Siguranță & Camera Copilului', kw: ['siguranta', 'camera copilului', 'tarc', 'termometr', 'aspirator nazal', 'aspiratoare nazale', 'monitor', 'umidificator', 'paturic', 'casti antifonice'] },
    { slug: 'jucarii', name: 'Jucării', kw: ['jucari', 'centru de activitati', 'inel gingival', 'inele gingivale'] },
  ],

  'cosmetice-barbati': [
    { slug: 'ras-barbierit', name: 'Ras & Barbierit', kw: ['ras=', 'spuma de ras', 'spume de ras', 'gel de ras', 'crema de ras', 'shaving', 'shave', 'lame', 'barbierit', 'pamatuf'] },
    { slug: 'after-shave', name: 'After Shave', kw: ['after shave', 'aftershave', 'dupa ras', 'dupa barbierit'] },
    { slug: 'barba', name: 'Barbă', kw: ['barba=', 'barbii', 'beard', 'mustata'] },
    { slug: 'ingrijire-fata', name: 'Îngrijire Față', kw: ['crema', 'creme', 'gel=', 'fata', 'face=', 'antirid', 'hidratant'] },
    { slug: 'deodorant-parfum', name: 'Deodorant & Parfum', kw: ['deodorant', 'antiperspirant', 'parfum', 'eau de'] },
    { slug: 'aparate-de-ras-tuns', name: 'Aparate de Ras & Tuns', kw: ['aparat de ras', 'aparat de barbierit', 'aparat de tuns', 'aparate de ras', 'trimmer', 'masina de tuns', 'shaver', 'clipper'] },
  ],

  wellness: [
    { slug: 'detox', name: 'Detox', kw: ['detoxmed', 'program detox', 'healthymed', 'imunomed', 'cold press', 'suc presat', 'suc natural', 'sucuri naturale', 'ceai detoxifiant', 'detoxifiere', 'nutritie detox'] },
    { slug: 'cafea', name: 'Cafea', kw: ['cafea boabe', 'cafea macinata', 'cafea solubila', 'cafea verde', 'single origin', 'de specialitate', 'espresso', 'decaf', 'nutritie cafea', 'inlocuitori cafea'] },
    { slug: 'ceaiuri', name: 'Ceaiuri', kw: ['ceai', 'tea=', 'matcha', 'infuzie'] },
    { slug: 'nutritie-sanatoasa', name: 'Nutriție Sănătoasă', kw: ['nutritie sanatoasa', 'bio si wellness', 'dieta si nutritie', 'ulei de cocos', 'seminte', 'superfood', 'faina', 'indulcitor', 'miere', 'fulgi', 'batoane', 'cacao', 'spirulina', 'chia', 'sirop de', 'fara gluten', 'nuci', 'fructe uscate'] },
    { slug: 'uleiuri-esentiale', name: 'Uleiuri Esențiale', kw: ['ulei esential', 'uleiuri esentiale', 'aromaterapie', 'difuzoare aromaterapie'] },
  ],

  'cuplu-intimitate': [
    { slug: 'prezervative', name: 'Prezervative', kw: ['prezervativ', 'condom'] },
    { slug: 'lubrifianti', name: 'Lubrifianți', kw: ['lubrifiant', 'lubricant'] },
    { slug: 'jucarii-intime', name: 'Jucării Intime', kw: ['vibrator', 'vibratoare', 'stimulator', 'jucari', 'masturbator', 'accesorii sexuale'] },
    { slug: 'uleiuri-de-masaj', name: 'Uleiuri de Masaj', kw: ['ulei de masaj', 'masaj', 'massage'] },
    { slug: 'fertilitate', name: 'Fertilitate', kw: ['fertilit', 'conceptie', 'infertilitate'] },
    { slug: 'potenta-libido', name: 'Potență & Libido', kw: ['potenta', 'erect', 'libido', 'sex power', 'afrodisiac'] },
  ],

  'dispozitive-medicale': [
    { slug: 'ciorapi-compresivi', name: 'Ciorapi Compresivi', kw: ['ciorapi compresiv', 'compresie', 'compresivi', 'ciorapi medicinali'] },
    { slug: 'plasturi-pansamente', name: 'Plasturi & Pansamente', kw: ['plastur', 'pansament', 'fasa', 'fesi', 'bandaj', 'compres', 'consumabile medicale', 'prim ajutor'] },
    { slug: 'incontinenta', name: 'Incontinență', kw: ['incontinent', 'scutece pentru adulti', 'scutece adulti', 'aleze', 'protectii pat'] },
    { slug: 'aparate-medicale', name: 'Aparate Medicale', kw: ['tensiometr', 'termometr', 'nebulizator', 'aerosol', 'pulsoximetr', 'glucometr', 'aparatura medicala', 'aparate medicale', 'cantar', 'inhalator'] },
    { slug: 'teste-rapide', name: 'Teste Rapide', kw: ['test=', 'teste', 'test rapid'] },
    { slug: 'mobilitate-ortopedie', name: 'Mobilitate & Ortopedie', kw: ['carj', 'cadru de mers', 'baston', 'orteza', 'orteze', 'scaun cu rotile', 'dispozitive ajutatoare', 'genunchier', 'glezn', 'ortoped', 'recuperare', 'deplasare', 'talonet', 'branturi'] },
    { slug: 'dezinfectare-protectie', name: 'Dezinfectare & Protecție', kw: ['dezinfect', 'manusi', 'antiseptic', 'masti de protectie'] },
  ],
};

export function getTipuri(categorySlug) {
  return tipuri[categorySlug] || [];
}

export function getTip(categorySlug, tipSlug) {
  return getTipuri(categorySlug).find((t) => t.slug === tipSlug);
}
