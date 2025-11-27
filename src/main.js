import { createApp } from 'vue';
import { createPinia } from 'pinia'
import App from './App.vue';
import router from './routing';
import { PokeApiService } from './services/pokeApiService';

const pinia = createPinia();
const app = createApp(App);
app.use(pinia);
app.use(router);
app.mount('#app');

const api = new PokeApiService();
await api.FetchPokeApi();