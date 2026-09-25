# ファイル構成（シミュレーション）

`vite/` ディレクトリの構成と、各ファイルの役割を説明します。

## `vite/` のディレクトリ構成

```text
vite/
├── _build/
│   └── getHtmlInputsRecursively.js  # ビルド用ユーティリティ
├── css/
│   └── (共通 CSS ファイル)
├── ts/
│   └── (共通 TypeScript モジュール。bicpema-canvas-controller.ts など)
├── types/
│   └── assets.d.ts                  # アセット読み込み用の型定義
└── simulations/
    ├── {simulation-name}/           # 各シミュレーション（例: doppler）
    │   ├── index.html
    │   ├── css/
    │   │   └── style.css
    │   └── ts/
    │       ├── index.ts
    │       ├── state.ts
    │       ├── init.ts
    │       └── element-function.ts
    └── ...
```

## 共通ファイルの説明

### `vite/_build/getHtmlInputsRecursively.js`

`vite/simulations/` 以下の `index.html` を再帰的に収集し、Vite の `rollupOptions.input` に渡すユーティリティ関数です。

## シミュレーション内のファイル説明

### `index.html`

シミュレーションのエントリーポイントとなる HTML ファイルです。

- `./css/style.css` を `<link>` タグで読み込む（`vite-ignore` 属性付き）
- `./ts/index.ts` を `<script type="module">` で読み込む（`vite-ignore` 属性付き）
- Bootstrap のコンポーネント（モーダル・スライダー等）を HTML に記述する

### `css/style.css`

シミュレーション固有のスタイルシートです。

- `html, body { height: 100%; overflow: hidden; }` を設定してスクロールを禁止
- `#p5Container` などキャンバスを配置する要素のサイズを設定

### `ts/index.ts`

シミュレーションのメインエントリーポイントです。

- `p5` と `bootstrap` を ES モジュールとしてインポート
- `const sketch = (p) => { p.setup = ...; p.draw = ...; }; new p5(sketch);` でスケッチを定義

```js title="ts/index.ts の基本構造"
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

### `ts/state.ts`

シミュレーション全体で共有する状態（変数）を管理するファイルです。

```js title="ts/state.ts の基本構造"
export const state = {
    isPlaying: true
    // その他のシミュレーション固有の状態
};
```

### `ts/init.ts`

シミュレーションの初期化処理を担当します。  
`p.setup()` や「リセット」ボタンのコールバックから呼ばれます。

### `ts/element-function.ts`

Bootstrap コンポーネント（スライダー・ボタン等）のイベントハンドラーを定義します。  
`setup()` 内で `initElements(p)` を呼び出して登録します。

### `vite/ts/bicpema-canvas-controller.ts`

キャンバスのサイズ制御を担当するクラスです。

- `fixedAspectRatio=true`（既定値）の場合、キャンバスを 16:9 の比率に固定し、ビューポート高さに合わせてクランプする
- `p.createCanvas()` / `p.resizeCanvas()` を `p5` インスタンス（`p`）経由で呼び出す
- オプションの一覧は[シミュレーションの実装方法](./index.md#実装パターン)を参照

```js title="BicpemaCanvasController の使い方"
import { BicpemaCanvasController } from "../../../ts/bicpema-canvas-controller.js";

const controller = new BicpemaCanvasController({ fixedAspectRatio: true });

// setup() 内
controller.fullScreen(p);

// windowResized() 内
controller.resizeScreen(p);
```
