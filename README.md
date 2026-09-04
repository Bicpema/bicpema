# Bicpema

## Requirements

- [Hugo](https://gohugo.io/installation/)
- [Node.js](https://nodejs.org/ja/download/)
- npm 11.x (Node.jsを入れると勝手に入る)

各種インストールできているかの確認

```bash
hugo version
hugo v0.140.2+extended+withdeploy darwin/arm64 BuildDate=2024-12-30T15:01:53Z VendorInfo=brew

node -v
v22.12.0

npm -v
11.0.0
```

## Setup

リポジトリをクローンする  
※サブモジュールを使用しているため、`--recursive`オプションをつけること

```bash
git clone --recursive git@github.com:Bicpema/bicpema.git
```

npmパッケージをインストールする

```bash
npm install
```

## Development

hugoのサーバーを立ち上げる

```bash
hugo server -D
```

simulationsのhtmlをビルドする

```bash
npm run dev
```

TOPページ
<http://localhost:1313/>

シミュレーション
<http://localhost:1313/vite/simulations/wave-reflection/>

ドキュメント（Markdown）のリントチェックを実行する

```bash
npm run lint:md
```

## Blog

記事の追加

```bash
hugo new post/[post-name]/index.md
# 例
hugo new post/sample-post/index.md
```

タグの追加

```bash
hugo new tags/[tag-name]/_index.md
# 例
hugo new tags/sample-tag/_index.md
```

カテゴリの追加

```bash
hugo new categories/[category-name]/_index.md
# 例
hugo new categories/sample-category/_index.md
```

シリーズの追加

```bash
hugo new series/[series-name]/_index.md
# 例
hugo new series/sample-series/_index.md
```

使用できるマークダウンの記法は以下を参照

プレビュー  
<https://hugo-theme-tailwind.tomo.dev/post/markdown-syntax/>

ソースコード  
<https://github.com/tomowang/hugo-theme-tailwind/blob/main/exampleSite/content/post/markdown-syntax/index.md?plain=1>

記事とシミュレーションのリンク整合性（記事内のリンク切れ、対応する記事のないシミュレーション）をチェックする

```bash
npm run check:article-links
```

意図的に記事なしとするシミュレーションは`scripts/articleless-simulation-allowlist.js`に追加する。

## Simulation

[`vite`](./vite/)ディレクトリにシミュレーションのHTMLを配置する。  
新規のシミュレーションを追加する場合は、以下のコマンドを実行する。

```bash
mkdir vite/simulations/[simulation-name]
# 例
mkdir vite/simulations/sample-simulation
```

重いファイルは[Firebase Storage](https://console.firebase.google.com/project/bicpema/storage/bicpema.firebasestorage.app/files)にアップロードしてURLで参照すること。

## Structure

```txt
bicpema
├── archetypes # hugo newで生成されるファイルのテンプレート
├── config
│   ├── _default # ローカル、検証、本番で共通のHugoの設定
│   └── production # 本番環境のHugoの設定
├── content
│   ├── categories # Hugoのカテゴリ
│   ├── post # Hugoの記事
│   ├── series # Hugoのシリーズ
│   └── tags # Hugoのタグ
├── i18n # 文言の設定
├── static # 静的ファイル
├── themes # Hugoのテーマ
└── vite # SimulationsのHTML
    ├── _build # ビルドに使う関数
    ├── js # npmでインストールしたパッケージを使うためのファイル
    ├── scss # npmでインストールしたパッケージを使うためのファイル
    └── simulations # シミュレーションのHTML, CSS, JS
```

## Others

- `main`ブランチにマージすると、GitHub Actionsで自動的にデプロイされる。
- デプロイの状況は[こちら](https://github.com/Bicpema/bicpema/actions)で確認できる。
- デプロイ先 URL → <https://bicpema.com/>
- 開発者向けインストラクション（フォルダー構成、実装手順、コミットメッセージのルールなど）は[AGENTS.md](./AGENTS.md)を参照。Claude Code（`CLAUDE.md`経由）とGitHub Copilot Coding Agentで共通の内容。

## License

Bicpema独自のソースコード・コンテンツ（記事、画像、シミュレーション等）はAll Rights Reserved（全著作権留保）です。詳細は[LICENSE](./LICENSE)を参照してください。

サブモジュールとして利用しているテーマ [hugo-theme-tailwind](https://github.com/tomowang/hugo-theme-tailwind) はMIT Licenseで提供されています。詳細は[themes/hugo-theme-tailwind/LICENSE](./themes/hugo-theme-tailwind/LICENSE)を参照してください。
