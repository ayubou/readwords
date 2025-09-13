<template>
  <div class="signin">
    <Title title="Sign In" />
    <Alert :text="errorTxt" type="error" />
    <SignInForm @error="setErrorTxt" />
  </div>
</template>

<script setup lang="ts">
import SignInForm from "@/features/auth/components/SignInForm.vue";
import Title from "@/components/ui/Title.vue";
import Alert from "@/components/ui/Alert.vue";
import { ref } from "vue";
const errorTxt = ref("");

const setErrorTxt = (msg: string) => (errorTxt.value = msg);
</script>
