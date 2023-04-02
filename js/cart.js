/**
 * // Récupère les données du panier depuis le stockage local, ou initialise un tableau vide si aucune donnée n'a été enregistrée
 * @date 29/03/2023 - 18:55:28
 *
 * @type {*}
 */
const cart = JSON.parse(localStorage.getItem("cart")) || [];

/**
 * // Sélectionne les éléments HTML
 * @date 29/03/2023 - 18:55:49
 *
 * @type {*}
 */
const cartItems = document.querySelector("#cart__items");
const totalQuantity = document.querySelector("#totalQuantity");
const orderForm = document.querySelector(".cart__order__form");
const totalPrice = document.querySelector("#totalPrice");

/**
 * // Fonction pour supprimer un produit du panier

 * @date 29/03/2023 - 18:56:09
 *
 * @param {*} productId
 * @param {*} productColor
 */
function deleteProduct(productId, productColor) {
  const newCart = cart.filter((item) => {
    return item.id !== productId || item.color !== productColor;
  });

  // enregistre le nouveau tableau dans le stockage local
  localStorage.setItem("cart", JSON.stringify(newCart));

  // recharge la page pour mettre à jour l'affichage du panier
  location.reload();
}

/**
 * Fonction pour créer une image d'un produit
 * @date 29/03/2023 - 19:00:01
 *
 * @param {*} productData
 * @returns {*}
 */
function createImg(productData) {
  const img = document.createElement("img");
  img.src = productData.imageUrl;
  img.alt = productData.name;
  img.classList.add("cart__item__img");
  return img;
}

/**
 * // Fonction pour créer la description d'un produit
 * @date 29/03/2023 - 19:01:47
 *
 * @param {*} productData
 * @param {*} item
 * @returns {*}
 */
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

/**
 * Fonction pour créer la quantité d'un produit ainsi que les limites possible
 * @date 29/03/2023 - 19:04:14
 *
 * @param {*} item
 * @returns {*}
 */
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

/**
 * Fonction créant un bouton pour supprimer
 * @date 29/03/2023 - 19:07:03
 *
 * @returns {*}
 */
function createDeleteItem() {
  const deleteItem = document.createElement("p");
  deleteItem.classList.add("deleteItem");
  deleteItem.innerText = "Supprimer";

  return deleteItem;
}

/**
 * Fonction pour création des options de quantité et de suppression des produits
 * @date 29/03/2023 - 19:08:00
 *
 * @param {*} productData
 * @param {*} item
 * @returns {*}
 */
function createSettings(productData, item) {
  const settings = document.createElement("div");
  settings.classList.add("cart__item__content__settings");

  const quantity = createQuantity(item);
  settings.appendChild(quantity);

  const deleteItem = createDeleteItem();
  settings.appendChild(deleteItem);

  return settings;
}

/**
 * Fonction pour créer un élément article contenant une image, une description et des paramètres pour un produit
 * @date 29/03/2023 - 21:15:16
 *
 * @param {*} productData
 * @param {*} item
 * @returns {*}
 */
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

/**
 *  Fonction ajoutant un événement de suppression
 * @date 29/03/2023 - 21:16:27
 *
 * @param {*} deleteItem
 * @param {*} itemId
 * @param {*} itemColor
 */
function setDeleteItemEventListener(deleteItem, itemId, itemColor) {
  deleteItem.addEventListener("click", () => {
    deleteProduct(itemId, itemColor);
  });
}

/**
 * Fonction qui calule la quantité totale
 * @date 29/03/2023 - 21:16:55
 *
 * @param {*} cart
 * @returns {{ quantity: any; total: any; }}
 */
function calculateQuantityTotal(cart) {
  return {
    quantity: cart.reduce((acc, item) => acc + item.quantity, 0),
    total: cart.reduce((acc, item) => acc + item.quantity * item.price, 0),
  };
}

/**
 * Fonction permettant la mise à jour du prix total et de la quantité totale
 * @date 29/03/2023 - 21:19:55
 *
 * @param {*} quantityTotalObj
 * @param {*} priceTotal
 */
function setTotalPriceAndQuantity(quantityTotalObj, priceTotal) {
  totalQuantity.innerText = quantityTotalObj.quantity;

  totalPrice.innerText = `${priceTotal.toFixed(2)} `;
}

/**
 * Fonction pour afficher les éléments du panier sur la page et calucler le prix et la quantité totale.
 * @date 29/03/2023 - 21:22:11
 */
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
    const quantityTotalObj = calculateQuantityTotal(cart);
    const priceTotal = totalPriceCents;

    setTotalPriceAndQuantity(quantityTotalObj, priceTotal);
  });
}

/**Fonction ajoutant un événement "change" à l'élément cartItems et met à jour la quantité de l'article dans le panier lorsqu'un changement est détecté dans l'input de quantité. */

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

/**
 * Fonction met à jour le prix total et la quantité totale du panier par une requete a l api pour chaque porduit
 * @date 29/03/2023 - 21:26:24
 *
 * @async
 * @returns {*}
 */
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
    ).innerText = `${totalPriceCents.toFixed(2)}`;
  } else {
    alert("Vous ne pouvez pas commander plus de 100 unités d'un même produit.");
  }
}

/**
 * // Fonction pour récupérer les articles du panier
 * @returns
 */
