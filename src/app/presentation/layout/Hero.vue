<script setup>
    import { RouterLink, useRoute } from 'vue-router';
    import { TITLE } from '@/app/const';
    import { AppRouteName } from '@/app/routing/AppRouteName';

    const route = useRoute();
</script>

<template>
    <RouterLink :to="{ name: AppRouteName.Home }" class="mx-auto max-w-fit" aria-label="Vai alla home">
        <h1 class="pokemon my-5" translate="no">
            {{ TITLE }}
        </h1>
    </RouterLink>
</template>