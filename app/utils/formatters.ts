/**
 * formatters.ts – Einheiten-Formatierung
 * ========================================
 * Einheitliche Formatierungsfunktionen für das gesamte Projekt.
 * Alle Funktionen sind pure Funktionen ohne Seiteneffekte.
 * ========================================
 */

/**
 * Formatiert eine Leistungs-/Energiemenge in Megawatt.
 * Beispiele: 1234567 → "1.234.567 MW", 45000 → "45.000 MW"
 */
export function formatMW(value: number): string {
  return `${value.toLocaleString('de-DE')} MW`
}

/**
 * Formatiert eine Leistung in Gigawatt (1 GW = 1000 MW).
 * Beispiele: 1234567 → "1.235 GW", 45000 → "45 GW"
 */
export function formatGW(value: number): string {
  return `${(value / 1000).toLocaleString('de-DE', { maximumFractionDigits: 0 })} GW`
}

/**
 * Formatiert CO₂-Intensität in gCO₂/kWh.
 * Beispiele: 324.5 → "324,5 gCO₂/kWh", 50 → "50 gCO₂/kWh"
 */
export function formatCO2(value: number): string {
  return `${value.toLocaleString('de-DE', { minimumFractionDigits: 1, maximumFractionDigits: 1 })} gCO₂/kWh`
}

/**
 * Formatiert einen Börsenstrompreis in €/MWh.
 * Beispiele: 56.20 → "56,20 €/MWh", -15.50 → "−15,50 €/MWh"
 */
export function formatEuro(value: number): string {
  const formatted = Math.abs(value).toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  const sign = value < 0 ? '−' : ''
  return `${sign}${formatted} €/MWh`
}

/**
 * Formatiert einen Prozentwert.
 * Beispiele: 58.4 → "58,4 %", 100 → "100 %"
 */
export function formatPercent(value: number): string {
  return `${value.toLocaleString('de-DE', { minimumFractionDigits: 1, maximumFractionDigits: 1 })} %`
}

/**
 * Formatiert einen Zeitstempel (Millisekunden) als deutsches Datum.
 * Beispiele: 1704067200000 → "01.01.2024"
 */
export function formatDate(ts: number): string {
  return new Date(ts).toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

/**
 * Formatiert einen Zeitstempel als Kurzform (Monat Jahr).
 * Beispiele: 1704067200000 → "Jan 2024"
 */
export function formatMonthYear(ts: number): string {
  return new Date(ts).toLocaleDateString('de-DE', { month: 'short', year: 'numeric' })
}

/**
 * Gibt den Monatsnamen zurück (1 = Januar, 12 = Dezember).
 */
export function monthName(month: number): string {
  const names = [
    'Jan', 'Feb', 'Mär', 'Apr', 'Mai', 'Jun',
    'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dez',
  ]
  return names[month - 1] ?? ''
}
