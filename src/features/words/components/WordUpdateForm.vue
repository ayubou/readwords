<template>
  <form class="c-card--update" @submit.prevent="submitForm">
    <div>
      <label for="kana">かな</label>
      <input
        v-model="word.kana"
        name="kana"
        id="kana"
        required
        :disabled="isLoading"
      />
    </div>
    <div>
      <label for="word">単語</label>
      <input
        v-model="word.name"
        name="word"
        id="word"
        required
        :disabled="isLoading"
      />
    </div>
    <div>
      <label for="detail">備考</label>
      <textarea
        v-model="word.detail"
        name="detail"
        id="detail"
        required
        :disabled="isLoading"
      />
    </div>
    <button type="submit" :disabled="isLoading">
      {{ isLoading ? "更新中..." : "更新" }}
    </button>
    <button type="button" @click="emit('close')">閉じる</button>
  </form>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { updateWord } from "@/features/words/services/repository";
import { type AlertType } from "@/components/ui/Alert.vue";

//========================================
// props & emit
//========================================

const props = defineProps<{
  word: {
    id: string;
    kana: string;
    name: string;
    detail: string;
  };
}>();

const emit = defineEmits<{
  (e: "result", message: string, type: AlertType): void;
  (e: "close"): void;
}>();

//========================================
// data
//========================================

const word = ref({ ...props.word });
const isLoading = ref(false);

//========================================
// method
//========================================

/**
 * 単語を更新
 */
const submitForm = async () => {
  // TODO:バリデーションチェック・アラート
  if (word.value.kana && word.value.name && word.value.detail) {
    isLoading.value = true;
    try {
      await updateWord(word.value.id, {
        name: word.value.name,
        kana: word.value.kana,
        detail: word.value.detail,
      });

      emit("close");
    } catch (e: unknown) {
      console.error(e instanceof Error ? e.message : e);
    } finally {
      isLoading.value = false;
    }
  }
};
</script>
