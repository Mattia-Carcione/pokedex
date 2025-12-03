import { createRouter, createWebHistory } from 'vue-router';

import HomeView from '@/views/HomeView.vue';
import GenerationView from '@/views/GenerationView.vue';
import PokemonView from '@/views/PokemonView.vue';

const routes = [
    { path: '/:pathMatch(.*)*', name: 'NotFound', component: () => import('../views/404View.vue') },
    { path: '/', name: 'home', component: HomeView, },
    { path: '/generation/:id([1-9]\\d*)', name: 'generation', props: true, component: GenerationView, },
    { path: '/pokemon/:name/:id([1-9]\\d*)', name: 'pokemon', props: true, component: PokemonView, },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (to.hash) {
      return {
        el: to.hash,
        behavior: 'smooth',
      }
    }
    return { top: 0 }
  }
});

export default router