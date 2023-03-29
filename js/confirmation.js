/**
 * Récupère l'identifiant de commande depuis les paramètres de l'URL, puis affiche cet identifiant dans la page HTML
 * Vide le localStorage
 * @date 29/03/2023 - 21:37:38
 */
function displayOrderConfirmation() {
  const orderId = new URLSearchParams(window.location.search).get("orderId");
  document.getElementById("orderId").textContent = orderId;
  window.localStorage.clear();
}

displayOrderConfirmation();
