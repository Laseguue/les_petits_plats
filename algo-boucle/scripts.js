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

function montrerRecettes(listeRecettes) {
  const zoneRecettes = document.getElementById('recipes');
  const compteurRecettes = document.getElementById('recipe-counter');
  zoneRecettes.innerHTML = '';

  compteurRecettes.textContent = listeRecettes.length === 1 
    ? "1 recette" 
    : `${listeRecettes.length} recettes`;

  listeRecettes.forEach(recette => {
    const carteRecette = document.createElement('div');
    carteRecette.classList.add('recipe-card');
    
    const imageRecette = document.createElement('img');
    imageRecette.src = `img/${recette.image}`;
    imageRecette.alt = recette.name;
    
    const badgeTemps = document.createElement('div');
    badgeTemps.classList.add('time-badge');
    badgeTemps.textContent = `${recette.time} min`;
    
    const titreRecette = document.createElement('h3');
    titreRecette.textContent = recette.name;
    
    const titreDescription = document.createElement('h5');
    titreDescription.textContent = 'Recette :';
    
    const descriptionRecette = document.createElement('p');
    descriptionRecette.classList.add('description');
    descriptionRecette.textContent = recette.description;
    
    const titreIngredients = document.createElement('h5');
    titreIngredients.textContent = 'Ingrédients :';
    
    const listeIngredients = document.createElement('ul');
    recette.ingredients.forEach(ingredient => {
      const itemIngredient = document.createElement('li');
      
      const nomIngredient = document.createElement('span');
      nomIngredient.classList.add('ingredient-name');
      nomIngredient.textContent = ingredient.ingredient;
      
      const quantiteIngredient = document.createElement('span');
      quantiteIngredient.classList.add('ingredient-quantity');
      if (ingredient.quantity) {
        quantiteIngredient.textContent = `${ingredient.quantity} ${ingredient.unit || ''}`;
      } else {
        quantiteIngredient.textContent = 'Quantité non spécifiée';
      }
      
      itemIngredient.appendChild(nomIngredient);
      itemIngredient.appendChild(document.createElement('br'));
      itemIngredient.appendChild(quantiteIngredient);
      
      listeIngredients.appendChild(itemIngredient);
    });
    
    const contenuRecette = document.createElement('div');
    contenuRecette.classList.add('recipe-card-content');
    contenuRecette.append(titreRecette, titreDescription, descriptionRecette, titreIngredients, listeIngredients);
    
    carteRecette.append(imageRecette, badgeTemps, contenuRecette);
    zoneRecettes.appendChild(carteRecette);
  });
}

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
  bouton.textContent = label;
  bouton.addEventListener("click", () => {
    dropdown.classList.toggle("show");
  });

  const dropdown = document.createElement("div");
  dropdown.classList.add("filter-dropdown");

  const champRecherche = document.createElement("input");
  champRecherche.type = "text";
  champRecherche.placeholder = "Rechercher...";
  champRecherche.addEventListener("input", () => {
    const recherche = champRecherche.value.toLowerCase();
    listeOptions.childNodes.forEach(option => {
      option.style.display = option.textContent.toLowerCase().includes(recherche) ? "block" : "none";
    });
  });

  const listeOptions = document.createElement("ul");

  dropdown.appendChild(champRecherche);
  dropdown.appendChild(listeOptions);
  container.appendChild(bouton);
  container.appendChild(dropdown);

  return container;
}

const zoneFiltres = document.getElementById("filters");
const filtreIngredient = creerFiltre("ingredient", "Ingrédients", "ingredients");
const filtreAppareil = creerFiltre("appliance", "Appareils", "appliances");
const filtreUstensile = creerFiltre("utensil", "Ustensiles", "ustensils");
zoneFiltres.append(filtreIngredient, filtreAppareil, filtreUstensile);

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

