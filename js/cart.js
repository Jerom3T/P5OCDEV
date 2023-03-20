// récupère les données du panier depuis le stockage local, ou initialise un tableau vide si aucune donnée n'a été enregistrée
const cart = JSON.parse(localStorage.getItem("cart")) || [];

// sélectionne les éléments HTML pertinents
const cartItems = document.querySelector("#cart__items");
const totalQuantity = document.querySelector("#totalQuantity");
const orderForm = document.querySelector(".cart__order__form");
const totalPrice = document.querySelector("#totalPrice");

// fonction pour supprimer un produit du panier
function deleteProduct(productId, productColor) {
  const newCart = cart.filter((item) => {
    return item.id !== productId || item.color !== productColor;
  });

  // enregistre le nouveau tableau dans le stockage local
  localStorage.setItem("cart", JSON.stringify(newCart));

  // recharge la page pour mettre à jour l'affichage du panier
  location.reload();
}
function createImg(productData) {
  const img = document.createElement("img");
  img.src = productData.imageUrl;
  img.alt = productData.name;
  img.classList.add("cart__item__img");
  return img;
}

function createDescription(productData, item) {
  const description = document.createElement("div");
  description.classList.add("cart__item__content__description");

  const title = document.createElement("h2");
  title.innerText = productData.name;
  description.appendChild(title);

  const color = document.createElement("p");
  color.innerText = `Couleur : ${item.color}`;
  description.appendChild(color);

  const price = document.createElement("p");
  price.innerText = `${productData.price} €`;
  description.appendChild(price);

  return description;
}

function createQuantity(item) {
  const quantity = document.createElement("div");
  quantity.classList.add("cart__item__content__settings__quantity");

  const quantityLabel = document.createElement("p");
  quantityLabel.innerText = "Qté : ";
  quantity.appendChild(quantityLabel);

  const quantityInput = document.createElement("input");
  quantityInput.type = "number";
  quantityInput.min = "1";
  quantityInput.max = "100";
  quantityInput.value = item.quantity;
  quantityInput.classList.add("itemQuantity");
  quantity.appendChild(quantityInput);

  return quantity;
}

function createDeleteItem() {
  const deleteItem = document.createElement("p");
  deleteItem.classList.add("deleteItem");
  deleteItem.innerText = "Supprimer";

  return deleteItem;
}

function createSettings(productData, item) {
  const settings = document.createElement("div");
  settings.classList.add("cart__item__content__settings");

  const quantity = createQuantity(item);
  settings.appendChild(quantity);

  const deleteItem = createDeleteItem();
  settings.appendChild(deleteItem);

  return settings;
}

function createArticle(productData, item) {
  const article = document.createElement("article");
  article.classList.add("cart__item");

  article.setAttribute("data-id", productData._id);
  article.setAttribute("data-color", item.color);

  const img = createImg(productData);
  article.appendChild(img);

  const content = document.createElement("div");
  content.classList.add("cart__item__content");
  article.appendChild(content);

  const description = createDescription(productData, item);
  content.appendChild(description);

  const settings = createSettings(productData, item);
  content.appendChild(settings);

  return article;
}

function setDeleteItemEventListener(deleteItem, itemId, itemColor) {
  deleteItem.addEventListener("click", () => {
    deleteProduct(itemId, itemColor);
  });
}

function calculateQuantityTotal(cart) {
  return {
    quantity: cart.reduce((acc, item) => acc + item.quantity, 0),
    total: cart.reduce((acc, item) => acc + item.quantity * item.price, 0),
  };
}


function setTotalPriceAndQuantity(quantityTotal, priceTotal) {
  totalQuantity.innerText = quantityTotal;

  totalPrice.innerText = `${priceTotal.toFixed(2)} €`;
}

function displayCart() {
  cartItems.innerHTML = "";

  let totalPriceCents = 0;

  const promises = cart.map((item) => {
    return fetch(`http://localhost:3000/api/products/${item.id}`)
      .then((response) => response.json())
      .then((productData) => {
        const article = createArticle(productData, item);

        const itemPrice = productData.price * item.quantity;
        totalPriceCents += itemPrice;

        cartItems.appendChild(article);

        setDeleteItemEventListener(
          article.querySelector(".deleteItem"),
          item.id,
          item.color
        );
      });
  });

  Promise.all(promises).then(() => {
    const quantityTotal = calculateQuantityTotal(cart);
    const priceTotal = totalPriceCents;

    setTotalPriceAndQuantity(quantityTotal, priceTotal);
  });
}

cartItems.addEventListener("change", (event) => {
  if (event.target.classList.contains("itemQuantity")) {
    const itemId = event.target.closest(".cart__item").dataset.id;

    cart.find((item) => item.id === itemId).quantity = parseInt(
      event.target.value
    );

    localStorage.setItem("cart", JSON.stringify(cart));

    updateTotalPrice();
  }
});

