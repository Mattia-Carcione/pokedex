/**
 * Converte un numero arabo in numero romano.
 * Supporta numeri da 1 a 3999.
 */
export function convertToRomanNumber(number: number): string {
  if (number <= 0 || number > 3999) {
    throw new Error("Il numero deve essere compreso tra 1 e 3999.");
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