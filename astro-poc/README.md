# Astro移行PoC（#796）

<!-- cspell:ignore Sätteri tagz -->

記事サイトをHugoからAstroへ移行した場合の効果とコストを見極めるための概念実証です。
このディレクトリは `main` へはマージせず、判断後に破棄する前提です。

## 実行方法

```bash
# リポジトリ直下で依存関係をインストール済みであること（シミュレーションのビルドに使用）
cd astro-poc
npm install
npm run build     # シミュレーション（ルートのVite）→ public/vite/、記事（Astro）→ dist/
npm run preview   # http://localhost:4321/
npm run dev       # シミュレーションをビルドしてから開発サーバーを起動
npm run check     # astro check（型検査）
```

## 実装した範囲

| 項目                           | 実装                                                                                                                                                                                                 |
| ------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 記事（3本）                    | `振り子`（ページバンドル内の画像）・`自由落下`（外部URLの画像、`aliases` の検証用）・`ドップラー効果`。本文はHugo版から無修正                                                                        |
| 記事ページ `/post/<スラッグ>/` | `src/pages/post/[slug].astro`                                                                                                                                                                        |
| 記事一覧（ページ送り）         | `/post/`（1ページ目）と `/post/page/<n>/`（Hugoと同じURL）。PoCでは記事が3本のため1ページ2件                                                                                                         |
| タクソノミー                   | タグのみ（`/tags/`・`/tags/<タグ>/`）                                                                                                                                                                |
| `simulation-link`              | ① remarkプラグイン（`src/plugins/remark-simulation-link.mjs`、既存記事の記法をそのまま変換）<br>② Astroコンポーネント（`src/components/SimulationLink.astro`、確認用ページ `/poc/simulation-link/`） |
| front matterのスキーマ         | `src/content.config.ts`（`title` / `description` / `author` / `date` / `image` / `tags` / `categories` / `series` / `aliases` / `draft`）                                                            |
| `aliases`                      | `src/pages/[...alias].astro` でHugoと同じmeta refresh形式のページを生成                                                                                                                              |
| シミュレーション               | 段階移行の「方法B」。ルートの `vite build` の出力先を `astro-poc/public/vite/` に変更し、Astroがそのまま `dist/vite/` へコピー                                                                       |
| ダークモード・数式             | テーマと同じ `.dark` クラス切り替えとKaTeX（CDN・auto-render）                                                                                                                                       |

## 評価結果

### 1. フォルダー構造の変化

本格移行時の想定です（PoCは既存構成と共存させるため `astro-poc/` に配置しています）。

```text
移行前（Hugo＋Vite）                     移行後（Astro＋Vite、方法B）
├── archetypes/        ← Hugo           ├── src/
├── assets/css/        ← Hugo           │   ├── content/posts/<スラッグ>/index.md   ← content/post/ から移動
├── config/_default/   ← Hugo           │   ├── content.config.ts                  ← front matterのスキーマ
├── content/post/      ← Hugo           │   ├── components/ layouts/ pages/ styles/ plugins/
├── data/              ← Hugo＋CI       ├── public/            ← Astroの静的ファイル（ソース）
├── i18n/              ← Hugo           ├── data/published-urls.yaml（CI用に残す）
├── layouts/           ← Hugo           ├── astro.config.mjs
├── static/            ← Hugo           ├── vite/              ← 変更なし
├── themes/（submodule）← Hugo          └── vite.config.js     ← 出力先のみ変更
├── vite/
└── vite.config.js
```

- Hugo用の8フォルダー（`archetypes/` `assets/` `config/` `content/` `i18n/` `layouts/` `static/` `themes/`）が `src/` と `public/` に集約され、git submoduleがなくなります。
- **注意**: 現在リポジトリ直下の `public/` はHugoの出力先（git管理対象外）ですが、Astroでは `public/` が **ソース** です。`.gitignore`・`firebase.json`（`hosting.public`）・markdownlint / cspell / yamllint / Prettierの除外設定の見直しが必要です（Astroの出力先は `dist/`）。

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

| CI・スクリプト                                                         | 必要な修正                                                                                              |
| ---------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------- |
| `deploy.yml` / `check-published-urls.yml`                              | `peaceiris/actions-hugo` と `hugo --minify` を `astro build` に置き換え、`public/` を `dist/` に変更    |
| `check:published-urls`（`scripts/check-published-urls.js`）            | 検査対象ディレクトリを `public/` → `dist/` に変更（ロジックはそのまま流用できることを確認済み）         |
| `check:article-links`（`scripts/_lib/checkArticleSimulationLinks.js`） | 記事ディレクトリのパス（`content/post/`）を変更。ショートコードの記法を変えなければ検出ロジックは流用可 |
| `vite/_build/bicpemaComponents.js`                                     | ナビバーの「解説ページへ戻る」リンクの対象判定に使う `POSTS_DIR` のパスを変更                           |
| markdownlint / cspell / Prettier / yamllint                            | 除外パスの `public/` を `dist/`・`.astro/` に変更。記事の `.md` はそのままlint対象                      |
| typecheck                                                              | `astro check` を追加（PoCでは0 errors）。ルートの `tsc --noEmit` との統合方法を決める                   |
| E2E（Playwright）・`verify:runtime`                                    | `vite preview` で完結しているため影響なし                                                               |
| ドキュメント                                                           | `README.md` と `docs/docs/` の約9ファイルでHugoの手順・パスに言及しており更新が必要                     |

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
- **開発サーバーでのシミュレーション配信**: `astro dev` は `public/` 配下のディレクトリURL（`/vite/simulations/<名前>/`）を `index.html` に解決せず404になります（ビルド後の `astro preview`・Firebase Hostingでは解決されます）。`astro.config.mjs` のViteプラグインで開発時のみ `index.html` へ書き換えています。また `public/vite/` はgit管理外のため、`npm run dev` でもシミュレーションを先にビルドしています。
