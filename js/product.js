/**
 * // Récupère l'identifiant du produit depuis les paramètres de l'URL
 * @date 29/03/2023 - 18:40:41
 *
 * @type {*}
 */
const urlSearchParams = new URLSearchParams(window.location.search);
const id = urlSearchParams.get("id");

/**
 * // Utilisation de fetch pour récupérer les données du produit depuis le serveur
 * @date 29/03/2023 - 18:41:48
 *
 * @async
 * @returns {*}
 */
async function fetchProduct() {
  await fetch(`http://localhost:3000/api/products/${id}`)
    .then((response) => response.json())
    .then((data) => {
      console.log("Product data:", data);
      productDisplay(data);
    });
}

/**
 * // Récupère les éléments HTML nécessaires à l'affichage des données du produit

 * @date 29/03/2023 - 18:42:06
 *
 * @param {*} productDatas
 * @returns
 */
function productDisplay(productDatas) {
  showDatas(productDatas);

  showColors(productDatas);

  // Ajoute un écouteur d'événement au bouton "Ajouter au panier"
  const addToCartButton = document.querySelector("#addToCart");
  addToCartButton.addEventListener("click", function () {
    manageCart(productDatas);
  });
}

/**
 * // Récupère les éléments HTML nécessaires à l'affichage des données du produit

 * @date 29/03/2023 - 18:42:57
 *
 * @param {*} productDatas
 */
function showDatas(productDatas) {
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
  img.append(imgTag);
}

/**
 * // Récupère les couleurs disponibles pour le produit et on les ajoute à une liste déroulante sur la page HTML

 * @date 29/03/2023 - 18:43:49
 *
 * @param {*} productDatas
 */
function showColors(productDatas) {
  const colors = productDatas.colors;
  const colorSelect = document.querySelector("#colors");
  for (let color of colors) {
    const colorOption = document.createElement("option");
    colorOption.value = color;
    colorOption.innerText = color;
    colorSelect.append(colorOption);
  }
}



/**
 *   // Si tout est correct, on récupère le contenu du panier depuis le stockage local ou on crée un tableau vide s'il n'existe pas encore

 * @date 27/03/2023 - 20:57:01
 *
 * @param {*} productDatas
 */
function manageCart(productDatas) {
  if (hasErrors()) {
    let cart = getCart();
    addProduct(cart, productDatas);
  }
}

/**
 *  // Si au moins un champ est manquant ou incorrect, affichage  d'un message d'erreur

 * @date 27/03/2023 - 20:57:47
 *
 * @returns {boolean}
 */
function hasErrors() {
  let errorCounter = getErrorsCounter();

  if (errorCounter > 0) {
    alert("Veuillez remplir tous les champs requis.");
    return false;
  }
  return true;
}

/**
 *   // Récupère la quantité et la couleur sélectionnées par l'utilisateur

 * @date 29/03/2023 - 18:44:42
 *
 * @returns {number}
 */
function getErrorsCounter() {
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
  return !color;
}

function checkQuantity(quantity) {
  return !quantity || quantity <= 0;
}

/**
 * // Fonction qui récupère le contenu du panier dans le local storage,ou qui retourne un tableau vide si le panier n'existe pas encore
 * @date 29/03/2023 - 18:45:50
 *
 * @returns {*}
 */
function getCart() {
  return JSON.parse(localStorage.getItem("cart")) || [];
}

/**
 * // Ajoute un produit au panier avec sa quantité et sa couleur, et vérifie la limite de 100 produits dans le panier. Si le produit est déjà présent dans le panier, propose de l'ajouter avec une nouvelle quantité. Enregistre ensuite le panier dans le localStorage.
 * @date 29/03/2023 - 18:47:49
 *
 * @param {*} cart
 * @param {*} productDatas
 */
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
      alert(
        "Le nombre de produits dans votre panier ne peut pas dépasser 100."
      );
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
        alert(
          "Le nombre de produits dans votre panier ne peut pas dépasser 100."
        );
      }
    }
  }
  saveCart(cart);
}

/**
 *   // Vérifie si un produit avec la même ID et la même couleur est déjà présent dans le panier
 * @date 29/03/2023 - 18:48:09
 *
 * @param {*} cart
 * @param {*} product
 * @returns {(number | false)}
 */
function isProductInCart(cart, product) {
  for (let i = 0; i < cart.length; i++) {
    if (cart[i].id === product.id && cart[i].color === product.color) {
      return i;
    }
  }
  return false;
}

/**
 * // Fonction qui calcule la quantité totale des produits dans le panier
 * @date 29/03/2023 - 18:50:25
 *
 * @param {*} cart
 * @returns {*}
 */
function getCartQuantity(cart) {
  return cart.reduce((acc, item) => acc + item.quantity, 0);
}

/**
 * // Enregistre le panier dans le stockage local du navigateur sous forme de chaîne de caractères JSON à l'aide de la méthode "JSON.stringify"
 * @date 29/03/2023 - 18:51:32
 *
 * @param {*} cart
 */
function saveCart(cart) {
  localStorage.setItem("cart", JSON.stringify(cart));
}

/**
 *   // Ajoute un produit au panier et affiche un message de confirmation
 * @date 29/03/2023 - 18:52:08
 *
 * @param {*} cart
 * @param {*} product
 */
function addProductToCart(cart, product) {
  cart.push(product);
  alert("Le produit a été ajouté au panier avec succès.");
}


console.log("ID:", id);
window.addEventListener("load", fetchProduct);
