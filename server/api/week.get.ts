/**
 * /api/week – Wochenaggregation aus SQLite
 * ==========================================
 * Gibt alle Wochenwerte zurück (entspricht combined-week.json).
 *
 * Optionale Query-Parameter:
 *   ?year=2024 – Filter auf Jahr
 *
 * Rückgabe: JSON-Array mit identischer Struktur wie combined-week.json.
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

  let sql = 'SELECT * FROM week'
  const params = []

  if (query.year) {
    sql += ' WHERE year = ?'
    params.push(Number(query.year))
  }

  sql += ' ORDER BY ts ASC'

  return database.prepare(sql).all(...params)
})
