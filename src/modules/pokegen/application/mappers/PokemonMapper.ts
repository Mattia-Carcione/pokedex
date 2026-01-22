import { Pokemon } from "../../domain/entities/Pokemon";
import { MappingError } from "@/core/errors/MappingError";
import { PokemonDTO } from "../../data/models/dtos/PokemonDto";
import { IPokemonMapper } from "@/modules/pokegen/application/mappers/contracts/IPokemonMapper";
import { ILogger } from "@/core/contracts/infrastructure/logger/ILogger";
import { PokemonAggregateData } from "../../data/models/types/PokemonAggregateData";
import { PokemonSpeciesDTO } from "../../data/models/dtos/PokemonSpeciesDto";

/**
 * Mapper per convertire i dati del Pokémon dal DTO al dominio.
 */
export class PokemonMapper implements IPokemonMapper {
    constructor(private readonly logger: ILogger) {}

    /**
     * Converte un oggetto PokemonDTO in un'entità Pokemon del dominio.
     * @param dto - L'oggetto PokemonDTO da convertire.
     * @returns L'entità Pokemon corrispondente.
     */
    map(dto :PokemonAggregateData) : Pokemon {
        const { pokemon, species, evolutions, forms } = dto;

        if (!pokemon.id || !pokemon.name || !pokemon.types || !pokemon.sprites || !pokemon.weight || !pokemon.height || !pokemon.stats) {
            this.logger.error("[PokemonMapper] - Proprietà richieste mancanti: ", pokemon);
            throw new MappingError<PokemonDTO>("[PokemonMapper] - Error during Pokémon mapping: Missing required properties.", pokemon);
        }
        
        try {
            const types = pokemon.types.map(t => ({ slot: t.slot, name: t.type.name, url: t.type.url }));
            
            const entity = new Pokemon(
                pokemon.id,
                pokemon.species.name,
                types.sort((a, b) => a.slot - b.slot),
                pokemon.sprites.other?.home.front_default || pokemon.sprites.front_default ||'',
                pokemon.height,
                pokemon.weight,
                pokemon.stats.map(s => ({ name: s.stat.name, base: s.base_stat }))
            );

            if(species)
                this.mapSpecies(entity, species);

            if(evolutions) { }

            if(forms) { }

            return entity;
        } catch (error) {
            this.logger.error("[PokemonMapper] - Errore durante il mapping del Pokémon. " + (error as Error).message);
            throw new MappingError<PokemonAggregateData>("[PokemonMapper] - Error during Pokémon mapping", dto, error as Error);
        }
    }

    /**
     * Mappa i dati della specie del Pokémon nell'entità Pokemon.
     * @param pokemon  L'entità Pokemon da aggiornare.
     * @param dto I dati della specie del Pokémon.
     * @returns L'entità Pokemon aggiornata con i dati della specie.
     */
    private mapSpecies(pokemon: Pokemon, dto: PokemonSpeciesDTO): Pokemon {
        if (!dto.capture_rate || !dto.genera || !dto.generation || !dto.flavor_text_entries) {
            this.logger.error("[PokemonMapper] - Proprietà richieste mancanti in PokemonSpeciesDTO: ", dto);
            throw Error("[PokemonMapper] - Error during Pokémon Species mapping: Missing required properties.");
        }
            
        try {
            pokemon.genus = dto.genera.find((g: any) => g.language.name === "en")?.genus || "";
            pokemon.flavorText = dto.flavor_text_entries
            .filter((entry) => entry.language.name === "en")
            .map((entry) => ({
                version: entry.version.name,
                text: entry.flavor_text.replace(/[\n\f]/g, " ")
            }));
            pokemon.captureRate = dto.capture_rate;
            pokemon.generation = dto.generation.name;
            pokemon.evolutionUrl = dto.evolution_chain?.url || "";
            pokemon.genderRate = dto.gender_rate;
            pokemon.varieties = dto.varieties;
            
            return pokemon;
        } catch (error) {
            this.logger.error("[PokemonMapper] - Errore durante il mapping della specie del Pokémon. " + (error as Error).message);
            throw Error("[PokemonMapper] - Error during Pokémon Species mapping. " + (error as Error).message);
        }
    }
}