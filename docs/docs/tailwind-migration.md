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

## ボイラープレートの共通コンポーネントクラス化方針（[Issue #493](https://github.com/Bicpema/bicpema/issues/493)）

上記の生CSS最小化方針（#470）に沿って[#483](https://github.com/Bicpema/bicpema/issues/483)・[#484](https://github.com/Bicpema/bicpema/issues/484)の移行を進めた結果、`free-fall` 等の完了済みファイルでは、設定モーダルや固定位置のボタン群で、1要素あたり15〜20個のユーティリティクラス（任意値記法込み）が並ぶ状態になった。同一の組み合わせがシミュレーション間でほぼコピーペーストされており、可読性の低下と、デザイン変更時に置換対象全ファイルを横断修正する必要があるという課題がある。

### 共通化に関する決定事項

1. **共通化する。** 「生CSSを残さない」という#470の方針は維持しつつ、TailwindCSSの `@layer components` + `@apply` を用いてコンポーネントクラスを定義する。生CSSの直接記述ではなく、ユーティリティクラスの組を `@apply` で束ねるだけなので、#470の「Tailwindで表現できるものを生CSSで書かない」という趣旨から外れない。
2. **対象範囲は、レイアウト・装飾（位置・角丸・影・transition・レスポンシブ対応）に加えて、色バリエーションも含める。** `toggleModal`/`settingsButton`（シアン系）や `closeModal`（グレー系）はほぼ全ファイルで固定だが、それ以外は操作パターンによって配色が変わる。`playPauseButton` を主とするファイルでは `resetButton` が青系、`playPauseButton` 自体が緑系になることが多い一方、`startButton`/`stopButton` の2ボタン構成のファイル（`doppler` 等）では `startButton` が青系・`stopButton` が赤系・`resetButton` はグレー系（ニュートラル）になるなど、同じ役割名でもファイルによって色が揺れるケースがある。それでも色数自体は「青・緑・シアン・赤・グレー」の5系統に収まっており、役割名と1対1に固定するのではなく、色ごとの修飾クラス（`.btn-control-primary` 等）を用意してファイル側で必要な組み合わせを選べるようにする。個別シミュレーション固有の配色が必要な場合は、コンポーネントクラスに加えてユーティリティクラスを併記することを妨げない。
3. **定義場所は `vite/css/tailwind.css` に `@layer components` を追記する。** 提案時点の想定（`vite/scss/common.scss`）はBootstrap時代の構成であり、TailwindCSS移行後の共通CSSエントリーポイントは `vite/css/tailwind.css`（`@import "tailwindcss";` のみ）である。現状は1ファイルで十分な規模のため新規ファイル分割は行わず、将来コンポーネントクラスが増えて可読性を損なう規模になった時点で改めてファイル分割を検討する。
4. **命名規則は、BEMではなくTailwindのコンポーネント慣習（kebab-case + 機能プレフィックス）に寄せる。** `.modal-*`（設定モーダル関連）、`.controls-*`（固定位置のボタン群コンテナ）、`.btn-control` + `.btn-control-*`（コントロールボタン本体と色修飾）のように、役割を表すプレフィックスで分類する。
5. **既に移行済みの[#483](https://github.com/Bicpema/bicpema/issues/483)・[#484](https://github.com/Bicpema/bicpema/issues/484)分は手戻りしない。** 動作確認済みの差分を今回のコンポーネントクラス化のためだけに書き換えるレビューコスト・デグレリスクを避けるため、未着手の[#485](https://github.com/Bicpema/bicpema/issues/485)〜[#489](https://github.com/Bicpema/bicpema/issues/489)から本方針を適用する。#483・#484対象のファイルは、別件の修正で該当箇所に触れる際に合わせて置き換える（強制はしない）。

### 実装例

`free-fall` 等で確立された設定モーダル・右上/左下ボタン群のクラスの組を、`vite/css/tailwind.css` に以下のように定義する。

```css
@import "tailwindcss";

@layer components {
  /* 設定モーダル本体 */
  .modal-panel {
    @apply absolute top-1/2 left-1/2 z-[2000] w-[350px] max-w-[90vw] -translate-x-1/2 -translate-y-1/2 rounded-xl border-2 border-white/30 bg-black/90 p-[30px] text-white shadow-[0_8px_32px_rgba(0,0,0,0.5)] backdrop-blur-[15px] max-[576px]:w-[300px] max-[576px]:p-5;
  }

  /* モーダル内の閉じる／小型ボタン */
  .btn-modal {
    @apply w-full rounded bg-neutral-600 px-3 py-2 text-white hover:bg-neutral-500;
  }

  /* 固定位置のボタン群コンテナ */
  .controls-left-bottom {
    @apply absolute bottom-5 left-5 z-[1000] flex flex-wrap gap-2.5 max-[576px]:bottom-2.5 max-[576px]:left-2.5 max-[576px]:gap-2;
  }
  .controls-right-top {
    @apply absolute top-5 right-5 z-[1000] max-[576px]:top-2.5 max-[576px]:right-2.5;
  }

  /* コントロールボタン本体（色は役割別の修飾クラスで指定） */
  .btn-control {
    @apply rounded-lg px-5 py-2.5 text-base font-bold whitespace-nowrap text-white shadow-[0_4px_6px_rgba(0,0,0,0.3)] transition-[transform,box-shadow] duration-200 hover:-translate-y-0.5 hover:shadow-[0_6px_8px_rgba(0,0,0,0.4)] active:translate-y-0 active:shadow-[0_2px_4px_rgba(0,0,0,0.3)] max-[576px]:px-[15px] max-[576px]:py-2 max-[576px]:text-sm max-[400px]:px-3 max-[400px]:py-1.5 max-[400px]:text-xs;
  }
  .btn-control-primary {
    @apply bg-blue-600 hover:bg-blue-500;
  }
  .btn-control-success {
    @apply bg-green-600 hover:bg-green-500;
  }
  .btn-control-info {
    @apply bg-cyan-600 hover:bg-cyan-500;
  }
  .btn-control-danger {
    @apply bg-red-600 hover:bg-red-500;
  }
  .btn-control-neutral {
    @apply bg-neutral-600 hover:bg-neutral-500;
  }
}
```

HTML側は次のようにコンポーネントクラス＋個別差分のユーティリティのみを書く。`playPauseButton` を持つファイルと `startButton`/`stopButton` の2ボタン構成のファイルとで、`resetButton` に割り当てる色修飾クラスが異なる点に注意する。

```html
<!-- playPauseButton構成（reset=primary, playPause=success） -->
<div class="controls-left-bottom">
  <button id="resetButton" class="btn-control btn-control-primary">リセット</button>
  <button id="playPauseButton" class="btn-control btn-control-success">再生</button>
</div>
<div class="controls-right-top">
  <button id="toggleModal" class="btn-control btn-control-info">設定</button>
</div>

<!-- startButton/stopButton構成（reset=neutral, doppler等） -->
<div class="controls-left-bottom">
  <button id="startButton" class="btn-control btn-control-primary">開始</button>
  <button id="stopButton" class="btn-control btn-control-danger">停止</button>
  <button id="resetButton" class="btn-control btn-control-neutral">リセット</button>
</div>
```

上記は #485〜#489 着手時の出発点であり、対象シミュレーションの実装を進める中で過不足があれば `vite/css/tailwind.css` 側のコンポーネントクラスを追加・調整してよい。
