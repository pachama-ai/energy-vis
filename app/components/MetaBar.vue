<template>
  <!--
    MetaBar.vue – Minimale seitenübergreifende Navigation

    ENTWURFSENTSCHEIDUNG:
    Dies ist KEINE globale Toolbar. Die MetaBar ist bewusst schlicht:
    - Link-Liste zu allen 6 Seiten
    - Ein default-Slot für seiten-spezifische Metainformationen
      (z. B. "Deutschlands Strom 2025" auf Seite 1)
    - Keine globalen Steuerelemente – Interaktionen gehören zur Visualisierung.

    Die Seite, die MetaBar importiert, füllt den Slot mit ihrem
    spezifischen Inhalt. Das Layout bleibt konsistent, der Inhalt flexibel.
  -->
  <header :class="['meta-bar', { 'meta-bar--dark': dark }]">

    <nav class="meta-nav">
      <NuxtLink to="/"        class="nav-link">Start</NuxtLink>
      <NuxtLink to="/strommix" class="nav-link">Strommix</NuxtLink>
      <NuxtLink to="/heatmap"  class="nav-link">Heatmap</NuxtLink>
      <NuxtLink to="/residuallast" class="nav-link">Residuallast</NuxtLink>
      <NuxtLink to="/stromhandel" class="nav-link">Stromhandel</NuxtLink>
      <NuxtLink to="/co2-trend" class="nav-link">CO₂ &amp; Preise</NuxtLink>
    </nav>
    <div class="meta-content">
      <!-- Slot für seiten-spezifische Metadaten -->
      <slot />
    </div>
  </header>
</template>

<script setup lang="ts">
/**
 * MetaBar – Navigation + Slot für seiten-spezifische Metadaten.
 *
 * Props:
 * - dark: boolean – schaltet auf dunkles Farbschema um (für Seite 4)
 */
withDefaults(defineProps<{
  dark?: boolean
}>(), {
  dark: false,
})
</script>

<style scoped>
.meta-bar {
  display: flex;
  justify-content: center;
  align-items: center;
  padding-block: 1rem;
  padding-inline: clamp(1.5rem, 5vw, 3.5rem);
  background: var(--surface-1);
  border-bottom: 0.5px solid var(--border);

  /* Volle Browserbreite – auch innerhalb eines constrained parent */
  width: 100vw;
  margin-left: calc(-50vw + 50%);

  transition: background 0.2s, border-color 0.2s;
}

/* Dunkel-Variante für Seite 4 */
.meta-bar--dark {
  background: #16213e;
  border-bottom: 0.5px solid #2a2a4e;
}

.meta-bar--dark .nav-link {
  color: #aaa;
}

.meta-bar--dark .nav-link:hover {
  color: #fff;
}

.meta-bar--dark .nav-link.router-link-active {
  color: #fff;
  border-bottom-color: #fff;
}

.meta-bar--dark .meta-content {
  color: #ccc;
}

.meta-nav {
  display: flex;
  gap: 3rem;
  flex-shrink: 0;
}

.nav-link {
  font-family: var(--font-sans);
  font-size: 0.75rem;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--text-muted);
  text-decoration: none;
  padding-bottom: 0.15rem;
  border-bottom: 0.0625rem solid transparent;
  transition: color 0.15s, border-color 0.15s;
  white-space: nowrap;
}

.nav-link:hover {
  color: var(--accent);
}

.nav-link.router-link-active {
  color: var(--accent);
  border-bottom: 0.0625rem solid var(--accent);
}

.meta-content {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-left: auto;
  padding-left: 2rem;
  display: none;
  font-size: 0.7rem;
  font-style: italic;
  color: var(--text-muted);
  white-space: nowrap;
}
</style>
