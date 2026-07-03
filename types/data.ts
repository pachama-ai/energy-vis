/**
 * types/data.ts – TypeScript-Typen für die Datenstruktur
 * ========================================================
 *
 * Diese Typen spiegeln die tatsächliche Struktur der JSON-Dateien
 * aus der Datenpipeline (scripts/merge-data.js) wider.
 *
 * DATENQUELLEN:
 * - SMARD (Bundesnetzagentur): Stromerzeugung und -last
 * - ENTSO-E / SMARD: Börsenstrompreise
 * - Zeitraum: 2015–2025, stündliche Auflösung
 *
 * Alle Felder sind als number/number[]/boolean definiert.
 * null-Werte treten in den Rohdaten nicht auf (gefiltert in merge-data.js).
 * ========================================================
 */

/** Einzelner Stundenwert (Hauptdatensatz, ~89.000 Einträge). */
export interface HourEntry {
  ts:            number   // Unix-Timestamp (ms)
  year:          number   // 2015 – 2025
  month:         number   // 1 – 12
  day:           number   // 1 – 31
  hour:          number   // 0 – 23
  weekend:       boolean  // true = Samstag oder Sonntag

  preis:         number   // Börsenstrompreis Day-Ahead (€/MWh)
  negativePrice: boolean  // true wenn preis < 0

  ges:           number   // Gesamte Stromerzeugung (MW)
  ee:            number   // Erneuerbare-Erzeugung (MW)
  eeAnt:         number   // EE-Anteil an Erzeugung (%)
  eeAntLast:     number   // EE-Anteil an Last (%)
  konv:          number   // Konventionelle Erzeugung (MW)
  co2:           number   // CO₂-Intensität (gCO₂/kWh)

  last:          number   // Gesamtlast (MW)
  resLast:       number   // Residuallast (MW) – negativ = EE-Überschuss

  // Energieträger (MW)
  wOn:   number   // Wind Onshore
  wOff:  number   // Wind Offshore
  sol:   number   // Solar
  bio:   number   // Biomasse
  was:   number   // Wasserkraft
  bk:    number   // Braunkohle
  sk:    number   // Steinkohle
  gas:   number   // Erdgas
  kern:  number   // Kernenergie
  pump:  number   // Pumpspeicher (Erzeugung)
  pumpV: number   // Pumpspeicher (Verbrauch)
  sEE:   number   // Sonstige Erneuerbare
  sKon:  number   // Sonstige Konventionelle
}

/** Tagesaggregation (~3.800 Einträge). */
export interface DayEntry {
  ts:            number
  date:          string   // ISO-Datum "YYYY-MM-DD"
  year:          number
  month:         number
  day:           number
  weekend:       boolean

  preis:         number   // Durchschnittspreis (€/MWh)
  negativePrice: boolean  // true wenn mind. eine Stunde negativ
  negStunden:    number   // Anzahl negativer Preisstunden

  ges:       number   // Summe Erzeugung (MW)
  ee:        number   // Summe EE (MW)
  konv:      number   // Summe Konventionell (MW)
  eeAnt:     number   // Ø EE-Anteil an Erzeugung (%)
  eeAntLast: number   // Ø EE-Anteil an Last (%)
  co2:       number   // Ø CO₂-Intensität (gCO₂/kWh)

  last:     number   // Ø Last (MW)
  resLast:  number   // Ø Residuallast (MW)

  wOn:   number;  wOff: number;  sol: number;  bio: number
  was:   number;  bk:   number;  sk:  number;  gas: number
  kern:  number;  pump: number;  pumpV: number
  sEE:   number;  sKon: number
}

/** Wochenaggregation (~550 Einträge). */
export interface WeekEntry {
  ts:    number
  key:   string   // Kalenderwoche "YYYY-WNN"
  year:  number

  preis:      number   // Ø Preis (€/MWh)
  negStunden: number   // Summe negativer Stunden

  ges:       number   // Summe Erzeugung
  ee:        number   // Summe EE
  konv:      number   // Summe Konventionell
  eeAnt:     number   // Ø EE-Anteil (%)
  eeAntLast: number   // Ø EE-Anteil an Last (%)
  co2:       number   // Ø CO₂-Intensität

  last:    number   // Ø Last
  resLast: number   // Ø Residuallast

  wOn:   number;  wOff: number;  sol: number;  bio: number
  was:   number;  bk:   number;  sk:  number;  gas: number
  kern:  number;  pump: number;  pumpV: number
  sEE:   number;  sKon: number
}

/** Jahresaggregation (11 Einträge: 2015–2025). */
export interface YearEntry {
  ts:    number
  year:  number

  co2:        number   // Ø CO₂-Intensität (gCO₂/kWh) – für S6 CO₂-Linie
  negStunden: number   // Summe negativer Preisstunden – für S6 Balken
  preis:      number   // Ø Börsenpreis (€/MWh)
  eeAnt:      number   // Ø EE-Anteil Erzeugung (%)
  eeAntLast:  number   // Ø EE-Anteil Last (%)

  ges:  number   // Summe Erzeugung
  ee:   number   // Summe EE
  konv: number   // Summe Konventionell

  wOn:   number;  wOff: number;  sol: number;  bio: number
  was:   number;  bk:   number;  sk:  number;  gas: number
  kern:  number;  pump: number;  pumpV: number
  sEE:   number;  sKon: number
}
