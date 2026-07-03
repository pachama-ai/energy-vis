/**
 * useDataLoader.ts – Zentrale Datenbereitstellung
 * =================================================
 *
 * ENTWURFSENTSCHEIDUNG:
 * Dieses Composable lädt alle JSON-Dateien genau EINMAL beim ersten Aufruf.
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
 * Lädt alle JSON-Dateien asynchron und gibt sie als ComputedRefs zurück.
 * Der Cache (shallowRef) stellt sicher, dass die Daten nur einmal geladen werden.
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

    // Lade alle JSONs parallel
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
