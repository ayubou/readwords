import { defineStore } from "pinia";
import {
  onAuthStateChanged,
  type User,
  type Unsubscribe,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { auth } from "@/lib/firebase";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    user: null as User | null,
    ready: false as boolean, // 初回同期が完了したか
    _started: false as boolean, // 二重購読防止
    _unsub: null as Unsubscribe | null, // 監視解除ハンドラ
  }),

  getters: {
    isLogin: (s) => !!s.user,
  },

  actions: {
    // 初期化
    init() {
      if (this._started) return;
      this._started = true;

      // ログイン状態の常駐リスナー
      this._unsub = onAuthStateChanged(auth, (u) => {
        // uがUserの場合はログイン状態、nullはログアウト状態
        this.user = u;
        this.ready = true;
      });
    },

    // 監視停止
    stop() {
      this._unsub?.();
      this._unsub = null;
      this._started = false;
      this.user = null;
      this.ready = false;
    },

    // ログイン
    async loginWithEmail(email: string, password: string) {
      await signInWithEmailAndPassword(auth, email, password);
    },

    // ログアウト
    async logout() {
      await signOut(auth);
    },
  },
});
