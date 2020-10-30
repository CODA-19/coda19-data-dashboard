import Vue from 'vue'
import App from './App.vue'
import Router from 'vue-router'
import router from './router/router'
import "@/assets/scss/style.scss"
import 'bootstrap'
import underscore from 'vue-underscore';
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'
import vuetify from './plugins/vuetify';
import Axios from 'axios'
import VueLogger from 'vuejs-logger';
import i18n from '@/plugins/i18n';
import * as Keycloak from 'keycloak-js';

Vue.prototype.$http = Axios;

Vue.use(Router)

// Install BootstrapVue
Vue.use(BootstrapVue)
// Optionally install the BootstrapVue icon components plugin
Vue.use(IconsPlugin)

Vue.use(underscore)

Vue.use(VueLogger);

Vue.config.productionTip = false

export const bus = new Vue();

// // prep for Keycloak
// let initOptions = {
//   url: 'http://127.0.0.1:8080/auth', realm: 'myrealm', clientId: 'app-vue', onLoad: 'login-required'
// }
//
// let keycloak = Keycloak(initOptions);
//
// keycloak.init({ onLoad: initOptions.onLoad }).then((auth) => {
//   if (!auth) {
//     window.location.reload();
//   } else {
//     Vue.$log.info("Authenticated");
//
//     new Vue({
//       router,
//       vuetify,
//       i18n,
//       render: h => h(App, { props: { keycloak: keycloak } })
//     }).$mount('#app')
//
//   }
//
//
// //Token Refresh
//   setInterval(() => {
//     keycloak.updateToken(70).then((refreshed) => {
//       if (refreshed) {
//         Vue.$log.info('Token refreshed' + refreshed);
//       } else {
//         Vue.$log.warn('Token not refreshed, valid for '
//           + Math.round(keycloak.tokenParsed.exp + keycloak.timeSkew - new Date().getTime() / 1000) + ' seconds');
//       }
//     }).catch(() => {
//       Vue.$log.error('Failed to refresh token');
//     });
//   }, 6000)
//
// }).catch(() => {
//   Vue.$log.error("Authenticated Failed");
// });


new Vue({
  router,
  vuetify,
  i18n,
  render: function (h) { return h(App) }
}).$mount('#app')
