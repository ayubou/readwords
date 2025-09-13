<template>
  <div class="home">
    <SearchInput @result="searchWords" />

    <h1 id="c-logo">What do you read...? 🤔</h1>

    <div class="l-columns">
      <div
        v-for="word in words"
        :key="word.id"
        :class="[isLogin ? 'c-card more' : 'c-card']"
      >
        <div @click="openId = word.id">
          <WordCard
            :d="{
              wordId: word.id,
              kana: word.kana,
              name: word.name,
              detail: word.detail,
            }"
            :openId
            @delete="openDeleteModal(word.id, word.name)"
          />
        </div>
      </div>
    </div>
    <!-- /.l-columns -->

    <DeleteModal :isModal :wordName :wordId @close="closeDeleteModal" />
  </div>
  <!-- /.home -->
</template>

<style lang="scss" src="@/assets/sass/object/project/home.scss" />

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import type { Unsubscribe } from "firebase/firestore";
import { Word } from "@/features/words/types/word";
import SearchInput from "@/components/ui/SearchInput.vue";
import DeleteModal from "@/features/words/components/WordDeleteModal.vue";
import WordCard from "@/features/words/components/WordCard.vue";
import { subscribeWords } from "@/features/words/services/repository";

// TODO:全体的に見直す

const isLogin = ref(false);
const isModal = ref(false);
const wordId = ref("");
const wordName = ref("");
const openId = ref("");

const words = ref<Word[]>([]);

let unSub: Unsubscribe | null = null;

const searchWords = (result: Word[]) => {
  words.value = result;
};

function openDeleteModal(id: string, name: string) {
  wordId.value = id;
  wordName.value = name;
  isModal.value = true;
}

function closeDeleteModal() {
  wordId.value = "";
  wordName.value = "";
  isModal.value = false;
}

// TODO:見直す
function logoAnimation() {
  const logotxt = document.getElementById("c-logo");
  const splitLogo = logotxt ? logotxt.textContent?.split("") ?? [] : [];
  if (splitLogo.length > 0 && logotxt) {
    const createLogo = splitLogo
      .map((x) => `<span class="c-logo__txt">${x}</span>`)
      .join("");
    logotxt.innerHTML = createLogo;
    const logotxt2 = document.getElementsByClassName(
      "c-logo__txt"
    ) as HTMLCollectionOf<HTMLElement>;
    for (let i = 0; i < logotxt2.length; i++) {
      setTimeout(() => {
        logotxt2[i].classList.add("jump");
      }, i * 50);
    }
  }
}

onMounted(() => {
  // 単語一覧の購読開始
  unSub = subscribeWords((list) => {
    words.value = list;
  });
  // ロゴアニメ
  logoAnimation();
});

onUnmounted(() => {
  // 単語一覧の購読解除
  unSub?.();
  unSub = null;
});
</script>
