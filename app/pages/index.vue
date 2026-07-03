<template>
  <!--
    Seite 1 – Waffeldiagramm (365 × 24)
    ======================================
    Hero-Seite der Anwendung. Zeigt die CO₂-Intensität jeder Stunde
    des Jahres 2025 als farbcodiertes Raster.

    ENTWURFSENTSCHEIDUNG:
    - Ausschließlich Jahr 2025 (kein Jahres-Dropdown)
    - Season-Filter ist LOKALER State
    - Daten werden hier gefiltert und als Prop an WaffleChart übergeben
  -->
  <div class="page page-waffle">
    <MetaBar />

    <section class="section-intro container-narrow">
      <h1>Wie klimaneutral ist Deutschlands Strom?</h1>
      <p class="lead-text">
        Jede Stunde des Schaltjahres 2024 als Farbpunkt – von tiefem Petrolgrün
        (nahezu klimaneutral) bis tiefrot (hohe CO₂-Intensität). Jede der
        8.784 Zellen steht für eine Stunde des Jahres.
      </p>
    </section>

    <!-- Season-Filter (lokal) -->
    <div class="filter-bar container-narrow">
      <label class="filter-label">Zeitraum:</label>
      <ToggleSwitch
        :options="seasonOptions"
        :model-value="season"
        @update:model-value="season = $event"
      />
    </div>

    <!-- Waffel-Chart -->
    <div class="chart-container">
      <WaffleChart :data="filteredData" />
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * index.vue – Seite 1
 *
 * DATENFLUSS:
 * 1. useDataLoader() → hourData (alle Stunden 2015–2025)
 * 2. computed filteredData: filtert auf Jahr 2024 + aktiven Season-Filter
 * 3. WaffleChart bekommt gefilterte Daten als Prop
 *
 * LOKALER STATE:
 * - season (SeasonFilter): 'all' | 'summer' | 'winter'
 */
import type { SeasonFilter } from '~/utils/constants'
import { SEASON_ALL, SEASON_SUMMER, SEASON_WINTER } from '~/utils/constants'
import type { HourEntry } from '~/types/data'

const { hourData } = useDataLoader()

const season = ref<SeasonFilter>('all')

const seasonOptions = [
  { value: 'all',    label: SEASON_ALL.label },
  { value: 'summer', label: SEASON_SUMMER.label },
  { value: 'winter', label: SEASON_WINTER.label },
]

/**
 * Gefilterte Daten: Jahr 2024 + ggf. auf Energiehalbjahr eingeschränkt.
 * Sommerhalbjahr = Apr–Sep (Monate 4–9)
 * Winterhalbjahr = Okt–Mrz (Monate 10–12, 1–3)
 */
const filteredData = computed<HourEntry[]>(() => {
  let data = hourData.value.filter(d => d.year === 2024)

  if (season.value === 'summer') {
    data = data.filter(d => d.month >= 4 && d.month <= 9)
  } else if (season.value === 'winter') {
    data = data.filter(d => d.month <= 3 || d.month >= 10)
  }

  return data
})
</script>

<style scoped>
/* ---------------------------------------------------------------------------
   Editorial-Typografie
   Alle Größen in rem/clamp – keine px außer border-width.
   --------------------------------------------------------------------------- */

.section-intro {
  margin-top: 3.5rem;
  margin-bottom: 0;
}

h1 {
  font-family: 'Inter', var(--font-voice);
  font-size: clamp(2rem, 4vw, 3rem);
  font-weight: 700;
  letter-spacing: -0.01em;
  line-height: 1.1;
  margin-bottom: 0;
  max-width: 90ch;
  color: var(--text-primary);
}

.lead-text {
  font-family: 'DM Sans', var(--font-sans);
  font-size: clamp(0.95rem, 1.5vw, 1.05rem);
  line-height: 1.75;
  max-width: 60ch;
  color: var(--text-secondary);
  margin-top: 1.25rem;
}

/* ---------------------------------------------------------------------------
   Season-Filter: Tab-ähnlich, kein Zeilenumbruch
   --------------------------------------------------------------------------- */

.filter-bar {
  display: flex;
  flex-wrap: nowrap;
  align-items: center;
  gap: 0;
  margin-top: 1.5rem;
  margin-bottom: 0;
}

.filter-label {
  font-size: 0.7rem;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--text-muted);
  margin-right: 0.75rem;
}

/* ---------------------------------------------------------------------------
   Chart-Abstand
   --------------------------------------------------------------------------- */

.chart-container {
  margin-top: 2rem;
  /* Chart um MARGIN.left (44px ≈ 2.75rem) nach links verschieben –
     so fluchten die Zellen (nicht die Monatslabels) mit dem Text */
  margin-left: -2.75rem;
  width: calc(100% + 2.75rem);
}
</style>
