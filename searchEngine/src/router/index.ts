import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/Home.vue'
import BookContent from '@/views/BookContent.vue'
import BookReader from '@/views/BookReader.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/books/:id',
      name: 'book',
      component: BookContent,
      props: true,
    },
    {
      path: '/books/:id/bookReader',
      name: 'bookReader',
      component: BookReader,
      props: true,
    },
  ],
})

export default router
