export class OrderManager {
  constructor(cartManager, authManager) {
    this.cartManager = cartManager;
    this.authManager = authManager;
    this.init();
  }

  init() {
    document
      .getElementById("checkoutBtn")
      .addEventListener("click", () => this.showCheckout());
    document
      .getElementById("backToCartBtn")
      .addEventListener("click", () => this.showCart());
    document
      .getElementById("checkoutForm")
      .addEventListener("submit", (e) => this.handleOrder(e));
  }

  showCheckout() {
    if (!this.authManager.isAuthenticated()) {
      alert("Для оформления заказа необходимо войти в систему");
      this.authManager.showLogin();
      return;
    }

    if (this.cartManager.getCartItems().length === 0) {
      alert("Корзина пуста");
      return;
    }

    this.hideAllScreens();
    document.getElementById("checkoutScreen").classList.remove("hidden");
    this.renderOrderSummary();
    this.prefillUserData();
  }

  showCart() {
    this.hideAllScreens();
    document.getElementById("cartScreen").classList.remove("hidden");
    this.cartManager.renderCart();
  }

  hideAllScreens() {
    document.querySelectorAll(".screen").forEach((screen) => {
      screen.classList.add("hidden");
    });
  }

  prefillUserData() {
    const user = this.authManager.getCurrentUser();
    if (user) {
      document.getElementById("customerName").value = user.name || "";
    }
  }

  renderOrderSummary() {
    const orderSummary = document.getElementById("orderSummary");
    const cartItems = this.cartManager.getCartItems();
    const total = this.cartManager.getTotal();

    let summaryHTML = "<h3>Ваш заказ:</h3>";
    cartItems.forEach((item) => {
      summaryHTML += `
                <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                    <span>${item.title} x ${item.quantity}</span>
                    <span>${this.formatPrice(item.price * item.quantity)}</span>
                </div>
            `;
    });
    summaryHTML += `
            <hr style="margin: 1rem 0;">
            <div style="display: flex; justify-content: space-between; font-weight: bold;">
                <span>Итого:</span>
                <span>${this.formatPrice(total)}</span>
            </div>
        `;

    orderSummary.innerHTML = summaryHTML;
  }

  async handleOrder(e) {
    e.preventDefault();

    const orderData = {
      customer: {
        name: document.getElementById("customerName").value,
        phone: document.getElementById("customerPhone").value,
        address: document.getElementById("customerAddress").value,
        comment: document.getElementById("customerComment").value,
        email: this.authManager.getCurrentUser().email,
      },
      items: this.cartManager.getCartItems(),
      total: this.cartManager.getTotal(),
      orderDate: new Date().toISOString(),
      orderId: this.generateOrderId(),
    };

    // Формальная отправка заказа
    try {
      await this.submitOrder(orderData);

      this.saveOrder(orderData);

      this.cartManager.clearCart();

      alert(`Заказ ${orderData.orderId} успешно оформлен! Спасибо за покупку!`);
      this.showProducts();
    } catch (error) {
      alert("Ошибка при оформлении заказа. Попробуйте еще раз.");
      console.error("Order error:", error);
    }
  }

  async submitOrder(orderData) {
    console.log("Отправка заказа:", orderData);

    // const response = await fetch('/api/orders', {
    //     method: 'POST',
    //     headers: {
    //         'Content-Type': 'application/json'
    //     },
    //     body: JSON.stringify(orderData)
    // });

    // if (!response.ok) {
    //     throw new Error('Failed to submit order');
    // }

    // return await response.json();

    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ success: true, orderId: orderData.orderId });
      }, 1000);
    });
  }

  saveOrder(orderData) {
    const orders = JSON.parse(localStorage.getItem("orders") || "[]");
    orders.push(orderData);
    localStorage.setItem("orders", JSON.stringify(orders));
  }

  generateOrderId() {
    return (
      "ORD-" +
      Date.now() +
      "-" +
      Math.random().toString(36).substr(2, 5).toUpperCase()
    );
  }

  formatPrice(price) {
    return new Intl.NumberFormat("ru-RU", {
      style: "currency",
      currency: "RUB",
    }).format(price);
  }
}
