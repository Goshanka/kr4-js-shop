document.addEventListener("DOMContentLoaded", () => {
  updateCartCount();
  initPhoneMask();
  initCatalog();
  initProductPage();
  initAddButtons();
  initCartPage();

  const orderItems = typeof initOrderPage === "function" ? initOrderPage() : [];
  document.querySelectorAll("form.order-form").forEach((form) => {
    if (
      orderItems.length > 0 &&
      form.closest("section")?.querySelector("#order-items")
    ) {
      initFormValidation(form, () => {
        const text = describeOrder(orderItems);
        if (isCartOrder()) {
          saveCart([]);
          setPromoApplied(false);
          updateCartCount();
        }
        return "Заявка подготовлена. " + text;
      });
    } else {
      initFormValidation(form);
    }
  });
});
