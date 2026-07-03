<template>
  <!--
    Annotation.vue – Narrative Chart-Annotation
    ============================================
    Zeigt einen positionierten Textblock mit optionalem Pfeil.
    Dient dazu, im Chart-Bereich auf bestimmte Phänomene
    hinzuweisen (z. B. "Dunkelflaute Januar 2025").

    Props:
    - position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'
      (Steuerung über CSS – kann später durch absolute Position ersetzt werden)

    Slot: default (Text-Inhalt)
  -->
  <aside :class="['annotation', position]">
    <slot />
  </aside>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'
}>(), {
  position: 'top-right',
})
</script>

<style scoped>
.annotation {
  display: inline-block;
  padding: 0.75rem 1rem;
  background: #f5f5f0;
  border-left: 3px solid #1a1a1a;
  border-radius: 4px;
  font-size: 0.85rem;
  line-height: 1.5;
  color: #333;
  max-width: 24rem;
}

.annotation strong {
  font-weight: 700;
}
</style>
