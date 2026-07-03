<template>
  <!--
    Seite 6 – CO₂-Trend und negative Strompreise
    ==============================================
    Zwei unabhängige Charts:
    1. CO₂-Intensitätslinie (2015–2025)
    2. Negativpreis-Balken (2015–2025)
  -->
  <div class="page page-co2">
    <MetaBar>
      <span>CO₂-Trend &amp; negative Preise 2015–2025</span>
    </MetaBar>

    <section class="section-intro container-narrow">
      <h1>CO₂-Intensität und negative Strompreise</h1>
      <p class="lead-text">
        Zwei zentrale Kennzahlen der Energiewende: Der CO₂-Gehalt pro
        Kilowattstunde sinkt – und die Stunden mit negativen Börsenpreisen
        steigen. Hier entstehen die Trendlinie und das Balkendiagramm.
      </p>
    </section>

    <!-- Platzhalter für CO₂-Linie -->
    <div class="chart-container chart-placeholder">
      <span class="placeholder-text">CO₂-Trendlinie – wird in Schritt 3 implementiert</span>
    </div>

    <!-- Platzhalter für Negativpreis-Balken -->
    <div class="chart-container chart-placeholder">
      <span class="placeholder-text">Negative-Preis-Balken – wird in Schritt 3 implementiert</span>
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * co2-trend.vue – Seite 6
 * Aktuell: Grundgerüst.
 * Schritt 3: CO2LineChart + NegativePriceChart.
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
