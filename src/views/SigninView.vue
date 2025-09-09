<template>
  <div class="signin">
    <h2 class="c-title">Sign In</h2>

    <div class="c-alert" v-if="logoutText !== undefined || errMsg">
      <span v-if="errMsg">{{ errMsg }}</span>
      <span v-else>{{ logoutText }}</span>
    </div>

    <div class="c-form">
      <dl>
        <dt>
          <label for="email">
            <span class="material-symbols-outlined">mail</span>
          </label>
        </dt>
        <dd>
          <input type="email" v-model="mailaddress" name="email" id="email" />
        </dd>
      </dl>
      <dl>
        <dt>
          <label for="key">
            <span class="material-symbols-outlined">key</span>
          </label>
        </dt>
        <dd>
          <input type="password" v-model="password" name="key" id="key" />
        </dd>
      </dl>
      <button @click="login">ログイン</button>
    </div>
  </div>
</template>

<script setup lang="ts">
//TODO:全体的に見直す
import { ref, onMounted, onUnmounted } from "vue";
import { useRouter } from "vue-router";
import {
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";

// props
const props = defineProps<{ logoutText?: string }>();

// 状態
const mailaddress = ref("");
const password = ref("");
const errMsg = ref("");

const router = useRouter();
const auth = getAuth();

// ログインチェック
let unsubscribe: (() => void) | null = null;
onMounted(() => {
  unsubscribe = onAuthStateChanged(auth, (user) => {
    if (user) {
      router.push("/post").catch(() => {});
    }
  });
});
onUnmounted(() => {
  if (unsubscribe) unsubscribe();
});

// ログイン処理
async function login() {
  try {
    await signInWithEmailAndPassword(auth, mailaddress.value, password.value);
    errMsg.value = "";
  } catch (e) {
    errMsg.value = "ログインに失敗しました";
  }
}

// ログアウト処理
async function logout() {
  await signOut(auth);
}
</script>
