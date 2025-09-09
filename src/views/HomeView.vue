<template>
  <div class="home">
    <div class="c-search">
      <div class="c-search--results">{{ results }}</div>
      <div class="c-search__form">
        <input v-model="searchWord" />
        <button @click="search">
          <span class="material-symbols-outlined">search</span>
        </button>
      </div>
    </div>
    <!-- /.c-search -->

    <h1 id="c-logo">What do you read...? 🤔</h1>

    <div class="l-columns">
      <div
        v-for="word in words"
        :key="word.id"
        :class="[isLogin ? 'c-card more' : 'c-card']"
      >
        <div :id="word.id">
          <div
            @click="setForm(word.id, word.name, word.kana, word.detail)"
            class="c-card__main"
          >
            <small>{{ word.kana }}</small>
            <h2>{{ word.name }}</h2>
            <span>{{ word.detail }}</span>
          </div>

          <div class="c-card--update" v-if="openFormId === word.id">
            <dl>
              <dt><label for="kana">かな</label></dt>
              <dd><input v-model="updateKana" name="kana" id="kana" /></dd>
            </dl>
            <dl>
              <dt><label for="word">単語</label></dt>
              <dd><input v-model="updateName" name="word" id="word" /></dd>
            </dl>
            <dl>
              <dt><label for="detail">備考</label></dt>
              <dd>
                <textarea v-model="updateDetail" name="detail" id="detail" />
              </dd>
            </dl>
            <button @click="update(word.id)">update</button>
          </div>

          <div id="delete">
            <button @click="modalDel(word.id, word.name)" v-show="isLogin">
              delete
            </button>
          </div>
        </div>
      </div>
    </div>
    <!-- /.l-columns -->

    <div
      id="c-modal-delete"
      v-show="isModal"
      :class="{ result: isModalResults }"
    >
      <h3 v-if="isModalResults">削除しました</h3>
      <h3 v-else>"{{ modalName }}"を<br />削除しますか？</h3>
      <ul>
        <li v-if="!isModalResults">
          <button @click="del(modalId)" class="yes">はい</button>
        </li>
        <li>
          <button @click="closeModalDel" class="no">
            <span v-if="isModalResults">閉じる</span>
            <span v-else>いいえ</span>
          </button>
        </li>
      </ul>
    </div>
  </div>
  <!-- /.home -->
</template>

<style lang="scss" src="@/assets/sass/object/project/home.scss"></style>

<script setup lang="ts">
// TODO:全体的に見直す
import { ref, onMounted, onUnmounted } from "vue";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import {
  getFirestore,
  collection,
  query,
  orderBy,
  startAt,
  endAt,
  getDocs,
  onSnapshot,
  doc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";

type Word = {
  id: string;
  name: string;
  kana: string;
  detail: string;
};

const auth = getAuth();
const db = getFirestore();

const isLogin = ref(false);
const isModal = ref(false);
const isModalResults = ref(false);
const modalId = ref("");
const modalName = ref("");

const searchWord = ref("");
const results = ref("");

const updateName = ref("");
const updateKana = ref("");
const updateDetail = ref("");
const openFormId = ref("");

const words = ref<Word[]>([]);

async function search() {
  const keyword = searchWord.value.trim();
  const q = query(
    collection(db, "words"),
    orderBy("name"),
    startAt(keyword),
    endAt(keyword + "\uf8ff")
  );

  const snap = await getDocs(q);
  words.value = snap.docs.map((d) => ({
    id: d.id,
    ...(d.data() as Omit<Word, "id">),
  }));

  if (words.value.length > 0 || !searchWord.value) {
    results.value = `${words.value.length}件一致`;
  } else {
    results.value = "お探しの単語はありませんでした";
  }
}

function setForm(id: string, name: string, kana: string, detail: string) {
  if (!isLogin.value) return;
  if (openFormId.value === id) {
    resetUpdateData();
  } else {
    openFormId.value = id;
    updateName.value = name;
    updateKana.value = kana;
    updateDetail.value = detail;
  }
}

async function update(id: string) {
  await updateDoc(doc(db, "words", id), {
    name: updateName.value,
    kana: updateKana.value,
    detail: updateDetail.value,
  });
  resetUpdateData();
}

function resetUpdateData() {
  openFormId.value = "";
  updateName.value = "";
  updateKana.value = "";
  updateDetail.value = "";
}

function modalDel(id: string, name: string) {
  modalId.value = id;
  modalName.value = name;
  isModal.value = true;
}

function closeModalDel() {
  modalId.value = "";
  modalName.value = "";
  isModal.value = false;
  isModalResults.value = false;
}

async function del(id: string) {
  await deleteDoc(doc(db, "words", id));
  isModalResults.value = true;
}

let unSubWords: (() => void) | null = null;
function allWords() {
  const q = query(collection(db, "words"), orderBy("name"));
  unSubWords = onSnapshot(q, (querySnapshot) => {
    const list: Word[] = [];
    querySnapshot.forEach((d) => {
      const data = d.data() as Omit<Word, "id">;
      list.push({ id: d.id, ...data });
    });
    words.value = list;
  });
}

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

// standard comment: マウント時処理
let unSubAuth: (() => void) | null = null;
onMounted(() => {
  allWords();
  logoAnimation();
  unSubAuth = onAuthStateChanged(getAuth(), (user) => {
    isLogin.value = !!user;
  });
});

onUnmounted(() => {
  if (unSubWords) unSubWords();
  if (unSubAuth) unSubAuth();
});
</script>
