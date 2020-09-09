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

Vue.prototype.$http = Axios;

Vue.use(Router)

// Install BootstrapVue
Vue.use(BootstrapVue)
// Optionally install the BootstrapVue icon components plugin
Vue.use(IconsPlugin)

Vue.use(underscore)

Vue.config.productionTip = false

new Vue({
  router,
  vuetify,
  render: function (h) { return h(App) }
}).$mount('#app')
