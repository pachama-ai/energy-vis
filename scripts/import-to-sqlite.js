/**
 * import-to-sqlite.js – Migration von JSON zu SQLite
 * ====================================================
 *
 * Liest die vier combined-*.json-Dateien aus public/data/
 * und importiert sie in eine SQLite-Datenbank (data/energy.db).
 *
 * Nutzung:
 *   node scripts/import-to-sqlite.js
 *
 * Die Datenbank wird im Projektstamm unter data/energy.db angelegt.
 * Die JSON-Dateien in public/data/ bleiben unverändert.
 *
 * Tabellen:
 *   - hour  (Stundenwerte, ~89.000 Zeilen)
 *   - day   (Tagesaggregation, ~3.800 Zeilen)
 *   - week  (Wochenaggregation, ~550 Zeilen)
 *   - year  (Jahresaggregation, 11 Zeilen)
 *
 * Indizes auf timestamp/date/year für schnelle API-Abfragen.
 * ====================================================
 */

import fs from 'fs'
import path from 'path'
import Database from 'better-sqlite3'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// ---------------------------------------------------------------------------
// Pfade
// ---------------------------------------------------------------------------

const DATA_DIR = path.resolve(__dirname, '..', 'public', 'data')
const DB_DIR   = path.resolve(__dirname, '..', 'data')
const DB_PATH  = path.join(DB_DIR, 'energy.db')

if (!fs.existsSync(DB_DIR)) fs.mkdirSync(DB_DIR, { recursive: true })

// ---------------------------------------------------------------------------
// Datenbank öffnen
// ---------------------------------------------------------------------------

const db = new Database(DB_PATH)

// Performance: Transaktion und WAL-Modus
db.pragma('journal_mode = WAL')
db.pragma('synchronous = NORMAL')

// ---------------------------------------------------------------------------
// Tabellen anlegen
// ---------------------------------------------------------------------------

console.log('Lege Tabellen an...')

db.exec(`
  CREATE TABLE IF NOT EXISTS hour (
    ts            INTEGER NOT NULL,
    year          INTEGER NOT NULL,
    month         INTEGER NOT NULL,
    day           INTEGER NOT NULL,
    hour          INTEGER NOT NULL,
    weekend       INTEGER NOT NULL,
    preis         REAL    NOT NULL,
    negativePrice INTEGER NOT NULL,
    ges           INTEGER NOT NULL,
    ee            INTEGER NOT NULL,
    eeAnt         REAL    NOT NULL,
    eeAntLast     REAL    NOT NULL,
    konv          INTEGER NOT NULL,
    co2           REAL    NOT NULL,
    last          INTEGER NOT NULL,
    resLast       INTEGER NOT NULL,
    wOn           INTEGER NOT NULL,
    wOff          INTEGER NOT NULL,
    sol           INTEGER NOT NULL,
    bio           INTEGER NOT NULL,
    was           INTEGER NOT NULL,
    bk            INTEGER NOT NULL,
    sk            INTEGER NOT NULL,
    gas           INTEGER NOT NULL,
    kern          INTEGER NOT NULL,
    pump          INTEGER NOT NULL,
    pumpV         INTEGER NOT NULL,
    sEE           INTEGER NOT NULL,
    sKon          INTEGER NOT NULL
  );

  CREATE TABLE IF NOT EXISTS day (
    ts            INTEGER NOT NULL,
    date          TEXT    NOT NULL,
    year          INTEGER NOT NULL,
    month         INTEGER NOT NULL,
    day           INTEGER NOT NULL,
    weekend       INTEGER NOT NULL,
    preis         REAL    NOT NULL,
    negativePrice INTEGER NOT NULL,
    negStunden    INTEGER NOT NULL,
    ges           INTEGER NOT NULL,
    ee            INTEGER NOT NULL,
    konv          INTEGER NOT NULL,
    eeAnt         REAL    NOT NULL,
    eeAntLast     REAL    NOT NULL,
    co2           REAL    NOT NULL,
    last          REAL    NOT NULL,
    resLast       REAL    NOT NULL,
    wOn           INTEGER NOT NULL,
    wOff          INTEGER NOT NULL,
    sol           INTEGER NOT NULL,
    bio           INTEGER NOT NULL,
    was           INTEGER NOT NULL,
    bk            INTEGER NOT NULL,
    sk            INTEGER NOT NULL,
    gas           INTEGER NOT NULL,
    kern          INTEGER NOT NULL,
    pump          INTEGER NOT NULL,
    pumpV         INTEGER NOT NULL,
    sEE           INTEGER NOT NULL,
    sKon          INTEGER NOT NULL
  );

  CREATE TABLE IF NOT EXISTS week (
    ts            INTEGER NOT NULL,
    key           TEXT    NOT NULL,
    year          INTEGER NOT NULL,
    preis         REAL    NOT NULL,
    negStunden    INTEGER NOT NULL,
    ges           INTEGER NOT NULL,
    ee            INTEGER NOT NULL,
    konv          INTEGER NOT NULL,
    eeAnt         REAL    NOT NULL,
    eeAntLast     REAL    NOT NULL,
    co2           REAL    NOT NULL,
    last          REAL    NOT NULL,
    resLast       REAL    NOT NULL,
    wOn           INTEGER NOT NULL,
    wOff          INTEGER NOT NULL,
    sol           INTEGER NOT NULL,
    bio           INTEGER NOT NULL,
    was           INTEGER NOT NULL,
    bk            INTEGER NOT NULL,
    sk            INTEGER NOT NULL,
    gas           INTEGER NOT NULL,
    kern          INTEGER NOT NULL,
    pump          INTEGER NOT NULL,
    pumpV         INTEGER NOT NULL,
    sEE           INTEGER NOT NULL,
    sKon          INTEGER NOT NULL
  );

  CREATE TABLE IF NOT EXISTS year (
    ts            INTEGER NOT NULL,
    year          INTEGER NOT NULL,
    co2           REAL    NOT NULL,
    negStunden    INTEGER NOT NULL,
    preis         REAL    NOT NULL,
    eeAnt         REAL    NOT NULL,
    eeAntLast     REAL    NOT NULL,
    ges           INTEGER NOT NULL,
    ee            INTEGER NOT NULL,
    konv          INTEGER NOT NULL,
    wOn           INTEGER NOT NULL,
    wOff          INTEGER NOT NULL,
    sol           INTEGER NOT NULL,
    bio           INTEGER NOT NULL,
    was           INTEGER NOT NULL,
    bk            INTEGER NOT NULL,
    sk            INTEGER NOT NULL,
    gas           INTEGER NOT NULL,
    kern          INTEGER NOT NULL,
    pump          INTEGER NOT NULL,
    pumpV         INTEGER NOT NULL,
    sEE           INTEGER NOT NULL,
    sKon          INTEGER NOT NULL
  );
`)

