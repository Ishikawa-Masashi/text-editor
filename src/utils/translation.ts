import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import { EnglishLanguage } from '../languages/english';
import { JapaneseLanguage } from '../languages/japanese';

i18n.use(initReactI18next).init({
  resources: {
    [EnglishLanguage.code]: EnglishLanguage,
    [JapaneseLanguage.code]: JapaneseLanguage,
  },
  lng: 'ja',
  fallbackLng: 'ja',
  interpolation: {
    escapeValue: false,
  },
});
