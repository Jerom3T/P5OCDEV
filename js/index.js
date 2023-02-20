//Variable pour selectionner élément HTML appelé "items"
const productContainer = document.querySelector(".items");

//Variable pour créer un tableau vide (tableau sera rempli avec les données de l'API)
let productDatas = [];

// Fonction asynchrone pour récupérer les données des produits depuis une API
//puis focntion await pour attendre reception des données de l'API et convertit en JSON
//puis stocke ces données dans la variable productData
async function fetchProducts() {
  await fetch("http://localhost:3000/api/products")
    .then((response) => response.json())
    .then((data) => (productDatas = data));
  // Permet de vérifier la dans la console la reception des données dans le tableau
  console.log(productData);
  productDisplay();
}

//Fonction pour afficher les produits dans la page
function productDisplay() {
  //Utilisation de la constante afin d inserer des éléments HTML dans la classe items
  productContainer.innerHTML = productData
    .map(
      //Création d'un éléments "a" pour chaque objet du tableau productDAta
      (kanap) =>
        `
      <a href="product.html?id=${kanap._id}" class="product-card">
        <img src=${kanap.imageUrl} alt="${kanap.altTxt}" title="${kanap.altTxt}">
        <h3>${kanap.name}</h3>
        <p> ${kanap.price} €</p>
        <p> ${kanap.description}</p>
      </a>
    `
    )
    .join("");
}

window.addEventListener("load", fetchProducts);