// ---------------------------------------------------------------------------
// Indizes
// ---------------------------------------------------------------------------

console.log('Lege Indizes an...')

db.exec(`
  CREATE INDEX IF NOT EXISTS idx_hour_ts    ON hour(ts);
  CREATE INDEX IF NOT EXISTS idx_hour_year  ON hour(year);
  CREATE INDEX IF NOT EXISTS idx_day_date   ON day(date);
  CREATE INDEX IF NOT EXISTS idx_day_year   ON day(year);
  CREATE INDEX IF NOT EXISTS idx_week_year  ON week(year);
  CREATE INDEX IF NOT EXISTS idx_year_year  ON year(year);
`)

// ---------------------------------------------------------------------------
// Import ausführen
// ---------------------------------------------------------------------------

console.log('\nImportiere Daten...\n')

function importHour() {
  const filePath = path.join(DATA_DIR, 'combined-hour.json')
  const rows = JSON.parse(fs.readFileSync(filePath, 'utf-8'))
  const stmt = db.prepare(`
    INSERT OR IGNORE INTO hour (ts,year,month,day,hour,weekend,preis,negativePrice,
      ges,ee,eeAnt,eeAntLast,konv,co2,last,resLast,
      wOn,wOff,sol,bio,was,bk,sk,gas,kern,pump,pumpV,sEE,sKon)
    VALUES (@ts,@year,@month,@day,@hour,@weekend,@preis,@negativePrice,
      @ges,@ee,@eeAnt,@eeAntLast,@konv,@co2,@last,@resLast,
      @wOn,@wOff,@sol,@bio,@was,@bk,@sk,@gas,@kern,@pump,@pumpV,@sEE,@sKon)
  `)
  const tx = db.transaction((data) => {
    for (const r of data) stmt.run({
      ...r,
      weekend: r.weekend ? 1 : 0,
      negativePrice: r.negativePrice ? 1 : 0,
    })
  })
  tx(rows)
  console.log(`  → ${rows.length} Stunden importiert`)
}

function importGeneric(table, jsonFile, fields) {
  const filePath = path.join(DATA_DIR, jsonFile)
  const rows = JSON.parse(fs.readFileSync(filePath, 'utf-8'))
  const placeholders = fields.map(f => `@${f}`).join(',')
  const stmt = db.prepare(`INSERT OR IGNORE INTO ${table} (${fields.join(',')}) VALUES (${placeholders})`)
  const tx = db.transaction((data) => {
    for (const r of data) {
      const row = {}
      for (const f of fields) {
        let v = r[f]
        if (typeof v === 'boolean') v = v ? 1 : 0
        row[f] = v ?? null
      }
      stmt.run(row)
    }
  })
  tx(rows)
  console.log(`  → ${rows.length} Zeilen importiert`)
}

console.log('\nStunden...')
importHour()

console.log('\nTage...')
importGeneric('day', 'combined-day.json', [
  'ts','date','year','month','day','weekend','preis','negativePrice','negStunden',
  'ges','ee','konv','eeAnt','eeAntLast','co2','last','resLast',
  'wOn','wOff','sol','bio','was','bk','sk','gas','kern','pump','pumpV','sEE','sKon'
])

console.log('\nWochen...')
importGeneric('week', 'combined-week.json', [
  'ts','key','year','preis','negStunden',
  'ges','ee','konv','eeAnt','eeAntLast','co2','last','resLast',
  'wOn','wOff','sol','bio','was','bk','sk','gas','kern','pump','pumpV','sEE','sKon'
])

console.log('\nJahre...')
importGeneric('year', 'combined-year.json', [
  'ts','year','co2','negStunden','preis','eeAnt','eeAntLast',
  'ges','ee','konv',
  'wOn','wOff','sol','bio','was','bk','sk','gas','kern','pump','pumpV','sEE','sKon'
])

// ---------------------------------------------------------------------------
// Abschluss
// ---------------------------------------------------------------------------

console.log('\n✅ Datenbank erstellt:', DB_PATH)

const stats = db.prepare(`
  SELECT 'hour' AS tbl, COUNT(*) AS cnt FROM hour
  UNION ALL SELECT 'day', COUNT(*) FROM day
  UNION ALL SELECT 'week', COUNT(*) FROM week
  UNION ALL SELECT 'year', COUNT(*) FROM year
`).all()
console.table(stats)

db.close()
