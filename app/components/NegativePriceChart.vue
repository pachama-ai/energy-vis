<template>
  <!--
    NegativePriceChart.vue – D3-Negativpreis-Balken
    ================================================
    Balkendiagramm der Stunden mit negativen Börsenpreisen pro Jahr.
    Datenquelle: combined-year.json (Feld negStunden).

    Entwicklung in Schritt 3.
  -->
  <div ref="containerRef" class="negprice-container">
    <p class="placeholder">Negative-Preis-Balken – wird in Schritt 3 implementiert</p>
  </div>
</template>

<script setup lang="ts">
const containerRef = ref<HTMLDivElement>()
</script>

<style scoped>
.negprice-container {
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
