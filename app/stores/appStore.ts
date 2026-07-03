/**
 * appStore.ts – Globaler Pinia-Store
 * ====================================
 *
 * ENTWURFSENTSCHEIDUNG:
 * Der Store bleibt bewusst klein. Er enthält ausschließlich Zustände,
 * die von mehreren Seiten gemeinsam genutzt werden:
 *
 * brushedRange / brushedActive:
 *   Seite 2 (StackedAreaChart) schreibt den gebürsteten Zeitraum,
 *   Seite 3 (HeatmapChart) liest ihn und schränkt die Anzeige ein.
 *
 * ALLE ANDEREN ZUSTÄNDE SIND LOKAL:
 * - Season-Filter (Seite 1)
 * - Jahres-Dropdown (Seite 3)
 * - Heatmap-Metrik (Seite 3)
 * - Absolut/Prozent-Modus (Seite 2)
 *
 * @see https://pinia.vuejs.org/
 * ====================================
 */

import { defineStore } from 'pinia'
import { ref, readonly } from 'vue'

export const useAppStore = defineStore('app', () => {
  // -------------------------------------------------------------------------
  // State
  // -------------------------------------------------------------------------

  /** Vom StackedAreaChart (Seite 2) gebürsteter Zeitraum [startTs, endTs]. */
  const brushedRange = ref<[number, number] | null>(null)

  /** True, wenn ein Brushing aktiv ist. */
  const brushedActive = ref(false)

  // -------------------------------------------------------------------------
  // Actions
  // -------------------------------------------------------------------------

  /**
   * Setzt den gebürsteten Zeitraum. Wird vom StackedAreaChart aufgerufen,
   * wenn der Nutzer einen Bereich auswählt.
   */
  function setBrushedRange(range: [number, number] | null): void {
    brushedRange.value = range
    brushedActive.value = range !== null
  }

  /** Löscht das Brushing. */
  function clearBrushing(): void {
    brushedRange.value = null
    brushedActive.value = false
  }

  return {
    // State (readonly, damit Komponenten nicht direkt schreiben)
    brushedRange:  readonly(brushedRange),
    brushedActive: readonly(brushedActive),

    // Actions
    setBrushedRange,
    clearBrushing,
  }
})
