<template>
  <div class="post">
    <Title title="New Post" />
    <Alert :text="alert.text" :type="alert.type" />
    <WordPostForm @result="setAlert" />

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
import Alert, { type AlertType } from "@/components/ui/Alert.vue";
import WordPostForm from "@/features/words/components/WordPostForm.vue";

//========================================
// data
//========================================

const isLoading = ref(false);
const alert = ref<{
  text: string;
  type: AlertType;
}>({
  text: "",
  type: "info",
});
const router = useRouter();
const auth = useAuthStore();
const { isLoggedIn } = storeToRefs(auth);

//========================================
// method
//========================================

/**
 * アラームを設定
 * @param info アラームメッセージ
 * @param type アラートタイプ
 */
const setAlert = (text: string, type: AlertType) => {
  alert.value = {
    text,
    type,
  };
};

// ログインチェック
onMounted(() => {
  if (!isLoggedIn.value) router.push("/").catch((err) => console.error(err));
});

// ログイン状態を監視
watch(isLoggedIn, (login) => {
  if (!login) {
    router.push("/").catch((err) => console.error(err));
  }
});

/**
 * ログアウト
 */
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
