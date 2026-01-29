<script setup>
import { AppRouteName } from '@/app/routing/AppRouteName';
import { RouterLink } from 'vue-router';

</script>

<template>
    <p>
        Pokémon and all related content are © Nintendo, Game Freak, and The Pokémon Company. 
        Data provided by 
        <a href="https://pokeapi.co/" target="_blank" rel="noopener noreferrer" class="underline">PokéAPI</a>.
    </p>
    <p>
        This site is not affiliated with or endorsed by Nintendo, Game Freak, or The Pokémon Company.
    </p>
    <h5>&copy; 
        <RouterLink :to="{ name: AppRouteName.Home }" class="underline">PokéGen</RouterLink>
     - made by Mattia Carcione</h5>
</template>