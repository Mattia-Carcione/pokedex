<script setup>
import { AppRouteName } from '@/app/routing/AppRouteName';
import { RouterLink } from 'vue-router';

</script>

<template>
    <h5>&copy; 
        <RouterLink :to="AppRouteName.Home">Pokégen</RouterLink>
     - made by Mattia Carcione</h5>
</template>