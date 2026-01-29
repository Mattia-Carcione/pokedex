import './app/styles/main.css';
import { createApp } from 'vue';
import App from './app/App.vue';
import Hero from './app/presentation/layout/Hero.vue';
import Navbar from './app/presentation/layout/Navbar.vue';
import pinia from './app/providers/Pinia';
import router from './app/routing';
import Footer from './app/presentation/layout/Footer.vue';

const app = createApp(App);
app.use(pinia);
app.use(router);
app.mount('#app');


const hero = createApp(Hero);
hero.use(router);
hero.mount('#header');

const nav = createApp(Navbar);
nav.use(router);
nav.mount('#nav');

const footer = createApp(Footer);
footer.use(router);
footer.mount('#footer');