<template>
  <!-- TODO: Enterで検索したい、リセットボタンほしい -->
  <div class="c-search">
    <div class="c-search--results">{{ result }}</div>
    <form class="c-search__form" @submit.prevent="emit('filterTerm', input)">
      <input v-model="input" name="search" id="search" />
      <button type="submit">
        <span class="material-symbols-outlined">search</span>
      </button>
    </form>
  </div>
  <!-- /.c-search -->
</template>

<style lang="scss" src="@/assets/sass/object/component/search-input.scss" />

<script setup lang="ts">
import { ref } from "vue";

//========================================
// emit
//========================================

const emit = defineEmits<{
  (e: "filterTerm", term: string): void;
}>();

//========================================
// data
//========================================

const input = ref("");
const result = ref("");
</script>
