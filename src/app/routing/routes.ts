import { pokegenRoutes } from '@/modules/pokegen/presentation/routes';
// @ts-ignore - Vue 3 dynamic import type declaration
import NotFound from '@/shared/presentation/components/404View.vue';
import { AppRouteName } from '@/app/routing/AppRouteName';

/**
 * Definizione delle rotte dell'applicazione.
 */
export const routes = [
    { path: '/:pathMatch(.*)*', name: AppRouteName.NotFound, component: NotFound },
    { path: '/', redirect: '/generation/1', name: AppRouteName.Home, },
    ...pokegenRoutes,
];