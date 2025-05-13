import i18n from "i18next"
import { initReactI18next } from "react-i18next"

import en from "./en/messages.json"
import es from "./es/messages.json"

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    es: { translation: es }
  },
  lng: "en",
  fallbackLng: "en",
  interpolation: {
    escapeValue: false
  }
})

export default i18n
