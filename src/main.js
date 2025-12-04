import '../src/styles/global.css';
import { createApp } from 'vue';
import { createPinia } from 'pinia'
import App from './App.vue';
import Hero from './components/Hero.vue';
import CustomNav from './components/CustomNav.vue';
import router from './routing';
import { PokeApiService } from './services/pokeApiService';

const pinia = createPinia();
const app = createApp(App);
app.use(pinia);
app.use(router);
app.mount('#app');

const hero = createApp(Hero);
hero.use(pinia);
hero.use(router);
hero.mount('#header');

const nav = createApp(CustomNav);
nav.use(pinia);
nav.use(router);
nav.mount('#nav');

const api = new PokeApiService();
await api.GetAndStoreData();