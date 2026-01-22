/**
 * Classe di utilità per operazioni matematiche.
 */
export class MathHelper {
  private constructor() {}

  /**
   * Converte un valore numerico in una percentuale formattata a due cifre decimali.
   * @param num - Il valore numerico da convertire.
   * @returns Il valore convertito in percentuale, con due cifre decimali.
   */
  static formatPercentageValue(num: number): number {
    return Number(((num / 255) * 100).toFixed(2));
  }

  /**
   * Converte un valore in decimetri a metri, formattato a due cifre decimali.
   * @param value - Il valore in decimetri da convertire.
   * @returns Il valore convertito in metri, con due cifre decimali.
   */
  static formatDecimeterValue(value: number): number {
    return Number((value / 10).toFixed(2));
  }

  /**
   * Converte un numero arabo in numero romano.
   * Supporta numeri da 1 a 3999.
   */
  static convertToRomanNumber(number: number): string {
    if (number <= 0 || number > 3999) {
      throw new Error("Number out of range (must be between 1 and 3999): " + number);
    }

    // Mappa dei valori romani principali
    const mappaRomana: { [key: number]: string } = {
      1000: 'M',
      900:  'CM',
      500:  'D',
      400:  'CD',
      100:  'C',
      90:   'XC',
      50:   'L',
      40:   'XL',
      10:   'X',
      9:    'IX',
      5:    'V',
      4:    'IV',
      1:    'I'
    };

    let risultato = "";
    
    // Ordiniamo le chiavi in modo decrescente
    const chiavi = Object.keys(mappaRomana)
      .map(Number)
      .sort((a, b) => b - a);

    for (const valore of chiavi) {
      while (number >= valore) {
        risultato += mappaRomana[valore];
        number -= valore;
      }
    }

    return risultato;
  }
}