// Fonction qui effectue une requête pour récupérer les produits depuis l'API
async function fetchProducts() {
  // Effectue une requête GET vers l'URL pour récupérer les produits
  await fetch("http://localhost:3000/api/products")
    // Transforme la réponse en objet JavaScript
    .then(response => response.json())
    // Appelle la fonction productDisplay avec les données obtenues
    .then(data => productDisplay(data));
}

// Fonction qui affiche les produits sur la page
function productDisplay(productDatas) {
  // Sélectionne le conteneur des produits
  const productContainer = document.querySelector(".items");
  // Pour chaque produit dans les données
  productDatas.forEach(element => {
    // Crée un élément "a" qui représente un lien vers la page de produit
    const a = document.createElement("a");
    a.href = "product.html?id=" + element._id;
    a.classList.add("product-card");

    // Crée un élément "article" pour contenir les informations sur le produit
    const article = document.createElement("article");
    a.append(article);

    // Crée une image pour représenter le produit
    const img = document.createElement("img");
    img.src = element.imageUrl;
    img.alt = element.name;
    img.title = element.name;
    article.append(img);

    // Crée un élément "h3" pour afficher le nom du produit
    const h3 = document.createElement("h3");
    h3.innerText = element.name;
    h3.classList.add("productName");
    article.append(h3);

    // Crée un élément "p" pour afficher la description du produit
    const pDescription = document.createElement("p");
    pDescription.innerText = element.description;
    pDescription.classList.add("productDescription");
    article.append(pDescription);
    
    // Ajoute le lien vers la page de produit au conteneur de produits
    productContainer.append(a);
  });
}

// Écoute l'événement "load" sur la fenêtre pour appeler la fonction fetchProducts
window.addEventListener("load", fetchProducts);
