<template>
  <div :id="word.id">
    <div @click="isOpen = !isOpen" class="c-card__main">
      <small>{{ word.kana }}</small>
      <h2>{{ word.name }}</h2>
      <span>{{ word.detail }}</span>
    </div>

    <WordUpdateForm
      v-if="isLoggedIn && isOpen && updateWordId === word.id"
      :word="{
        id: word.id,
        kana: word.kana,
        name: word.name,
        detail: word.detail,
      }"
      @close="isOpen = false"
    />

    <div v-if="isLoggedIn" class="btn-delete">
      <button @click="emit('delete')">delete</button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { storeToRefs } from "pinia";
import { useAuthStore } from "@/features/auth/store/auth";
import WordUpdateForm from "@/features/words/components/WordUpdateForm.vue";
import { type AlertType } from "@/components/ui/Alert.vue";

//========================================
// props & emit
//========================================

defineProps<{
  word: {
    id: string;
    kana: string;
    name: string;
    detail: string;
  };
  updateWordId: string;
}>();

const emit = defineEmits<{
  (e: "result", message: string, type: AlertType): void;
  (e: "delete"): void;
}>();

//========================================
// data
//========================================

const auth = useAuthStore();
const { isLoggedIn } = storeToRefs(auth);
const isOpen = ref(false);
</script>
