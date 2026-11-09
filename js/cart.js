const CART_KEY = "cart";
const PROMO_CODE = "SOFA10";
const PROMO_DISCOUNT = 0.1;

function loadCart() {
  try {
    const data = JSON.parse(localStorage.getItem(CART_KEY));
    return Array.isArray(data) ? data : [];
  } catch (error) {
    return [];
  }
}

function saveCart(cart) {
  try {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
  } catch (error) {}
}

const PROMO_KEY = "promoApplied";

function isPromoApplied() {
  try {
    return localStorage.getItem(PROMO_KEY) === "1";
  } catch (error) {
    return false;
  }
}

function setPromoApplied(applied) {
  try {
    if (applied) {
      localStorage.setItem(PROMO_KEY, "1");
    } else {
      localStorage.removeItem(PROMO_KEY);
    }
  } catch (error) {}
}

function calcDiscount(total, applied) {
  return applied ? Math.round(total * PROMO_DISCOUNT) : 0;
}

function addToCart(productId) {
  console.log("Добавлено", productId);
  const cart = loadCart();
  const item = cart.find((entry) => entry.id === productId);
  if (item) {
    item.qty += 1;
  } else {
    cart.push({ id: productId, qty: 1 });
  }
  saveCart(cart);
  updateCartCount();
}

function removeFromCart(productId) {
  saveCart(loadCart().filter((entry) => entry.id !== productId));
  updateCartCount();
}

function changeQty(productId, delta) {
  const cart = loadCart();
  const item = cart.find((entry) => entry.id === productId);
  if (!item) return;
  item.qty += delta;
  saveCart(cart.filter((entry) => entry.qty > 0));
  updateCartCount();
}

function calcTotal(cart) {
  return cart.reduce((sum, entry) => {
    const product = products.find((p) => p.id === entry.id);
    return product ? sum + product.price * entry.qty : sum;
  }, 0);
}

function updateCartCount() {
  const count = loadCart().reduce((sum, entry) => sum + entry.qty, 0);
  document.querySelectorAll("[data-cart-count]").forEach((el) => {
    el.textContent = count;
  });
}

function renderCart(promoApplied) {
  const list = document.querySelector("#cart-list");
  if (!list) return;

  const empty = document.querySelector("#cart-empty");
  const summary = document.querySelector("#cart-summary");
  const totalEl = document.querySelector("#cart-total");
  const discountEl = document.querySelector("#cart-discount");
  const cart = loadCart().filter((entry) =>
    products.some((p) => p.id === entry.id),
  );

  list.replaceChildren();
  empty.hidden = cart.length > 0;
  summary.hidden = cart.length === 0;

  cart.forEach((entry) => {
    const product = products.find((p) => p.id === entry.id);
    const row = document.createElement("li");
    row.classList.add("cart-item");

    const title = document.createElement("span");
    title.classList.add("cart-item__title");
    title.textContent = product.title;

    const price = document.createElement("span");
    price.textContent = formatPrice(product.price * entry.qty);

    const minus = document.createElement("button");
    minus.type = "button";
    minus.classList.add("button", "button--secondary");
    minus.textContent = "−";
    minus.setAttribute("aria-label", "Уменьшить количество: " + product.title);
    minus.dataset.action = "minus";
    minus.dataset.id = product.id;

    const qty = document.createElement("span");
    qty.textContent = entry.qty + " шт.";

    const plus = document.createElement("button");
    plus.type = "button";
    plus.classList.add("button", "button--secondary");
    plus.textContent = "+";
    plus.setAttribute("aria-label", "Увеличить количество: " + product.title);
    plus.dataset.action = "plus";
    plus.dataset.id = product.id;

    const remove = document.createElement("button");
    remove.type = "button";
    remove.classList.add("button", "button--secondary");
    remove.textContent = "Удалить";
    remove.dataset.action = "remove";
    remove.dataset.id = product.id;

    row.append(title, minus, qty, plus, price, remove);
    list.append(row);
  });

  const total = calcTotal(cart);
  const discount = calcDiscount(total, promoApplied);
  discountEl.textContent = promoApplied
    ? "Скидка по промокоду: −" + formatPrice(discount)
    : "";
  totalEl.textContent = "Итого: " + formatPrice(total - discount);
}

function initCartPage() {
  const list = document.querySelector("#cart-list");
  if (!list) return;

  let promoApplied = isPromoApplied();
  const promoForm = document.querySelector("#promo-form");
  const promoInput = document.querySelector("#promo-input");
  const promoMessage = document.querySelector("#promo-message");

  list.addEventListener("click", (event) => {
    const button = event.target.closest("button[data-action]");
    if (!button) return;
    const id = Number(button.dataset.id);
    if (button.dataset.action === "remove") removeFromCart(id);
    if (button.dataset.action === "plus") changeQty(id, 1);
    if (button.dataset.action === "minus") changeQty(id, -1);
    renderCart(promoApplied);
  });

  document.querySelector("#cart-clear").addEventListener("click", () => {
    saveCart([]);
    setPromoApplied(false);
    promoApplied = false;
    promoMessage.textContent = "";
    updateCartCount();
    renderCart(promoApplied);
  });

  promoForm.addEventListener("submit", (event) => {
    event.preventDefault();
    promoApplied = promoInput.value.trim().toUpperCase() === PROMO_CODE;
    setPromoApplied(promoApplied);
    promoMessage.textContent = promoApplied
      ? "Промокод применён: скидка 10%."
      : "Промокод не найден.";
    promoMessage.classList.toggle("is-error", !promoApplied);
    renderCart(promoApplied);
  });

  if (promoApplied) {
    promoInput.value = PROMO_CODE;
    promoMessage.textContent = "Промокод применён: скидка 10%.";
  }
  renderCart(promoApplied);
}

function initAddButtons() {
  const toast = document.createElement("p");
  toast.classList.add("cart-toast");
  toast.setAttribute("role", "status");
  toast.hidden = true;
  document.body.append(toast);
  let timer;

  document.addEventListener("click", (event) => {
    const button = event.target.closest("button[data-action='add']");
    if (!button) return;
    const id = Number(button.dataset.id);
    const product = products.find((p) => p.id === id);
    if (!product) return;
    addToCart(id);
    toast.textContent = "«" + product.title + "» добавлен в корзину";
    toast.hidden = false;
    clearTimeout(timer);
    timer = setTimeout(() => {
      toast.hidden = true;
    }, 2000);
  });
}
