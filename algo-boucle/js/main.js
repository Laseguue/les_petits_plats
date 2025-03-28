const champRecherche = document.getElementById('search-input');
const boutonEffacer = document.getElementById('clear-btn');

champRecherche.addEventListener('input', () => {
  boutonEffacer.style.display = champRecherche.value.trim() !== '' ? 'flex' : 'none';
});

boutonEffacer.addEventListener('click', () => {
  champRecherche.value = '';
  boutonEffacer.style.display = 'none';
  champRecherche.focus();
  mettreAJourAffichageRecettes();
});

const zoneFiltres = document.getElementById("filters");
const filtreIngredient = creerFiltre("ingredient", "Ingrédients", "ingredients");
const filtreAppareil = creerFiltre("appliance", "Appareils", "appliances");
const filtreUstensile = creerFiltre("utensil", "Ustensiles", "ustensils");
zoneFiltres.append(filtreIngredient, filtreAppareil, filtreUstensile);

montrerRecettes(recipes);
const toutesOptions = collecterOptionsDisponibles(recipes);
mettreAJourFiltres(toutesOptions);

champRecherche.addEventListener('input', () => {
  if (champRecherche.value.trim().length >= 3) {
    mettreAJourAffichageRecettes();
  } else {
    montrerRecettes(recipes);
  }
});

runPerformanceTests();
