<template>
  <!--
    ToggleSwitch.vue – Generischer Kippschalter
    ============================================
    Ein Button-Switch für 2–3 Optionen.
    Wird verwendet für:
    - Prozent/Absolut-Umschalter (Seite 2)
    - Season-Filter (Seite 1)
    - CO₂/EE-Metrik (Seite 3)

    Props:
    - options: { value: T; label: string }[]
    - modelValue: T (aktuell ausgewählt)

    Events:
    - update:modelValue(T)
  -->
  <div class="toggle-switch">
    <button
      v-for="opt in options"
      :key="String(opt.value)"
      :class="['toggle-btn', { active: modelValue === opt.value }]"
      @click="$emit('update:modelValue', opt.value)"
    >
      {{ opt.label }}
    </button>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  options: { value: unknown; label: string }[]
  modelValue: unknown
}>()

defineEmits<{
  'update:modelValue': [value: unknown]
}>()
</script>

<style scoped>
.toggle-switch {
  display: inline-flex;
  flex-wrap: nowrap;
  align-items: center;
  gap: 0;
}

.toggle-btn {
  padding: 0.35em 1em;
  font-size: 0.85rem;
  border: none;
  background: transparent;
  color: var(--text-muted);
  cursor: pointer;
  white-space: nowrap;
  transition: color 200ms ease;
  border-bottom: 0.125rem solid transparent;
}

.toggle-btn:hover {
  color: var(--text-primary);
}

.toggle-btn.active {
  color: var(--text-primary);
  font-weight: 500;
  border-bottom: 0.125rem solid var(--accent);
}
</style>
