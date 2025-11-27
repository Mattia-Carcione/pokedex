// store.js
import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useGenStore = defineStore('gen', () => {
  const id = ref(null);
  function setId(newId) {
    id.value = newId;
  }

  return { id, setId };
});
