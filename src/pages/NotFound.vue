<template>
  <div class="not-found">
    <Title title="404" />
    <div class="l-container">
      <p>お探しのページは見つかりませんでした。</p>
      <button @click="goHome">ホームに戻る</button>
    </div>
  </div>
</template>

<style lang="scss" src="@/assets/sass/object/project/not-found.scss" />

<script setup lang="ts">
import Title from "@/components/ui/Title.vue";
import { useRouter } from "vue-router";

const router = useRouter();
const goHome = () => router.push("/").catch((err) => console.error(err));
</script>
