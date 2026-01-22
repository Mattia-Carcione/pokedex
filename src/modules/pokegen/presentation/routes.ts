import { AppRouteName } from "@/app/routing/AppRouteName";
// @ts-ignore - Vue 3 dynamic import type declaration
import HomeView from "@/modules/pokegen/presentation/views/HomeView.vue";
// @ts-ignore - Vue 3 dynamic import type declaration
import DetailView from "@/modules/pokegen/presentation/views/DetailView.vue";

/**
 * Percorsi delle rotte per la funzionalità PokéGen.
 */
export const pokegenRoutes =[
    { path: '/generation/:id([1-9]\\d*)', name: AppRouteName.Generation, props: true, component: HomeView, },
    { path: '/pokemon/:name', name: AppRouteName.Pokemon, props: true, component: DetailView, },
]