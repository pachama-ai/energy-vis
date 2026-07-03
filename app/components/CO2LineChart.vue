<template>
  <!--
    CO2LineChart.vue – D3-CO₂-Trendlinie
    ======================================
    Liniendiagramm der durchschnittlichen CO₂-Intensität 2015–2025.
    Datenquelle: combined-year.json (Feld co2).

    Entwicklung in Schritt 3.
  -->
  <div ref="containerRef" class="co2line-container">
    <p class="placeholder">CO₂-Trendlinie – wird in Schritt 3 implementiert</p>
  </div>
</template>

<script setup lang="ts">
const containerRef = ref<HTMLDivElement>()
</script>

<style scoped>
.co2line-container {
  width: 100%;
  min-height: 400px;
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
