<template>
  <!--
    ResidualLoadChart.vue – D3-Duck-Curve
    ======================================
    Zeigt Tagesprofile der Residuallast.
    Vergleich 2015 vs. 2025 als überlagerte Linien.
    Angepasst an dunklen Hintergrund (Seite 4).

    Entwicklung in Schritt 3.
  -->
  <div ref="containerRef" class="residual-container">
    <p class="placeholder">Residuallast-Chart (Duck Curve) – wird in Schritt 3 implementiert</p>
  </div>
</template>

<script setup lang="ts">
const containerRef = ref<HTMLDivElement>()
</script>

<style scoped>
.residual-container {
  width: 100%;
  min-height: 500px;
  border: 1px dashed #555;
  display: flex;
  align-items: center;
  justify-content: center;
}

.placeholder {
  color: #888;
  font-size: 0.9rem;
}
</style>
