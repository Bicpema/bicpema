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

## 生CSS最小化方針（[Issue #470](https://github.com/Bicpema/bicpema/issues/470)）

[#461](https://github.com/Bicpema/bicpema/issues/461)（3d-strata系の移行）の作業中、Bootstrap JSのタブコンポーネント代替として `style.css` に生CSSを追加したことをきっかけに、TailwindCSS移行済みのシミュレーションを含めて `vite/simulations/*/css/style.css` 全体（43ファイル、合計3203行）を棚卸しした。

### 分類基準

- **A. Tailwindユーティリティにそのまま置き換え可能**: `position` / `top` / `left` / `right` / `bottom`、`display:flex` 系（`flex-direction` / `flex-wrap` / `gap` / `justify-content` / `align-items`）、`z-index`、`width` / `height`（`calc()` を含む）、`border-radius`、`box-shadow`、`backdrop-filter`、`background-color`（hex/rgb/rgba）、`:hover` / `:active` などの疑似クラス、`transition`、`transform`。
- **B. Tailwindの標準機能だけでは表現しづらく一手間必要なもの**: `576px` / `400px` のようなTailwindの標準ブレークポイント（`sm:`=640px 等）と一致しない `@media` はTailwind v4の任意値ブレークポイント記法（`max-[576px]:` 等）で表現する。JSで付け外しされるクラスの有無で見た目を変えるパターン（例: `.nav-link.active`）はTailwind v4の任意バリアント `[&.active]:` を使うか、JS側でトグルするクラス自体をユーティリティクラスの組に変更する。
- **C. 生CSSとして残す必要があるもの**: 今回の棚卸しでは該当なし。`@keyframes` / `animation` を使っているファイルは1件も無く、p5.js側の描画色とCSS側の値が動的に連動していて置換できないケースも見当たらなかった（凡例色のような静的な色定義はTailwindの任意値記法で表現できるため対象外）。

### 棚卸し結果と対応方針

分類の結果、43ファイルのほぼ全量が分類A（そのままユーティリティクラスに置き換え可能）であり、分類Bは一部の独自ブレークポイントとタブのactive状態表現のみ、分類Cに該当するものは無かった。特に行数の多いファイル（150〜240行）は、`.settings-modal` / `.left-bottom-controls` / `.right-top-controls` / `.bottom-controls` という同一のボイラープレート（設定モーダルと配置固定ボタン群）がほぼコピーペーストで複数シミュレーションに重複しており、1件でクラスの組み合わせを確立すれば残りへ横展開できる。

[#455](https://github.com/Bicpema/bicpema/issues/455)〜[#461](https://github.com/Bicpema/bicpema/issues/461)のTailwindCSS移行と同じグループ分けで、以下のフォローアップIssueに分割した（1件のPRにはしない）。

| グループ | Issue | 対象シミュレーション数 | 生CSS合計行数 |
| --- | --- | --- | --- |
| 運動学系 | [#483](https://github.com/Bicpema/bicpema/issues/483) | 11件 | 1620行 |
| 力・エネルギー・振動系 | [#484](https://github.com/Bicpema/bicpema/issues/484) | 11件 | 755行 |
| 音・振動波系 | [#485](https://github.com/Bicpema/bicpema/issues/485) | 8件 | 224行 |
| 光学系 | [#486](https://github.com/Bicpema/bicpema/issues/486) | 6件（うち2件は対応不要） | 160行 |
| 熱系 | [#487](https://github.com/Bicpema/bicpema/issues/487) | 5件 | 284行 |
| 電磁気系 | [#488](https://github.com/Bicpema/bicpema/issues/488) | 2件 | 28行 |
| 地学系 | [#489](https://github.com/Bicpema/bicpema/issues/489) | 2件 | 132行 |

## JS内HTML最小化方針（[Issue #491](https://github.com/Bicpema/bicpema/issues/491)）

上記の生CSS最小化と同じ発想で、`vite/simulations/*/js/*.js` 内に文字列として埋め込まれたHTML（`p.createDiv("<div>...")` / `.html("<span>...")` 等）を棚卸しした。TailwindCSS移行時に設定モーダルや操作ボタンを `style.css` から `index.html` へ移した際、多くのシミュレーションではJS側は要素の生成・配置とイベントリスナー設定のみを担う構成に揃ったが、一部のシミュレーションはこの構成に揃っていなかった。

### 対応方針の分類基準

- **静的なマークアップをまるごとJSで生成しているケース**: `index.html` に直接書き、JS側は `p.select()` によるID参照とイベントリスナー設定のみを担う構成に揃える（`uniform-linear-motion` 等）。
- **1行程度の軽微なケース**（`p.createDiv('<canvas id="graphCanvas"></canvas>')` など）: 同様に `index.html` に直書きし、`p.select()` で参照する（`free-fall` / `uniformly-accelerated-linear-motion` 等）。
- **動的な内容でHTMLタグが必要になるケース**: 表示内容・配色が計算結果に連動して切り替わる場合でも、可能な限り状態ごとの静的マークアップを `index.html` に用意し、JS側は `addClass("hidden")` / `removeClass("hidden")` によるトグルと、数値部分のみの `.html()` 差し替えに留める（`cart-work-ruler` の情報パネル状態表示で対応）。テキストや配色を含むHTML全体を都度生成する必要があるものは、生HTMLとして残すことを許容する。

### 対応状況

- `uniform-linear-motion` の設定モーダル・操作ボタン・グラフ用canvasのマークアップを `index.html` に移した。
- `free-fall` / `uniformly-accelerated-linear-motion` のグラフ用canvasタグを `index.html` に直書きした。
- `cart-work-ruler/js/logic.js` の状態別ステータス表示（静止・臨界超過・運動中）は、3パターンの静的マークアップを `index.html` に用意し、`hidden` クラスのトグルと数値部分の差し替えのみJSで行う構成に変更した。
