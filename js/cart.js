export class CartManager {
  constructor() {
    this.cart = this.loadCart();
    this.init();
  }

  init() {
    document
      .getElementById("cartBtn")
      .addEventListener("click", () => this.showCart());
    document
      .getElementById("backToProductsBtn")
      .addEventListener("click", () => this.showProducts());
    this.updateCartCount();
  }

  loadCart() {
    const cartData = localStorage.getItem("cart");
    return cartData ? JSON.parse(cartData) : [];
  }

  saveCart() {
    localStorage.setItem("cart", JSON.stringify(this.cart));
    this.updateCartCount();
  }

  addToCart(product) {
    const existingItem = this.cart.find((item) => item.id === product.id);

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      this.cart.push({ ...product, quantity: 1 });
    }

    this.saveCart();
    alert(`${product.title} добавлен в корзину!`);
  }

  removeFromCart(productId) {
    this.cart = this.cart.filter((item) => item.id !== productId);
    this.saveCart();
    this.renderCart();
  }

  updateQuantity(productId, newQuantity) {
    if (newQuantity <= 0) {
      this.removeFromCart(productId);
      return;
    }

    const item = this.cart.find((item) => item.id === productId);
    if (item) {
      item.quantity = newQuantity;
      this.saveCart();
      this.renderCart();
    }
  }

  updateCartCount() {
    const totalItems = this.cart.reduce((sum, item) => sum + item.quantity, 0);
    document.getElementById("cartCount").textContent = totalItems;
  }

  showCart() {
    this.hideAllScreens();
    document.getElementById("cartScreen").classList.remove("hidden");
    this.renderCart();
  }

  showProducts() {
    this.hideAllScreens();
    document.getElementById("productsScreen").classList.remove("hidden");
  }

  hideAllScreens() {
    document.querySelectorAll(".screen").forEach((screen) => {
      screen.classList.add("hidden");
    });
  }

  renderCart() {
    const cartItems = document.getElementById("cartItems");
    const cartTotal = document.getElementById("cartTotal");

    if (this.cart.length === 0) {
      cartItems.innerHTML = '<p class="text-center">Корзина пуста</p>';
      cartTotal.innerHTML = "";
      return;
    }

    cartItems.innerHTML = "";

    this.cart.forEach((item) => {
      const cartItem = document.createElement("div");
      cartItem.className = "cart-item";
      cartItem.innerHTML = `
                <div class="cart-item-info">
                    <div class="cart-item-title">${item.title}</div>
                    <div class="cart-item-price">${this.formatPrice(
                      item.price
                    )}</div>
                </div>
                <div class="cart-item-controls">
                    <button class="quantity-btn" data-action="decrease" data-id="${
                      item.id
                    }">-</button>
                    <span class="quantity">${item.quantity}</span>
                    <button class="quantity-btn" data-action="increase" data-id="${
                      item.id
                    }">+</button>
                    <button class="btn btn-secondary" data-action="remove" data-id="${
                      item.id
                    }">Удалить</button>
                </div>
            `;

      cartItem.querySelectorAll(".quantity-btn, .btn").forEach((btn) => {
        btn.addEventListener("click", (e) => this.handleCartAction(e));
      });

      cartItems.appendChild(cartItem);
    });

    const total = this.getTotal();
    cartTotal.innerHTML = `
            <div class="total-price">Итого: ${this.formatPrice(total)}</div>
        `;
  }

  handleCartAction(e) {
    const action = e.target.dataset.action;
    const productId = parseInt(e.target.dataset.id);
    const item = this.cart.find((item) => item.id === productId);

    switch (action) {
      case "increase":
        this.updateQuantity(productId, item.quantity + 1);
        break;
      case "decrease":
        this.updateQuantity(productId, item.quantity - 1);
        break;
      case "remove":
        this.removeFromCart(productId);
        break;
    }
  }

  getTotal() {
    return this.cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }

  formatPrice(price) {
    return new Intl.NumberFormat("ru-RU", {
      style: "currency",
      currency: "RUB",
    }).format(price);
  }

  getCartItems() {
    return this.cart;
  }

  clearCart() {
    this.cart = [];
    this.saveCart();
  }
}
