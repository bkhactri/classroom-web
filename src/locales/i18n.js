import i18n from "i18next";
import Backend from "i18next-xhr-backend";
import LanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";
import translationEN from "./translations/en.json";
import translationVI from "./translations/vi.json";

const resources = {
  "en-US": {
    translation: translationEN,
  },
  "vi-VN": {
    translation: translationVI,
  },
};

const fallbackLng = ["vi-VN"];
const availableLanguages = ["en-US", "vi-VN"];

const options = {
  order: ["localStorage", "navigator", "htmlTag", "path", "subdomain"],
  lookupLocalStorage: "language",
  lookupFromPathIndex: 0,
  lookupFromSubdomainIndex: 0,
  caches: ["localStorage"],
  excludeCacheFor: ["cimode"],
  checkWhitelist: true,
};

i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng,
    whitelist: availableLanguages,
    detection: options,
    react: {
      useSuspense: false,
    },
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
