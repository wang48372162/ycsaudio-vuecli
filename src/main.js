import Vue from 'vue'
import VueCookies from 'vue-cookies'
import NProgress from 'vue-nprogress'
import App from './App'
import router from './router'
import './registerServiceWorker'
import './assets/scss/app.scss'

Vue.config.productionTip = false

Vue.use(NProgress)
const nprogress = new NProgress()

Vue.use(VueCookies)
VueCookies.config('1y')

new Vue({
  router,
  nprogress,
  render: h => h(App)
}).$mount('#app')
