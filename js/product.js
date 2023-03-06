const urlSearchParams = new URLSearchParams(window.location.search);
const id = urlSearchParams.get("id");

async function fetchProduct() {
  await fetch(`http://localhost:3000/api/products/${id}`)
    .then((response) => response.json())
    .then((data) => {
      console.log("Product data:", data);
      productDisplay(data);
    });
}

function productDisplay(productDatas) {
  const title = document.querySelector("#title");
  const price = document.querySelector("#price");
  const description = document.querySelector("#description");
  const img = document.querySelector(".item__img");

  title.innerText = productDatas.name;
  document.title = productDatas.name;
  price.innerText = productDatas.price;
  description.innerText = productDatas.description;
  const imgTag = document.createElement("img");
  imgTag.src = productDatas.imageUrl;
  imgTag.alt = productDatas.name;
  imgTag.title = productDatas.name;
  img.append(imgTag);

  const colors = productDatas.colors;
  const colorSelect = document.querySelector("#colors");
  for (let color of colors) {
    const colorOption = document.createElement("option");
    colorOption.value = color;
    colorOption.innerText = color;
    colorSelect.append(colorOption);
  }

  const addToCartButton = document.querySelector("#addToCart");

  addToCartButton.addEventListener("click", function () {
    const quantity = document.querySelector("#quantity").value;
    const color = colorSelect.value;

    let errorCounter = 0;
    if (!quantity || quantity <= 0) {
      errorCounter++;
    }

    if (!color) {
      errorCounter++;
    }

    if (errorCounter > 0) {
      if (errorCounter === 1) {
        alert("Veuillez remplir tous les champs requis.");
      } else {
        alert("Veuillez remplir tous les champs requis.");
      }
    } else {
      let cart = JSON.parse(localStorage.getItem("cart")) || [];

      function getCart() {
        return JSON.parse(localStorage.getItem("cart")) || [];
      }

      function saveCart(cart) {
        localStorage.setItem("cart", JSON.stringify(cart));
      }

      function addProductToCart(product) {
        cart.push(product);
        alert("Le produit a été ajouté au panier avec succès.");
      }

      function isProductInCart(cart, product) {
        for (let i = 0; i < cart.length; i++) {
          if (cart[i].id === product.id && cart[i].color === product.color) {
            return i;
          }
        }
        return false;
      }

      function addProduct() {
        let product = {
          id: productDatas._id,
          quantity: parseInt(quantity),
          color: color,
        };
        let temp = isProductInCart(cart, product);

        if (temp === false) {
          addProductToCart(product);
        } else {
          cart[temp].quantity += parseInt(quantity);
        }

        saveCart(cart);
      }

      addProduct();
    }
  });
}

console.log("ID:", id);
window.addEventListener("load", fetchProduct);
