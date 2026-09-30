# Astro移行PoC（#796）

<!-- cspell:ignore Sätteri tagz -->

記事サイトをHugoからAstroへ移行した場合の効果とコストを見極めるための概念実証です。
このブランチは `main` へはマージせず、判断後に破棄する前提です。

当初は `astro-poc/` に記事3本で実装し（コミット `bee3418`）、その後、移行後のフォルダー構成を確認するため、
Astroをリポジトリ直下に移し、全32記事・固定ページを移行してHugo関連のファイルを削除しました。

## 実行方法

```bash
npm ci
npm run dev       # シミュレーションをビルドしてからAstroの開発サーバーを起動（http://localhost:4321/）
npm run build     # シミュレーション（Vite）→ public/vite/、サイト（Astro）→ dist/
npm run preview   # ビルドしたサイトを確認
```

## 実装した範囲

| 項目                           | 実装                                                                                                                                      |
| ------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------- |
| 記事（全32本）                 | `src/content/posts/<スラッグ>/index.md`。本文・front matterはHugo版から無修正                                                             |
| 固定ページ                     | `src/content/pages/`（about / licenses / terms）と `src/pages/[page].astro`。TOML形式のfront matterのまま読み込める                       |
| 記事ページ `/post/<スラッグ>/` | `src/pages/post/[slug].astro`                                                                                                             |
| 記事一覧（ページ送り）         | `/post/`（1ページ目）と `/post/page/<n>/`（Hugoと同じURL、1ページ10件）                                                                   |
| タクソノミー                   | タグのみ（`/tags/`・`/tags/<タグ>/`）                                                                                                     |
| ショートコード                 | remarkプラグインで変換（`src/plugins/`）。`simulation-link`（サムネイル付きカード）・`bundled-licenses`（ライセンス一覧）                 |
| front matterのスキーマ         | `src/content.config.ts`（`title` / `description` / `author` / `date` / `image` / `tags` / `categories` / `series` / `aliases` / `draft`） |
| `aliases`                      | `src/pages/[...alias].astro` でHugoと同じmeta refresh形式のページを生成                                                                   |
| シミュレーション               | 段階移行の「方法B」。`vite build` の出力先を `public/vite/` に変更し、Astroがそのまま `dist/vite/` へコピー                               |
| ダークモード・数式             | テーマと同じ `.dark` クラス切り替えとKaTeX（CDN・auto-render）                                                                            |
| CI・スクリプト・設定           | デプロイ・掲載URL検査のワークフローからHugoを削除し、各スクリプト・lint設定・`.gitignore`・`firebase.json` を移行後のパスに変更           |

`simulation-link` はAstroコンポーネント版も試作しましたが（コミット `bee3418` の `SimulationLink.astro`）、
記事をMDXにできない（後述）ため、記事ではremarkプラグインを使い、コンポーネントは削除しました。

## 評価結果

### 1. フォルダー構造の変化

```text
移行前（Hugo＋Vite）                      移行後（Astro＋Vite、方法B）＝このブランチ
├── archetypes/          ← Hugo          ├── src/
├── assets/css/          ← Hugo          │   ├── content/
├── config/_default/     ← Hugo          │   │   ├── posts/<スラッグ>/index.md   ← content/post/ から移動
├── content/             ← Hugo          │   │   └── pages/{about,licenses,terms}.md
├── data/                ← Hugo＋CI      │   ├── content.config.ts               ← front matterのスキーマ
├── i18n/                ← Hugo          │   ├── components/ layouts/ lib/ pages/ plugins/ styles/
├── layouts/             ← Hugo          ├── public/              ← favicon.ico・logo.svg（＋ビルド時に vite/）
├── static/              ← Hugo          ├── data/                ← CI用（published-urls.yaml など）
├── themes/（submodule） ← Hugo          ├── vite/                ← 変更なし
├── vite/                                ├── astro.config.mjs
└── vite.config.js                       └── vite.config.js       ← 出力先のみ変更
```

- Hugo用の8フォルダー（`archetypes/` `assets/` `config/` `content/` `i18n/` `layouts/` `static/` `themes/`）が `src/` と `public/` に集約され、git submodule（`.gitmodules`）がなくなりました。
- サイトのソースは `src/`、シミュレーションは `vite/` と、役割ごとにフォルダーが分かれます。
- **注意**: Hugoでは直下の `public/` が出力先（git管理対象外）でしたが、Astroでは `public/` が **ソース** です。出力先は `dist/` で、`public/vite/`（Viteの出力）・`dist/`・`.astro/` をgit管理対象外にしています。

### 2. ビルドの流れとビルド時間

