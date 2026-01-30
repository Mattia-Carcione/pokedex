import { watch } from 'vue';
import { createPokemonStructuredData, createStructuredData, setSeoTags, setStructuredData } from '@/shared/presentation/composables/useSeo';
import { DetailViewModel } from '@/modules/pokegen/presentation/viewmodels/DetailViewModel';

export const usePokegenHomeSeo = (route: any, generationIdRef: { value?: string | null }) => {
    const updateHomeSeo = (generationId?: string | null, search?: unknown) => {
        if (typeof search === 'string' && search.length >= 3) {
            const title = `Search: ${search}`;
            const description = `Search results for "${search}" in PokéGen.`;
            setSeoTags({ title, description });
            setStructuredData(createStructuredData({
                title,
                description,
                pageType: 'CollectionPage',
                url: window.location.href,
                breadcrumb: [
                    { name: 'Home', url: '/' },
                    { name: `Search: ${search}`, url: window.location.href },
                ],
            }));
            return;
        }

        if (generationId) {
            const title = `Generation ${generationId}`;
            const description = `Browse all Pokémon from Generation ${generationId} with stats, types, and evolutions.`;
            setSeoTags({ title, description });
            setStructuredData(createStructuredData({
                title,
                description,
                pageType: 'CollectionPage',
                url: window.location.href,
                breadcrumb: [
                    { name: 'Home', url: '/' },
                    { name: `Generation ${generationId}`, url: `/generation/${generationId}` },
                ],
            }));
        }
    };

    watch(() => [route.name, generationIdRef?.value, route.query?.search], ([, newId, search]) => {
        updateHomeSeo(newId as string | null | undefined, search);
    }, { immediate: true });
};

export const usePokegenDetailSeo = (pkmDetailController: any) => {
    watch(() => pkmDetailController.data?.value, (data) => {
        if (data instanceof DetailViewModel && data.pokemon) {
            const pokemon = data.pokemon;
            const title = pokemon.name;
            const description = pokemon.genus
                ? `${pokemon.genus} Find stats, types, evolutions, and lore for ${pokemon.name}.`
                : `Find stats, types, evolutions, and lore for ${pokemon.name}.`;

            setSeoTags({
                title,
                description,
                image: pokemon.sprite,
                url: window.location.href,
                type: 'article',
            });

            const pokemonGraph = createPokemonStructuredData(pokemon, window.location.href);
            setStructuredData(createStructuredData({
                title,
                description,
                image: pokemon.sprite,
                url: window.location.href,
                pageType: 'ItemPage',
                breadcrumb: [
                    { name: 'Home', url: '/' },
                    { name: pokemon.name, url: `/pokemon/${pokemon.name}` },
                ],
                extraGraph: pokemonGraph ? [pokemonGraph] : [],
            }));
        }
    }, { immediate: true });
};