displayCart();

async function updateTotalPrice() {
  let totalPriceCents = 0;
  let totalQuantity = 0;

  for (let i = 0; i < cart.length; i++) {
    const item = cart[i];

    const response = await fetch(
      `http://localhost:3000/api/products/${item.id}`
    );
    const productData = await response.json();

    const productPrice = item.quantity * productData.price;

    totalPriceCents += productPrice;
    totalQuantity += item.quantity;
  }

  if (totalQuantity <= 100) {
    document.querySelector("#totalQuantity").innerText = totalQuantity;

    document.querySelector(
      "#totalPrice"
    ).innerText = `${totalPriceCents.toFixed(2)} €`;
  } else {
    alert("Vous ne pouvez pas commander plus de 100 unités d'un même produit.");
  }
}

// Fonction de validation d'une donnée avec une regex
function validateData(data, regex) {
  if (!regex.test(data)) {
    return false;
  }
  return true;
}

// Fonction de vérification des données saisies par l'utilisateur
function validateForm() {
  const firstName = document.getElementById('firstName').value;
  const lastName = document.getElementById('lastName').value;
  const address = document.getElementById('address').value;
  const city = document.getElementById('city').value;
  const email = document.getElementById('email').value;

  const firstNameRegex = /^[A-Za-zÀ-ÖØ-öø-ÿ-]+$/;
  const lastNameRegex = /^[A-Za-zÀ-ÖØ-öø-ÿ-]+$/;
  const addressRegex = /^[0-9]{1,3}\s[A-Za-zÀ-ÖØ-öø-ÿ\s]{3,}$/;
  const cityRegex = /^[A-Za-zÀ-ÖØ-öø-ÿ\s]{2,}$/;
  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  let firstNameError = '';
  let lastNameError = '';
  let addressError = '';
  let cityError = '';
  let emailError = '';

  if (!validateData(firstName, firstNameRegex)) {
    firstNameError = 'Le prénom n\'est pas valide.';
  }
  if (!validateData(lastName, lastNameRegex)) {
    lastNameError = 'Le nom n\'est pas valide.';
  }
  if (!validateData(address, addressRegex)) {
    addressError = 'L\'adresse n\'est pas valide.';
  }
  if (!validateData(city, cityRegex)) {
    cityError = 'La ville n\'est pas valide.';
  }
  if (!validateData(email, emailRegex)) {
    emailError = 'L\'adresse e-mail n\'est pas valide.';
  }

  // Affichage des messages d'erreur si nécessaire
  document.getElementById('firstNameErrorMsg').textContent = firstNameError;
  document.getElementById('lastNameErrorMsg').textContent = lastNameError;
  document.getElementById('addressErrorMsg').textContent = addressError;
  document.getElementById('cityErrorMsg').textContent = cityError;
  document.getElementById('emailErrorMsg').textContent = emailError;

  // Retourne true si toutes les données sont valides, false sinon
  if (!firstNameError && !lastNameError && !addressError && !cityError && !emailError) {
    return true;
  }
  return false;
}

// Fonction de création de l'objet contact
function createContact() {
  const firstName = document.getElementById('firstName').value;
  const lastName = document.getElementById('lastName').value;
  const address = document.getElementById('address').value;
  const city = document.getElementById('city').value;
  const email = document.getElementById('email').value;

  const contact = {
    firstName: firstName,
    lastName: lastName,
    address: address,
    city: city,
    email: email
  };
  return contact;
}

// Fonction de création du tableau de produits
function createProductsArray() {
  const products = [];

  // Boucle sur tous les articles du panier
  const cartItems = document.querySelectorAll('.cart__item');
  cartItems.forEach((item) => {
    const productId = item.getAttribute('data-id');
    const productColor = item.getAttribute('data-color');
    const productQuantity = item.querySelector('.itemQuantity').value;

    const product = {
      _id: productId,
      color: productColor,
      quantity: productQuantity
    };
    products.push(product);
  });

  return products;
}

// Récupération du bouton "commander"
const orderButton = document.getElementById('order');

// Ajout de l'événement "click" sur le bouton "commander"
orderButton.addEventListener('click', (event) => {
  event.preventDefault();

  // Vérification des données du formulaire et envoi de la commande à l'API
  if (validateForm()) {
    sendOrder().then((response) => {
      // Si la commande a bien été enregistrée, affichage de la page de confirmation
      if (response.orderId) {
        window.location.href = `./confirmation.html?id=${response.orderId}`;
      }
    }).catch((error) => {
      console.error(error);
      alert(`Une erreur est survenue : ${error}`);
    });
  }
});
