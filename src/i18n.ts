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
import sellerEn from "./locales/en/seller.json";
import sellerAr from "./locales/ar/seller.json";
import sellerFr from "./locales/fr/seller.json";
import heritageEn from "./locales/en/heritage-data.json";
import heritageAr from "./locales/ar/heritage-data.json";
import heritageFr from "./locales/fr/heritage-data.json";
import citiesEn from "./locales/en/cities.json";
import citiesAr from "./locales/ar/cities.json";
import citiesFr from "./locales/fr/cities.json";
import cityDetailsEn from "./locales/en/citydetails.json";
import cityDetailsAr from "./locales/ar/citydetails.json";
import cityDetailsFr from "./locales/fr/citydetails.json";
import libraryEn from "./locales/en/library.json";
import libraryAr from "./locales/ar/library.json";
import libraryFr from "./locales/fr/library.json";
import traditionsEn from "./locales/en/traditions.json";
import traditionsAr from "./locales/ar/traditions.json";
import traditionsFr from "./locales/fr/traditions.json";
import clothesEn from "./locales/en/clothes.json";
import clothesAr from "./locales/ar/clothes.json";
import clothesFr from "./locales/fr/clothes.json";
import foodsEn from "./locales/en/foods.json";
import foodsAr from "./locales/ar/foods.json";
import foodsFr from "./locales/fr/foods.json";
import condolenceEn from "./locales/en/condolence.json";
import condolenceAr from "./locales/ar/condolence.json";
import condolenceFr from "./locales/fr/condolence.json";
import weddingEn from "./locales/en/wedding.json";
import weddingAr from "./locales/ar/wedding.json";
import weddingFr from "./locales/fr/wedding.json";
import soapStoryEn from "./locales/en/soapStory.json";
import soapStoryAr from "./locales/ar/soapStory.json";
import soapStoryFr from "./locales/fr/soapStory.json";

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
        marketplace: marketplaceEn,
        seller: sellerEn,
        heritage: { ...heritageEn, ...libraryEn },
        cities: citiesEn,
        cityDetails: cityDetailsEn,
        library: libraryEn,
        traditions: traditionsEn,
        clothes: clothesEn,
        foods: foodsEn,
        condolence: condolenceEn,
        wedding: weddingEn,
        soapStory: soapStoryEn
      },
      ar: {
        translation: ar,
        home: homeAr,
        sidebar: sidebarAr,
        profile: profileAr,
        discover: discoverAr,
        ai: aiAr,
        marketplace: marketplaceAr,
        seller: sellerAr,
        heritage: { ...heritageAr, ...libraryAr },
        cities: citiesAr,
        cityDetails: cityDetailsAr,
        library: libraryAr,
        traditions: traditionsAr,
        clothes: clothesAr,
        foods: foodsAr,
        condolence: condolenceAr,
        wedding: weddingAr,
        soapStory: soapStoryAr
      },
      fr: {
        translation: fr,
        home: homeFr,
        sidebar: sidebarFr,
        profile: profileFr,
        discover: discoverFr,
        ai: aiFr,
        marketplace: marketplaceFr,
        seller: sellerFr,
        heritage: { ...heritageFr, ...libraryFr },
        cities: citiesFr,
        cityDetails: cityDetailsFr,
        library: libraryFr,
        traditions: traditionsFr,
        clothes: clothesFr,
        foods: foodsFr,
        condolence: condolenceFr,
        wedding: weddingFr,
        soapStory: soapStoryFr
      },
    },
  });

export default i18n;
