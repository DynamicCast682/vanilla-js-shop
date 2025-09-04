export class AuthManager {
  constructor() {
    this.currentUser = this.loadUser();
    this.init();
  }

  init() {
    document
      .getElementById("loginBtn")
      .addEventListener("click", () => this.showLogin());
    document
      .getElementById("logoutBtn")
      .addEventListener("click", () => this.logout());
    document
      .getElementById("showRegisterBtn")
      .addEventListener("click", () => this.showRegister());
    document
      .getElementById("showLoginBtn")
      .addEventListener("click", () => this.showLogin());

    document
      .getElementById("loginForm")
      .addEventListener("submit", (e) => this.handleLogin(e));
    document
      .getElementById("registerForm")
      .addEventListener("submit", (e) => this.handleRegister(e));

    this.updateUI();
  }

  loadUser() {
    const userData = localStorage.getItem("currentUser");
    return userData ? JSON.parse(userData) : null;
  }

  saveUser(user) {
    localStorage.setItem("currentUser", JSON.stringify(user));
    this.currentUser = user;
  }

  showLogin() {
    this.hideAllScreens();
    document.getElementById("loginScreen").classList.remove("hidden");
  }

  showRegister() {
    this.hideAllScreens();
    document.getElementById("registerScreen").classList.remove("hidden");
  }

  hideAllScreens() {
    document.querySelectorAll(".screen").forEach((screen) => {
      screen.classList.add("hidden");
    });
  }

  showProducts() {
    this.hideAllScreens();
    document.getElementById("productsScreen").classList.remove("hidden");
  }

  handleLogin(e) {
    e.preventDefault();
    const email = document.getElementById("loginEmail").value;
    const password = document.getElementById("loginPassword").value;

    const users = JSON.parse(localStorage.getItem("registeredUsers") || "[]");
    const user = users.find(
      (u) => u.email === email && u.password === password
    );

    if (user) {
      this.saveUser({ name: user.name, email: user.email });
      this.updateUI();
      this.showProducts();
      alert("Успешный вход!");
    } else {
      alert("Неверный email или пароль");
    }
  }

  handleRegister(e) {
    e.preventDefault();
    const name = document.getElementById("regName").value;
    const email = document.getElementById("regEmail").value;
    const password = document.getElementById("regPassword").value;

    const users = JSON.parse(localStorage.getItem("registeredUsers") || "[]");

    if (users.find((u) => u.email === email)) {
      alert("Пользователь с таким email уже существует");
      return;
    }

    users.push({ name, email, password });
    localStorage.setItem("registeredUsers", JSON.stringify(users));

    this.saveUser({ name, email });
    this.updateUI();
    this.showProducts();
    alert("Регистрация успешна!");
  }

  logout() {
    localStorage.removeItem("currentUser");
    this.currentUser = null;
    this.updateUI();
    this.showProducts();
    alert("Вы вышли из системы");
  }

  updateUI() {
    const loginBtn = document.getElementById("loginBtn");
    const logoutBtn = document.getElementById("logoutBtn");
    const userWelcome = document.getElementById("userWelcome");

    if (this.currentUser) {
      loginBtn.classList.add("hidden");
      logoutBtn.classList.remove("hidden");
      userWelcome.classList.remove("hidden");
      userWelcome.textContent = `Привет, ${this.currentUser.name}!`;
    } else {
      loginBtn.classList.remove("hidden");
      logoutBtn.classList.add("hidden");
      userWelcome.classList.add("hidden");
    }
  }

  isAuthenticated() {
    return this.currentUser !== null;
  }

  getCurrentUser() {
    return this.currentUser;
  }
}
