<script setup>
import { AppRouteName } from '@/app/routing/AppRouteName';
import { RouterLink } from 'vue-router';
import AppMetaInfo from '@/shared/presentation/components/AppMetaInfo.vue';
</script>

<template>
    <section aria-label="Footer information" class="space-y-2">
        <p>
            Pokémon and all related content are © Nintendo, Game Freak, and The Pokémon Company. 
            Data provided by 
            <a href="https://pokeapi.co/" target="_blank" rel="noopener noreferrer" class="underline">PokéAPI</a>.
        </p>
        <p class="font-semibold text-[var(--color-secondary)]">
            Disclaimer: fan‑made project, not affiliated with Nintendo, Game Freak, or The Pokémon Company.
        </p>
        <p>
            This site is not affiliated with or endorsed by Nintendo, Game Freak, or The Pokémon Company.
        </p>
        <nav aria-label="Legal" class="flex flex-wrap justify-center items-center gap-4">
            <RouterLink :to="{ name: AppRouteName.Privacy }" class="underline">Privacy Policy</RouterLink>
            <RouterLink :to="{ name: AppRouteName.Terms }" class="underline">Terms of Service</RouterLink>
        </nav>
        <AppMetaInfo />
        <p>
            &copy; 
            <RouterLink :to="{ name: AppRouteName.Home }" class="underline">PokéGen</RouterLink>
            <span> - made by Mattia Carcione</span>
        </p>
        <div class="flex justify-center items-center gap-4 pt-3" aria-label="Social links">
            <a href="mailto:mattia.carcione01@gmail.com"
               class="w-10 h-10 flex items-center justify-center rounded-full bg-[var(--bg-custom)]/50 border border-white/20 text-white transition hover:bg-[var(--color-primary)] hover:text-[var(--color-secondary)]"
               aria-label="Email">
                <svg viewBox="0 0 24 24" class="w-5 h-5" fill="currentColor" aria-hidden="true">
                    <path d="M20 4H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2zm0 4-8 5-8-5V6l8 5 8-5v2z" />
                </svg>
            </a>
            <a href="https://www.instagram.com/mattia.carcione" target="_blank" rel="noopener noreferrer"
               class="w-10 h-10 flex items-center justify-center rounded-full bg-[var(--bg-custom)]/50 border border-white/20 text-white transition hover:bg-[var(--color-primary)] hover:text-[var(--color-secondary)]"
               aria-label="Instagram">
                <svg viewBox="0 0 24 24" class="w-5 h-5" fill="currentColor" aria-hidden="true">
                    <path d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5zm10 2H7a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3zm-5 3.5A5.5 5.5 0 1 1 6.5 13 5.5 5.5 0 0 1 12 7.5zm0 2A3.5 3.5 0 1 0 15.5 13 3.5 3.5 0 0 0 12 9.5zm5.25-3.75a1.25 1.25 0 1 1-1.25-1.25 1.25 1.25 0 0 1 1.25 1.25z" />
                </svg>
            </a>
            <a href="https://www.linkedin.com/in/mattia-carcione-developer" target="_blank" rel="noopener noreferrer"
               class="w-10 h-10 flex items-center justify-center rounded-full bg-[var(--bg-custom)]/50 border border-white/20 text-white transition hover:bg-[var(--color-primary)] hover:text-[var(--color-secondary)]"
               aria-label="LinkedIn">
                <svg viewBox="0 0 24 24" class="w-5 h-5" fill="currentColor" aria-hidden="true">
                    <path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5zM3 9h4v12H3zM14.5 9A4.5 4.5 0 0 1 19 13.5V21h-4v-6.5a2.5 2.5 0 0 0-5 0V21H6V9h4v1.5A4.5 4.5 0 0 1 14.5 9z" />
                </svg>
            </a>
        </div>
    </section>
</template>