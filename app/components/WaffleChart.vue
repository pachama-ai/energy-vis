<template>
  <!--
    WaffleChart.vue – D3-Waffeldiagramm (365 × 24)
    ================================================
    Zeigt die CO₂-Intensität jeder Stunde als farbcodiertes Raster.
    Tage auf der Y-Achse, Stunden auf der X-Achse.

    Props:
    - data: HourEntry[] (bereits gefiltert auf Jahr und ggf. Saison)

    ENTWURFSENTSCHEIDUNGEN:
    - Erhält bereits gefilterte Daten als Prop → keine eigene Datenlogik
    - Kein globaler State
    - Responsive via ResizeObserver
    - Farbe über co2Color() aus colors.ts
  -->
  <div ref="containerRef" class="waffle-container">
    <!-- SVG wird von D3 erstellt -->
  </div>
</template>

<script setup lang="ts">
/**
 * WaffleChart.vue – D3-Implementierung
 *
 * DATENFLUSS:
 *   props.data (HourEntry[]) → D3 data join → SVG rects
 *
 * LEBENSZYKLUS:
 *   1. onMounted: initChart() → SVG erstellen + ResizeObserver
 *   2. watch(data): updateChart() → neu zeichnen bei Datenänderung
 *   3. onUnmounted: ResizeObserver-Cleanup
 */
import * as d3 from 'd3'
import { co2ColorScale } from '~/utils/colors'
import type { HourEntry } from '~/types/data'

const props = defineProps<{
  data: HourEntry[]
}>()

// ---------------------------------------------------------------------------
// Template Ref & D3-Referenzen
// ---------------------------------------------------------------------------

const containerRef = ref<HTMLDivElement>()
let svg: d3.Selection<SVGSVGElement, unknown, null, undefined> | null = null
let chartGroup: d3.Selection<SVGGElement, unknown, null, undefined> | null = null
let resizeCleanup: (() => void) | null = null

// ---------------------------------------------------------------------------
// Layout-Konstanten
// ---------------------------------------------------------------------------

/**
 * Feste Chart-Höhe: Das ganze Jahr (365 Zeilen) muss ohne Scrollen
 * sichtbar sein. Die Zellen werden dafür bewusst sehr schmal (ca. 1,5 px).
 * Bei Saison-Filter (weniger Tage) bleiben die Dimensionen gleich –
 * die Zellen werden nur minimal höher.
 */
const CHART_AREA_HEIGHT = 550

/** Platz für die CO₂-Legende (Gradient-Balken + Achsenmarken) unterhalb des Charts. */
const LEGEND_HEIGHT = 96

/** Farbe für den Zellen-Zwischenraum (1 px Stroke). */
const CELL_GAP_COLOR = '#F8F8F6'

const MARGIN = { top: 20, right: 50, bottom: 32, left: 44 }

/** Monatsnamen (für dynamische doy-Berechnung). */
const MONTH_NAMES = ['Jan','Feb','Mär','Apr','Mai','Jun','Jul','Aug','Sep','Okt','Nov','Dez']

/**
 * Berechnet die Monatsanfänge als dayOfYear für ein gegebenes Jahr.
 * Wird bei jedem updateChart() aus den aktuellen Daten ermittelt,
 * damit Schaltjahre (z. B. 2024) korrekt abgebildet werden.
 */
function getMonthStarts(year: number): { month: string; monthIndex: number; doy: number }[] {
  return MONTH_NAMES.map((name, i) => ({
    month: name,
    monthIndex: i + 1,
    doy: dayOfYear(year, i + 1, 1),
  }))
}

/** Stunden-Labels (alle 6 Stunden, plus 24:00 am Ende). */
const HOUR_TICKS = [
  { hour: 0,  anchor: 'start',  offset: 4 },
  { hour: 6,  anchor: 'middle', offset: 0 },
  { hour: 12, anchor: 'middle', offset: 0 },
  { hour: 18, anchor: 'middle', offset: 0 },
  { hour: 24, anchor: 'end',    offset: -4 },
]

// ---------------------------------------------------------------------------
// Hilfsfunktionen
// ---------------------------------------------------------------------------

/**
 * Berechnet den Tag des Jahres (1–365/366) für ein gegebenes Datum.
 * Nutzt das tatsächliche Jahr aus den Daten (Schaltjahre korrekt).
 */
function dayOfYear(year: number, month: number, day: number): number {
  const date = new Date(Date.UTC(year, month - 1, day))
  const start = new Date(Date.UTC(year, 0, 0))
  return Math.floor((date.getTime() - start.getTime()) / 86400000)
}

// ---------------------------------------------------------------------------
// Chart-Initialisierung
// ---------------------------------------------------------------------------

