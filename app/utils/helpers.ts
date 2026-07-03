/**
 * helpers.ts – Gemeinsame D3-Helfer
 * ====================================
 * Stellt allen Chart-Komponenten konsistente D3-Werkzeuge bereit:
 * - Responsives SVG-Container-Setup
 * - Einheitliche Achsen-Stile
 * - Grid-Lines
 * - ResizeObserver-Integration
 * ====================================
 */

import * as d3 from 'd3'

/**
 * Standard-Margin für alle Charts.
 * Einheitlich definiert, damit alle Charts denselben Weißraum haben.
 */
export const MARGIN = { top: 40, right: 40, bottom: 50, left: 70 }

// ---------------------------------------------------------------------------
// Responsives SVG-Setup
// ---------------------------------------------------------------------------

/**
 * Erstellt oder aktualisiert ein responsives SVG-Element innerhalb eines
 * Containers. Setzt viewBox und preserveAspectRatio.
 *
 * @param container – D3-Selektion des Container-Elements (z. B. d3.select(divRef))
 * @param width     – Aktuelle Breite des Containers
 * @param height    – Aktuelle Höhe des Containers
 * @returns         – D3-Selektion des <svg>-Elements
 */
export function createSvg(
  container: d3.Selection<HTMLDivElement, unknown, null, undefined>,
  width: number,
  height: number,
): d3.Selection<SVGSVGElement, unknown, null, undefined> {
  // Entferne altes SVG, falls vorhanden (für Resize)
  container.select('svg').remove()

  return container
    .append('svg')
    .attr('viewBox', `0 0 ${width} ${height}`)
    .attr('preserveAspectRatio', 'xMidYMid meet')
    .style('width', '100%')
    .style('height', '100%')
}

/**
 * Erstellt eine innere Gruppe (g) mit Übersetzung für die Margins.
 * Alle Chart-Inhalte werden in dieser Gruppe gezeichnet.
 */
export function createChartGroup(
  svg: d3.Selection<SVGSVGElement, unknown, null, undefined>,
): d3.Selection<SVGGElement, unknown, null, undefined> {
  return svg.append('g').attr('transform', `translate(${MARGIN.left},${MARGIN.top})`)
}

// ---------------------------------------------------------------------------
// Achsen und Grid
// ---------------------------------------------------------------------------

/**
 * Zeichnet die X-Achse unterhalb des Charts.
 *
 * @param group   – Die Chart-Gruppe (g)
 * @param scale   – D3-Scale für die X-Achse
 * @param height  – Chart-Höhe (für Positionierung am unteren Rand)
 * @param ticks   – Anzahl der Ticks (optional)
 */
export function drawXAxis(
  group: d3.Selection<SVGGElement, unknown, null, undefined>,
  scale: d3.AxisScale<d3.NumberValue>,
  height: number,
  ticks?: number,
): void {
  const axis = d3.axisBottom(scale)
  if (ticks !== undefined) axis.ticks(ticks)
  group.append('g')
    .attr('class', 'x-axis')
    .attr('transform', `translate(0, ${height})`)
    .call(axis)
    .selectAll('text')
    .attr('font-size', '11px')
    .attr('fill', '#666')
}

/**
 * Zeichnet die Y-Achse links neben dem Chart.
 */
export function drawYAxis(
  group: d3.Selection<SVGGElement, unknown, null, undefined>,
  scale: d3.AxisScale<d3.NumberValue>,
  ticks?: number,
): void {
  const axis = d3.axisLeft(scale)
  if (ticks !== undefined) axis.ticks(ticks)
  group.append('g')
    .attr('class', 'y-axis')
    .call(axis)
    .selectAll('text')
    .attr('font-size', '11px')
    .attr('fill', '#666')
}

/**
 * Zeichnet horizontale Grid-Linien über die gesamte Chart-Breite.
 * Die Farbe ist standardmäßig hellgrau und kann über den theme-Parameter
 * an dunkle Hintergründe angepasst werden.
 */
export function drawGrid(
  group: d3.Selection<SVGGElement, unknown, null, undefined>,
  scale: d3.AxisScale<d3.NumberValue>,
  width: number,
  theme: 'light' | 'dark' = 'light',
): void {
  const color = theme === 'dark' ? '#444' : '#e0e0e0'
  const axis = d3.axisLeft(scale)
    .tickSize(-width)
    .tickFormat(() => '')

  group.append('g')
    .attr('class', 'grid')
    .attr('stroke', color)
    .attr('stroke-opacity', 0.5)
    .call(axis)
    .selectAll('line')
    .attr('stroke', color)
}

// ---------------------------------------------------------------------------
// ResizeObserver für responsive Charts
// ---------------------------------------------------------------------------

/**
 * Richtet einen ResizeObserver ein, der bei Größenänderung des Containers
 * eine Callback-Funktion aufruft. Gibt eine Cleanup-Funktion zurück.
 *
 * @param containerRef – Vue template ref des Container-Elements (HTMLDivElement)
 * @param onResize     – Callback mit neuer (width, height)
 * @returns            – Cleanup-Funktion (in onUnmounted aufrufen)
 */
export function setupResizeObserver(
  containerRef: HTMLDivElement,
  onResize: (width: number, height: number) => void,
): () => void {
  const observer = new ResizeObserver((entries) => {
    for (const entry of entries) {
      const { width, height } = entry.contentRect
      if (width > 0 && height > 0) {
        onResize(width, height)
      }
    }
  })

  observer.observe(containerRef)
  return () => observer.disconnect()
}

/**
 * Formatiert eine D3-Achse mit einheitlichem Styling.
 * Wird nach drawXAxis / drawYAxis aufgerufen.
 */
export function styleAxis(
  axisGroup: d3.Selection<SVGGElement, unknown, null, undefined>,
  theme: 'light' | 'dark' = 'light',
): void {
  const color = theme === 'dark' ? '#ccc' : '#666'
  axisGroup.selectAll('line').attr('stroke', color)
  axisGroup.selectAll('path').attr('stroke', color)
  axisGroup.selectAll('text').attr('fill', color).attr('font-size', '11px')
}
