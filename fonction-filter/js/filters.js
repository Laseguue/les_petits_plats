function collecterOptionsDisponibles(recettes) {
  const ingredientsDisponibles = new Set();
  const appareilsDisponibles = new Set();
  const ustensilesDisponibles = new Set();

  recettes.forEach(recette => {
    recette.ingredients.forEach(ing => ingredientsDisponibles.add(ing.ingredient.toLowerCase()));
    appareilsDisponibles.add(recette.appliance.toLowerCase());
    recette.ustensils.forEach(ust => ustensilesDisponibles.add(ust.toLowerCase()));
  });

  return {
    ingredients: [...ingredientsDisponibles].sort(),
    appareils: [...appareilsDisponibles].sort(),
    ustensiles: [...ustensilesDisponibles].sort()
  };
}

function creerFiltre(id, label, type) {
  const container = document.createElement("div");
  container.classList.add("filter-container");

  const bouton = document.createElement("button");
  bouton.classList.add("filter-button");
  bouton.innerHTML = `${label} <img class="arrow-icon" src="img/Vector-1.svg" alt="flèche">`;

  const dropdown = document.createElement("div");
  dropdown.classList.add("filter-dropdown");

  bouton.addEventListener("click", () => {
    const isOpen = dropdown.classList.toggle("show");
    const icon = bouton.querySelector('.arrow-icon');
    icon.src = isOpen ? "img/Vector-2.svg" : "img/Vector-1.svg";
    bouton.classList.toggle("dropdown-open", isOpen);
    dropdown.classList.toggle("no-top-border", isOpen);
  });

  const searchWrapper = document.createElement("div");
  searchWrapper.classList.add("filter-search-wrapper");

  const champRecherche = document.createElement("input");
  champRecherche.type = "text";
  champRecherche.placeholder = "Rechercher...";

  const clearIcon = document.createElement("img");
  clearIcon.src = "img/croix.svg";
  clearIcon.alt = "Effacer";
  clearIcon.classList.add("clear-icon");
  clearIcon.style.display = "none";

  const searchIcon = document.createElement("img");
  searchIcon.src = "img/Group-5.svg";
  searchIcon.alt = "Rechercher";
  searchIcon.classList.add("search-icon");

  searchWrapper.appendChild(champRecherche);
  searchWrapper.appendChild(clearIcon);
  searchWrapper.appendChild(searchIcon);

  const listeOptions = document.createElement("ul");

  champRecherche.addEventListener("input", () => {
    clearIcon.style.display = champRecherche.value.trim() !== "" ? "block" : "none";
    const recherche = champRecherche.value.toLowerCase();
    listeOptions.childNodes.forEach(option => {
      option.style.display = option.textContent.toLowerCase().includes(recherche) ? "block" : "none";
    });
  });

  clearIcon.addEventListener("click", () => {
    champRecherche.value = "";
    clearIcon.style.display = "none";
    listeOptions.childNodes.forEach(option => {
      option.style.display = "block";
    });
    champRecherche.focus();
  });

  dropdown.appendChild(searchWrapper);
  dropdown.appendChild(listeOptions);
  container.appendChild(bouton);
  container.appendChild(dropdown);

  return container;
}

function mettreAJourFiltres(optionsDisponibles) {
  mettreAJourFiltre(filtreIngredient, optionsDisponibles.ingredients, 'ingredients');
  mettreAJourFiltre(filtreAppareil, optionsDisponibles.appareils, 'appliances');
  mettreAJourFiltre(filtreUstensile, optionsDisponibles.ustensiles, 'ustensils');
}

function mettreAJourFiltre(filtre, options, type) {
  const listeOptions = filtre.querySelector('ul');
  listeOptions.innerHTML = '';

  const tagsSelectionnesType = tagsSelectionnes[type];
  const optionsAInclure = new Set(options);
  tagsSelectionnesType.forEach(tag => optionsAInclure.add(tag));

  [...optionsAInclure].sort().forEach(valeur => {
    const item = document.createElement("li");
    item.textContent = valeur;
    item.addEventListener("click", () => {
      mettreAJourTags(type, valeur);
      const dropdown = filtre.querySelector('.filter-dropdown');
      dropdown.classList.remove("show");

      const bouton = filtre.querySelector('.filter-button');
      const icon = bouton.querySelector('.arrow-icon');
      icon.src = "img/Vector-1.svg";
      bouton.classList.remove("dropdown-open");
    });
    listeOptions.appendChild(item);
  });
}

const tagsSelectionnes = { ingredients: new Set(), appliances: new Set(), ustensils: new Set() };
const zoneFiltresSelectionnes = document.getElementById('selected-filters');

function mettreAJourAffichageTags() {
  zoneFiltresSelectionnes.innerHTML = '';
  Object.entries(tagsSelectionnes).forEach(([type, tags]) => {
    tags.forEach(tag => {
      const tagElement = document.createElement('div');
      tagElement.classList.add('tag');
      tagElement.innerHTML = `${tag} <span class='remove-tag'>✖</span>`;
      tagElement.querySelector('.remove-tag').addEventListener('click', () => {
        tagsSelectionnes[type].delete(tag);
        mettreAJourAffichageTags();
        mettreAJourAffichageRecettes();
      });
      zoneFiltresSelectionnes.appendChild(tagElement);
    });
  });
}

function mettreAJourTags(type, valeur) {
  tagsSelectionnes[type].has(valeur) ? tagsSelectionnes[type].delete(valeur) : tagsSelectionnes[type].add(valeur);
  mettreAJourAffichageTags();
  mettreAJourAffichageRecettes();
}
