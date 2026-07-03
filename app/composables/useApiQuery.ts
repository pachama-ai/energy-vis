/**
 * useApiQuery.ts – Gefilterte API-Abfragen (SQLite)
 * ====================================================
 *
 * Für Abfragen, bei denen nur ein Teil der Daten benötigt wird
 * (z. B. ein bestimmter Monat), ist der Weg über die SQLite-API
 * schneller als clientseitiges Filtern der 89k JSON-Zeilen.
 *
 * Die API-Routen in server/api/ nutzen better-sqlite3 mit Indizes
 * auf year, month und timestamp.
 *
 * VERWENDUNG:
 *   const { data, loading } = useApiQuery('hour', { year: 2024, month: 5 })
 *   const { data, loading } = useApiQuery('day', { year: 2024 })
 *   const { data, loading } = useApiQuery('year')
 * ====================================================
 */

import type { HourEntry, DayEntry, WeekEntry, YearEntry } from '~/types/data'

type Endpoint = 'hour' | 'day' | 'week' | 'year'
type DataMap = {
  hour: HourEntry[]
  day: DayEntry[]
  week: WeekEntry[]
  year: YearEntry[]
}

/**
 * Ruft eine gefilterte API-Route ab.
 * @param endpoint – 'hour' | 'day' | 'week' | 'year'
 * @param filters  – z. B. { year: 2024, month: 5 }
 * @returns        – { data, loading, error }
 */
export function useApiQuery<E extends Endpoint>(
  endpoint: E,
  filters: Record<string, number> = {},
) {
  const data = ref<DataMap[E] | null>(null)
  const loading = ref(true)
  const error = ref<string | null>(null)

  const params = new URLSearchParams()
  for (const [key, val] of Object.entries(filters)) {
    if (val !== undefined && val !== null) params.set(key, String(val))
  }

  const query = params.toString()
  const url = `/api/${endpoint}${query ? `?${query}` : ''}`

  fetch(url)
    .then<DataMap[E]>(r => {
      if (!r.ok) throw new Error(`${r.status} ${r.statusText}`)
      return r.json()
    })
    .then(result => {
      data.value = result
      loading.value = false
    })
    .catch((err: Error) => {
      error.value = err.message
      loading.value = false
    })

  return { data, loading, error }
}
