<template>
  <!--
    Seite 2 – Transformation des Strommixes
    =========================================
    Stacked Area Chart der Stromerzeugung nach Energieträgern 2015–2025.
    Enthält später einen D3-Brush-Selektor für die Zeitraumauswahl
    (→ Seite 3 Heatmap) sowie einen Prozent/Absolut-Umschalter.
  -->
  <div class="page page-strommix">
    <MetaBar>
      <span>Strommix 2015–2025</span>
    </MetaBar>

    <section class="section-intro container-narrow">
      <h1>Transformation des Strommixes</h1>
      <p class="lead-text">
        Wie hat sich die Stromerzeugung in Deutschland verändert? Hier entsteht
        der Stacked Area Chart – wähle später einen Zeitraum aus, um die
        Detailansicht auf der Heatmap-Seite zu sehen.
      </p>
    </section>

    <!-- Platzhalter für Stacked Area Chart -->
    <div class="chart-container chart-placeholder">
      <span class="placeholder-text">Stacked Area Chart – wird in Schritt 2 implementiert</span>
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * strommix.vue – Seite 2
 * Aktuell: reines Grundgerüst ohne Datenlogik.
 * Schritt 2: StackedAreaChart + ToggleSwitch + Brushing.
 */
</script>

<style scoped>
h1 {
  font-size: 2rem;
  font-weight: 700;
  line-height: 1.2;
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
