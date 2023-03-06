const cart = JSON.parse(localStorage.getItem("cart")) || [];

const cartItems = document.querySelector("#cart__items");

const totalQuantity = document.querySelector("#totalQuantity");

const orderForm = document.querySelector(".cart__order__form");

const totalPrice = document.querySelector("#totalPrice");

function deleteProduct(productId, productColor) {
  const newCart = cart.filter((item) => {
    return item.id !== productId || item.color !== productColor;
  });

  localStorage.setItem("cart", JSON.stringify(newCart));

  location.reload();
}



