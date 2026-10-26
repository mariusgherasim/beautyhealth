// ============================================================
// GHIDURILE SITE-ULUI — lista pentru pagina /ghiduri/, meniul de sus
// și blocul „Ghiduri utile" de pe paginile de categorie.
// Ghid nou = pagină nouă în src/pages/ghiduri/{slug}.astro + o intrare aici.
//
//   slug        adresa: /ghiduri/{slug}/
//   titlu       titlul cardului
//   descriere   1–2 fraze
//   minute      timp de citit
//   eticheta    categoria afișată pe card (ex: 'Parfumuri')
//   categorii   pe ce pagini de categorie apare în blocul „Ghiduri utile"
//   data        data publicării (AAAA-LL-ZZ) — cele mai noi apar primele
//   emoji       iconița cardului
// ============================================================
export const ghiduri = [
  {
    slug: 'note-parfum-varf-inima-baza',
    titlu: 'Ce înseamnă, de fapt, notele de vârf, inimă și bază',
    descriere: 'Piramida olfactivă explicată simplu: cât ține fiecare notă, piramida a 6 parfumuri celebre și fișa de testare gratuită.',
    minute: 8,
    eticheta: 'Parfumuri',
    categorii: ['parfumuri'],
    data: '2026-10-26',
    emoji: '🌸',
  },
  {
    slug: 'parfum-edp-edt',
    titlu: 'Parfum, Apă de Parfum sau Apă de Toaletă — ce cumperi de fapt?',
    descriere: 'Concentrații, durată și intensitate: diferența reală dintre extrait, EDP, EDT și EDC, cu date din studii.',
    minute: 7,
    eticheta: 'Parfumuri',
    categorii: ['parfumuri'],
    data: '2026-10-10',
    emoji: '🧴',
  },
];

export const ghiduriSortate = () => [...ghiduri].sort((a, b) => b.data.localeCompare(a.data));
export const ghiduriPentru = (categorie) => ghiduriSortate().filter((g) => g.categorii.includes(categorie));
