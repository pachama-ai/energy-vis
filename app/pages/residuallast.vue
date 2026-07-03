<template>
  <!--
    Seite 4 – Residuallast und Duck Curve
    =======================================
    Zeigt Tagesprofile der Residuallast als Liniendiagramm.
    Visualisiert den "Duck Curve"-Effekt.

    GESTALTERISCHE ENTSCHEIDUNG:
    Festes dunkles Theme (#1a1a2e) als narrative Designentscheidung –
    kein Interaktionsfeedback, sondern visuelle Unterstützung des Themas.
  -->
  <div class="page page-residuallast dark-page">
    <MetaBar dark>
      <span>Residuallast &amp; Duck Curve</span>
    </MetaBar>

    <section class="section-intro container-narrow">
      <h1>Residuallast und die Duck Curve</h1>
      <p class="lead-text">
        Die Residuallast ist der Strom, den konventionelle Kraftwerke liefern
        müssen. Hier entsteht die Duck-Curve-Visualisierung mit Tagesprofilen
        und Dunkelflauten-Analyse.
      </p>
    </section>

    <!-- Platzhalter für ResidualLoadChart -->
    <div class="chart-container chart-placeholder">
      <span class="placeholder-text">ResidualLoadChart – wird in Schritt 3 implementiert</span>
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * residuallast.vue – Seite 4
 * Aktuell: Grundgerüst mit dunklem Theme.
 * Schritt 3: ResidualLoadChart.
 */
</script>

<style scoped>
/* ---------------------------------------------------------------------------
   Dunkler Hintergrund – bewusste narrative Designentscheidung
   Gilt NUR für diese Seite. Negative Margen überdecken den hellen app.vue-
   Hintergrund vollflächig.
   --------------------------------------------------------------------------- */

.page-residuallast {
  background: #1a1a2e;
  color: #e0e0e0;
  min-height: 100vh;
  margin: -2rem;
  padding: 2rem;
}

h1 {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 0.75rem;
  color: #f0f0f0;
}

.lead-text {
  font-size: 1.1rem;
  color: #aaa;
  max-width: 36rem;
}

.chart-placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px dashed #555;
  border-radius: 6px;
  background: #16213e;
}

.placeholder-text {
  color: #888;
  font-size: 0.9rem;
}
</style>
