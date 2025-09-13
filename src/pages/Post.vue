<template>
  <div class="post">
    <Title title="New Post" />
    <Alert :text="result" :type="alert" />
    <PostForm @result="setAlert" />

    <button @click="logout" class="c-btn-logout" :disabled="isLoading">
      {{ isLoading ? "ログアウト中..." : "ログアウト" }}
    </button>
  </div>
</template>

<style lang="scss" scoped src="@/assets/sass/object/project/post.scss" />

<script setup lang="ts">
import { ref, watch, onMounted } from "vue";
import { useRouter } from "vue-router";
import { storeToRefs } from "pinia";
import { useAuthStore } from "@/features/auth/store/auth";
import Title from "@/components/ui/Title.vue";
import Alert from "@/components/ui/Alert.vue";
import PostForm from "@/features/words/components/WordPostForm.vue";

//TODO:全体的に見直す

//========================================
// data
//========================================

const result = ref("");
const isLoading = ref(false);
// TODO:型共通化
const alert = ref<"info" | "error">("info");

const router = useRouter();
const auth = useAuthStore();
const { isLogin, ready } = storeToRefs(auth);

//========================================
// method
//========================================

const setAlert = (info: string, type: "info" | "error") => {
  result.value = info;
  alert.value = type;
};

// ログインチェック
onMounted(() => {
  if (!ready.value && !isLogin.value) {
    router.push("/");
  }
});

// ログイン状態を監視
watch(isLogin, (login) => {
  if (!login) router.push("/");
});

// ログアウト処理
const logout = async () => {
  isLoading.value = true;
  try {
    await auth.logout();
  } catch (e: unknown) {
    console.error(e instanceof Error ? e.message : e);
  } finally {
    isLoading.value = false;
  }
};
</script>
