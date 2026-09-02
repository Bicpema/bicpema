# ファイル構成（シミュレーション）

`vite/` ディレクトリの構成と、各ファイルの役割を説明します。

## `vite/` のディレクトリ構成

```text
vite/
├── _build/
│   └── getHtmlInputsRecursively.js  # ビルド用ユーティリティ
├── js/
├── scss/
│   └── (共通 SCSS ファイル)
└── simulations/
    ├── {simulation-name}/           # 各シミュレーション（例: doppler）
    │   ├── index.html
    │   ├── css/
    │   │   └── style.css
    │   └── js/
    │       ├── index.js
    │       ├── state.js
    │       ├── init.js
    │       ├── element-function.js
    │       └── bicpema-canvas-controller.js
    └── ...
```

## 共通ファイルの説明

### `vite/_build/getHtmlInputsRecursively.js`

`vite/simulations/` 以下の `index.html` を再帰的に収集し、Vite の `rollupOptions.input` に渡すユーティリティ関数です。

## シミュレーション内のファイル説明

### `index.html`

シミュレーションのエントリーポイントとなる HTML ファイルです。

- `./css/style.css` を `<link>` タグで読み込む（`vite-ignore` 属性付き）
- `./js/index.js` を `<script type="module">` で読み込む（`vite-ignore` 属性付き）
- Bootstrap のコンポーネント（モーダル・スライダー等）を HTML に記述する

### `css/style.css`

シミュレーション固有のスタイルシートです。

- `html, body { height: 100%; overflow: hidden; }` を設定してスクロールを禁止
- `#p5Container` などキャンバスを配置する要素のサイズを設定

### `js/index.js`

シミュレーションのメインエントリーポイントです。

- `p5` と `bootstrap` を ES モジュールとしてインポート
- `const sketch = (p) => { p.setup = ...; p.draw = ...; }; new p5(sketch);` でスケッチを定義

```js title="js/index.js の基本構造"
import p5 from "p5";
import "bootstrap";
import { initElements } from "./element-function.js";
import { state } from "./state.js";

const sketch = (p) => {
    p.setup = () => {
        // キャンバス作成・初期化
    };

    p.draw = () => {
        // 毎フレームの描画
    };

    p.windowResized = () => {
        // ウィンドウリサイズ対応
    };
};

new p5(sketch);
```

### `js/state.js`

シミュレーション全体で共有する状態（変数）を管理するファイルです。

```js title="js/state.js の基本構造"
export const state = {
    isPlaying: true,
    // その他のシミュレーション固有の状態
};
```

### `js/init.js`

シミュレーションの初期化処理を担当します。  
`p.setup()` や「リセット」ボタンのコールバックから呼ばれます。

### `js/element-function.js`

Bootstrap コンポーネント（スライダー・ボタン等）のイベントハンドラーを定義します。  
`setup()` 内で `initElements(p)` を呼び出して登録します。

### `js/bicpema-canvas-controller.js`

キャンバスのサイズ制御を担当するクラスです。

- `fixed=true` の場合、キャンバスを 16:9 の比率に固定し、ビューポート高さに合わせてクランプする
- `p.createCanvas()` / `p.resizeCanvas()` を `p5` インスタンス（`p`）経由で呼び出す

```js title="BicpemaCanvasController の使い方"
import { BicpemaCanvasController } from "./bicpema-canvas-controller.js";

const controller = new BicpemaCanvasController({ fixed: true });

// setup() 内
controller.fullScreen(p);

// windowResized() 内
controller.resizeScreen(p);
```
