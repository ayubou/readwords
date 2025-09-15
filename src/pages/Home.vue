<template>
  <div class="home">
    <SearchInput @filterTerm="onFilterTerm" />

    <h1 id="c-logo" :aria-label="logoText">
      <span
        v-for="(c, i) in logoChars"
        :key="i"
        class="c-logo__txt"
        :style="`--i:${i}`"
        aria-hidden="true"
        >{{ c }}</span
      >
    </h1>

    <div class="l-columns">
      <div
        v-for="word in displayedWords"
        :key="word.id"
        :class="['c-card', { 'c-card--active': isLoggedIn }]"
      >
        <div @click="updateWordId = word.id">
          <WordCard
            :updateWordId
            :word="{
              id: word.id,
              kana: word.kana,
              name: word.name,
              detail: word.detail,
            }"
            @delete="openWordDeleteModal(word.id, word.name)"
          />
        </div>
      </div>
    </div>

    <WordDeleteModal
      v-model:isOpen="showDeleteModal"
      :word="wordToDelete"
      @close="closeWordDeleteModal"
    />
  </div>
</template>

<style lang="scss" src="@/assets/sass/object/project/home.scss" />

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from "vue";
import GraphemeSplitter from "grapheme-splitter";
import { Word } from "@/features/words/types/word";
import type { Unsubscribe } from "firebase/firestore";
import { subscribeWords } from "@/features/words/services/repository";
import SearchInput from "@/components/ui/SearchInput.vue";
import WordDeleteModal from "@/features/words/components/WordDeleteModal.vue";
import WordCard from "@/features/words/components/WordCard.vue";

//========================================
// data
//========================================

let unSub: Unsubscribe | null = null;
const isLoggedIn = ref(false);

const updateWordId = ref("");

const allWords = ref<Word[]>([]);
const filterTerm = ref<string>("");
const norm = (s: string) => s.toLowerCase();
const displayedWords = computed(() =>
  allWords.value.filter((w) => norm(w.name).includes(norm(filterTerm.value)))
);

const logoText = "What do you read...? 🤔";
const splitter = new GraphemeSplitter();
const logoChars = splitter.splitGraphemes(logoText);

const showDeleteModal = ref(false);
const wordToDelete = ref({
  id: "",
  name: "",
});

//========================================
// method
//========================================

/**
 * 検索欄で入力された文字列を取得
 * @param input 入力値
 */
const onFilterTerm = (input: string) => (filterTerm.value = input);

/**
 * WordDeleteModalを表示
 * @param id 単語ID
 * @param name 単語名
 */
const openWordDeleteModal = (id: string, name: string) => {
  wordToDelete.value = {
    id,
    name,
  };
  showDeleteModal.value = true;
};

/**
 * WordDeleteModalを非表示
 */
const closeWordDeleteModal = () => {
  // 初期化
  wordToDelete.value = {
    id: "",
    name: "",
  };
};

onMounted(() => {
  // 単語一覧の購読開始
  unSub = subscribeWords((list) => (allWords.value = list));
});

onUnmounted(() => {
  // 単語一覧の購読解除
  unSub?.();
  unSub = null;
});
</script>
