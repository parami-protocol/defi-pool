import i18n from "i18next";
import { getLanguage } from './utils';
import detector from "i18next-browser-languagedetector";
import { initReactI18next  } from "react-i18next";

import translationEN from './locales/en/translation.json';
import translationZH from './locales/zh/translation.json';
import translationJA from './locales/ja/translation.json';

// the translations
const resources = {
  en_US: {
    translation: translationEN
  },
  zh_CN: {
    translation: translationZH
  },
  zh_TW: {
    translation: translationJA
  }
};

i18n
  .use(detector)
  .use(initReactI18next ) // passes i18n down to react-i18next
  .init({
    resources,
    lng: getLanguage(),
    fallbackLng: getLanguage(),

    keySeparator: false, // we do not use keys in form messages.welcome

    interpolation: {
      escapeValue: false // react already safes from xss
    }
  });

export default i18n;
