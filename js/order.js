function getOrderItems() {
  const params = new URLSearchParams(location.search);
  if (params.has("product")) {
    console.log("Переход с товара");
    const product = products.find(
      (p) => p.id === Number(params.get("product")),
    );
    return product ? [{ id: product.id, qty: 1 }] : [];
  }
  if (params.get("from") === "cart") {
    console.log("Переход с корзины");
    return loadCart().filter((entry) =>
      products.some((p) => p.id === entry.id),
    );
  }
  console.log("Переход просто");
  return [];
}

function isCartOrder() {
  return new URLSearchParams(location.search).get("from") === "cart";
}

function getOrderDiscount(items) {
  return isCartOrder() ? calcDiscount(calcTotal(items), isPromoApplied()) : 0;
}

function formatOrderTotal(items) {
  const discount = getOrderDiscount(items);
  const total = formatPrice(calcTotal(items) - discount);
  return discount > 0
    ? total +
        " (скидка по промокоду " +
        PROMO_CODE +
        ": −" +
        formatPrice(discount) +
        ")"
    : total;
}

function describeOrder(items) {
  const parts = items.map((entry) => {
    const product = products.find((p) => p.id === entry.id);
    return product.title + " × " + entry.qty;
  });
  return "Заказ: " + parts.join(", ") + ". Итого: " + formatOrderTotal(items);
}

function initOrderPage() {
  const box = document.querySelector("#order-items");
  if (!box) return [];

  const items = getOrderItems();
  if (items.length === 0) return items;

  const list = document.querySelector("#order-items-list");
  items.forEach((entry) => {
    const product = products.find((p) => p.id === entry.id);
    const li = document.createElement("li");
    li.textContent =
      product.title +
      " — " +
      entry.qty +
      " шт., " +
      formatPrice(product.price * entry.qty);
    list.append(li);
  });
  document.querySelector("#order-items-total").textContent =
    "Итого: " + formatOrderTotal(items);
  box.hidden = false;

  const topic = document.querySelector("[name='topic']");
  if (topic) topic.value = "product";
  return items;
}
