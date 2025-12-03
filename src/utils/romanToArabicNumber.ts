const map: { [key: string]: number } = { I: 1, V: 5, X: 10, L: 50, C: 100, D: 500, M: 1000 };

/**
 * Funzione helper per trasformare i numeri romani in numeri arabi
 * @param roman (string) numero romano
 * @returns ritorna il numero arabo (number)
 */
export function RomanToArabic(roman: string): number {
    let result = 0;
    let prev = 0;
    for (let i = roman.length - 1; i >= 0; i--) {
        const current = map[roman[i].toUpperCase()];
        if (!current) return NaN; // gestione caratteri non validi
        if (current < prev) {
            result -= current;
        } else {
            result += current;
        }
        prev = current;
    }
    return result;
}
