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



function displayCart() {
  cartItems.innerHTML = "";

  let totalPriceCents = 0;

  const promises = cart.map((item) => {
    return fetch(`http://localhost:3000/api/products/${item.id}`)
      .then((response) => response.json())
      .then((productData) => {
        const article = document.createElement("article");
        article.classList.add("cart__item");
        article.setAttribute("data-id", productData._id);
        article.setAttribute("data-color", item.color);

        const img = document.createElement("img");
        img.src = productData.imageUrl;
        img.alt = productData.name;
        img.classList.add("cart__item__img");
        article.appendChild(img);

        const content = document.createElement("div");
        content.classList.add("cart__item__content");
        article.appendChild(content);

        const description = document.createElement("div");
        description.classList.add("cart__item__content__description");
        content.appendChild(description);

        const title = document.createElement("h2");
        title.innerText = productData.name;
        description.appendChild(title);

        const color = document.createElement("p");
        color.innerText = `Couleur : ${item.color}`;
        description.appendChild(color);

        const price = document.createElement("p");
        price.innerText = `${productData.price} €`;
        description.appendChild(price);

        const settings = document.createElement("div");
        settings.classList.add("cart__item__content__settings");
        content.appendChild(settings);

        const quantity = document.createElement("div");
        quantity.classList.add("cart__item__content__settings__quantity");
        settings.appendChild(quantity);

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

        const deleteItem = document.createElement("p");
        deleteItem.classList.add("deleteItem");
        deleteItem.innerText = "Supprimer";
        settings.appendChild(deleteItem);

        cartItems.appendChild(article);

        const itemPrice = productData.price * item.quantity;
        totalPriceCents += itemPrice;

        deleteItem.addEventListener("click", () => {
          deleteProduct(item.id, item.color);
        });
        deleteItem.addEventListener("mouseover", () => {
          deleteItem.style.cursor = "pointer";
        });

        deleteItem.addEventListener("mouseout", () => {
          deleteItem.style.cursor = "default";
        });
      });
  });

  Promise.all(promises).then(() => {
    const quantityTotal = cart.reduce((acc, item) => {
      return acc + item.quantity;
    }, 0);

    const priceTotal = totalPriceCents;

    totalQuantity.innerText = quantityTotal;
    totalPrice.innerText = `${priceTotal.toFixed(2)} €`;
  });
}

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
    document.querySelector("#totalPrice").innerText = `${totalPriceCents.toFixed(
      2
    )} €`;
  } else {
    alert("Vous ne pouvez pas commander plus de 100 unités d'un même produit.");
  }
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




