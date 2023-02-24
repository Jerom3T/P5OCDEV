async function fetchProducts() {
  await fetch("http://localhost:3000/api/products")
    .then(response => response.json())
    .then(data => productDisplay(data));
}

function productDisplay(productDatas) {
  const productContainer = document.querySelector(".items");
  productDatas.forEach(element => {
    const a = document.createElement("a");
    a.href = "product.html?id=" + element._id;
    a.classList.add("product-card");

    const img = document.createElement("img");
    img.src = element.imageUrl;
    img.alt = element.name;
    img.title = element.name;
    a.append(img);

    const h3 = document.createElement("h3");
    h3.innerText = element.name;
    a.append(h3);

    const pDescription = document.createElement("p");
    pDescription.innerText = element.description;
    a.append(pDescription);

    const pPrice = document.createElement("p");
    pPrice.innerText = element.price + " €";
    a.append(pPrice);

    a.addEventListener("click", function () {
      window.location.href = "front/html/product.html?id=" + element._id;
    });

    productContainer.append(a);
  });
}

window.addEventListener("load", fetchProducts);
