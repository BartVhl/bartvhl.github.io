const DEFAULT_LANG = "nl";
const SUPPORTED = new Set(["nl", "en"]);

function getSavedLang() {
  const saved = localStorage.getItem("lang");
  if (saved && SUPPORTED.has(saved)) return saved;

  const browser = (navigator.language || "").slice(0, 2).toLowerCase();
  if (SUPPORTED.has(browser)) return browser;

  return DEFAULT_LANG;
}

async function loadTranslations(lang) {
  const res = await fetch(`${getBasePath()}i18n/${lang}.json`, { cache: "no-store" });
  if (!res.ok) throw new Error(`Missing i18n/${lang}.json`);
  return res.json();
}

function getBasePath() {
  const depth = location.pathname.split("/").filter(Boolean).length - 1;
  return depth <= 0 ? "" : "../".repeat(depth);
}

function deepGet(obj, key) {
  return key.split(".").reduce((acc, part) => (acc && acc[part] != null ? acc[part] : null), obj);
}

function applyTranslations(dict) {
  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const key = el.getAttribute("data-i18n");
    const val = deepGet(dict, key);
    if (val == null) return;

    // allow <br> etc in translations
    el.innerHTML = String(val);
  });
}

function setActiveLangUI(lang) {
  document.documentElement.setAttribute("lang", lang);

  document.querySelectorAll(".lang-btn").forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.lang === lang);
  });
}

async function setLang(lang) {
  if (!SUPPORTED.has(lang)) lang = DEFAULT_LANG;
  localStorage.setItem("lang", lang);

  const dict = await loadTranslations(lang);
  applyTranslations(dict);
  setActiveLangUI(lang);
}

document.addEventListener("click", (e) => {
  const btn = e.target.closest(".lang-btn");
  if (!btn) return;
  setLang(btn.dataset.lang);
});

document.addEventListener("DOMContentLoaded", () => {
  setLang(getSavedLang()).catch((err) => console.error(err));
});
