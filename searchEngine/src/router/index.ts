import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/Home.vue'
import BookContent from '@/views/BookContent.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/livre',
      name: 'Livre',
      component: BookContent,
    },
  ],
})

export default router
