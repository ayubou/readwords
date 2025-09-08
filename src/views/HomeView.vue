<template>
  <div class="home">
    <div id="search">
      <div class="search-results">{{ results }}</div>
      <div class="search-form">
        <input v-model="searchWord" />
        <button @click="search">
          <span class="material-symbols-outlined">search</span>
        </button>
      </div>
    </div>
    <!-- /#search -->

    <h1 id="logo">What do you read...? 🤔</h1>

    <div class="columns">
      <div
        v-for="word in words"
        :key="word.id"
        :class="[isLogin ? 'card more' : 'card']"
      >
        <div :id="word.id">
          <div
            @click="setForm(word.id, word.name, word.kana, word.detail)"
            class="main"
          >
            <small>{{ word.kana }}</small>
            <h2>{{ word.name }}</h2>
            <span>{{ word.detail }}</span>
          </div>

          <div class="update" v-if="openFormId === word.id">
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
    <!-- /.columns -->

    <div id="modalDelete" v-show="isModal" :class="{ mResult: isModalResults }">
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
  const logotxt = document.getElementById("logo");
  const splitLogo = logotxt ? logotxt.textContent?.split("") ?? [] : [];
  if (splitLogo.length > 0 && logotxt) {
    const createLogo = splitLogo
      .map((x) => `<span class="logotxt">${x}</span>`)
      .join("");
    logotxt.innerHTML = createLogo;
    const logotxt2 = document.getElementsByClassName(
      "logotxt"
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

<style scoped lang="scss">
@keyframes move-stripe {
  0% {
    background-position-x: 0;
  }
  100% {
    background-position-x: -34px;
  }
}

#logo {
  font-family: $webfont-sub;
  color: $primary-point;
  font-size: 5rem;
  text-align: center;
  margin-bottom: 60px;
  font-weight: normal;
  text-shadow: 4px 4px 0px $primary-base, 8px 8px 0px $primary-sub;
  @include mq(xs) {
    font-size: 3rem;
    margin-bottom: 40px;
  }
}
.columns {
  display: flex;
  flex-wrap: wrap;
  margin: 0 30px;
  @include mq(tb) {
    margin: 0 15px;
  }
  @include mq(xs) {
    flex-direction: column;
  }
  .card {
    flex-basis: 33.3%;
    padding: 30px;
    box-sizing: border-box;
    @include mq(tb) {
      flex-basis: 50%;
      padding: 20px 15px;
    }
    & > div {
      background: $primary-base;
      padding: 50px 30px 20px;
      box-sizing: border-box;
      position: relative;
      border: 1px solid $primary-point;
      border-top: 3px solid $primary-point;
      border-radius: 5px;

      &::before {
        content: "";
        display: block;
        border: 1px solid $primary-point;
        background-size: auto auto;
        background-color: $primary-bg;
        background-image: repeating-linear-gradient(
          45deg,
          transparent,
          transparent 5px,
          $primary-point 5px,
          $primary-point 6px
        );
        animation: move-stripe 2.5s infinite linear;
        position: absolute;
        top: 10px;
        left: 10px;
        right: -10px;
        bottom: -10px;
        z-index: -1;
        border-radius: 5px;
        opacity: 0.5;
      }
    }

    .main {
      small {
        position: absolute;
        left: 0;
        top: 15px;
        display: inline-block;
        background: #fdfdbd;
        padding: 5px 30px;
        font-size: 1.2rem;
        letter-spacing: 0.1em;
        &::before {
          content: "";
          display: block;
          border-top: 15px transparent solid;
          border-bottom: 15px transparent solid;
          border-right: 15px $primary-base solid;
          position: absolute;
          right: 0;
          top: 50%;
          transform: translateY(-50%);
        }
      }
      h2 {
        font-size: 3.3rem;
        text-shadow: 3px 3px 0 $primary-bg;
        color: $primary-point;
        @include mq(xs) {
          font-size: 2.7rem;
        }
      }
      span {
        display: block;
        margin-top: 15px;
        margin-left: -10px;
        margin-right: -10px;
        margin-bottom: -5px;
        box-sizing: border-box;
        padding: 10px 20px;
        font-size: 1.2rem;
        background: $primary-sub;
        letter-spacing: 0.1em;
        border-radius: 5px;
      }
    }

    .update {
      background: #fff;
      margin-top: 20px;
      margin-left: -10px;
      margin-right: -10px;
      border-radius: 5px;
      background: $primary-bg;
      padding: 20px 20px 15px;
      dl {
        display: flex;
        align-content: center;
        dt {
          font-size: 1.2rem;
          flex-basis: 15%;
          padding-top: 3px;
          font-weight: bold;
          color: $primary-point;
        }
        dd {
          border-left: 1px solid $primary-sub;
          flex-basis: 85%;
          input,
          textarea {
            width: 100%;
            padding: 5px 10px;
            box-sizing: border-box;
            background: $primary-bg;
            color: $primary-font;
            font-size: 1.3rem;
          }
        }
      }
      button {
        display: inline-block;
        padding: 3px 10px;
        color: $primary-bg;
        background: $primary-point;
        border-radius: 5px;
        cursor: pointer;
        width: 100%;
        margin-top: 15px;
        letter-spacing: 0.1em;
      }
    }
  }
}
#search {
  position: fixed;
  z-index: 1;
  right: 30px;
  top: 6px;
  display: flex;
  align-items: center;
  @include mq(xs) {
    align-items: flex-end;
    flex-direction: column-reverse;
  }
  .search-results {
    margin-right: 10px;
    color: $primary-bg;
    font-size: 13px;
    @include mq(xs) {
      background: $primary-point;
      margin: 0;
      padding: 3px 10px;
    }
  }
  .search-form {
    display: flex;
    padding: 5px;
    border-radius: 3px;
    background: $primary-bg;
  }
  input {
    border: none;
    background: $primary-bg;
  }
  button {
    border: none;
    background: #b1afff;
    width: 20px;
    color: #fdfdbd;
    height: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 5px;
    span {
      font-size: 14px;
    }
  }
}
#delete {
  position: absolute;
  right: 20px;
  top: 15px;
  button {
    display: inline-block;
    padding: 3px 10px;
    color: $primary-bg;
    background: $primary-point;
    border-radius: 5px;
    cursor: pointer;
    letter-spacing: 0.1em;
  }
}
#modalDelete {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100%;
  background: $primary-point;
  max-width: 350px;
  box-sizing: border-box;
  padding: 50px 30px;
  border-radius: 5px;
  text-align: center;
  border: 2px solid $primary-bg;
  outline: 4px solid $primary-point;
  @include mq(xs) {
    max-width: 300px;
    padding: 30px 20px;
  }
  h3 {
    color: $primary-bg;
    margin-bottom: 30px;
    letter-spacing: 0.15em;
  }
  li {
    display: inline-block;
    + li {
      margin-left: 15px;
    }
    button {
      display: inline-block;
      width: 100px;
      line-height: 30px;
      font-size: 1.3rem;
      border-radius: 5px;
      cursor: pointer;
      color: $primary-point;
      font-weight: bold;
      &.yes {
        background: $primary-base;
        box-shadow: 0 3px 0 $primary-bg;
      }
      &.no {
        background: $primary-sub;
        box-shadow: 0 3px 0 $primary-bg;
      }
    }
  }
  &.mResult {
    background: $primary-result;
    outline: 4px solid $primary-result;
    h3 {
      color: $primary-font;
    }
    li {
      button {
        color: $primary-font;
      }
    }
  }
}
</style>
