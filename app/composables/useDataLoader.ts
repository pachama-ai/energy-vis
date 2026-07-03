/**
 * useDataLoader.ts – Zentrale Datenbereitstellung
 * =================================================
 *
 * ENTWURFSENTSCHEIDUNG:
 * Dieses Composable lädt alle Daten genau EINMAL beim ersten Aufruf
 * über die Nuxt-API-Routen (/api/hour, /api/day, /api/week, /api/year),
 * die aus der SQLite-Datenbank (data/energy.db) lesen.
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

    // Lade alle Daten parallel über die API-Routen (SQLite)
    Promise.all([
      fetch('/api/hour').then<HourEntry[]>(r => r.json()),
      fetch('/api/day').then<DayEntry[]>(r => r.json()),
      fetch('/api/week').then<WeekEntry[]>(r => r.json()),
      fetch('/api/year').then<YearEntry[]>(r => r.json()),
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
