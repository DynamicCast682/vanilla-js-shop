import { AuthManager } from "./auth.js";
import { ProductManager } from "./products.js";
import { CartManager } from "./cart.js";
import { OrderManager } from "./order.js";

class ShopApp {
  constructor() {
    this.authManager = new AuthManager();
    this.cartManager = new CartManager();
    this.productManager = new ProductManager(this.cartManager);
    this.orderManager = new OrderManager(this.cartManager, this.authManager);

    this.init();
  }

  init() {
    this.showProducts();

    this.authManager.updateUI();
    this.cartManager.updateCartCount();
  }

  showProducts() {
    document.querySelectorAll(".screen").forEach((screen) => {
      screen.classList.add("hidden");
    });
    document.getElementById("productsScreen").classList.remove("hidden");
  }
}

document.addEventListener("DOMContentLoaded", () => {
  new ShopApp();
});
