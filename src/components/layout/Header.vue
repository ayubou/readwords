<template>
  <header class="l-header">
    <nav class="c-nav">
      <ul>
        <li class="c-btn-header c-btn-header--home">
          <RouterLink to="/">
            <span class="material-symbols-outlined">home</span>
          </RouterLink>
        </li>
        <li class="c-btn-header c-btn-header--nav">
          <RouterLink to="/post" v-if="isLoggedIn">New Post</RouterLink>
        </li>
        <li class="c-btn-header c-btn-header--nav">
          <RouterLink to="/signin" v-if="!isLoggedIn">Signin</RouterLink>
        </li>
      </ul>
    </nav>
  </header>
</template>

<style lang="scss" src="@/assets/sass/layout/header.scss" />

<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useAuthStore } from "@/features/auth/store/auth";

const auth = useAuthStore();
const { isLoggedIn } = storeToRefs(auth);
</script>
