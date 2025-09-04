import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import translationEN from "./en/Translation.json";
import translationGU from "./gu/Translation.json";

const resources = {
  en: { translation: translationEN },
  gu: { translation: translationGU },
};

i18n
  .use(initReactI18next) // Enables React integration
  .use(LanguageDetector) // Detects user language automatically
  .init({
    resources,
    fallbackLng: "en", // Default language
    interpolation: { escapeValue: false }, // Prevents escaping special characters in translations
  });

export default i18n;
