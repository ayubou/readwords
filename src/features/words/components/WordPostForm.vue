<template>
  <!-- TODO:バリデーションチェック追加 -->
  <div class="c-form">
    <dl>
      <dt><label for="word">単語</label></dt>
      <dd>
        <input
          type="text"
          v-model="name"
          name="word"
          id="word"
          :disabled="isLoading"
        />
      </dd>
    </dl>
    <dl>
      <dt><label for="kana">かな</label></dt>
      <dd>
        <input
          type="text"
          v-model="kana"
          name="kana"
          id="kana"
          :disabled="isLoading"
        />
      </dd>
    </dl>
    <dl>
      <dt><label for="detail">詳細</label></dt>
      <dd>
        <textarea
          v-model="detail"
          name="detail"
          id="detail"
          :disabled="isLoading"
        />
      </dd>
    </dl>
    <button @click="addTodo" :disabled="isLoading">
      {{ isLoading ? "投稿中..." : "投稿" }}
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { createWord } from "@/features/words/services/repository";

//========================================
// emit
//========================================

const emit = defineEmits<{
  result: [string, "info" | "error"];
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

// 登録処理
async function addTodo() {
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
}
</script>
