const root = document.documentElement;
const themeToggle = document.getElementById("theme-toggle");

function systemPrefersDark() {
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
}

function currentTheme() {
  return root.dataset.theme || (systemPrefersDark() ? "dark" : "light");
}

try {
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme) {
    root.dataset.theme = savedTheme;
  }
} catch (error) {
}

function updateThemeButton() {
  if (!themeToggle) return;
  const isDark = currentTheme() === "dark";
  themeToggle.setAttribute("aria-pressed", String(isDark));
  themeToggle.setAttribute(
    "aria-label",
    isDark ? "Включить светлую тему" : "Включить тёмную тему"
  );
}

if (themeToggle) {
  updateThemeButton();
  themeToggle.addEventListener("click", () => {
    const next = currentTheme() === "dark" ? "light" : "dark";
    root.dataset.theme = next;
    try {
      localStorage.setItem("theme", next);
    } catch (error) {
    }
    updateThemeButton();
  });
}
