const languageSwitcher = document.getElementById("languageSwitcher");

let currentLang = "en";
let translations = {};

async function loadLanguage(lang) {
  const res = await fetch(`/locales/${lang}.json`);
  translations = await res.json();
  currentLang = lang;
  renderTable();
}

languageSwitcher.addEventListener("change", (e) => {
  loadLanguage(e.target.value);
});

window.loadLanguage = loadLanguage;
