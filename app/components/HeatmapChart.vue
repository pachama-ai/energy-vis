<template>
  <!--
    HeatmapChart.vue – D3-Kalender-Heatmap
    ========================================
    Zeigt 24h × 365-Tage als farbcodierte Matrix.
    Farbcodierung nach CO₂-Intensität oder EE-Anteil (per metric-Prop).
    Reagiert auf Brushing aus dem Store (Seite 2 → Seite 3).

    Props:
    - year: number
    - metric: MetricMode ('co2' | 'eeShare')

    Entwicklung in Schritt 2.
  -->
  <div ref="containerRef" class="heatmap-container">
    <p class="placeholder">Heatmap-Chart – wird in Schritt 2 implementiert</p>
  </div>
</template>

<script setup lang="ts">
type MetricMode = 'co2' | 'eeShare'

const props = defineProps<{
  year: number
  metric: MetricMode
}>()

const containerRef = ref<HTMLDivElement>()
</script>

<style scoped>
.heatmap-container {
  width: 100%;
  min-height: 500px;
  border: 1px dashed #ccc;
  display: flex;
  align-items: center;
  justify-content: center;
}

.placeholder {
  color: #999;
  font-size: 0.9rem;
}
</style>
