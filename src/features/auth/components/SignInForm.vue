<template>
  <div class="c-form">
    <dl>
      <dt>
        <label for="email">
          <span class="material-symbols-outlined">mail</span>
        </label>
      </dt>
      <dd>
        <input
          type="email"
          v-model="email"
          name="email"
          id="email"
          :disabled="isLoading"
        />
      </dd>
    </dl>
    <dl>
      <dt>
        <label for="key">
          <span class="material-symbols-outlined">key</span>
        </label>
      </dt>
      <dd>
        <input
          type="password"
          v-model="password"
          name="key"
          id="key"
          :disabled="isLoading"
        />
      </dd>
    </dl>
    <button @click="login" :disabled="isLoading">
      {{ isLoading ? "ログイン中..." : "ログイン" }}
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from "vue";
import { useRouter } from "vue-router";
import { storeToRefs } from "pinia";
import { useAuthStore } from "@/features/auth/store/auth";

//========================================
// emit
//========================================

const emit = defineEmits<{
  error: [string];
}>();

//========================================
// data
//========================================

const auth = useAuthStore();
const { isLogin, ready } = storeToRefs(auth);
const router = useRouter();
const email = ref("");
const password = ref("");
const isLoading = ref(false);

//========================================
// method
//========================================

// ログインチェック
onMounted(() => {
  if (ready.value && isLogin.value) {
    router.push("/post");
  }
});

// ログイン状態を監視
watch([ready, isLogin], ([r, login]) => {
  if (r && login) router.push("/post");
});

/**
 * Login
 */
const login = async () => {
  isLoading.value = true;
  try {
    auth.loginWithEmail(email.value, password.value);
  } catch (e: unknown) {
    console.error(e instanceof Error ? e.message : e);
    emit("error", "ログインに失敗しました");
  } finally {
    isLoading.value = false;
  }
};
</script>
