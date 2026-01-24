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
import profileEn from "./locales/en/profile.json";
import profileAr from "./locales/ar/profile.json";
import profileFr from "./locales/fr/profile.json";
import discoverEn from "./locales/en/discover.json";
import discoverAr from "./locales/ar/discover.json";
import discoverFr from "./locales/fr/discover.json";
import aiEn from "./locales/en/ai.json";
import aiAr from "./locales/ar/ai.json";
import aiFr from "./locales/fr/ai.json";
import marketplaceEn from "./locales/en/marketplace.json";
import marketplaceAr from "./locales/ar/marketplace.json";
import marketplaceFr from "./locales/fr/marketplace.json";

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
        sidebar: sidebarEn,
        profile: profileEn,
        discover: discoverEn,
        ai: aiEn,
        marketplace: marketplaceEn
      },
      ar: {
        translation: ar,
        home: homeAr,
        sidebar: sidebarAr,
        profile: profileAr,
        discover: discoverAr,
        ai: aiAr,
        marketplace: marketplaceAr
      },
      fr: {
        translation: fr,
        home: homeFr,
        sidebar: sidebarFr,
        profile: profileFr,
        discover: discoverFr,
        ai: aiFr,
        marketplace: marketplaceFr
      },
    },
  });

export default i18n;
