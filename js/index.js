// Fonction qui effectue une requête pour récupérer les produits depuis l'API
async function fetchProducts() {
  // Effectue une requête GET vers l'URL pour récupérer les produits
  await fetch("http://localhost:3000/api/products")
    .then(response => response.json())
    .then(data => productDisplay(data));
}

// Fonction qui affiche les produits sur la page
function productDisplay(productDatas) {
  const productContainer = document.querySelector(".items");
  productDatas.forEach(element => {

    // Création des différents éléments concernant le produit.

    const a = document.createElement("a");
    a.href = "product.html?id=" + element._id;
    a.classList.add("product-card");

    const article = document.createElement("article");
    a.append(article);

    const img = document.createElement("img");
    img.src = element.imageUrl;
    img.alt = element.name;
    img.title = element.name;
    article.append(img);

    const h3 = document.createElement("h3");
    h3.innerText = element.name;
    h3.classList.add("productName");
    article.append(h3);

    const pDescription = document.createElement("p");
    pDescription.innerText = element.description;
    pDescription.classList.add("productDescription");
    article.append(pDescription);
    
    productContainer.append(a);
  });
}

window.addEventListener("load", fetchProducts);
