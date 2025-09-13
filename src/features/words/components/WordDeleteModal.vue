<template>
  <div v-if="isModal" id="c-modal-delete" :class="{ result: isModalResults }">
    <h3 v-if="isModalResults">削除しました</h3>
    <h3 v-else>"{{ wordName }}"を<br />削除しますか？</h3>
    <ul>
      <li v-if="!isModalResults">
        <button @click="del(wordId)" class="yes">はい</button>
      </li>
      <li>
        <button @click="closeModalDel" class="no">
          <span v-if="isModalResults">閉じる</span>
          <span v-else>いいえ</span>
        </button>
      </li>
    </ul>
  </div>
</template>
<script lang="ts" setup>
import { ref } from "vue";
import { deleteWord } from "@/features/words/services/repository";

//========================================
// props & emit
//========================================

defineProps<{ isModal: boolean; wordName: string; wordId: string }>();
const emit = defineEmits<{
  close: [];
}>();

//========================================
// data
//========================================

const isModalResults = ref(false);
const isLoading = ref(false);

//========================================
// method
//========================================

async function del(id: string) {
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

function closeModalDel() {
  emit("close");
}
</script>
