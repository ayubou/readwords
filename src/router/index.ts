import {
  createRouter,
  createWebHistory,
  type RouteRecordRaw,
} from "vue-router";
// pageは各画面表示時に読み込む
const Home = () => import("@/pages/Home.vue");
const Post = () => import("@/pages/Post.vue");
const Signin = () => import("@/pages/Signin.vue");
const NotFound = () => import("@/pages/NotFound.vue");

// ルート一覧
const routes = [
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
  {
    path: "/:pathMatch(.*)*",
    name: "not-found",
    component: NotFound,
  },
] satisfies RouteRecordRaw[];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;
