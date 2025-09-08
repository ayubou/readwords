import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import path from "node:path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: { "@": path.resolve(__dirname, "src") },
  },
  server: {
    host: true,
    port: 5173,
    strictPort: true, // ポート固定
    hmr: {
      protocol: "ws", // HTTPS環境は'wss'
      host: "localhost",
      clientPort: 5173,
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@import "@/assets/sass/main.scss";
        @import "@/assets/sass/_variables.scss";`,
      },
    },
  },
});
