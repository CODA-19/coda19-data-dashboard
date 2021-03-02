import Vue from 'vue'
import App from './App.vue'
import Router from 'vue-router'
import router from './router/router'
import "@/assets/scss/style.scss"
import 'bootstrap-vue'
import underscore from 'vue-underscore';
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'
import vuetify from './plugins/vuetify';
import Axios from 'axios'
import VueLogger from 'vuejs-logger';
import i18n from '@/plugins/i18n';
import keycloak from './keycloak';
import TokenContext from './api/TokenContext';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faUserSecret } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

Vue.prototype.$http = Axios;

Vue.use(Router)

// Install BootstrapVue
Vue.use(BootstrapVue)
// Optionally install the BootstrapVue icon components plugin
Vue.use(IconsPlugin)

Vue.use(underscore)

Vue.use(VueLogger, { logLevel: 'debug' });

library.add(faUserSecret);

Vue.component('font-awesome-icon', FontAwesomeIcon);

Vue.config.productionTip = false

// Note(malavv) : The dual instantiation of Vue is normal, here it is used just for an encapsulated EventBus.
export const bus = new Vue();

// prep for Keycloak
keycloak.init({ onLoad: 'login-required' }).then((auth) => {
  if (!auth) {
    window.location.reload();
  } else {
    Vue.$log.info("Authenticated");

    TokenContext.setToken(keycloak.token);

    new Vue({
      router,
      vuetify,
      i18n,
      render: h => h(App, { props: { keycloak: keycloak } })
    }).$mount('#app')

  }


  //Token Refresh
  setInterval(() => {
    keycloak.updateToken(70).then((refreshed) => {
      if (refreshed) {
        Vue.$log.info('Token refreshed' + refreshed);
        TokenContext.setToken(keycloak.token);
      } else {
        Vue.$log.warn('Token not refreshed, valid for '
          + Math.round(keycloak.tokenParsed.exp + keycloak.timeSkew - new Date().getTime() / 1000) + ' seconds');
      }
    }).catch(() => {
      Vue.$log.error('Failed to refresh token');
    });
  }, 6000)

}).catch(() => {
  Vue.$log.error("Authenticated Failed");
});
