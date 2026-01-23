import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import en from "./locales/en.json";
import ar from "./locales/ar.json";
import fr from "./locales/fr.json";
import homeEn from "./locales/en/home.json";
import homeAr from "./locales/ar/home.json";
import homeFr from "./locales/fr/home.json";
import sidebarEn from "./locales/en/sidebar.json";
import sidebarAr from "./locales/ar/sidebar.json";
import sidebarFr from "./locales/fr/sidebar.json";

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: "en",
    debug: false,
    interpolation: {
      escapeValue: false,
    },
    resources: {
      en: {
        translation: en,
        home: homeEn,
        sidebar: sidebarEn
      },
      ar: {
        translation: ar,
        home: homeAr,
        sidebar: sidebarAr
      },
      fr: {
        translation: fr,
        home: homeFr,
        sidebar: sidebarFr
      },
    },
  });

export default i18n;