function initChart(): void {
  if (!containerRef.value) return

  const container = containerRef.value
  const rect = container.getBoundingClientRect()
  const width = rect.width || 800
  const height = 600 // Start-Höhe, wird in updateChart() berechnet

  // SVG erstellen
  svg = d3.select(container)
    .append('svg')
    .attr('width', width)
    .attr('height', height)
    .style('display', 'block')

  chartGroup = svg.append('g')
    .attr('class', 'chart-area')
    .attr('transform', `translate(${MARGIN.left},${MARGIN.top})`)

  // No-Data-Pattern in SVG-Defs definieren (diagonale Schraffur)
  if (!svg.select('#no-data-pattern').size()) {
    const defs = svg.select('defs').size()
      ? svg.select('defs')
      : svg.insert('defs', ':first-child')

    defs.append('pattern')
      .attr('id', 'no-data-pattern')
      .attr('patternUnits', 'userSpaceOnUse')
      .attr('width', 4)
      .attr('height', 4)
      .append('line')
      .attr('x1', 0)
      .attr('y1', 4)
      .attr('x2', 4)
      .attr('y2', 0)
      .attr('stroke', '#ccc')
      .attr('stroke-width', 0.5)
  }

  // ResizeObserver für responsive Anpassung
  resizeCleanup = setupResizeObserver()
}

function setupResizeObserver(): () => void {
  const el = containerRef.value
  if (!el) return () => {}

  const observer = new ResizeObserver((entries) => {
    for (const entry of entries) {
      const { width } = entry.contentRect
      if (width > 0) {
        updateChart()
      }
    }
  })

  observer.observe(el)
  return () => observer.disconnect()
}

// ---------------------------------------------------------------------------
// Chart-Zeichnen
// ---------------------------------------------------------------------------

/** Zell-Struktur für D3 data join.
 *  co2 = -1 signalisiert „keine Daten“ → diagonale Schraffur.
 *  month = 0 für no-data-Zellen (immer sichtbar im Filter). */
interface CellData {
  hour: number
  row: number
  co2: number   // -1 = keine Daten
  month: number // 0 = no-data
}

