import { AppRouteName } from "@/shared/core/enums/AppRouteName";
import HomeView from "./views/HomeView.vue";
import DetailView from "./views/DetailView.vue";

/**
 * Percorsi delle rotte per la funzionalità PokéGen.
 */
export const pokegenRoutes =[
    { path: '/generation/:id([1-9]\\d*)', name: AppRouteName.Generation, props: true, component: HomeView, },
    { path: '/pokemon/:name/:id([1-9]\\d*)', name: AppRouteName.Pokemon, props: true, component: DetailView, },
]