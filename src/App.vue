<template>
  <div>
    <header class="l-header">
      <nav class="c-nav">
        <ul>
          <li class="c-btn-header c-btn-header--home">
            <router-link to="/">
              <span class="material-symbols-outlined">home</span>
            </router-link>
          </li>
          <li class="c-btn-header c-btn-header--nav">
            <router-link to="/post" v-if="isLogin">New Post</router-link>
          </li>
          <li class="c-btn-header c-btn-header--nav">
            <router-link to="/signin" v-if="!isLogin">Signin</router-link>
          </li>
        </ul>
      </nav>
    </header>

    <router-view />
    <footer class="l-footer">&copy; 2022 What do you read...? 🤔</footer>
  </div>
</template>

<script setup lang="ts">
//TODO:全体的に見直す
import { ref, onMounted, onUnmounted } from "vue";
import { getAuth, onAuthStateChanged } from "firebase/auth";

const isLogin = ref<boolean>(false);

let unsubscribe: (() => void) | null = null;

onMounted(() => {
  const auth = getAuth();
  unsubscribe = onAuthStateChanged(auth, (user) => {
    isLogin.value = !!user;
  });
});

onUnmounted(() => {
  if (unsubscribe) unsubscribe();
});
</script>
