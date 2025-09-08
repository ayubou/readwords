<template>
  <div class="post">
    <h2 class="sub-title">New Post</h2>

    <div class="result" v-if="result">{{ result }}</div>

    <div class="form">
      <dl>
        <dt><label for="word">単語</label></dt>
        <dd><input type="text" v-model="name" name="word" id="word" /></dd>
      </dl>
      <dl>
        <dt><label for="kana">かな</label></dt>
        <dd><input type="text" v-model="kana" name="kana" id="kana" /></dd>
      </dl>
      <dl>
        <dt><label for="detail">詳細</label></dt>
        <dd>
          <textarea v-model="detail" name="detail" id="detail"></textarea>
        </dd>
      </dl>
      <button @click="addTodo">Add</button>
    </div>

    <button @click="logout" class="logout">ログアウト</button>
  </div>
</template>

<script setup lang="ts">
//TODO:全体的に見直す
import { ref, onMounted, onUnmounted } from "vue";
import { useRouter } from "vue-router";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { getFirestore, collection, addDoc } from "firebase/firestore";

const name = ref("");
const kana = ref("");
const detail = ref("");
const result = ref("");

const router = useRouter();
const auth = getAuth();
const db = getFirestore();

// ログインチェック
let unsubscribeAuth: (() => void) | null = null;
onMounted(() => {
  unsubscribeAuth = onAuthStateChanged(auth, (user) => {
    if (!user) {
      router
        .push({ name: "signin", params: { logoutText: "ログアウトしました" } })
        .catch(() => {});
    }
  });
});

onUnmounted(() => {
  if (unsubscribeAuth) unsubscribeAuth();
});

// ログアウト処理
async function logout() {
  await signOut(auth);
}

// 登録処理
async function addTodo() {
  if (name.value && kana.value && detail.value) {
    await addDoc(collection(db, "words"), {
      name: name.value,
      kana: kana.value,
      detail: detail.value,
    });
    name.value = "";
    kana.value = "";
    detail.value = "";
    result.value = "登録に成功しました";
  } else {
    result.value = "未入力項目があります";
  }
}
</script>

<style scoped lang="scss">
.logout {
  margin: 20px auto 0;
  background: $primary-sub;
  color: $primary-point;
  display: block;
  width: 100%;
  line-height: 40px;
  letter-spacing: 0.2em;
  font-weight: bold;
  border-radius: 5px;
  cursor: pointer;
  box-shadow: 0 3px 0 $primary-point;
  max-width: 200px;

  &:hover {
    color: $primary-bg;
    background: $primary-point;
    box-shadow: 0 3px 0 $primary-sub;
  }
}
</style>
