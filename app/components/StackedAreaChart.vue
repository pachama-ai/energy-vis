<template>
  <!--
    StackedAreaChart.vue – D3-Stacked-Area-Chart
    =============================================
    Zeigt die Entwicklung der Stromerzeugung nach Energieträgern.
    Enthält D3-Brush-Selektor für Zeitraumauswahl (→ Seite 3).

    Props:
    - absolute: boolean (false = Prozent, true = MW)

    Entwicklung in Schritt 2.
  -->
  <div ref="containerRef" class="stacked-container">
    <p class="placeholder">Stacked Area Chart – wird in Schritt 2 implementiert</p>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  absolute: boolean
}>()

const containerRef = ref<HTMLDivElement>()
</script>

<style scoped>
.stacked-container {
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
