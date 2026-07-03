/**
 * /api/hour – Stundenwerte aus SQLite
 * =====================================
 * Gibt alle Stundenwerte zurück (entspricht combined-hour.json).
 *
 * Optionale Query-Parameter:
 *   ?year=2024    – Filter auf Jahr
 *   ?month=5      – Filter auf Monat (nur in Kombination mit year)
 *
 * Rückgabe: JSON-Array mit identischer Struktur wie combined-hour.json.
 * =====================================
 */

import Database from 'better-sqlite3'
import path from 'path'

const DB_PATH = path.resolve(process.cwd(), 'data', 'energy.db')

let db = null
function getDb() {
  if (!db) db = new Database(DB_PATH)
  return db
}

export default defineEventHandler((event) => {
  const query = getQuery(event)
  const database = getDb()

  let sql = 'SELECT * FROM hour'
  const params = []

  if (query.year) {
    sql += ' WHERE year = ?'
    params.push(Number(query.year))
    if (query.month) {
      sql += ' AND month = ?'
      params.push(Number(query.month))
    }
  }

  sql += ' ORDER BY ts ASC'

  const rows = database.prepare(sql).all(...params)

  // Boolean-Felder zurückkonvertieren
  return rows.map(r => ({
    ...r,
    weekend: r.weekend === 1,
    negativePrice: r.negativePrice === 1,
  }))
})
