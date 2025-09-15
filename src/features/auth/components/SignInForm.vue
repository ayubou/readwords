<template>
  <form class="c-form" @submit.prevent="login">
    <div>
      <label for="email">
        <span class="material-symbols-outlined">mail</span>
      </label>
      <input
        type="email"
        v-model="email"
        name="email"
        id="email"
        required
        :disabled="isLoading"
      />
    </div>
    <div>
      <label for="key">
        <span class="material-symbols-outlined">key</span>
      </label>
      <input
        type="password"
        v-model="password"
        name="key"
        id="key"
        required
        :disabled="isLoading"
      />
    </div>
    <button type="submit" :disabled="isLoading">
      {{ isLoading ? "ログイン中..." : "ログイン" }}
    </button>
  </form>
</template>

<style lang="scss" src="@/assets/sass/object/component/form.scss" />

<script setup lang="ts">
import { ref, watch } from "vue";
import { useRouter } from "vue-router";
import { storeToRefs } from "pinia";
import { useAuthStore } from "@/features/auth/store/auth";

//========================================
// emit
//========================================

const emit = defineEmits<{
  (e: "authError", message: string): void;
}>();

//========================================
// data
//========================================

const auth = useAuthStore();
const { isLoggedIn, ready } = storeToRefs(auth);
const router = useRouter();
const email = ref("");
const password = ref("");
const isLoading = ref(false);

//========================================
// method
//========================================

// ログインチェック
watch(
  [ready, isLoggedIn],
  ([r, login]) => {
    if (r && login) router.push("/post").catch(console.error);
  },
  { immediate: true }
);

/**
 * ログイン
 */
const login = async () => {
  isLoading.value = true;
  try {
    await auth.loginWithEmail(email.value, password.value);
  } catch (e: unknown) {
    console.error(e instanceof Error ? e.message : e);
    emit("authError", "ログインに失敗しました");
  } finally {
    isLoading.value = false;
  }
};
</script>
