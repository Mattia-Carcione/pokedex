<script setup>
    import { RouterLink, useRoute } from 'vue-router';
    import { TITLE } from '@/app/const';
    import { AppRouteName } from '@/app/routing/AppRouteName';

    const route = useRoute();
</script>

<template>
    <div class="text-center">
        <RouterLink :to="{ name: AppRouteName.Home }" aria-label="Vai alla home">
            <h1 class="pokemon my-5" translate="no">
                {{ TITLE }}
            </h1>
        </RouterLink>
        <p id="set-gen"
            class="font-bold text-[2rem] text-[var(--color-primary)] [text-shadow:-1px_-1px_0_#0075BE,1px_-1px_0_#0075BE,-1px_1px_0_#0075BE,1px_1px_0_#0075BE]">
            Select a Generation:
        </p>
    </div>
</template>