<template>
  <div v-if="text" :class="['c-alert', `c-alert--${type}`]">
    <span>{{ text }}</span>
  </div>
</template>

<style lang="scss" src="@/assets/sass/object/component/alert.scss" />

<script setup lang="ts">
export type AlertType = "info" | "error";

//========================================
// props
//========================================
withDefaults(defineProps<{ text: string; type?: AlertType }>(), {
  type: "info",
});
</script>
