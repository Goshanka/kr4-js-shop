function createCard(product) {
  console.log("Создана карточка", product.title);
  const card = document.createElement("article");
  card.classList.add("product-card");

  if (product.isHit) {
    const badge = document.createElement("span");
    badge.classList.add("badge", "badge--hit");
    badge.textContent = "Хит";
    card.append(badge);
  }

  const img = document.createElement("img");
  img.classList.add("product-card__image");
  img.src = product.images[0];
  img.sizes = "(max-width: 639px) 100vw, (max-width: 1023px) 50vw, 33vw";
  img.alt = product.title;
  img.width = 640;
  img.height = 480;
  img.loading = "lazy";

  const title = document.createElement("h3");
  title.classList.add("product-card__title");
  title.textContent = product.title;

  const description = document.createElement("p");
  description.classList.add("product-card__description");
  description.textContent = product.description;

  const price = document.createElement("p");
  price.classList.add("product-card__price");
  price.textContent = "Цена: " + formatPrice(product.price);

  const status = document.createElement("p");
  status.classList.add("product-card__status");
  status.textContent = product.isAvailable ? "В наличии" : "Нет в наличии";

  const actions = document.createElement("div");
  actions.classList.add("product-card__actions");

  const link = document.createElement("a");
  link.classList.add("button", "button--secondary", "product-card__link");
  link.href = "product.html?id=" + product.id;
  link.textContent = "Подробнее";

  const buy = document.createElement("button");
  buy.type = "button";
  buy.classList.add("button", "button--primary");
  buy.textContent = product.isAvailable ? "В корзину" : "Недоступно";
  buy.disabled = !product.isAvailable;
  buy.dataset.id = product.id;
  buy.dataset.action = "add";

  const order = document.createElement("a");
  order.classList.add("button", "button--secondary");
  order.href = "order.html?product=" + product.id;
  order.textContent = "Заказать";
  order.hidden = !product.isAvailable;

  actions.append(link, buy, order);
  card.append(img, title, description, price, status, actions);
  return card;
}

function getVisibleProducts(query, category, sort) {
  const q = query.trim().toLowerCase();
  const result = products.filter(
    (p) =>
      p.title.toLowerCase().includes(q) &&
      (category === "all" || p.category === category),
  );
  if (sort === "price-asc") result.sort((a, b) => a.price - b.price);
  if (sort === "price-desc") result.sort((a, b) => b.price - a.price);
  if (sort === "title")
    result.sort((a, b) => a.title.localeCompare(b.title, "ru"));
  console.log("Поиск:", query, category, sort, "→", result.length);
  return result;
}

function initCatalog() {
  const grid = document.querySelector("#catalog-grid");
  if (!grid) return;

  const search = document.querySelector("#search");
  const categorySelect = document.querySelector("#category");
  const sortSelect = document.querySelector("#sort");
  const counter = document.querySelector("#catalog-count");
  const empty = document.querySelector("#catalog-empty");
  const resetButton = document.querySelector("#catalog-reset");

  function render() {
    const items = getVisibleProducts(
      search.value,
      categorySelect.value,
      sortSelect.value,
    );
    grid.replaceChildren();
    items.forEach((product) => grid.append(createCard(product)));
    counter.textContent = "Найдено товаров: " + items.length;
    empty.hidden = items.length > 0;
  }

  search.addEventListener("input", render);
  categorySelect.addEventListener("change", render);
  sortSelect.addEventListener("change", render);

  resetButton.addEventListener("click", () => {
    search.value = "";
    categorySelect.value = "all";
    sortSelect.value = "default";
    render();
  });

  render();
}

