const urlSearchParams = new URLSearchParams(window.location.search);
const id = urlSearchParams.get('id');

async function fetchProduct() {
  await fetch(`http://localhost:3000/api/products/${id}`)
    .then((response) => response.json())
    .then((data) => productDisplay(data));
}

function productDisplay(productDatas) {
  const title = document.querySelector("#title");
  const price = document.querySelector("#price");
  const description = document.querySelector("#description");
  const img = document.querySelector(".item__img");

  title.innerText = productDatas.name;
  document.title = productDatas.name;
  price.innerText = productDatas.price + " €";
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

    if (!quantity || quantity <= 0) {
      alert("Veuillez saisir une quantité valide.");
      return;
    }

    if (!color) {
      alert("Veuillez choisir une couleur.");
      return;
    }

    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    const product = {
      id: productDatas._id,
      name: productDatas.name,
      price: productDatas.price,
      imageUrl: productDatas.imageUrl,
      quantity: parseInt(quantity),
      color: color,
    };
    cart.push(product);

    localStorage.setItem("cart", JSON.stringify(cart));

    alert("Le produit a été ajouté au panier.");
  });
}

window.addEventListener("load", fetchProduct);
