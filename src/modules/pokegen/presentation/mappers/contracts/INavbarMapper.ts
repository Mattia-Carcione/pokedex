import { Generation } from "@/modules/pokegen/domain/entities/Generation";
import { IMapper } from "@/core/contracts/mappers/IMapper";
import { NavbarViewModel } from "@/app/presentation/viewmodels/NavbarViewModel";

/**
 * Interfaccia per il mapper della vista della generazione.
 */
export interface INavbarMapper extends IMapper<Generation[], NavbarViewModel> {}