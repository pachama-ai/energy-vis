/**
 * useDataLoader.ts – Zentrale Datenbereitstellung
 * =================================================
 *
 * ENTWURFSENTSCHEIDUNG (Hybrid-Ansatz):
 *
 * Grundlast (App-Start):
 *   Lädt die vier combined-*.json-Dateien aus public/data/.
 *   Statische JSONs sind der schnellste Weg – kein API-Overhead,
 *   keine Serialisierung, kein DB-Connection-Pool.
 *
 * Feinabfragen (optional, z. B. Brushing):
 *   Die SQLite-API-Routen (/api/hour, /api/day, etc.) stehen bereit
 *   für gefilterte Abfragen wie GET /api/hour?year=2024&month=5.
 *   Dort lohnt sich SQLite, weil nur ein Teil der 89k Zeilen
 *   übertragen wird – das ist schneller als clientseitiges Filtern.
 *
 * Die Daten werden in einem module-level shallowRef gecached. Dadurch
 * sind die computed-Refs reaktiv: Sobald der Fetch abgeschlossen ist,
 * aktualisieren sich hourData, dayData etc. automatisch.
 *
 * DATENFLUSS:
 *   useDataLoader() ──> hourData (ComputedRef<HourEntry[]>)
 *                    ──> dayData  (ComputedRef<DayEntry[]>)
 *                    ──> weekData (ComputedRef<WeekEntry[]>)
 *                    ──> yearData (ComputedRef<YearEntry[]>)
 *                    ──> loading  (Ref<boolean>)
 *
 * VERWENDUNG:
 *   const { hourData, loading } = useDataLoader()
 * =================================================
 */

import type { HourEntry, DayEntry, WeekEntry, YearEntry } from '~/types/data'

/**
 * Module-level Cache (shallowRef).
 * shallowRef verhindert Deep-Reactivity für die großen Arrays,
 * aber der .value-Austausch triggert computed-Neuberechnung.
 */
const cached = shallowRef<{
  hour: HourEntry[]
  day:  DayEntry[]
  week: WeekEntry[]
  year: YearEntry[]
} | null>(null)

/** Wurde der Fetch bereits gestartet? (kein ref – reine Flag) */
let fetchStarted = false

/**
 * Lädt alle Daten über die Nuxt-API-Routen (SQLite-DB) und gibt sie
 * als ComputedRefs zurück. Der shallowRef-Cache stellt sicher, dass
 * die Daten nur einmal geladen werden.
 */
export function useDataLoader() {
  const loading = ref(true)
  const error   = ref<string | null>(null)

  const hourData = computed<HourEntry[]>(() => cached.value?.hour ?? [])
  const dayData  = computed<DayEntry[]>(() => cached.value?.day ?? [])
  const weekData = computed<WeekEntry[]>(() => cached.value?.week ?? [])
  const yearData = computed<YearEntry[]>(() => cached.value?.year ?? [])

  if (!fetchStarted) {
    fetchStarted = true

    // Grundlast: statische JSON-Dateien (schnellster Weg, kein API-Overhead)
    // Gefilterte Abfragen nutzen später die SQLite-API-Routen (/api/*)
    Promise.all([
      fetch('/data/combined-hour.json').then<HourEntry[]>(r => r.json()),
      fetch('/data/combined-day.json').then<DayEntry[]>(r => r.json()),
      fetch('/data/combined-week.json').then<WeekEntry[]>(r => r.json()),
      fetch('/data/combined-year.json').then<YearEntry[]>(r => r.json()),
    ])
      .then(([hour, day, week, year]) => {
        cached.value = { hour, day, week, year }
        loading.value = false
      })
      .catch((err: Error) => {
        error.value = `Daten konnten nicht geladen werden: ${err.message}`
        loading.value = false
      })
  } else if (cached.value) {
    // Daten bereits geladen – loading sofort beenden
    loading.value = false
  }

  return { hourData, dayData, weekData, yearData, loading, error }
}
