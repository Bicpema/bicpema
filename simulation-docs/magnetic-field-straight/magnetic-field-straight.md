# 直線電流の磁場 シミュレーション設計書

## 概要

直線電流が作る磁場を 3D（WEBGL）で可視化するシミュレーション。右ねじの法則に基づく磁力線の向きと、電流の方向・強さをインタラクティブに確認できる。

## ファイル構成

```
vite/simulations/magnetic-field-straight/
├── index.html
├── css/
│   └── style.css
└── js/
    ├── index.js                    # エントリーポイント
    ├── state.js                    # 共有状態管理
    ├── init.js                     # 初期化処理
    ├── element-function.js         # DOM イベントハンドラ
    ├── logic.js                    # 描画ロジック
    └── bicpema-canvas-controller.js # キャンバス制御
```

## 画面設計

### ナビバー（fixed-top）

| 要素 | 内容 |
|------|------|
| ブランド | Bicpema（リンク） |
| タイトル | 直線電流の磁場 |
| 電流スライダー | `id="currentSlider"` / range / min=-4, max=4, step=1, default=1 |
| 電流ラベル | `id="currentLabel"` / 現在値表示（例: `1.0 A`） |

### キャンバス

- WEBGL（3D）モード
- `BicpemaCanvasController(false, true, 1.0, 1.0)` でフルスクリーン生成
- カメラ初期位置: `camera(0, -300, 600, 0, 0, 0, 0, 1, 0)`
- マウスドラッグで `orbitControl()` による視点回転が可能

## 状態管理（state.js）

| プロパティ | 型 | 説明 |
|-----------|-----|------|
| `currentSlider` | DOM ref | 電流スライダー要素 |
| `currentLabel` | DOM ref | 電流値表示ラベル要素 |

## 初期化（init.js）

### `elCreate(p)`

- `#currentSlider` / `#currentLabel` を `p.select()` で取得して state に保存
- スライダーの `input` イベントに `onCurrentSliderInput` を登録

### `initValue(p)`

- 初期値は HTML 側で設定済みのため処理なし

## DOM イベント（element-function.js）

### `onCurrentSliderInput(p)`

- `state.currentSlider.value()` を読み取り
- `state.currentLabel.elt.textContent` を `"X.X A"` 形式に更新

## 描画ロジック（logic.js）

### `drawSimulation(p)`

毎フレーム呼ばれるメイン描画関数。

1. `p.background(240)`
2. `p.orbitControl()` — マウスによる視点操作
3. `currentVal` を `state.currentSlider.value()` から取得
4. `drawWire(p, currentVal)` を呼ぶ
5. `drawFieldLines(p, currentVal)` を呼ぶ

### `drawWire(p, currentVal)`

- 灰色半透明の円柱（radius=8, height=500）で導線を表現
- `|currentVal| > 0.1` のとき、オレンジ色の cone + cylinder で電流矢印をアニメーション表示
  - `yOffset = (frameCount × currentVal) % 40` で上下に流れる
  - `currentVal < 0` のとき矢印を反転（`rotateX(PI)`）

### `drawFieldLines(p, currentVal)`

- `numLines = |currentVal| × 2` 本の磁力線を描画
- 各磁力線の半径: `r = 180 - (180 / numLines) × i`
- 各磁力線に対して `drawCircle(p, r)` と `drawFlowArrow(p, r, 0, currentVal)` を呼ぶ

### `drawCircle(p, R)`

- XZ 平面上に半径 R の円を `beginShape / vertex / endShape(CLOSE)` で描画
- `theta: 0 → TWO_PI`、刻み `0.05`

### `drawFlowArrow(p, r, y, currentVal)`

- 右ねじの法則に従い、磁力線上に青い cone（radius=4, height=10）を 2 箇所配置
- `currentVal` の符号によって `directionOffset` を `+PI/2` / `-PI/2` に切り替えて矢印方向を決定

## 物理的背景

- **右ねじの法則**: 電流の向きに右ねじを進めると、ねじの回転方向が磁場の向きになる
- 電流が正（上向き）のとき: 磁力線は上から見て反時計回り
- 電流が負（下向き）のとき: 磁力線は上から見て時計回り
- 磁場の強さは電流に比例するため、電流が大きいほど磁力線の本数が増える