function getCartItems() {
  const cartItems = document.querySelectorAll(".cart__item");
  const cartItemsIds = [];

  // Boucle sur chaque élément du panier pour récupérer son identifiant
  for (const item of cartItems) {
    cartItemsIds.push(item.getAttribute("data-id"));
  }

  return cartItemsIds;
}

/**
 * // Fonction autorise uniquement les lettres et les espaces, pas de chiffres dans le champ
 * @date 29/03/2023 - 21:27:53
 *
 * @param {*} firstName
 * @returns {boolean}
 */
function validateFirstName(firstName) {
  const regex = /^[a-zA-Z\s]+$/;
  if (!regex.test(firstName)) {
    return "Le prénom ne doit contenir que des lettres et des espaces.";
  }
}

/**
 *  // Fonction autorise uniquement les lettres et les espaces, pas de chiffres dans le champ
 * @date 02/04/2023 - 21:18:38
 *
 * @param {*} lastName
 * @returns {string}
 */
function validateLastName(lastName) {
  const regex = /^[a-zA-Z\s]+$/;
  if (!regex.test(lastName)) {
    return "Le nom ne doit contenir que des lettres et des espaces.";
  }
}

function validateAddress(address) {
  const regex = /^[\w\s-]+$/;
  if (!regex.test(address)) {
    return "L'adresse ne doit contenir que des lettres, des espaces, des tirets et des chiffres.";
  }
}

function validateCity(city) {
  const regex = /^[a-zA-Z\s]+$/;
  if (!regex.test(city)) {
    return "La ville ne doit contenir que des lettres et des espaces.";
  }
}

function validateEmail(email) {
  const regex = /^[\w-]+(\.[\w-]+)*@[\w-]+(\.[\w-]+)*(\.[a-zA-Z]{2,7})$/;
  if (!regex.test(email)) {
    return "L'email doit être au format 'string@string.string'.";
  }
}

/**
 *  Cette fonction valide les données du formulaire et retourne true si toutes les données sont valides, false sinon.
 * @date 02/04/2023 - 21:20:14
 *
 * @param {*} formData
 * @returns {boolean}
 */
function validateFormData(formData) {
  const requiredFields = ["firstName", "lastName", "address", "city", "email"];
  const fieldNames = {
    firstName: "Prénom",
    lastName: "Nom",
    address: "Adresse",
    city: "Ville",
    email: "Email",
  };
  const errors = {};

  for (const field of requiredFields) {
    if (!formData.has(field)) {
      errors[field] = `Le champ ${fieldNames[field]} est obligatoire.`;
    } else {
      const value = formData.get(field);
      switch (field) {
        case "firstName":
          const firstNameError = validateFirstName(value);
          if (firstNameError) {
            errors[field] = firstNameError;
          }
          break;
        case "lastName":
          const lastNameError = validateLastName(value);
          if (lastNameError) {
            errors[field] = lastNameError;
          }
          break;
        case "address":
          const addressError = validateAddress(value);
          if (addressError) {
            errors[field] = addressError;
          }
          break;
        case "city":
          const cityError = validateCity(value);
          if (cityError) {
            errors[field] = cityError;
          }
          break;
        case "email":
          const emailError = validateEmail(value);
          if (emailError) {
            errors[field] = emailError;
          }
          break;
        default:
          errors[field] = "Champ invalide.";
      }
    }
  }

  if (Object.keys(errors).length === 0) {
    return true;
  } else {
    for (const field in errors) {
      const input = document.querySelector(`[name="${field}"]`);
      const error = errors[field];
      const errorMessage = document.createElement("div");
      errorMessage.textContent = error;
      errorMessage.classList.add("error-message");
      input.insertAdjacentElement("afterend", errorMessage);
    }
    return false;
  }
}

/**
 * // Fonction pour envoyer les données de la commande à l'API et récupérer l'identifiant de la commande
 * @date 29/03/2023 - 21:31:19
 *
 * @async
 * @param {*} contactData
 * @param {*} productIds
 * @returns {unknown}
 */
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
    alert(error.message); // Affiche le message d'erreur spécifique
    return null;
  }
}

// Définition de la fonction redirectToConfirmationPage
function redirectToConfirmationPage(orderId) {
  // Navigue vers la page de confirmation en ajoutant l'identifiant de commande à l'URL
  window.location.href = `./confirmation.html?orderId=${orderId}`;
}

const form = document.querySelector("form");

form.addEventListener("submit", (event) => {
  const formData = new FormData(form);
  const isValid = validateFormData(formData);

  if (!isValid) {
    event.preventDefault();
  } else {
    const contactData = Object.fromEntries(formData.entries());
    const productIds = getCartItems();

    // Vérifie si le panier est vide
    if (productIds.length === 0) {
      alert("Votre panier est vide.");
      event.preventDefault();
      return;
    }

    // Envoie les données de la commande et récupère l'identifiant de la commande
    sendOrderData(contactData, productIds)
      .then((orderId) => {
        // Si l'identifiant de la commande existe, redirige vers la page de confirmation
        if (orderId) {
          redirectToConfirmationPage(orderId);
        } else {
          alert(
            "Une erreur s'est produite lors de la soumission de votre commande."
          );
        }
      })
      .catch((error) => {
        alert(error.message);
      });
  }
});
