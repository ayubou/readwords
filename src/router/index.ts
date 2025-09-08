import {
  createRouter,
  createWebHistory,
  type RouteRecordRaw,
} from "vue-router";
import HomeView from "@/views/HomeView.vue";
import PostView from "@/views/PostView.vue";
import SigninView from "@/views/SigninView.vue";

// TODO：見直す
const routes: RouteRecordRaw[] = [
  {
    path: "/",
    name: "home",
    component: HomeView,
  },
  {
    path: "/post",
    name: "post",
    component: PostView,
  },
  {
    path: "/signin",
    name: "signin",
    component: SigninView,
    props: true,
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;
