import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";
import router from "./router";
import "@/assets/sass/main.scss";
import "@/lib/firebase";
import { useAuthStore } from "@/features/auth/store/auth";

const app = createApp(App);
const pinia = createPinia();

app.use(pinia).use(router);

useAuthStore(pinia).init();

app.mount("#app");
