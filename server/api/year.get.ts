/**
 * /api/year – Jahresaggregation aus SQLite
 * ==========================================
 * Gibt alle Jahreswerte zurück (entspricht combined-year.json).
 * Keine Filter notwendig (nur 11 Zeilen).
 *
 * Rückgabe: JSON-Array mit identischer Struktur wie combined-year.json.
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

export default defineEventHandler(() => {
  const database = getDb()
  return database.prepare('SELECT * FROM year ORDER BY ts ASC').all()
})
