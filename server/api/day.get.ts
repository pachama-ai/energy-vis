/**
 * /api/day – Tagesaggregation aus SQLite
 * ========================================
 * Gibt alle Tageswerte zurück (entspricht combined-day.json).
 *
 * Optionale Query-Parameter:
 *   ?year=2024 – Filter auf Jahr
 *
 * Rückgabe: JSON-Array mit identischer Struktur wie combined-day.json.
 * ========================================
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

  let sql = 'SELECT * FROM day'
  const params = []

  if (query.year) {
    sql += ' WHERE year = ?'
    params.push(Number(query.year))
  }

  sql += ' ORDER BY ts ASC'

  const rows = database.prepare(sql).all(...params)
  return rows.map(r => ({
    ...r,
    weekend: r.weekend === 1,
    negativePrice: r.negativePrice === 1,
  }))
})
