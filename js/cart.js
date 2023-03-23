// récupère les données du panier depuis le stockage local, ou initialise un tableau vide si aucune donnée n'a été enregistrée
const cart = JSON.parse(localStorage.getItem("cart")) || [];

// sélectionne les éléments HTML
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


// Fonction pour récupérer les articles du panier
function getCartItems() {
  const cartItems = document.querySelectorAll(".cart__item");
  const cartItemsIds = [];

  // Boucle sur chaque élément du panier pour récupérer son identifiant
  for (const item of cartItems) {
    cartItemsIds.push(item.getAttribute("data-id"));
  }

  return cartItemsIds;
}

// Fonction de validation des données du formulaire
function validateFormData(formData) {
  const requiredFields = ["firstName", "lastName", "address", "city", "email"];

  // Vérifie si chaque champ requis est présent dans les données du formulaire
  for (const field of requiredFields) {
    if (!formData.has(field)) {
      return false;
    }
  }

  return true;
}

// Fonction pour envoyer les données de la commande à l'API et récupérer l'identifiant de la commande
async function sendOrderData(contactData, productIds) {
  try {
    const response = await fetch("http://localhost:3000/api/products/order", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contact: contactData,
        products: productIds,
      }),
    });

    if (!response.ok) {
      throw new Error(`Erreur HTTP ${response.status}`);
    }

    const data = await response.json();
    return data.orderId; // Retourne l'identifiant de la commande
  } catch (error) {
    console.error("Erreur lors de l'envoi des données de commande :", error);
    return null;
  }
}

// Gérer la soumission du formulaire
orderForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const formData = new FormData(orderForm);

  // Valide les données du formulaire
  if (!validateFormData(formData)) {
    alert("Veuillez remplir tous les champs du formulaire.");
    return;
  }

  const contactData = Object.fromEntries(formData.entries());
  const productIds = getCartItems();

  // Vérifie si le panier est vide
  if (productIds.length === 0) {
    alert("Votre panier est vide.");
    return;
  }

  // Envoie les données de la commande et récupère l'identifiant de la commande
  const orderId = await sendOrderData(contactData, productIds);
  
  // Si l'identifiant de la commande existe, redirige vers la page de confirmation
  if (orderId) {
    redirectToConfirmationPage(orderId);
  } else {
    alert("Une erreur s'est produite lors de la soumission de votre commande.");
  }
});

// Fonction pour rediriger vers la page de confirmation avec l'identifiant de la commande
function redirectToConfirmationPage(orderId) {
  // Navigue vers la page de confirmation en ajoutant l'identifiant de commande à l'URL
  window.location.href = `./confirmation.html?orderId=${orderId}`;
}
