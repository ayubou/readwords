<template>
  <!-- TODO: Enterで検索したい、リセットボタンほしい -->
  <div class="c-search">
    <div class="c-search--results">{{ result }}</div>
    <div class="c-search__form">
      <input v-model="input" />
      <button @click="search">
        <span class="material-symbols-outlined">search</span>
      </button>
    </div>
  </div>
  <!-- /.c-search -->
</template>

<script setup lang="ts">
import { ref } from "vue";
import {
  getFirestore,
  collection,
  query,
  orderBy,
  startAt,
  endAt,
  getDocs,
} from "firebase/firestore";
import { Word } from "@/features/words/types/word";

//========================================
// emit
//========================================

const emit = defineEmits<{
  result: [Word[]];
}>();

//========================================
// data
//========================================

const input = ref("");
const result = ref("");

const db = getFirestore();

async function search() {
  const keyword = input.value.trim();
  const words: Word[] = await getWords(keyword);

  if (words.length > 0 || !input.value) {
    result.value = `${words.length}件一致`;

    emit("result", words);
  } else {
    result.value = "お探しの単語はありませんでした";
  }
}

async function getWords(keyword: string): Promise<Word[]> {
  let words: Word[] = [];

  // TODO:Store管理検討
  // TODO:部分一致検索できるか調査
  const q = query(
    collection(db, "words"),
    orderBy("name"),
    startAt(keyword),
    endAt(keyword + "\uf8ff")
  );

  try {
    const snap = await getDocs(q);

    // TODO:型ガード
    words = snap.docs.map((d) => ({
      id: d.id,
      ...(d.data() as Omit<Word, "id">),
    }));
  } catch (e: unknown) {
    console.error(e instanceof Error ? e.message : e);
  } finally {
    return words;
  }
}
</script>
