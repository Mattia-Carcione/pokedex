<script setup>
    import { RouterLink, useRoute } from 'vue-router';
    const route = useRoute();
</script>

<template>
    <div v-if="route.name != 'NotFound'" class="size-14 animate-bounce absolute fixed bottom-10 left-5 z-30">
        <RouterLink to="#home" aria-label="Vai all'inizio">
            <img class="origin-center rotate-180" src="/icons/arrowDown.svg" alt="Arrow up icon">
            <img src="/icons/poke-icon.svg" alt="poké ball icon">
        </RouterLink>
    </div>
</template>