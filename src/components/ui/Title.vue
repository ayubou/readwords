<template>
  <component :is="`h${level}`" class="c-title">{{ title }}</component>
</template>

<style lang="scss" src="@/assets/sass/object/component/title.scss" />

<script setup lang="ts">
//========================================
// props
//========================================

withDefaults(defineProps<{ title: string; level?: number }>(), {
  level: 2,
});
</script>
