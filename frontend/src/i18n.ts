import i18n from 'i18next';
import i18nBackend from "i18next-http-backend";
import { initReactI18next } from 'react-i18next';
import { HOST_URL } from './pages/constants';

i18n
    .use(i18nBackend)
    .use(initReactI18next)
    .init({
        lng: 'en',
        interpolation: {
            escapeValue: false
        },
        backend: {
            loadPath: `${HOST_URL}/locales/{{lng}}/{{lng}}.json`,
        }
    });

export default i18n;