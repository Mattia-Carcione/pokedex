import { IService } from "@/core/contracts/services/IServices";
import { Pokemon } from "@/modules/pokegen/domain/entities/Pokemon";

export interface INavigationPokemonLoaderService extends IService<Pokemon[]> { }
