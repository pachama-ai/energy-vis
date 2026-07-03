<template>
  <!--
    app.vue – Root-Komponente der Anwendung

    LAYOUT:
    NuxtPage (aktuelle Seite – enthält MetaBar + Inhalt)
    → AppFooter (Quellenangaben, global)

    Die Anwendung hat einen hellen Hintergrund (#FAFAF8), der nur auf
    Seite 4 (residuallast.vue) durch einen dunklen Hintergrund ersetzt wird.
  -->
  <div class="app-wrapper">
    <NuxtRouteAnnouncer />
    <main class="app-main">
      <NuxtPage />
    </main>
    <AppFooter />
  </div>
</template>

<script setup lang="ts">
/**
 * app.vue – Keine komplexe Logik.
 * Die Datenladung erfolgt erst in den Pages/Charts via useDataLoader().
 * Dadurch wird vermieden, dass Daten geladen werden, bevor der Nutzer
 * eine Seite betritt (obwohl lazy-loading hier akzeptabel wäre).
 */
</script>

<style>
/* ---------------------------------------------------------------------------
   Editorial Design System
   ========================
   Farben, Schriftarten und globale Abstände.
   Alle Größen in rem/em/clamp – keine px außer border-width.
   --------------------------------------------------------------------------- */

:root {
  --text-primary:    #1a1a1a;
  --text-secondary:  #555;
  --text-muted:      #888;
  --surface-1:       #f0efeb;
  --border:          #e0dfdb;
  --page-bg:         #fafaf7;
  --accent:          #2d6a4f;
  --font-voice:      'Inter', 'DM Sans', system-ui, sans-serif;
  --font-sans:       'DM Sans', system-ui, -apple-system, 'Segoe UI', sans-serif;
}

*,
*::before,
*::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html {
  font-family: var(--font-sans);
  font-size: 16px;
  line-height: 1.6;
  color: var(--text-primary);
  background-color: var(--page-bg);
  /* Subtiles Raster im Hintergrund – Millimeterpapier-Effekt */
  background-image:
    linear-gradient(var(--border) 0.5px, transparent 0.5px),
    linear-gradient(90deg, var(--border) 0.5px, transparent 0.5px);
  background-size: 4rem 4rem;
  background-blend-mode: normal;
  -webkit-font-smoothing: antialiased;
}

body {
  min-height: 100vh;
}

.app-wrapper {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.app-main {
  flex: 1;
  width: 100%;
  max-width: 80rem;
  margin: 0 auto;
  padding-inline: clamp(1.5rem, 5vw, 3.5rem);
}

/* ---------------------------------------------------------------------------
   Gemeinsame Utility-Klassen
   --------------------------------------------------------------------------- */

.container-narrow {
  max-width: 60ch;
  margin: 0 auto 0 0;
}

.chart-container {
  width: 100%;
  min-height: 400px;
}
</style>

