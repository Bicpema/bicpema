# ファイル構成（リポジトリ全体）

Bicpema リポジトリのトップレベルのディレクトリ構成と、各ファイル・フォルダの役割を説明します。

## ディレクトリ構成

```
bicpema/
├── .github/                  # GitHub 関連設定
│   ├── ISSUE_TEMPLATE/       # Issue テンプレート
│   ├── skills/               # GitHub Copilot エージェントのスキル定義
│   ├── workflows/            # GitHub Actions ワークフロー
│   ├── copilot-instructions.md  # Copilot へのプロジェクト指示
│   ├── dependabot.yml        # Dependabot 設定
│   ├── pull_request_template.md  # PR テンプレート
│   └── release.yml           # リリースノートのカテゴリ設定
├── archetypes/               # `hugo new` で生成されるファイルのテンプレート
├── config/
│   ├── _default/             # 共通の Hugo 設定（hugo.toml, params.toml など）
│   └── production/           # 本番環境向けの Hugo 設定
├── content/
│   ├── categories/           # カテゴリーページ
│   ├── post/                 # 記事（各フォルダに index.md）
│   ├── series/               # シリーズページ
│   └── tags/                 # タグページ
├── docs/                     # 開発者ドキュメント（Zensical）
├── i18n/                     # UI 文言の翻訳ファイル
├── layouts/                  # Hugo レイアウトのオーバーライド
├── simulation-docs/          # 各シミュレーションの設計ドキュメント
├── static/                   # 静的ファイル（CSS, 画像, ビルド済みシミュレーション）
│   └── vite/                 # Vite ビルド出力先
├── template/                 # シミュレーション雛形テンプレート
├── themes/                   # Hugo テーマ（サブモジュール）
├── vite/                     # シミュレーションのソースコード
├── .gitignore
├── .gitmodules               # Git サブモジュール設定（themes/）
├── .prettierignore
├── .prettierrc               # Prettier 設定
├── cors.json                 # Firebase Storage CORS 設定
├── firebase.json             # Firebase Hosting 設定
├── new_simulation.py         # 新規シミュレーション雛形生成スクリプト
├── package.json              # npm 設定・依存関係
├── package-lock.json
└── vite.config.js            # Vite ビルド設定
```

## 主要ファイルの説明

### `vite.config.js`

Vite のビルド設定ファイルです。

- ルートディレクトリ: `./vite`
- 出力先: `static/vite`
- ベースパス: `/vite`
- `vite/simulations/` と `vite/js/` は静的ファイルとしてコピーされます

### `config/_default/hugo.toml`

Hugo の基本設定ファイルです。サイトの URL、タイトル、使用テーマ（`hugo-theme-tailwind`）などを設定します。

### `firebase.json`

Firebase Hosting の設定ファイルです。Hugo のビルド出力先（`public/`）をホスティングルートとして指定します。

### `new_simulation.py`

新規シミュレーションの雛形を生成する Python スクリプトです。  
日本語名と英語名を入力すると `vite/simulations/` 配下にフォルダと基本テンプレートを生成します。

### `.github/workflows/deploy.yml`

Firebase Hosting へのデプロイワークフローです。  
`workflow_dispatch`（手動実行）またはリリースタグへの自動連携で実行されます。  
Hugo ビルドと npm ビルドを行い、Firebase に配信します。

### `.github/workflows/create-release-note.yml`

`v*.*.*` または `v*.*.*-Beta*` タグがプッシュされたときに実行されます。  
GitHub Release を自動作成し、正式リリース時はデプロイワークフローを起動します。

### `.github/release.yml`

リリースノートに含めるカテゴリとラベルの対応を定義します。

### `.github/dependabot.yml`

npm と GitHub Actions の依存関係を週次で自動更新する Dependabot の設定です。

### `simulation-docs/`

各シミュレーションの設計ドキュメント（Markdown）を格納します。  
シミュレーションの仕様・ロジック・画面設計などを記録しておく場所です。
