export class ProductManager {
  constructor(cartManager) {
    this.cartManager = cartManager;
    this.products = [
      {
        id: 1,
        title: "Смартфон iPhone 15",
        description: "Новейший смартфон Apple с улучшенной камерой",
        price: 89990,
        image: "Фото товара",
      },
      {
        id: 2,
        title: "Ноутбук MacBook Air",
        description: "Тонкий и легкий ноутбук для работы",
        price: 129990,
        image: "Фото товара",
      },
      {
        id: 3,
        title: "Наушники AirPods Pro",
        description: "Беспроводные наушники с шумоподавлением",
        price: 24990,
        image: "Фото товара",
      },
      {
        id: 4,
        title: "Планшет iPad Air",
        description: "Планшет для творчества и развлечений",
        price: 69990,
        image: "Фото товара",
      },
      {
        id: 5,
        title: "Умные часы Apple Watch",
        description: "Смарт-часы для активного образа жизни",
        price: 39990,
        image: "Фото товара",
      },
      {
        id: 6,
        title: "Bluetooth колонка",
        description: "Портативная колонка с отличным звуком",
        price: 5990,
        image: "Фото товара",
      },
    ];
    this.render();
  }

  render() {
    const productsList = document.getElementById("productsList");
    productsList.innerHTML = "";

    this.products.forEach((product) => {
      const productCard = document.createElement("div");
      productCard.className = "product-card";
      productCard.innerHTML = `
                <div class="product-image">${product.image}</div>
                <div class="product-title">${product.title}</div>
                <div class="product-description">${product.description}</div>
                <div class="product-price">${this.formatPrice(
                  product.price
                )}</div>
                <button class="btn btn-primary add-to-cart-btn" data-product-id="${
                  product.id
                }">
                    Добавить в корзину
                </button>
            `;

      productCard
        .querySelector(".add-to-cart-btn")
        .addEventListener("click", () => {
          this.cartManager.addToCart(product);
        });

      productsList.appendChild(productCard);
    });
  }

  formatPrice(price) {
    return new Intl.NumberFormat("ru-RU", {
      style: "currency",
      currency: "RUB",
    }).format(price);
  }

  getProductById(id) {
    return this.products.find((product) => product.id === id);
  }
}
