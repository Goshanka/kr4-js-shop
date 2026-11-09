const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE_RE = /^\+7 \(\d{3}\) \d{3}-\d{2}-\d{2}$/;

function getFieldError(field) {
  const value = field.type === "checkbox" ? "" : field.value.trim();
  switch (field.name) {
    case "name":
      if (value.length < 2) return "Введите имя (не менее 2 символов).";
      break;
    case "email":
      if (!value) return "Введите e-mail.";
      if (!EMAIL_RE.test(value))
        return "Некорректный e-mail, пример: example@mail.ru.";
      break;
    case "phone":
      if (!value) return "Введите телефон.";
      if (!PHONE_RE.test(value)) return "Формат телефона: +7 (900) 000-00-00.";
      break;
    case "topic":
      if (!value) return "Выберите тему заявки.";
      break;
    case "message":
      if (value.length < 5) return "Сообщение не короче 5 символов.";
      break;
    case "agreement":
      if (!field.checked) return "Необходимо согласие на обработку данных.";
      break;
  }
  return "";
}

function showFieldError(field, message) {
  const holder = field.closest(".order-form__field");
  let error = holder.querySelector(".field-error");
  if (!error) {
    error = document.createElement("small");
    error.classList.add("field-error");
    error.setAttribute("role", "alert");
    holder.append(error);
  }
  error.textContent = message;
  if (message) {
    field.setAttribute("aria-invalid", "true");
  } else {
    field.removeAttribute("aria-invalid");
  }
}

function initFormValidation(form, onSuccess) {
  const fields = Array.from(form.elements).filter(
    (el) => el.name && el.type !== "hidden",
  );

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    let valid = true;
    fields.forEach((field) => {
      const message = getFieldError(field);
      showFieldError(field, message);
      if (message) valid = false;
    });

    const status = getStatusElement(form);
    if (!valid) {
      status.textContent = "Исправьте ошибки в форме.";
      status.classList.add("is-error");
      return;
    }
    status.classList.remove("is-error");
    const message = onSuccess ? onSuccess() : "";
    status.textContent =
      message || "Заявка подготовлена. Мы свяжемся с вами в ближайшее время.";
    form.reset();
  });

  form.addEventListener("input", (event) => {
    if (event.target.hasAttribute("aria-invalid")) {
      showFieldError(event.target, getFieldError(event.target));
    }
  });
}

function getStatusElement(form) {
  let status = form.querySelector(".form-status");
  if (!status) {
    status = document.createElement("p");
    status.classList.add("form-status");
    status.setAttribute("role", "status");
    form.prepend(status);
  }
  return status;
}

function formatPhone(raw, deleting) {
  let digits = raw.replace(/\D/g, "");
  if (!digits) return "";
  if (digits[0] === "8" || digits[0] === "7") digits = digits.slice(1);
  digits = digits.slice(0, 10);
  let result = "+7";
  if (digits.length > 0) result += " (" + digits.slice(0, 3);
  if (digits.length >= 3 && !(deleting && digits.length === 3)) result += ")";
  if (digits.length > 3) result += " " + digits.slice(3, 6);
  if (digits.length > 6) result += "-" + digits.slice(6, 8);
  if (digits.length > 8) result += "-" + digits.slice(8, 10);
  return result;
}

function initPhoneMask() {
  document.querySelectorAll("input[name='phone']").forEach((input) => {
    input.addEventListener("input", (event) => {
      const deleting = event.inputType && event.inputType.startsWith("delete");
      input.value = formatPhone(input.value, deleting);
    });
  });
}
