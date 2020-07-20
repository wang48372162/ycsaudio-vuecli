import Vue from 'vue'
import Router from 'vue-router'
import Home from './pages/home.vue'
import ErrorPage from './pages/error.vue'

Vue.use(Router)

export default new Router({
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '*',
      name: 'error',
      component: ErrorPage
    }
  ]
})
