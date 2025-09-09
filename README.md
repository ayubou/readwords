## 🚧 このリポジトリは現在リファクタリング中です 🚧

- 2022 年作の自作プロジェクトで全体的にかなり古いので、コードを整理してモダンな構成に移行中。
- 【現状進捗】
  - [x] （20250908）Vue2 +JS 構造は一旦そのままで Vue3+TS に変更。全体見直しはまだ。
  - [x] （20250909）CSS は FLOCSS で、 Vue で SCSS もたない。
- 【今後の目標】
  - [ ] 全体的に構造見直し。
  - [ ] 全体的にコードリファクタ。JSDoc いれる。
  - [ ] ビルド設定見直し。
  - [ ] firebase 見直し。Vue 側は薄く持ちたい。
  - [ ] Vercel でホスト。
  - [ ] 現行の firebase 仕様に合わせて検索の精度上げたい。
  - [ ] 投稿画面改修。バリデーション見直し。
  - [ ] frontend か backend かタグ付けしときたい。
  - [ ] 一覧の並び順を大文字小文字で分けたくない。

# readwords 🤔

「この単語どう読むんだっけ？」「意味ざっくり知りたい！」ときにサクッと検索・投稿できる WEB サイトです。(自分用)  
かつ Firebase の学習目的で作成しました。

## 🚀 技術スタック（移行中含む）

![Vue.js](https://img.shields.io/badge/Vue.js-3.4.0-35495E?logo=vuedotjs)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9.2-3178C6?logo=typescript)
![Vite](https://img.shields.io/badge/Vite-5.0.0-646CFF?logo=Vite)
![Firebase](https://img.shields.io/badge/Firebase-12.2.1-FFCA28?logo=firebase)
![Node.js](https://img.shields.io/badge/Node.js-22.19.0-339933?logo=node.js)
![Yarn](https://img.shields.io/badge/Yarn-4.9.4-2C8EBB?logo=yarn)

使用ライブラリなどは [package.json](./package.json) を確認。

## 📸 画面イメージ

- TOP
  ![TOP画面](./images/screenshot1.png)
- ログイン画面
  ![ログイン画面](./images/screenshot2.png)
- 投稿画面
  ![投稿画面](./images/screenshot3.png)
- 再編集時
  ![再編集時](./images/screenshot4.png)
- 削除時
  ![削除確認](./images/screenshot5.png)  
  ![削除完了](./images/screenshot6.png)
