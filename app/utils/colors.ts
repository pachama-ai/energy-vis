/**
 * colors.ts – ☠️ UNVERÄNDERLICHE FARBSYSTEME
 * ============================================
 * Diese Datei wird einmal angelegt und danach nicht mehr verändert.
 * Sie definiert zwei Farbsysteme, die von allen Visualisierungs-
 * komponenten importiert werden.
 *
 * 1. SEMANTISCHE CO₂-SKALA (kontinuierlich)
 *    Verwendet in: WaffleChart, HeatmapChart, ResidualLoadChart
 *    petrolgrün → grün → gelb → orange → rot (fließender Gradient per D3)
 *
 * 2. KATEGORIALE ENERGIETRÄGER-PALETTE
 *    Verwendet in: StackedAreaChart
 *    Kohle, Gas, Wind, Solar, Biomasse, Wasserkraft, Kernkraft
 * ============================================
 */

// ---------------------------------------------------------------------------
// 1. Semantische CO₂-Skala (kontinuierlich)
//    Eine D3-sequential-Skala, die von 0 bis 600 gCO₂/kWh einen
//    fließenden Farbverlauf von Petrolgrün → Grün → Gelb → Orange → Rot
//    erzeugt. Die Stützpunkte sind die bisherigen diskreten Farben,
//    ergänzt um einen sanften Gelb-Ton für den Übergang.
//
//    Werte über 600 werden auf 600 geclampt (clamp: true).
// ---------------------------------------------------------------------------

import * as d3 from 'd3'

/**
 * Kontinuierliche CO₂-Farbskala.
 * Domain: 0–600 gCO₂/kWh, geclampt auf 600.
 * Interpolation: RGB-Basis mit 5 Stützpunkten (dieselben Farben wie
 * zuvor die vier Kategorien, ergänzt um Gelb für den Grün→Orange-Übergang).
 *
 * Verwendung in Chart-Komponenten:
 *   fill = co2ColorScale(d.co2)
 */
export const co2ColorScale = d3.scaleSequential()
  .domain([0, 600])
  .clamp(true)
  .interpolator(d3.interpolateRgbBasis([
    '#2D6A4F',   //    0 g/kWh – tiefes Petrolgrün (nahezu klimaneutral)
    '#74C69D',   //  150 g/kWh – mittleres Grün (EE-dominiert)
    '#F4E04A',   //  250 g/kWh – Gelb (Übergang Grün → Orange)
    '#F4A261',   //  350 g/kWh – warmes Orange (fossile Übergangsphase)
    '#C1121F',   //  600 g/kWh – tiefes Rot (hohe CO₂-Intensität)
  ]))

// ---------------------------------------------------------------------------
// 2. Kategoriale Energieträger-Palette
//    Die Stacked-Area-Chart-Komponente verwendet diese Palette zur
//    eindeutigen Identifikation der Energieträger.
//    Die Reihenfolge bestimmt die Stapelreihenfolge im Chart.
// ---------------------------------------------------------------------------

export interface EnergySource {
  /** Datenfeldname im JSON (combined-hour.json) */
  key: string
  /** Angezeigter Label */
  label: string
  /** Farbe im Stacked Area Chart */
  color: string
}

/** Energieträger in der Stapelreihenfolge (von unten nach oben). */
export const ENERGY_MIX: EnergySource[] = [
  { key: 'pump',  label: 'Pumpspeicher',      color: '#78909C' },
  { key: 'sKon',  label: 'Sonst. Konventionell', color: '#90A4AE' },
  { key: 'kern',  label: 'Kernkraft',          color: '#AB47BC' },
  { key: 'bk',    label: 'Braunkohle',         color: '#8D6E63' },
  { key: 'sk',    label: 'Steinkohle',         color: '#5D4037' },
  { key: 'gas',   label: 'Erdgas',             color: '#FF7043' },
  { key: 'bio',   label: 'Biomasse',           color: '#43A047' },
  { key: 'was',   label: 'Wasserkraft',        color: '#0288D1' },
  { key: 'sEE',   label: 'Sonst. EE',          color: '#26A69A' },
  { key: 'wOn',   label: 'Wind Onshore',       color: '#42A5F5' },
  { key: 'wOff',  label: 'Wind Offshore',      color: '#1A237E' },
  { key: 'sol',   label: 'Solar',              color: '#FDD835' },
]

/** Kurzform für die vom Benutzer gewünschte kompakte Palette (für Legenden). */
export const ENERGY_MIX_COMPACT: { label: string; color: string }[] = [
  { label: 'Kohle',      color: '#6D4C41' },
  { label: 'Gas',        color: '#FF7043' },
  { label: 'Wind',       color: '#42A5F5' },
  { label: 'Solar',      color: '#FDD835' },
  { label: 'Biomasse',   color: '#43A047' },
  { label: 'Wasserkraft',color: '#0288D1' },
  { label: 'Kernkraft',  color: '#AB47BC' },
]

/** Gruppe der erneuerbaren Energien (EE) für Filterberechnungen. */
export const EE_KEYS = ['wOn', 'wOff', 'sol', 'bio', 'was', 'sEE']

/** Gruppe der konventionellen Energien. */
export const KONV_KEYS = ['bk', 'sk', 'gas', 'kern', 'sKon', 'pump']
