/**
 * useBrushing.ts – Brushing zwischen Seite 2 und Seite 3
 * ========================================================
 *
 * ENTWURFSENTSCHEIDUNG:
 * Das Brushing ist integraler Bestandteil des StackedAreaChart auf Seite 2.
 * Es gibt KEINE separate Brush-Leiste. Der Stacked-Area-Chart ist die
 * alleinige Quelle des ausgewählten Zeitraums.
 *
 * DATENFLUSS:
 *   StackedAreaChart.vue (Seite 2)
 *     │  Nutzer interagiert mit D3-Brush-Selektor
 *     │  → useBrushing.setBrushedRange([startTs, endTs])
 *     │  → schreibt in den globalen Store
 *     ▼
 *   appStore.ts
 *     │  brushedRange + brushedActive
 *     ▼
 *   HeatmapChart.vue (Seite 3, lesend)
 *     │  watch(store.brushedRange) → filtert Daten → updateChart()
 * ========================================================
 */

import { useAppStore } from '~/stores/appStore'

/**
 * Stellt die Brushing-Funktionen bereit.
 * Wird hauptsächlich vom StackedAreaChart (Seite 2) verwendet.
 */
export function useBrushing() {
  const store = useAppStore()

  /**
   * Setzt einen gebürsteten Zeitraum.
   * Wird vom D3-Brush-Event-Handler aufgerufen.
   */
  function setBrushedRange(range: [number, number] | null): void {
    store.setBrushedRange(range)
  }

  /** Prüft, ob ein Brushing aktiv ist. */
  function isBrushed(): boolean {
    return store.brushedActive
  }

  /** Gibt den aktuellen Brush-Bereich zurück. */
  function getBrushedRange(): [number, number] | null {
    return store.brushedRange
  }

  /** Löscht das Brushing. */
  function clearBrushing(): void {
    store.clearBrushing()
  }

  return {
    setBrushedRange,
    isBrushed,
    getBrushedRange,
    clearBrushing,
  }
}
