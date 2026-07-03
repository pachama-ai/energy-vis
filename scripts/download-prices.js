import fs from 'fs'

const TOKEN = 'bc68db8d-fd33-4b04-b814-3a09e66b1471'
const BASE = 'https://web-api.tp.entsoe.eu/api'

const DOMAIN_ALT = '10Y1001A1001A63L'
const DOMAIN_NEU = '10Y1001A1001A82H'

async function wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

function formatDate(date) {
  const y = date.getUTCFullYear()
  const m = String(date.getUTCMonth() + 1).padStart(2, '0')
  const d = String(date.getUTCDate()).padStart(2, '0')
  return `${y}${m}${d}0000`
}

function parseXML(xml) {
  const result = []
  const periodBlocks = xml.match(/<Period>[\s\S]*?<\/Period>/g) || []

  for (const period of periodBlocks) {
    const resMatch = period.match(/<resolution>(.*?)<\/resolution>/)
    const resolution = resMatch ? resMatch[1] : 'PT60M'

    // Nur Stundenauflösung – 15-Min-Blöcke überspringen
    if (resolution !== 'PT60M') continue

    const startMatch = period.match(/<start>(.*?)<\/start>/)
    if (!startMatch) continue
    const start = new Date(startMatch[1])

    const pointBlocks = period.match(/<Point>[\s\S]*?<\/Point>/g) || []

    for (const point of pointBlocks) {
      const posMatch   = point.match(/<position>(\d+)<\/position>/)
      const priceMatch = point.match(/<price\.amount>([\d.]+)<\/price\.amount>/)
      if (!posMatch || !priceMatch) continue

      const position = parseInt(posMatch[1]) - 1
      const price    = parseFloat(priceMatch[1])
      const ts       = new Date(start.getTime() + position * 60 * 60 * 1000)

      result.push({ timestamp: ts.getTime(), price })
    }
  }

  return result
}

async function fetchYear(year) {
  const domain = year <= 2018 ? DOMAIN_ALT : DOMAIN_NEU

  const start = new Date(Date.UTC(year, 0, 1))
  const end   = new Date(Date.UTC(year + 1, 0, 1))

  const url =
    `${BASE}?documentType=A44` +
    `&in_Domain=${domain}` +
    `&out_Domain=${domain}` +
    `&periodStart=${formatDate(start)}` +
    `&periodEnd=${formatDate(end)}` +
    `&securityToken=${TOKEN}`

  const res = await fetch(url)

  if (res.status === 429) {
    console.warn('  Rate-Limit. Warte 30 Sekunden...')
    await wait(30000)
    return fetchYear(year)
  }

  const xml = await res.text()

  if (!res.ok || xml.includes('No matching data found') || xml.includes('<code>999</code>')) {
    const reason = xml.match(/<text>(.*?)<\/text>/)?.[1] || res.status
    console.warn(`  Fehler: ${reason}`)
    return []
  }

  return parseXML(xml)
}

async function main() {
  const allData = []
  const startYear = 2015
  const currentYear = new Date().getUTCFullYear()

  for (let year = startYear; year <= currentYear; year++) {
    process.stdout.write(`Hole ${year}...`)

    const data = await fetchYear(year)
    allData.push(...data)
    console.log(` ${data.length} Punkte`)

    if (year < currentYear) await wait(5000)
  }

  if (allData.length === 0) {
    console.error('\nKeine Daten geladen. Token prüfen.')
    return
  }

  const unique = [...new Map(allData.map(d => [d.timestamp, d])).values()]
    .sort((a, b) => a.timestamp - b.timestamp)

  // Plausibilitätsprüfung
  const proJahr = {}
  for (const d of unique) {
    const y = new Date(d.timestamp).getUTCFullYear()
    proJahr[y] = (proJahr[y] || 0) + 1
  }
  console.log('\nPunkte pro Jahr:')
  for (const [y, n] of Object.entries(proJahr)) {
    const erwartet = (parseInt(y) % 4 === 0) ? 8784 : 8760
    const ok = n === erwartet ? '✓' : `⚠ erwartet ${erwartet}`
    console.log(`  ${y}: ${n} ${ok}`)
  }

  fs.mkdirSync('./public/data', { recursive: true })
  fs.writeFileSync('./public/data/preise.json', JSON.stringify(unique))

  const von = new Date(unique[0].timestamp).toISOString().slice(0, 10)
  const bis = new Date(unique[unique.length - 1].timestamp).toISOString().slice(0, 10)
  console.log(`\nFertig! ${unique.length} Preispunkte von ${von} bis ${bis}`)
  console.log('Gespeichert in public/data/preise.json')
}

main().catch(console.error)