import { createRouter, createWebHashHistory } from 'vue-router'
import Home from './pages/Home'
import Audio from './pages/Audio'
import Playlist from './pages/Playlist'
import ErrorPage from './pages/Error'

export const routerHistory = createWebHashHistory(process.env.BASE_URL)

export const router = createRouter({
  history: routerHistory,
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/audio/:audio',
      name: 'audio',
      component: Audio
    },
    {
      path: '/playlist/:playlist',
      name: 'playlist',
      component: Playlist
    },
    {
      path: '/:catchAll(.*)',
      name: 'error',
      component: ErrorPage
    }
  ]
})
