<template>
  <!--
    Seite 5 – Europäischer Stromhandel (Sankey)
    =============================================
    Sankey-Diagramm der physischen Stromflüsse zwischen Deutschland
    und seinen Nachbarländern. Daten aus separatem Download-Skript.
  -->
  <div class="page page-stromhandel">
    <MetaBar>
      <span>Europäischer Stromhandel</span>
    </MetaBar>

    <section class="section-intro container-narrow">
      <h1>Europäischer Stromhandel</h1>
      <p class="lead-text">
        Deutschland importiert und exportiert Strom mit allen Nachbarländern.
        Hier entsteht das Sankey-Diagramm der physischen Stromflüsse.
      </p>
    </section>

    <!-- Platzhalter für Sankey -->
    <div class="chart-container chart-placeholder">
      <span class="placeholder-text">Sankey-Diagramm – wird in Schritt 3 implementiert</span>
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * stromhandel.vue – Seite 5
 * Aktuell: Grundgerüst.
 * Schritt 3: SankeyChart + Download-Skript für Import/Export-Daten.
 */
</script>

<style scoped>
h1 {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 0.75rem;
}

.lead-text {
  font-size: 1.1rem;
  color: #555;
  max-width: 36rem;
}

.chart-placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px dashed #ccc;
  border-radius: 6px;
  background: #f5f5f0;
}

.placeholder-text {
  color: #999;
  font-size: 0.9rem;
}
</style>
