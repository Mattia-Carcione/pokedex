// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from "@tailwindcss/vite";
import { BASE_PATH } from './src/const';

// https://astro.build/config
export default defineConfig({
    site: "https://mattia-carcione.github.io",
    vite: {
      plugins: [tailwindcss()],
    },
    output: 'static',
    base: BASE_PATH,
});
