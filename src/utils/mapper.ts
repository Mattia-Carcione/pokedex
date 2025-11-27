import { NavGen } from "@/types/components/navGen";
import { Generation } from "@/types/pokemon/generation";

export class Mapper {
    private constructor() {}

    static NavbarMapper(data: Generation[]): NavGen[] {
        return data.map((e) => {
            const name = SetGenerationName(e.name);
            return {
                id: e.id,
                name: name,
                href: `/generation/${e.id}`,
                label: `Vai alla Gen ${e.id}`
            }
        })
    }
}

function SetGenerationName(input: string): string {
    return input.split('-')[input.split("-").length - 1].toUpperCase();
}
