/**
* repositories/pokeApiRepository
*
* Esempio di repository che usa apiClient per fare fetch dei dati utente.
* Il repository non sa nulla di IndexedDB: la cache è trasparente a livello di http client.
*/
import { pokeApiClient } from "@/lib/Http/HttpClient";
import { GenerationRepository } from "../repositories/generationRepository";
import { PokemonRepository } from "../repositories/pokemonRepository";
import { PokemonSpeciesRepository } from "../repositories/pokemonSpeciesRepository";
import { PokeApiRepository } from "@/repositories/pokeApiRepository";
import { Mapper } from "@/utils/mapper";
import { Version, VersionGroup } from "@/types/pokemon/versionGroup";

/**
 * Classe che rappresenta il repository per la pokeApi
 */
export class PokeApiService {
    private _pkmRepository = new PokemonRepository(this.client);
    private _pkmSpeciesRepository = new PokemonSpeciesRepository(this.client);
    private _genRepository = new GenerationRepository(this.client);
    private _pokeApiRepository = new PokeApiRepository(this.client);
    constructor(private client = pokeApiClient) { }

    /**
     * Metodo che recupera tutti i dati e li salva in cache.
     * Se i dati sono già presenti in cache, recupera quelli.
     * @param cacheTTL ms opzionale per salvare TTL nel cache layer 
     */
    async GetAndStoreData(cacheTTL?: number): Promise<void | null> {
        try {
            await this._genRepository.GetAll(cacheTTL);
            await this._pkmRepository.GetAllByGen(1, cacheTTL);
            await this._pkmSpeciesRepository.GetAllByGen(1, cacheTTL);
            await this._pokeApiRepository.getVersionGroups(cacheTTL);
        } catch (err) {
            console.warn(`Error GetAndStoreData fetching data. \n${err}`);
            return null;
        }
    }

    async GetVersionDetail(lang: 'en' | 'it', cacheTTL?: number): Promise<any> {
        const data = await this._pokeApiRepository.getVersionGroups(cacheTTL) as { vg: VersionGroup[]; names: Version[]; };
        if (!data) return [];
        return data.vg.map(vgItem => {
            const relatedNames = vgItem.versions.map(v => data.names.find(x => x.name == v.name));
            return Mapper.MapVersionGroup(vgItem, relatedNames, lang);
        });
    }
}