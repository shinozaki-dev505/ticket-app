# チケット管理アプリケーション (Ticket Management App)

シンプルで扱いやすいタスク・チケット管理アプリケーションです。  
Node.js + Express (TypeScript) で構築された REST API と SQLite データベース、Vanilla JS によるフロントエンドで構成されています。

---

## 🚀 主な機能

* **チケット一覧表示**: 登録されたチケットを一覧でカード形式表示
* **チケット新規作成**: タイトル・内容を入力してリアルタイム追加（タイトル必須バリデーション）
* **チケット編集・更新**: 既存チケットのタイトルや内容をいつでも編集・更新可能
* **チケット削除機能**: 確認ダイアログ付きのチケット削除処理
* **レスポンシブ UI**: 長文テキストの自動折り返しや改行（`\n`）の反映、削除・編集ボタンの配置崩れを防ぐデザイン調整
* **XSS 対策**: フロントエンドでのエスケープ処理によるセキュリティ対策

---

## 🛠️ 技術構成 (Tech Stack)

| カテゴリ | 技術・ライブラリ |
| :--- | :--- |
| **Backend** | Node.js, Express, TypeScript (`tsx`) |
| **Database** | SQLite (`better-sqlite3`) |
| **Frontend** | HTML5, CSS3 (Flexbox), JavaScript (ES6+ / Fetch API) |
| **Dev Tools** | VS Code, npm |

---
```
## 📁 ディレクトリ構造

ticket-app/
├── src/
│   ├── server.ts      # Express サーバー・API エンドポイント設定
│   └── db.ts          # SQLite データベース接続・CRUD 関数
├── public/            # 静的ファイル（フロントエンド）
│   ├── index.html     # メイン画面 HTML
│   ├── style.css      # スタイルシート
│   └── app.js         # フロントエンド処理 (Fetch API / UI制御)
├── tickets.db         # SQLite データベースファイル（自動生成）
├── package.json
└── tsconfig.json
```
---

## ⚙️ セットアップ・起動手順

1. **リポジトリのクローン・依存関係のインストール**
```
git clone https://github.com/shinozaki-dev505/ticket-app.git
cd ticket-app
npm install
```

2. **開発サーバーの起動**
```
npx tsx src/server.ts
```
起動後、ターミナルに以下が表示されます。
サーバーが起動しました: http://localhost:3000

3. **ブラウザでアクセス**  
ブラウザで http://localhost:3000 にアクセスするとアプリが利用できます。

---

## 📡 API エンドポイント一覧

| メソッド | エンドポイント | 説明 |
| :--- | :--- | :--- |
| **GET** | `/tickets` | チケット一覧の取得 |
| **POST** | `/tickets` | 新規チケットの作成 |
| **PATCH** | `/tickets/:id` | チケット情報の部分更新（タイトル・内容の編集） |
| **DELETE** | `/tickets/:id` | チケットの削除 |
