import NProgress from 'nprogress'
import { router } from '../router'
import 'nprogress/nprogress.css'

export const nprogress = NProgress

export function loadStart() {
  nprogress.start()
}

export function loadEnd() {
  nprogress.done()
}

export default {
  install(app, options) {
    nprogress.configure(options)

    nprogress.disableLoadedPageDone = route => {
      route.meta.showProgressBar = false
    }

    router.beforeEach((to, from, next) => {
      nprogress.start()
      next()
    })

    router.afterEach(to => {
      if (to.meta && typeof to.meta.showProgressBar === 'boolean' ? to.meta.showProgressBar : true) {
        nprogress.done()
      }
    })
  }
}