function updateChart(): void {
  if (!svg || !chartGroup || !containerRef.value) return
  if (props.data.length === 0) return

  // -----------------------------------------------------------------------
  // 1. Daten gruppieren: Tage → Stunden
  // -----------------------------------------------------------------------
  const dayGroups = new Map<number, Map<number, HourEntry>>()
  const seenDays = new Set<number>()

  for (const entry of props.data) {
    const doy = dayOfYear(entry.year, entry.month, entry.day)
    if (!dayGroups.has(doy)) {
      dayGroups.set(doy, new Map())
    }
    dayGroups.get(doy)!.set(entry.hour, entry)
    seenDays.add(doy)
  }

  // Sortierte Tage
  const sortedDays = [...seenDays].sort((a, b) => a - b)
  const numDays = sortedDays.length

  // -----------------------------------------------------------------------
  // 2. Zellen-Array für D3 data join bauen
  // -----------------------------------------------------------------------
  const cells: CellData[] = []

  for (let row = 0; row < sortedDays.length; row++) {
    const doy = sortedDays[row]
    const hours = dayGroups.get(doy)!
    for (let h = 0; h < 24; h++) {
      const entry = hours.get(h)
      if (!entry) {
        // Keine Daten für diese Stunde → Schraffur-Pattern
        cells.push({ hour: h, row, co2: -1, month: 0 })
      } else {
        cells.push({ hour: h, row, co2: entry.co2, month: entry.month })
      }
    }
  }

  // -----------------------------------------------------------------------
  // 3. Container-Dimensionen ermitteln (feste Höhe, responsive Breite)
  // -----------------------------------------------------------------------
  const containerWidth = containerRef.value.getBoundingClientRect().width
  const chartWidth = Math.max(200, containerWidth - MARGIN.left - MARGIN.right)
  const cellWidth = chartWidth / 24

  // Feste Chart-Höhe – alle Tage passen immer ohne Scrollen
  const cellHeight = CHART_AREA_HEIGHT / numDays
  const chartHeight = CHART_AREA_HEIGHT
  const totalHeight = chartHeight + MARGIN.top + MARGIN.bottom + LEGEND_HEIGHT

  // SVG-Größe setzen
  svg
    .attr('width', containerWidth)
    .attr('height', totalHeight)
    .attr('viewBox', `0 0 ${containerWidth} ${totalHeight}`)

  // -----------------------------------------------------------------------
  // 4. Hintergrund löschen
  // -----------------------------------------------------------------------
  chartGroup.selectAll('*').remove()

  // -----------------------------------------------------------------------
  // 5. Zellen zeichnen (D3 data join)
  //    Jede Zelle erhält einen 1 px Stroke in CELL_GAP_COLOR, damit
  //    ein feiner Zwischenraum zwischen den Zellen entsteht.
  // -----------------------------------------------------------------------
  chartGroup
    .selectAll<SVGRectElement, CellData>('rect')
    .data(cells, (d: CellData) => `${d.row}-${d.hour}`)
    .join('rect')
    .attr('x', d => d.hour * cellWidth)
    .attr('y', d => d.row * cellHeight)
    .attr('width', cellWidth)
    .attr('height', cellHeight)
    .attr('fill', d => d.co2 === -1 ? 'url(#no-data-pattern)' : co2ColorScale(d.co2))
    .attr('stroke', CELL_GAP_COLOR)
    .attr('stroke-width', 1)

  // -----------------------------------------------------------------------
  // 6. Achsen zeichnen
  // -----------------------------------------------------------------------

  // Y-Achse: Monatslabels – dynamisch aus den aktuellen Daten.
  // Es werden nur Monate angezeigt, die im gefilterten Datensatz
  // (aktiver Season-Filter) vorkommen. Die doy-Werte werden an das
  // tatsächliche Jahr (z. B. 2024 = Schaltjahr) angepasst.
  const sampleYear = props.data[0]?.year ?? 2024
  const monthStarts = getMonthStarts(sampleYear)
  const activeMonths = new Set(props.data.map(d => d.month))

  for (const ms of monthStarts) {
    if (!activeMonths.has(ms.monthIndex)) continue

    const idx = sortedDays.findIndex(d => d >= ms.doy)
    if (idx === -1) continue
    const y = idx * cellHeight + cellHeight / 2

    chartGroup.append('text')
      .attr('x', -8)
      .attr('y', y)
      .attr('text-anchor', 'end')
      .attr('alignment-baseline', 'middle')
      .style('font-size', '0.7rem')
      .style('fill', 'var(--text-muted)')
      .text(ms.month)
  }

  // X-Achse: Stundenlabels (0:00 – 24:00, alle 6 Stunden).
  // Erste und letzte Marke verwenden text-anchor start/end,
  // damit sie nicht am Chart-Rand abgeschnitten werden.
  for (const { hour, anchor, offset } of HOUR_TICKS) {
    const x = (hour / 24) * chartWidth + offset
    chartGroup.append('text')
      .attr('x', x)
      .attr('y', chartHeight + 14)
      .attr('text-anchor', anchor)
      .style('font-size', '0.65rem')
      .style('fill', 'var(--text-muted)')
      .text(`${String(hour).padStart(2, '0')}:00`)
  }

  // -----------------------------------------------------------------------
  // 7. CO₂-Farblegende
  // -----------------------------------------------------------------------
  drawLegend(containerWidth, chartHeight)
}

/**
 * Zeichnet die CO₂-Farblegende als kontinuierlichen Gradient-Balken.
 * Verwendet einen SVG linearGradient mit denselben Farb-Stützpunkten
 * wie co2ColorScale aus colors.ts.
 *
 * Unter dem Balken: Achsenmarken bei 0, 150, 300, 450 und 600 g/kWh.
 */
