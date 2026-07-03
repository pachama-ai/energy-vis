<template>
  <!--
    AppFooter.vue – Quellenangaben und Methodik-Hinweis

    ENTWURFSENTSCHEIDUNG:
    Der Footer erscheint auf allen Seiten und dokumentiert die
    Datenquellen (SMARD, ENTSO-E) als wissenschaftliche Transparenz.
    Dies ist ein geforderter Bestandteil der studentischen Arbeit.
  -->
  <footer class="app-footer">
    <div class="footer-content">
      <p class="footer-heading">Datenquellen</p>
      <p>
        Stromerzeugung und -last:
        <a href="https://www.smard.de" target="_blank" rel="noopener noreferrer">SMARD</a>
        (Bundesnetzagentur) – stündliche Auflösung 2015–2025.
      </p>
      <p>
        Börsenstrompreise: SMARD / ENTSO-E – Day-Ahead-Auktion.
      </p>
      <p class="footer-note">
        CO₂-Intensitäten basieren auf Standard-Emissionsfaktoren des Umweltbundesamtes.
        Die Daten wurden am 02.07.2026 aktualisiert.
      </p>
    </div>
  </footer>
</template>

<script setup lang="ts">
/**
 * AppFooter – Rein deklarativ, kein Script-Logik notwendig.
 * Alle Angaben sind statische Texte.
 */
</script>

<style scoped>
.app-footer {
  background: var(--surface-1);
  border-top: 0.5px solid var(--border);
  padding-block: 2.5rem;
  padding-inline: clamp(1.5rem, 5vw, 3.5rem);
  /* Volle Browserbreite wie MetaBar */
  width: 100vw;
  margin-left: calc(-50vw + 50%);
}

.footer-content {
  max-width: 60ch;
  margin: 0 auto;
  font-size: 0.75rem;
  color: var(--text-muted);
  line-height: 1.8;
}

.footer-heading {
  font-size: 0.65rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--text-muted);
  margin-bottom: 0.75rem;
  font-weight: 400;
}

.footer-note {
  margin-top: 0.5rem;
  font-style: italic;
}

.footer-content a {
  color: #2a6f97;
  text-decoration: underline;
}
</style>
