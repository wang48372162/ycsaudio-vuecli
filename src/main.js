import { createApp } from 'vue'
import { router } from './router'
import storage from './modules/storage'
import nprogress from './modules/nprogress'
import layouts from './layouts'
import App from './App'
import './registerServiceWorker'
import './assets/scss/app.scss'

createApp(App)
  .use(router)
  .use(storage)
  .use(nprogress, {
    parent: '#app',
    showSpinner: false
  })
  .use(layouts)
  .mount('#app')