- 流れ: 「`vite build` → `static/vite/` → `hugo --minify` → `public/`」から「`vite build` → `public/vite/` → `astro build` → `dist/`」へ。シミュレーションを当面Viteのまま残す方法Bでは2段階ビルドは残ります（1系統化は、シミュレーションもAstroのページとして扱う方法Aまで進めた場合）。
- 計測（Apple Silicon、ローカル、3回）:

    | 構成                                       | 時間         |
    | ------------------------------------------ | ------------ |
    | Vite（シミュレーション45本）               | 約0.6〜0.8秒 |
    | Hugo（記事32本・218ページ）                | 約0.6秒      |
    | Hugo＋Vite 合計                            | 約1.2〜1.8秒 |
    | Astro（記事3本・17ページ、キャッシュなし） | 約1.5〜2.0秒 |
    | Astro（記事32本を一時投入・116ページ）     | 約1.7〜1.9秒 |
    | Astro＋Vite 合計（記事3本）                | 約3.1〜3.4秒 |

- Astroは2倍程度遅いものの、どちらも数秒以内で、CI・ローカルとも実用上の差はありません。

### 3. 既存URLの維持

- `data/published-urls.yaml` の46件（トップページ＋シミュレーション45件）を `scripts/_lib/checkPublishedUrls.js` でAstroの `dist/` に対して検査し、**全件到達可能**でした。
- 全32記事を一時投入した状態で、`/post/<スラッグ>/` と `/tags/<タグ>/` の出力パスがHugoと**完全一致**しました（日本語スラッグ・タグの小文字化を含む）。スラッグはフォルダー名をそのままidにしています（`glob` ローダーの `generateId`）。
- `/post/page/<n>/`（ページ送り）もHugoと同じURLで出力できます。
- `aliases` はHugoと同じmeta refreshのHTMLを生成して動作を確認しました（`/post/free-fall/` → `/post/自由落下/`）。現状 `aliases` を使っている記事はありません。301が必要な場合は `firebase.json` の `redirects` を使う既存方針のままで問題ありません。

### 4. 既存CIへの影響

このブランチで以下を修正し、全チェックが通ることを確認しました。

| CI・スクリプト                                       | 修正内容                                                                                                |
| ---------------------------------------------------- | ------------------------------------------------------------------------------------------------------- |
| `deploy.yml` / `check-published-urls.yml`            | Hugoのセットアップ・`hugo --minify`・submoduleの取得を削除し、`npm run build`（Vite＋Astro）に一本化    |
| `check:published-urls`                               | 検査対象を `public/` → `dist/` に変更（検査ロジックはそのまま）                                         |
| `check:article-links`・`check-article-links.yml`     | 記事のパスを `content/post/` → `src/content/posts/` に変更                                              |
| `vite/_build/bicpemaComponents.js`                   | ナビバーの「解説ページへ戻る」リンクの判定に使う記事のパスを変更                                        |
| `verify:runtime`・`benchmark:performance`・E2E       | Viteの出力先を `static/vite/` → `public/vite/` に変更（`vite preview` で完結する点は変わらず）          |
| markdownlint / cspell / Prettier / yamllint / oxlint | 除外パスを `public/vite/`・`dist/`・`.astro/` に変更。oxlintに `.astro` 用のグローバル（`Astro`）を追加 |
| typecheck                                            | `tsc --noEmit` の対象に `src/` の `.ts`・`.mjs` を追加                                                  |
| ドキュメント                                         | `README.md`・`AGENTS.md` を更新。**`docs/docs/` の9ファイル（Hugoへの言及36箇所）は未更新**             |

`npm run build` の中身が「シミュレーションのみ」から「シミュレーション＋サイト」に変わるため、
シミュレーションだけをビルドするE2Eの事前処理は `npm run build:simulations` に変更しています。

### 5. テーマ相当の実装量

テーマ（`hugo-theme-tailwind`）のテンプレートは約870行（＋検索用JS・CSS）。PoCで実装していない主な機能と見積もりです。

| 機能                                                                           | 見積もり     |
| ------------------------------------------------------------------------------ | ------------ |
| レイアウト（ヘッダー・メニュー・フッター・ダークモード・Tailwind＋typography） | 1日          |
| 一覧・ページ送り・カテゴリ／シリーズの一覧と各ページ（タグは実装済み）         | 0.5日        |
| OGP・Twitterカード・JSON-LD・canonical・description                            | 0.5日        |
| RSS（`@astrojs/rss`）・サイトマップ（`@astrojs/sitemap`）・404                 | 0.5日        |
| サイト内検索（テーマは `search.json` ＋クライアント検索）                      | 0.5〜1日     |
| 固定ページ（about / licenses / terms）と `bundled-licenses` ショートコード     | 0.5日        |
| PWAマニフェスト・i18n文言                                                      | 0.25日       |
| **合計**                                                                       | **約4〜5日** |

