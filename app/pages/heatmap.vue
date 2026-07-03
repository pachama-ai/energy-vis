<template>
  <!--
    Seite 3 – Heatmap eines Jahres
    ================================
    Kalender-Heatmap mit 24h × 365-Tage-Matrix. Reagiert später auf
    das Brushing von Seite 2 (eingeschränkter Zeitraum) und enthält
    einen Jahres-Dropdown sowie einen CO₂/EE-Umschalter.
  -->
  <div class="page page-heatmap">
    <MetaBar>
      <span>CO₂-Intensität 2025</span>
    </MetaBar>

    <section class="section-intro container-narrow">
      <h1>CO₂-Intensität im Jahresverlauf</h1>
      <p class="lead-text">
        Jede Stunde als Farbpunkt – sortiert nach Monaten. Hier entsteht
        die Kalender-Heatmap, die später auf das Brushing von Seite 2
        reagiert.
      </p>
    </section>

    <!-- Platzhalter für Heatmap -->
    <div class="chart-container chart-placeholder">
      <span class="placeholder-text">Heatmap-Chart – wird in Schritt 2 implementiert</span>
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * heatmap.vue – Seite 3
 * Aktuell: reines Grundgerüst ohne Datenlogik.
 * Schritt 2: HeatmapChart + Jahres-Dropdown + Metric-Umschalter.
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
