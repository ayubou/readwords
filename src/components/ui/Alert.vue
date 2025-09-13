<template>
  <div v-if="text" :class="['c-alert', `c-alert--${type}`]">
    <span>{{ text }}</span>
  </div>
</template>

<script setup lang="ts">
//========================================
// props
//========================================
withDefaults(defineProps<{ text: string; type?: "info" | "error" }>(), {
  type: "info",
});
</script>
