# 縦波と横波 シミュレーション設計書

## 概要

縦波（疎密波）と横波の関係を可視化するシミュレーション。同じ媒質の振動を縦波表示と横波表示の両方で同時に描画し、二つの表現の対応関係を直感的に理解できるようにする。

## ファイル構成

```
vite/simulations/tate-yoko-wave/
├── index.html
├── css/
│   └── style.css
└── js/
    ├── index.js                      # エントリーポイント
    ├── state.js                      # 共有状態管理
    ├── init.js                       # 初期化処理
    ├── element-function.js           # DOM イベントハンドラ
    ├── logic.js                      # 描画ロジック
    └── bicpema-canvas-controller.js  # キャンバス管理
```

## 画面設計

### レイアウト

- **ナビゲーションバー**: 上部固定。タイトル「縦波と横波」を表示。
- **キャンバス**: ウィンドウ全体に広がる（固定比率なし）。
- **コントロールパネル**: 左下固定。スタート／ストップ・リセットボタン、速度スライダー。

### キャンバス描画エリア

| エリア | Y座標（translateY） | 内容 |
|--------|-------------------|------|
| 縦波 | height / 3 | 粒子が水平方向に変位する縦波の表示 |
| 横波 | height * 2 / 3 | 縦波の変位をY方向に変換した横波の表示 |

## 物理パラメータ

| 変数 | 値 | 説明 |
|------|----|------|
| N | 80 | 粒子数 |
| A | 40 | 振幅（px） |
| LAMBDA | 200 | 波長（px） |
| OMEGA | 0.1 | 角振動数（rad/frame） |
| k | TWO_PI / LAMBDA | 波数 |
| xStart | 60 | 波の出発点（左端 x 座標） |

## 状態管理（state.js）

```js
state = {
  particles: [],        // { x0 } の配列（平衡位置）
  k: 0,                 // 波数（setup 時に計算）
  t: 0,                 // 経過フレーム数
  running: false,       // アニメーション実行中フラグ
  focusIndex: 40,       // 注目粒子のインデックス（N/2）
  startStopButton: null,
  resetButton: null,
  timesSlider: null,
}
```

## ロジック設計（logic.js）

### displacement(x0, p)

粒子の変位を計算する。波がまだ到達していない粒子は 0 を返す。

```
v = OMEGA / k                    // 波の速さ
arrivalTime = (x0 - xStart) / v  // 到達時刻
if t <= arrivalTime → return 0
else → return -A * sin(k * (x0 - xStart) - OMEGA * t)
```

### drawLongitudinal(p)

- `translate(0, height/3)` で描画基準を移動
- 各粒子を `x = x0 + dx` の位置に赤丸で描画
- 注目粒子（focusIndex）は平衡点（青）と現在位置（赤）を大きめの丸で描画
- 波到達後は変位方向に緑の矢印を描画

### drawConvertedTransverse(p)

- `translate(0, height*2/3)` で描画基準を移動
- 縦波の変位 dx を Y 方向（-dy）に変換して横波として描画
- 連続した波形を赤い折れ線で描画
- 各粒子は `(x0, -dy)` の位置に赤丸、平衡点への垂線を描画
- 注目粒子と矢印は縦波と同様

### drawArrow(p, x1, y1, x2, y2)

始点と終点の距離が 1px 未満の場合は描画しない（ちらつき防止）。緑色の線と三角形の矢印頭を描画。

### drawAxis(p, title)

x 軸（水平線）と右矢印を描画し、左上にラベルを表示。

## UI コンポーネント

| 要素 | ID | 種別 | 説明 |
|------|-----|------|------|
| スタート／ストップ | startStopButton | button | 実行中は「ストップ」（赤）、停止中は「スタート」（青）に切り替え |
| リセット | resetButton | button | t=0 に戻しアニメーション停止 |
| 速度 | timesSlider | range (10–60, default 30) | frameRate を動的に変更 |

## キャンバス管理

`BicpemaCanvasController(false, false, 1.0, 1.0)` を使用。
- 固定比率なし（ウィンドウ全体に広がる）
- 2D キャンバス

## 依存関係

- p5.js（npm）
- Bootstrap 5（npm）
