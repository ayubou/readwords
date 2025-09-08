<template>
  <div>
    <nav>
      <ul>
        <li class="home-button">
          <router-link to="/">
            <span class="material-symbols-outlined">home</span>
          </router-link>
        </li>
        <li class="head-button">
          <router-link to="/post" v-if="isLogin">New Post</router-link>
        </li>
        <li class="head-button">
          <router-link to="/signin" v-if="!isLogin">Signin</router-link>
        </li>
      </ul>
    </nav>

    <router-view />
    <footer>&copy; 2022 What do you read...? 🤔</footer>
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

<style lang="scss">
#app {
  padding: 160px 0 0;
  @include mq(xs) {
    padding: 100px 0 0;
  }
}

nav {
  padding: 8px 30px;
  border-bottom: 6px solid $primary-sub;
  outline: 10px solid $primary-base;
  box-sizing: border-box;
  background: $primary-point;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1;

  a {
    font-weight: bold;
    color: $primary-sub;
    &:hover,
    &.router-link-exact-active {
      color: $primary-base;
    }
  }

  li {
    display: inline-block;
    vertical-align: middle;

    & + li {
      margin-left: 5px;
    }

    &.home-button a {
      display: flex;
      align-items: center;
      color: $primary-point;
      background: $primary-bg;
      font-size: 10px;
      height: 25px;
      padding: 0 5px;
      border-radius: 5px;
      border-bottom: 2px solid $primary-sub;

      span {
        font-size: 14px;
      }
    }

    &.head-button a {
      display: inline-block;
      color: $primary-point;
      background: $primary-bg;
      font-size: 1.3rem;
      line-height: 25px;
      padding: 0 10px;
      border-radius: 5px;
      border-bottom: 2px solid $primary-sub;
    }

    a:hover {
      background: $primary-sub;
      border-bottom: 2px solid $primary-base;
    }
  }
}

footer {
  margin-top: 100px;
  text-align: center;
  padding: 15px;
  color: $primary-bg;
  font-size: 1.3rem;
  background: $primary-point;

  @include mq(xs) {
    margin-top: 60px;
  }
}
</style>
