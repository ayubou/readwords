<template>
  <div class="signin">
    <Title title="Sign In" />
    <Alert v-if="errorTxt" :text="errorTxt" type="error" />
    <SignInForm @authError="setErrorText" />
  </div>
</template>

<script setup lang="ts">
import SignInForm from "@/features/auth/components/SignInForm.vue";
import Title from "@/components/ui/Title.vue";
import Alert from "@/components/ui/Alert.vue";
import { ref } from "vue";

const errorTxt = ref("");

/**
 * エラーメッセージを設定
 * @param message メッセージ
 */
const setErrorText = (message: string) => (errorTxt.value = message);
</script>
