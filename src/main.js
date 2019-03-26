import Vue from 'vue'
import NProgress from 'vue-nprogress'
import App from './App.vue'
import router from './router'
import './registerServiceWorker'
import './assets/app.scss'

Vue.config.productionTip = false

Vue.use(NProgress)
const nprogress = new NProgress()

new Vue({
  router,
  nprogress,
  render: h => h(App)
}).$mount('#app')
