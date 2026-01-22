import { NavbarViewModel } from "@/app/presentation/viewmodels/NavbarViewModel";
import { Generation } from "../../domain/entities/Generation";
import { INavbarMapper } from "./contracts/INavbarMapper";
import { MappingError } from "@/core/errors/MappingError";
import { AppRouteName } from "@/app/routing/AppRouteName";
import { MathHelper } from "@/core/utils/math/MathHelper";
import { ILogger } from "@/core/contracts/infrastructure/logger/ILogger";

/**
 * Mapper per convertire i dati della generazione in un NavbarViewModel.
 */
export class NavBarMapper implements INavbarMapper {
    constructor(private readonly logger: ILogger) {}
    /**
     * Mappa un array di entità Generation in un NavbarViewModel.
     * @param source - L'array di entità Generation da mappare
     * @returns L'oggetto NavbarViewModel risultante dalla mappatura
     * @throws MappingError se la mappatura fallisce
     */
    map(source: Generation[]): NavbarViewModel {
        try {
            const data = source.map(gen => {
                return {
                    version: gen.version,
                    displayVersion: MathHelper.convertToRomanNumber(gen.version),
                    href: { name: AppRouteName.Generation, params: { id: Number(gen.version) } },
                    label: `Vai alla Generazione: ${gen.version}`,
                }
            });
            return new NavbarViewModel(data);
        } catch (error) {
            this.logger.error("[NavBarMapper] - Errore durante la mappatura della generazione", (error as Error).message);
            throw new MappingError<Generation[]>("[NavBarMapper] - Error during mapping of generation", source, error as Error);
        }
    }
}