function initProductPage() {
  const box = document.querySelector("#product-detail");
  if (!box) return;

  const id = Number(new URLSearchParams(location.search).get("id"));
  const product = products.find((p) => p.id === id);
  if (!product) {
    box.hidden = true;
    document.querySelector("#product-not-found").hidden = false;
    return;
  }

  document.title = product.title + " — ShopProject";
  document.querySelector("#product-crumb").textContent = product.title;

  const gallery = createGallery(product);

  const info = document.createElement("div");
  info.classList.add("product-detail__info");

  const title = document.createElement("h1");
  title.classList.add("product-detail__title");
  title.textContent = product.title;

  const description = document.createElement("p");
  description.classList.add("product-detail__description");
  description.textContent = product.description;

  const price = document.createElement("p");
  price.classList.add("product-detail__price");
  price.textContent = "Цена: " + formatPrice(product.price);

  const buy = document.createElement("button");
  buy.type = "button";
  buy.classList.add("button", "button--primary");
  buy.textContent = product.isAvailable ? "В корзину" : "Нет в наличии";
  buy.disabled = !product.isAvailable;
  buy.dataset.action = "add";
  buy.dataset.id = product.id;

  const orderLink = document.createElement("a");
  orderLink.classList.add("button", "button--secondary");
  orderLink.href = "order.html?product=" + product.id;
  orderLink.textContent = "Заказать сразу";
  orderLink.hidden = !product.isAvailable;

  const actions = document.createElement("div");
  actions.classList.add("product-detail__actions");
  actions.append(buy, orderLink);

  info.append(title, description, price, actions);
  box.append(gallery, info);

  const rows = [
    ["Категория", categoryNames[product.category]],
    ["Артикул", "SKU-" + String(product.id).padStart(3, "0")],
    ["Наличие", product.isAvailable ? "В наличии" : "Нет в наличии"],
    ["Хит продаж", product.isHit ? "Да" : "Нет"],
    ["Гарантия", "12 месяцев"],
  ];
  const table = document.createElement("table");
  table.classList.add("product-specs");
  const caption = document.createElement("caption");
  caption.textContent = "Характеристики товара";
  const tbody = document.createElement("tbody");
  rows.forEach(([name, value]) => {
    const tr = document.createElement("tr");
    const th = document.createElement("th");
    th.scope = "row";
    th.textContent = name;
    const td = document.createElement("td");
    td.textContent = value;
    tr.append(th, td);
    tbody.append(tr);
  });
  table.append(caption, tbody);
  document.querySelector("#product-specs-wrapper").append(table);
}

function createGallery(product) {
  const gallery = document.createElement("div");
  gallery.classList.add("gallery");

  const img = document.createElement("img");
  img.classList.add("product-detail__image", "gallery__image");
  img.alt = product.title;
  img.width = 960;
  img.height = 640;
  gallery.append(img);

  let index = 0;
  const dots = [];

  function show(newIndex) {
    index = (newIndex + product.images.length) % product.images.length;
    img.src = product.images[index];
    img.alt =
      product.title + ", фото " + (index + 1) + " из " + product.images.length;
    dots.forEach((dot, i) => dot.classList.toggle("is-active", i === index));
  }

  if (product.images.length > 1) {
    const prev = document.createElement("button");
    prev.type = "button";
    prev.classList.add("gallery__button", "gallery__button--prev");
    prev.textContent = "‹";
    prev.setAttribute("aria-label", "Предыдущее фото");
    prev.addEventListener("click", () => show(index - 1));

    const next = document.createElement("button");
    next.type = "button";
    next.classList.add("gallery__button", "gallery__button--next");
    next.textContent = "›";
    next.setAttribute("aria-label", "Следующее фото");
    next.addEventListener("click", () => show(index + 1));

    const dotsBox = document.createElement("div");
    dotsBox.classList.add("gallery__dots");
    product.images.forEach((_, i) => {
      const dot = document.createElement("button");
      dot.type = "button";
      dot.classList.add("gallery__dot");
      dot.setAttribute("aria-label", "Фото " + (i + 1));
      dot.addEventListener("click", () => show(i));
      dots.push(dot);
      dotsBox.append(dot);
    });

    gallery.append(prev, next, dotsBox);
  }

  show(0);
  return gallery;
}
