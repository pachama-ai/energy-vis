<template>
  <!--
    SankeyChart.vue – D3-Sankey-Diagramm
    ======================================
    Zeigt physische Stromflüsse zwischen Deutschland und
    seinen Nachbarländern.

    Daten aus public/data/import-export.json (separates Skript).

    Entwicklung in Schritt 3.
  -->
  <div ref="containerRef" class="sankey-container">
    <p class="placeholder">Sankey-Diagramm – wird in Schritt 3 implementiert (nach Import/Export-Datenskript)</p>
  </div>
</template>

<script setup lang="ts">
const containerRef = ref<HTMLDivElement>()
</script>

<style scoped>
.sankey-container {
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
