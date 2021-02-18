import Vue from 'vue';
import VueI18n from 'vue-i18n';
Vue.use(VueI18n);

const messages = {
  'en': require('./lang/en.json'),
  'fr': require('./lang/fr.json')
}

const i18n = new VueI18n({locale: 'en',  fallbackLocale: 'fr',  messages});

export default i18n;