### 6. `<bicpema-*>` のAstroコンポーネント化の見通し

- 45本のシミュレーション（`index.html`）で `<bicpema-nav-bar>`・`<bicpema-loading-spinner>` が各45回、`<bicpema-settings-button>`・`<bicpema-settings-modal>` が各30回、`<bicpema-icon>` が29回使われています。
- いずれもビルド時に静的マークアップへ展開するだけのもので、Astroコンポーネント（`.astro`）への置き換え自体は容易です。
- ただし、置き換えるにはシミュレーションの `index.html` を `.astro` ページに変換する必要があり（方法A）、p5.jsのスクリプト読み込み・Tailwindの `@source`・`vite preview` を前提としたE2Eや `verify:runtime` まで影響します。**方法Bの段階では現在のViteプラグインを維持するのが妥当**です。

### 7. 全面移行の作業量

| 対象                          | 作業内容                                                                              | 見積もり     |
| ----------------------------- | ------------------------------------------------------------------------------------- | ------------ |
| 記事32本                      | `git mv` のみ。**本文は無修正でビルドでき、全32本にカードが出力されることを確認済み** | 0.5日        |
| シミュレーション45本（方法B） | 変更なし（出力先のみ変更）                                                            | 0日          |
| テーマ相当                    | 上記5.                                                                                | 4〜5日       |
| CI・スクリプト・ドキュメント  | 上記4.                                                                                | 1〜1.5日     |
| 見た目の差分確認・調整        | 全ページのスクリーンショット比較など                                                  | 1日          |
| **合計（方法B）**             |                                                                                       | **約7〜8日** |
| （参考）方法A                 | 45本の `index.html` を `.astro` 化し、`<bicpema-*>` をコンポーネント化、E2E等を修正   | ＋5〜8日     |

## PoCで分かった注意点

- **Markdownの処理系**: Astro 7の既定はRust製の `Sätteri` で、remarkプラグインが使えません。既存記事の `{{< simulation-link >}}` を変換するため、`@astrojs/markdown-remark` の `unified()` を指定しています。
- **MDXは不可**: 記事をMDXにしてコンポーネントを直接書く方式を試しましたが、数式（`\\( \\text{s} \\)` など）の `{}` がJSX式として解釈されビルドが失敗しました。数式を含む記事は32本中30本あるため、`.md` のままremarkプラグインで変換する方式が現実的です。
- **数式**: `\\(`〜`\\)` はHugoと同じく `\(`〜`\)` として出力されるため、既存のKaTeX auto-renderがそのまま使えます。
- **引用符**: smartypants（Hugoのtypographerに相当）がショートコードの `"` を `“ ”` に変換するため、プラグイン側で両方を許容しています。
- **画像**: ページバンドル内の `thumbnail.png` はAstroが自動でWebPに変換・最適化します。一方で `<img>` に `width` / `height` 属性が付くため、カードのCSSに `height: auto` が必要でした。Hugoの `image: "thumbnail.png"` はスキーマの `image()` でそのまま解決できます。
- **型検査**: 日付の不正値や、未定義のキー（例: `tagz`）はビルド時にエラーになります（`z.strictObject` を使用）。
- **コンテンツのキャッシュ**: remarkプラグインを変更しても、`.astro/` と `node_modules/.astro/` のキャッシュが残っていると記事が再変換されません。プラグイン開発時はキャッシュの削除が必要です。
- **開発サーバーでのシミュレーション配信**: 次の2点に対応しています。
    - `astro dev` は `public/` 配下のディレクトリURL（`/vite/simulations/<名前>/`）を`index.html`に解決せず404になります（ビルド後は解決されます）。`astro.config.mjs` のViteプラグインで、開発時のみ書き換えています。
    - `public/vite/` はgit管理外のため、`npm run dev` でもシミュレーションを先にビルドします。
- **`astro check` はTypeScript 7に未対応**: `@astrojs/check` の対応はTypeScript 5／6までで、TypeScript 7を使うこのリポジトリには導入できません。`.astro` ファイルの型検査は、対応を待つか、`.astro` 内のロジックを `.ts` に切り出して `tsc` で検査する方針になります。
- **oxlintは `.astro` も検査する**: フロントマターの `Astro` やインラインスクリプトのグローバルを `globals` に定義する必要があります。
- **GitHubのラベル**: リリースノートの分類（`.github/release.yml`）に `Hugo` ラベルがあり、移行する場合はラベル名の変更が必要です。
