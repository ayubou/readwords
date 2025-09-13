<template>
  <div class="c-card--update">
    <dl>
      <dt><label for="kana">かな</label></dt>
      <dd><input v-model="word.kana" name="kana" id="kana" /></dd>
    </dl>
    <dl>
      <dt><label for="word">単語</label></dt>
      <dd><input v-model="word.name" name="word" id="word" /></dd>
    </dl>
    <dl>
      <dt><label for="detail">備考</label></dt>
      <dd><textarea v-model="word.detail" name="detail" id="detail" /></dd>
    </dl>
    <button @click="update(word.wordId)" :disabled="isLoading">
      {{ isLoading ? "更新中..." : "更新" }}
    </button>
    <button @click="emit('close')">閉じる</button>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { updateWord } from "@/features/words/services/repository";

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
}>();

const emit = defineEmits<{
  result: [string, "info" | "error"];
  close: [];
}>();

//========================================
// data
//========================================

const word = ref({ ...props.d });
const isLoading = ref(false);

//========================================
// method
//========================================

async function update(id: string) {
  // TODO:バリデーションチェック・アラート
  if (word.value.kana && word.value.name && word.value.detail) {
    isLoading.value = true;
    try {
      await updateWord(id, {
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
}
</script>
