import i18n, { type InitOptions } from 'i18next';
import { initReactI18next } from 'react-i18next';
// import LangeDetector from 'i18next-browser-languagedetector';
// import { languages } from './languages';

// Locales
import ar from './locale/ar.json';
import de from './locale/de.json';
import en from './locale/en.json';
import es from './locale/es.json';
import fr from './locale/fr.json';
import hi from './locale/hi.json';
import ja from './locale/ja.json';
import ko from './locale/ko.json';
import ru from './locale/ru.json';
import zh from './locale/zh.json';

const options: InitOptions = {
  lng: typeof window !== 'undefined' ? window.location.pathname.split('/')[1] : undefined,
  debug: process.env.NODE_ENV === 'development',
  fallbackLng: 'en',
  resources: {
    ar: { translation: ar },
    de: { translation: de },
    en: { translation: en },
    es: { translation: es },
    fr: { translation: fr },
    hi: { translation: hi },
    ja: { translation: ja },
    ko: { translation: ko },
    ru: { translation: ru },
    zh: { translation: zh },
  },
  react: {
    useSuspense: false,
  },
  interpolation: {
    /**
     * react already safes from xss
     * @see https://www.i18next.com/translation-function/interpolation#unescape
     */
    escapeValue: false,
  },
};

i18n.use(initReactI18next);

// initialize if not already initialized
if (!i18n.isInitialized) {
  i18n.init(options, () => {
    if (typeof window !== 'undefined') {
      document.documentElement.dir = i18n.dir();
    }
  });
}

export default i18n;
