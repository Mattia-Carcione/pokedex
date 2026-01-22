<script setup>
    import { useRoute, RouterLink } from 'vue-router';
    import { AppRouteName } from '@/app/routing/AppRouteName';

    const error = defineProps(['error']);
    const route = useRoute();
    const message = error.error ?? 'Unknown error.';
</script>

<template>
    <div class="container mx-auto px-4 h-dvh">
        <h1 class="text-6xl font-bold text-[#ee6052] text-center mt-12">Something went wrong.</h1>

        <div class="flex flex-wrap mt-8">
            <div class="w-full md:w-1/2 flex justify-center">
                <img src="/404.png" alt="sad pokemon" class="h-full w-full">
            </div>

            <div class="w-full md:w-1/2 mt-8 md:mt-0 flex flex-col items-center">
                <h2 id="error" class="text-[10rem] sm:text-[12rem] xs:text-[11rem] text-center text-[#ee6052]">404</h2>
                <h3 class="text-xl mt-4 mb-8 text-center font-bold text-[var(--color-secondary)]">Ops! Page not found. {{ message }}</h3>
                    <RouterLink :to="{ name: AppRouteName.Home }"
                        class="bg-[var(--color-primary)] text-[var(--color-secondary)] px-6 py-3 rounded-lg hover:bg-[var(--color-secondary)] hover:text-[var(--color-primary)] transition border border-2 border-[var(--color-secondary)]"
                        aria-label="Go to Home">
                        Go to Home
                    </RouterLink>
            </div>
        </div>
    </div>
</template>