function obtenirRecettesFiltrees() {
  const startTime = performance.now();
  const recherche = champRecherche.value.trim().toLowerCase();
  const recettesFiltrees = [];

  for (let i = 0; i < recipes.length; i++) {
    const recette = recipes[i];

    let matchRecherche = !recherche;
    if (recherche) {
      const nom = recette.name.toLowerCase();
      if (nom.includes(recherche)) {
        matchRecherche = true;
      } else {
        const desc = recette.description.toLowerCase();
        if (desc.includes(recherche)) {
          matchRecherche = true;
        } else {
          for (const ing of recette.ingredients) {
            if (ing.ingredient.toLowerCase().includes(recherche)) {
              matchRecherche = true;
              break;
            }
          }
        }
      }
    }
    if (!matchRecherche) continue;

    const ingredientsRecette = new Set(recette.ingredients.map(ing => ing.ingredient.toLowerCase()));
    let matchIngredients = tagsSelectionnes.ingredients.size === 0;
    if (tagsSelectionnes.ingredients.size > 0) {
      matchIngredients = true;
      for (const tag of tagsSelectionnes.ingredients) {
        if (!ingredientsRecette.has(tag)) {
          matchIngredients = false;
          break;
        }
      }
    }
    if (!matchIngredients) continue;

    const appareilRecette = recette.appliance.toLowerCase();
    let matchAppareils = tagsSelectionnes.appliances.size === 0;
    if (tagsSelectionnes.appliances.size > 0) {
      matchAppareils = true;
      for (const tag of tagsSelectionnes.appliances) {
        if (appareilRecette !== tag) {
          matchAppareils = false;
          break;
        }
      }
    }
    if (!matchAppareils) continue;

    const ustensilesRecette = new Set(recette.ustensils.map(ust => ust.toLowerCase()));
    let matchUstensiles = tagsSelectionnes.ustensils.size === 0;
    if (tagsSelectionnes.ustensils.size > 0) {
      matchUstensiles = true;
      for (const tag of tagsSelectionnes.ustensils) {
        if (!ustensilesRecette.has(tag)) {
          matchUstensiles = false;
          break;
        }
      }
    }
    if (!matchUstensiles) continue;

    recettesFiltrees.push(recette);
  }

  const endTime = performance.now();
  console.log(`temps de chargement : ${endTime - startTime} ms`);
  return recettesFiltrees;
}

function mettreAJourAffichageRecettes() {
  const recettesFiltrees = obtenirRecettesFiltrees();
  montrerRecettes(recettesFiltrees);
  const optionsDisponibles = collecterOptionsDisponibles(recettesFiltrees);
  mettreAJourFiltres(optionsDisponibles);
}

champRecherche.addEventListener('input', () => {
  if (champRecherche.value.trim().length >= 3) {
    mettreAJourAffichageRecettes();
  } else {
    mettreAJourAffichageRecettes();
  }
});

montrerRecettes(recipes);
const toutesOptions = collecterOptionsDisponibles(recipes);
mettreAJourFiltres(toutesOptions);



function runPerformanceTests() {
  console.log('=== Début des tests de performance ===');
  const tempsExecutions = []; 
  
  console.log('Test 1 - Recherche simple par nom');
  champRecherche.value = 'citron';
  tagsSelectionnes.ingredients.clear();
  tagsSelectionnes.appliances.clear();
  tagsSelectionnes.ustensils.clear();
  let startTime = performance.now();
  let result1 = obtenirRecettesFiltrees();
  let endTime = performance.now();
  let temps1 = endTime - startTime;
  tempsExecutions.push(temps1);
  console.log(`Temps de filtrage : ${temps1.toFixed(2)}ms, ${result1.length} résultats`);

  console.log('\nTest 2 - Filtres multiples');
  champRecherche.value = '';
  tagsSelectionnes.ingredients.add('carotte');
  tagsSelectionnes.appliances.add('mixer');
  tagsSelectionnes.ustensils.add('couteau');
  startTime = performance.now();
  let result2 = obtenirRecettesFiltrees();
  endTime = performance.now();
  let temps2 = endTime - startTime;
  tempsExecutions.push(temps2);
  console.log(`Temps de filtrage : ${temps2.toFixed(2)}ms, ${result2.length} résultats`);

  console.log('\nTest 3 - Recherche complexe avec filtres');
  champRecherche.value = 'poisson';
  tagsSelectionnes.ingredients.add('carotte');
  tagsSelectionnes.ingredients.add('tomate');
  startTime = performance.now();
  let result3 = obtenirRecettesFiltrees();
  endTime = performance.now();
  let temps3 = endTime - startTime;
  tempsExecutions.push(temps3);
  console.log(`Temps de filtrage : ${temps3.toFixed(2)}ms, ${result3.length} résultats`);

  const moyenne = tempsExecutions.reduce((sum, temps) => sum + temps, 0) / tempsExecutions.length;
  console.log(`\nMoyenne des temps d'exécution : ${moyenne.toFixed(2)}ms`);

  champRecherche.value = '';
  tagsSelectionnes.ingredients.clear();
  tagsSelectionnes.appliances.clear();
  tagsSelectionnes.ustensils.clear();
  
  console.log('=== Fin des tests ===');
}

window.runPerformanceTests = runPerformanceTests;
runPerformanceTests()