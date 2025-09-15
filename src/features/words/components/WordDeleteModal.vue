<template>
  <div
    v-if="isOpen"
    :class="[
      'c-word-delete-modal',
      { 'c-word-delete-modal--result': isModalResults },
    ]"
  >
    <h3 v-if="isModalResults">削除しました</h3>
    <h3 v-else>"{{ word.name }}"を<br />削除しますか？</h3>
    <ul>
      <li v-if="!isModalResults">
        <button
          @click="onDelete(word.id)"
          class="c-word-delete-modal__btn c-word-delete-modal__btn--yes"
          type="button"
          :disabled="isLoading"
        >
          {{ isLoading ? "削除中..." : "はい" }}
        </button>
      </li>
      <li>
        <button
          @click="closeWordDeleteModal"
          class="c-word-delete-modal__btn c-word-delete-modal__btn--no"
          type="button"
          :disabled="isLoading"
        >
          <span v-if="isModalResults">閉じる</span>
          <span v-else>いいえ</span>
        </button>
      </li>
    </ul>
  </div>
</template>

<style
  lang="scss"
  src="@/assets/sass/object/component/word-delete-modal.scss"
></style>

<script lang="ts" setup>
import { ref } from "vue";
import { deleteWord } from "@/features/words/services/repository";

//========================================
// props & emit
//========================================

defineProps<{ isOpen: boolean; word: { name: string; id: string } }>();
const emit = defineEmits<{
  (e: "update:isOpen", value: boolean): void;
  (e: "close"): void;
}>();

//========================================
// data
//========================================

const isModalResults = ref(false);
const isLoading = ref(false);

//========================================
// method
//========================================

/**
 * 削除
 * @param id 単語ID
 */
async function onDelete(id: string) {
  isLoading.value = true;
  try {
    await deleteWord(id);
    isModalResults.value = true;
  } catch (e: unknown) {
    // TODO:アラート
    console.error(e instanceof Error ? e.message : e);
  } finally {
    isLoading.value = false;
  }
}

/**
 * WordDeleteModalを閉じる
 */
function closeWordDeleteModal() {
  emit("close");
  emit("update:isOpen", false);
  // 初期化
  isModalResults.value = false;
}
</script>
