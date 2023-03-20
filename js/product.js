const urlSearchParams = new URLSearchParams(window.location.search);
const id = urlSearchParams.get("id");

// Utilisation de fetch pour récupérer les données du produit depuis le serveur
async function fetchProduct() {
  await fetch(`http://localhost:3000/api/products/${id}`)
    .then((response) => response.json())
    .then((data) => {
      console.log("Product data:", data);
      productDisplay(data);
    });
}
  // Récupère les éléments HTML nécessaires à l'affichage des données du produit

function productDisplay(productDatas) {

  showDatas(productDatas);

  showColors(productDatas);

  // Ajoute un écouteur d'événement au bouton "Ajouter au panier"
  const addToCartButton = document.querySelector("#addToCart");
  addToCartButton.addEventListener("click", function () {
    manageCart(productDatas);
  });
}

function showDatas(productDatas){
  const title = document.querySelector("#title");
  const price = document.querySelector("#price");
  const description = document.querySelector("#description");
  const img = document.querySelector(".item__img");
  
  // Affiche les données du produit dans les éléments HTML correspondants
  title.innerText = productDatas.name;
  document.title = productDatas.name;
  price.innerText = productDatas.price;
  description.innerText = productDatas.description;
  
  const imgTag = document.createElement("img");
  imgTag.src = productDatas.imageUrl;
  imgTag.alt = productDatas.name;
  imgTag.title = productDatas.name;
  img.append(imgTag); 
}

function showColors(productDatas){
  // Récupère les couleurs disponibles pour le produit et on les ajoute à une liste déroulante sur la page HTML
  const colors = productDatas.colors;
  const colorSelect = document.querySelector("#colors");
  for (let color of colors) {
    const colorOption = document.createElement("option");
    colorOption.value = color;
    colorOption.innerText = color;
    colorSelect.append(colorOption);
  }
}
function manageCart(productDatas) {
  if(hasErrors()) {
    // Si tout est correct, on récupère le contenu du panier depuis le stockage local ou on crée un tableau vide s'il n'existe pas encore
    let cart = getCart();
    addProduct(cart, productDatas);
  }
}

function hasErrors() {
  let errorCounter = getErrorsCounter();

  // Si au moins un champ est manquant ou incorrect, affichage  d'un message d'erreur
  if (errorCounter > 0) {
    alert("Veuillez remplir tous les champs requis.");
    return false
  }
  return true
}

function getErrorsCounter() {
  // Récupère la quantité et la couleur sélectionnées par l'utilisateur
  const quantity = document.querySelector("#quantity").value;
  const color = document.querySelector("#colors").value;

  let errorCounter = 0;
  // Vérifie si la quantité n'est pas vide ou égale à zéro
  if (checkQuantity(quantity)) {
    errorCounter++;
  }

  // Vérifie si la couleur a été sélectionnée
  if (checkColor(color)) {
    errorCounter++;
  }
  return errorCounter;
}

function checkColor(color) {
  return !color
}

function checkQuantity(quantity){
  return (!quantity || quantity <= 0)
}

function getCart() {
  return JSON.parse(localStorage.getItem("cart")) || [];
}

function addProduct(cart, productDatas) {
  const quantity = document.querySelector("#quantity").value;
  const color = document.querySelector("#colors").value;

  let product = {
    id: productDatas._id,
    quantity: parseInt(quantity),
    color: color,
  };

  let temp = isProductInCart(cart, product);

  if (temp === false) {
    if (getCartQuantity(cart) + parseInt(quantity) <= 100) {
      addProductToCart(cart, product);
    } else {
      alert("Le nombre de produits dans votre panier ne peut pas dépasser 100.");
    }
  } else {
    let confirmAdd = confirm(
      "Ce produit est déjà dans votre panier. Voulez-vous l'ajouter?"
    );
    if (confirmAdd) {
      if (getCartQuantity(cart) + parseInt(quantity) <= 100) {
        cart[temp].quantity += parseInt(quantity);
        saveCart(cart);
        alert("Ajouté au panier avec succès.");
      } else {
        alert("Le nombre de produits dans votre panier ne peut pas dépasser 100.");
      }
    }
  }
  saveCart(cart);
}

function isProductInCart(cart, product) {
  // Vérifie si un produit avec la même ID et la même couleur est déjà présent dans le panier
  for (let i = 0; i < cart.length; i++) {
    if (cart[i].id === product.id && cart[i].color === product.color) {
      return i;
    }
  }
  return false;
}

function getCartQuantity(cart) {
  return cart.reduce((acc, item) => acc + item.quantity, 0);
}

function saveCart(cart) {
  localStorage.setItem("cart", JSON.stringify(cart));
}

function addProductToCart(cart, product) {
  // Ajoute un produit au panier et affiche un message de confirmation
  cart.push(product);
  alert("Le produit a été ajouté au panier avec succès.");
}


console.log("ID:", id);
window.addEventListener("load", fetchProduct);
