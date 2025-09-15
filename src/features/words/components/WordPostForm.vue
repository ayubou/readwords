<template>
  <!-- TODO:バリデーションチェック追加 -->
  <form class="c-form" @submit.prevent="submitForm">
    <div>
      <label for="word">単語</label>
      <input
        v-model="name"
        type="text"
        name="word"
        id="word"
        required
        :disabled="isLoading"
      />
    </div>
    <div>
      <label for="kana">かな</label>
      <input
        v-model="kana"
        type="text"
        name="kana"
        id="kana"
        required
        :disabled="isLoading"
      />
    </div>
    <div>
      <label for="detail">詳細</label>
      <textarea
        v-model="detail"
        name="detail"
        id="detail"
        required
        :disabled="isLoading"
      />
    </div>
    <button type="submit" :disabled="isLoading">
      {{ isLoading ? "投稿中..." : "投稿" }}
    </button>
  </form>
</template>

<style lang="scss" src="@/assets/sass/object/component/form.scss" />

<script setup lang="ts">
import { ref } from "vue";
import { createWord } from "@/features/words/services/repository";
import { type AlertType } from "@/components/ui/Alert.vue";

//========================================
// emit
//========================================

const emit = defineEmits<{
  (e: "result", message: string, type: AlertType): void;
}>();

//========================================
// data
//========================================

const name = ref("");
const kana = ref("");
const detail = ref("");
const isLoading = ref(false);

//========================================
// method
//========================================

/**
 * 新規単語登録
 */
const submitForm = async () => {
  // TODO:バリデーションチェック
  if (name.value && kana.value && detail.value) {
    isLoading.value = true;
    try {
      await createWord({
        name: name.value,
        kana: kana.value,
        detail: detail.value,
      });

      name.value = "";
      kana.value = "";
      detail.value = "";

      emit("result", "登録に成功しました", "info");
    } catch (e: unknown) {
      console.error(e instanceof Error ? e.message : e);
      emit("result", "登録に失敗しました", "error");
    } finally {
      isLoading.value = false;
    }
  } else {
    emit("result", "未入力項目があります", "error");
  }
};
</script>
