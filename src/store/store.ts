// store.js
import { defineStore } from 'pinia';
import { ref } from 'vue';

/**
 * Funzione getter e setter della generazione nello store
 */
export const useGenStore = defineStore('gen', () => {
  const id = ref(null);
  function setId(newId: number | string) {
    id.value = newId;
  }

  return { id, setId };
});

export const useVersionStore = defineStore("version", {
    state: () => ({
        generations: [] as Array<{ generation: number; versions: string[] }>
    }),
    actions: {
        setGenerations(list: Array<{ generation: number; versions: string[] }>) {
            this.generations = list;
        }
    }
});