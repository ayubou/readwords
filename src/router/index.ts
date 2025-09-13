import {
  createRouter,
  createWebHistory,
  type RouteRecordRaw,
} from "vue-router";
import Home from "@/pages/Home.vue";
import Post from "@/pages/Post.vue";
import Signin from "@/pages/Signin.vue";

// TODO：見直す
const routes: RouteRecordRaw[] = [
  {
    path: "/",
    name: "home",
    component: Home,
  },
  {
    path: "/post",
    name: "post",
    component: Post,
  },
  {
    path: "/signin",
    name: "signin",
    component: Signin,
    props: true,
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;
