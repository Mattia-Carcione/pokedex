import { DetailPkm, VersionDetail } from "@/types/components/detailPkm";

/**
 * Raggruppa i flavor text per generazione.
 *
 * Per ogni VersionDetail:
 *  - trova tutti i flavor text di quella generazione (match su version)
 *  - crea un array con {text, version}
 *  - raggruppa più versioni sotto la stessa generazione
 *
 * L'output è:
 * [
 *   {
 *     generation: number,
 *     flavorText: [
 *        { text: string, version: string },
 *        ...
 *     ]
 *   },
 *   ...
 * ]
 */
export function mapGenerationFlavorTextList(versionDetails: VersionDetail[], { flavorText }: DetailPkm) {
    try {
        if (!Array.isArray(versionDetails)) return [];
        const grouped = new Map<number, { text: string; version: string }[]>();
        for (const vg of versionDetails) {
            try {
                const gen = Number(vg?.generation);
                if (!grouped.has(gen)) grouped.set(gen, []);
                const matched = flavorText.filter(
                    ft => ft && vg?.versions.map((x) => x[ft.version])
                );
                for (const ft of matched) {
                    const italianVersion = vg.versions
                        .map(v => v[ft.version])
                        .find(v => Boolean(v));
                    grouped.get(gen)?.push({
                        text: ft.text,
                        version: italianVersion
                    });
                }
            } catch (err) {
                console.log(err);
            }
        }
        return Array.from(grouped.entries()).map(([generation, flavorText]) => ({
            generation,
            flavorText
        }));
    } catch (err) {
        console.log(err);
        return [];
    }
}