<template>
  <component :is="`h${level}`" class="c-title">{{ title }}</component>
</template>

<script setup lang="ts">
//========================================
// props
//========================================

withDefaults(defineProps<{ title: string; level?: number }>(), {
  level: 2,
});
</script>
