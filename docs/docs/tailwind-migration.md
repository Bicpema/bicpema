# TailwindCSS移行方針

[Issue #328](https://github.com/Bicpema/bicpema/issues/328) で提起された、`vite/simulations/` 配下の全シミュレーションおよび `templates/` で使用しているBootstrapをTailwindCSSへ移行する件について、対象範囲・進め方・Bootstrap JSコンポーネントの代替手段を決定する。

## 現状

- `package.json` の `dependencies` に `bootstrap`、`@popperjs/core`、`jquery` が入っている。
- 45件のシミュレーションのうち44件が `js/index.js` で `bootstrap/dist/css/bootstrap.min.css` と `bootstrap/dist/js/bootstrap.bundle.min.js` をimportしている（残り1件はCDN経由）。
- `templates/` のひな形（`new_simulation.py` 実行時に生成される）も同様にBootstrapへ依存している。
- `vite/scss/common.scss` で `@use "bootstrap/scss/bootstrap"` によりBootstrap全体を読み込んでいる。
- Hugoサイト本体のテーマ（`themes/hugo-theme-tailwind`）は既にTailwindCSSで構築されているが、独立したnpmプロジェクトであり `vite/simulations` 側とは依存関係・ビルドパイプラインを共有していない。

## 決定事項

### 1. 移行スコープ・進め方: 段階的移行

一括移行は行わない。以下の順序で段階的に進める。

1. **`templates/` を先行して移行する**（本Issueのフォローアップとして着手）。以降 `new_simulation.py` で新規作成されるシミュレーションはTailwindCSSベースになる。
2. **既存45件のシミュレーションは、シミュレーション単位またはグループ単位で個別Issueに分割し、順次移行する。** 一度に全件を移行するPRは作らない（差分が巨大になりレビュー・動作確認が困難なため、また1シミュレーションの不具合が他に波及するリスクを避けるため）。
3. 移行期間中は `bootstrap` / `@popperjs/core` / `jquery` を `package.json` に残し、Bootstrap版とTailwind版のシミュレーションが共存する状態を許容する。全シミュレーションの移行が完了した時点で、これらの依存関係と `vite/scss/common.scss` のBootstrap読み込みを削除する。

### 2. Bootstrap JSコンポーネントの代替手段: 素のJS + CSS

TailwindCSS自体はJSを持たないため、モーダル（設定パネル）やナビゲーションの開閉など、Bootstrap JSに依存していた挙動の代替が必要になる。

- **新規ライブラリ（Alpine.js等）は導入しない。** 各シミュレーションに閉じた素のJS（`classList.toggle` 等）とCSSで実装する。
- 複数シミュレーションで共通化できる処理（例: 設定モーダルの開閉、右上の設定ボタンの挙動）は、[BicpemaCanvasControllerをvite/js/配下の共有モジュールに一元化](https://github.com/Bicpema/bicpema/commit/613d8fb)した前例に倣い、`vite/js/` 配下の共有モジュールとして切り出すことを検討する。

## 移行手順（`templates/` および各シミュレーション共通の目安）

1. `vite/scss/common.scss` の `@use "bootstrap/scss/bootstrap"` をTailwindCSSの読み込みに置き換える（導入方法はCLI/PostCSSプラグイン/Viteプラグインのいずれか、着手時にVite 7系との親和性を踏まえて選定する）。
2. HTML内のBootstrapユーティリティクラス（`navbar` / `container-fluid` / `btn` / `modal` 等）をTailwindユーティリティクラスに置き換える。
3. `js/index.js` からBootstrapのCSS/JS importを除去し、モーダル・設定パネルの開閉を素のJSで実装する。
4. `AGENTS.md` の実装ルール（左下に再生・停止ボタン、右上に設定表示ボタン、スクロール不可など）を満たすことをUIレビューで確認する。
5. `npm run verify:runtime` で当該シミュレーションのランタイムエラーが発生しないことを確認する。

## 未決定事項（着手時に決める）

- TailwindCSSの具体的な導入方法（Tailwind CLI / PostCSSプラグイン / `@tailwindcss/vite` 等）
- 既存シミュレーションの移行順序（利用頻度・保守頻度の高いものから着手する、など）
- 移行完了の判定基準（Bootstrapクラスの残存を検知する自動チェックを設けるか）
