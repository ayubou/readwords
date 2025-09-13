<template>
  <div :id="d.wordId">
    <div @click="isUpdate = !isUpdate" class="c-card__main">
      <small>{{ d.kana }}</small>
      <h2>{{ d.name }}</h2>
      <span>{{ d.detail }}</span>
    </div>

    <WordUpdateForm
      v-if="isLogin && isUpdate && openId === d.wordId"
      :d="{
        wordId: d.wordId,
        kana: d.kana,
        name: d.name,
        detail: d.detail,
      }"
      @close="isUpdate = false"
    />

    <div id="delete">
      <button v-if="isLogin" @click="emit('delete')">delete</button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { storeToRefs } from "pinia";
import { useAuthStore } from "@/features/auth/store/auth";
import WordUpdateForm from "@/features/words/components/WordUpdateForm.vue";

//========================================
// props & emit
//========================================

const props = defineProps<{
  d: {
    wordId: string;
    kana: string;
    name: string;
    detail: string;
  };
  openId: string;
}>();

const emit = defineEmits<{
  result: [string, "info" | "error"];
  delete: [];
}>();

const auth = useAuthStore();
const { isLogin } = storeToRefs(auth);

const isUpdate = ref(false);
</script>
