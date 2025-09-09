<template>
  <div class="post">
    <h2 class="c-title">New Post</h2>

    <div class="c-alert" v-if="result">{{ result }}</div>

    <div class="c-form">
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

    <button @click="logout" class="c-btn-logout">ログアウト</button>
  </div>
</template>

<style lang="scss" scoped src="@/assets/sass/object/project/post.scss"></style>

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
