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
      titreDescription.textContent = 'Description :';
      
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
  