function drawLegend(svgWidth: number, chartBottom: number): void {
  if (!svg) return

  // Alte Legende entfernen
  svg.selectAll('g.legend').remove()

  const legendY = chartBottom + MARGIN.bottom + 36
  const chartWidth = svgWidth - MARGIN.left - MARGIN.right
  const barWidth = chartWidth
  const barHeight = 14

  const legendGroup = svg.append('g')
    .attr('class', 'legend')
    .attr('transform', `translate(${MARGIN.left}, ${legendY})`)

  // -----------------------------------------------------------------------
  // Trennlinie zwischen Chart und Legende
  // -----------------------------------------------------------------------
  legendGroup.append('line')
    .attr('x1', 0)
    .attr('x2', barWidth)
    .attr('y1', -14)
    .attr('y2', -14)
    .attr('stroke', '#e8e8e4')
    .attr('stroke-width', 1)

  // -----------------------------------------------------------------------
  // Gradient-Definition
  // Übereinstimmend mit den Stützpunkten aus co2ColorScale:
  //   0 → #2D6A4F, 150 → #74C69D, 250 → #F4E04A,
  //   350 → #F4A261, 600 → #C1121F
  // -----------------------------------------------------------------------
  const gradientId = 'co2-legend-gradient'

  // Gradient nur einmal pro SVG definieren
  if (!svg.select(`#${gradientId}`).size()) {
    const defs = svg.select('defs').size()
      ? svg.select('defs')
      : svg.insert('defs', ':first-child')

    const gradient = defs.append('linearGradient')
      .attr('id', gradientId)
      .attr('x1', '0%')
      .attr('y1', '0%')
      .attr('x2', '100%')
      .attr('y2', '0%')

    // Stopps bei denselben relativen Positionen wie die Stützpunkte
    const stops = [
      { offset: '0%',   color: '#2D6A4F' },
      { offset: '25%',  color: '#74C69D' },   // 150/600
      { offset: '42%',  color: '#F4E04A' },   // 250/600
      { offset: '58%',  color: '#F4A261' },   // 350/600
      { offset: '100%', color: '#C1121F' },    // 600/600
    ]

    stops.forEach(s => {
      gradient.append('stop')
        .attr('offset', s.offset)
        .attr('stop-color', s.color)
    })
  }

  // -----------------------------------------------------------------------
  // Gradient-Balken zeichnen
  // -----------------------------------------------------------------------
  legendGroup.append('rect')
    .attr('x', 0)
    .attr('y', 0)
    .attr('width', barWidth)
    .attr('height', barHeight)
    .attr('fill', `url(#${gradientId})`)
    .attr('rx', 3)

  // -----------------------------------------------------------------------
  // Achsenmarken und Beschriftung: 0, 150, 300, 450, 600
  // -----------------------------------------------------------------------
  const ticks = [0, 150, 300, 450, 600]

  ticks.forEach(val => {
    const x = (val / 600) * barWidth

    // Kleiner senkrechter Strich (letzten Tick etwas nach links versetzt)
    const tx = val === 600 ? barWidth - 8 : x
    legendGroup.append('line')
      .attr('x1', tx)
      .attr('y1', barHeight + 2)
      .attr('x2', tx)
      .attr('y2', barHeight + 7)
      .attr('stroke', '#999')
      .attr('stroke-width', 1)

    // Zahlenwert (letzten Wert rechtsbündig, damit nicht abgeschnitten)
    const labelX = val === 600 ? barWidth - 4 : x
    legendGroup.append('text')
      .attr('x', labelX)
      .attr('y', barHeight + 20)
      .attr('text-anchor', val === 600 ? 'end' : 'middle')
      .style('font-size', '0.65rem')
      .style('fill', 'var(--text-muted)')
      .text(val === 600 ? `${val}+` : `${val}`)
  })

  // Einheit oberhalb des Gradient-Balkens (statt rechts neben 600+)
  legendGroup.append('text')
    .attr('x', barWidth)
    .attr('y', -4)
    .attr('text-anchor', 'end')
    .style('font-size', '0.6rem')
    .style('fill', 'var(--text-muted)')
    .text('g CO₂ / kWh')

  // -----------------------------------------------------------------------
  // No-Data-Hinweis: kleines Muster-Beispiel + Text
  // Steht separat unterhalb der CO₂-Skala.
  // -----------------------------------------------------------------------
  const noDataY = barHeight + 36

  // Kleines Rechteck mit dem Schraffur-Pattern
  legendGroup.append('rect')
    .attr('x', 0)
    .attr('y', noDataY)
    .attr('width', 10)
    .attr('height', 10)
    .attr('fill', 'url(#no-data-pattern)')
    .attr('stroke', '#e0e0e0')
    .attr('stroke-width', 1)
    .attr('rx', 1)

  // Text „Keine Daten verfügbar“
  legendGroup.append('text')
    .attr('x', 16)
    .attr('y', noDataY + 9)
    .attr('text-anchor', 'start')
    .style('font-size', '0.7rem')
    .style('fill', 'var(--text-muted)')
    .text('Keine Daten verfügbar')
}

// ---------------------------------------------------------------------------
// Lebenszyklus
// ---------------------------------------------------------------------------

onMounted(() => {
  initChart()
  // Nächster Tick, damit DOM bereit ist
  nextTick(() => updateChart())
})

onUnmounted(() => {
  if (resizeCleanup) resizeCleanup()
})

/**
 * Bei Datenänderung neu zeichnen.
 * Nutzt watchEffect statt watch + deep, weil computed-Arrays
 * zuverlässiger getrackt werden. Der Zugriff auf props.data
 * registriert die Abhängigkeit automatisch.
 */
watchEffect(() => {
  // Zugriff auf props.data registriert die Reaktivität
  const count = props.data.length
  if (count > 0) {
    updateChart()
  }
})
</script>

<style scoped>
.waffle-container {
  width: 100%;
  min-height: 100px;
  overflow-x: auto;
}

.waffle-container :deep(.legend text) {
  user-select: none;
}

.waffle-container :deep(svg) {
  overflow: visible;
}
</style>
