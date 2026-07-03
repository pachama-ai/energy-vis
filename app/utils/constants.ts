/**
 * constants.ts – Projektweite Konstanten
 * ========================================
 * Zentrale Sammlung aller festen Werte, die in mehreren
 * Komponenten oder Pages verwendet werden.
 * ========================================
 */

/** Verfuegbare Jahre im Datensatz (2015–2025). */
export const AVAILABLE_YEARS: number[] = [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025]

/** Standard-Jahr fuer Waffeldiagramm und Heatmap. */
export const DEFAULT_YEAR = 2024

// ---------------------------------------------------------------------------
// Energiehalbjahr-Definition
// ---------------------------------------------------------------------------

export const SEASON_SUMMER = { label: 'Sommerhalbjahr (Apr-Sep)', months: [4, 5, 6, 7, 8, 9] }
export const SEASON_WINTER = { label: 'Winterhalbjahr (Okt-Mrz)', months: [10, 11, 12, 1, 2, 3] }
export const SEASON_ALL     = { label: 'Ganzes Jahr',             months: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] }

export type SeasonFilter = 'all' | 'summer' | 'winter'
