# ウェーブマシン シミュレーション設計書

## 1. 概要

- 対象: ウェーブマシン（波の入射・反射・合成）を可視化する p5.js シミュレーション。
- 想定利用者: 中学〜高校の物理学習者。波の固定端反射・自由端反射の違いを体験学習する用途。
- 現在の実装 (2026-03-21):
  - `vite/simulations/wave-machine/js` 以下でモジュール化された ES Modules構造（`index.js`, `logic.js`, `state.js`, `init.js`, `element-function.js`, `medium.js`, `incident-wave.js`, `reflected-wave.js`）。
  - `index.html` にはトップナビバー、`#p5Container`、ボタンは `#decelerationButton` / `#accelerationButton` の2つのみ。
  - `BicpemaCanvasController` を利用して `p5` のフルスクリーン表示とリサイズを管理。
  - 入射波・反射波・媒質は全てオブジェクト指向で計算。

---

## 2. 画面構成

- `index.html`
  - `<nav>`: `Bicpema` リンク、タイトル「ウェーブマシン」。
  - `#p5Container` 内に `#p5Canvas` を保持。`js/index.js`から `p5` インスタンスを生成して描画領域を確保。
  - 画面左下: `#decelerationButton`（減速）と `#accelerationButton`（加速）
- CSS: `css/style.css`
  - `#p5Container` の余白と 레イアウト調整。
  - `.skip-2` に `transform: scale(-1, 1)` を付与し、加速ボタンアイコンを反転表示。
- ボタンとインタラクション
  - 減速: `element-function.js` の `onDecelerationButtonClick` で `state.speed -= 1`。
  - 加速: `onAccelerationButtonClick` で `state.speed += 1`。
  - 再生/停止ボタンは存在しない（旧設計の名残）。
- 画像要素
  - 赤ボタン: `state.button` 画像（Firebase Storage）を `imageFunction` で `x=100` に固定描画。
  - ストッパー: `state.stopper` 画像を `stopperX`/`stopperY` で動的描画、ドラッグ移動可能。
- 右クリック禁止: `body oncontextmenu="return false;"`。

---

## 3. 機能振る舞い

- 初期化 (`init.js` の `valueInit`):
  - `state.speed = 1`, `state.fixedIs = true`, `state.buttonClickedIs = true`。
  - `state.incidentWaves = []`, `state.reflectedWaves = []`。
  - `state.mediums` を `MEDIUM_QUANTITY=100` で生成、x座標は `(i * (p.width - 200)) / MEDIUM_QUANTITY`。
  - `state.stopperX`, `state.stopperY` を右端中央付近に設定。
- 波生成 (`logic.js` の `buttonFunction`):
  - `p.mouseIsPressed` + 赤ボタン領域クリック (中心 `100`, `p.height/2 + state.button.height`) で発射。
  - `incidentWaves` に 100 個の `IncidentWave(p, x, 100, state.incidentWaves.length, i, true)` を追加。
  - `reflectedWaves` に 100 個の `ReflectedWave(p, x, 100, state.reflectedWaves.length, MEDIUM_QUANTITY - i - 2, true)` を追加。
  - 1回で100点入射波/100点反射波を追加。連続クリックで重ね合わせ増加。
- 波速度調整:
  - `decelerationButton` で `speed` を -1 ずつ、`accelerationButton` で +1 ずつ変更。
  - 制約なし（負値も可能）。
- 固定端/自由端判定 (`stopperFunction`):
  - `stopperX > p.width - 100 - stopper.width` かつ `stopperY` が `p.height/2 ± stopper.height/4` なら固定端と判定:
    - 停止位置に近づけて `stopperX = p.width - stopper.width - 5 - (p.width - 200)/MEDIUM_QUANTITY`、`stopperY = p.height/2 - stopper.height/8` 固定。
    - `state.fixedIs = true`。
  - それ以外で `state.fixedIs = false`。
  - ストッパー画像をドラッグ可能（マウスがストッパー矩形内のとき移動）
- 赤ボタン押下エフェクト (`imageFunction`):
  - マウス押下中なら `tint(255,200,200,200)` を適用。
- ウィンドウリサイズ: `p.windowResized` で `canvasController.resizeScreen(p)` → `valueInit(p)`
  - 状態全リセット（波消失）。

---

## 4. 計算ロジック

- 1フレーム描画 (`drawSimulation`):
  - `p.background(100)`。
  - `state.buttonClickedIs` が真なら: `incidentWaves.calculate()`, `reflectedWaves.calculate()`, `mediums.calculate()` を順に実行。
  - `mediums.display()` を全点描画（黄色点と黒垂直線）。
  - `buttonFunction`, `stopperFunction`, `imageFunction` を呼ぶ。
- `IncidentWave.calculate` (`incident-wave.js`):
  - `if (this.number < this.time) { theta-- ただし theta>-30 } else { theta=0 }`
  - `this.time += state.speed`
  - `this.posy = (p.height / 100) * sin(radians(6 * this.theta))`
- `ReflectedWave.calculate` (`reflected-wave.js`):
  - `if (this.number < this.time - MEDIUM_QUANTITY)`:
    - `state.fixedIs` が true のとき `theta++`（上限30）
    - `state.fixedIs` が false のとき `theta--`（下限-30）
  - それ以外は `theta = 0`
  - `this.time += state.speed`
  - `this.posy = (p.height/100) * sin(radians(6 * this.theta))`
- `Medium.calculate` (`medium.js`):
  - `sum = 0`
  - `for incidentWaves`: `i % MEDIUM_QUANTITY === number` の時 `sum += incidentWaves[i].posy`
  - `for reflectedWaves`: `i % MEDIUM_QUANTITY === number` の時 `sum += reflectedWaves[i].posy`
  - `this.posy = sum`
- 表示 (`Medium.display`):
  - 媒質位置: `this.posx + 100` を基準に描画（キャンバス両端に100px余白）。
  - 垂直線: `line(this.posx + 100, this.posy + p.height/2, (number*(p.width-200))/MEDIUM_QUANTITY + 100, p.height/2)`。
  - 円: `ellipse(this.posx + 100, this.posy + p.height/2, 10, 10)`。

---

## 5. ファイル構成 (最新)

| ファイル                                               | 役割                                                 |
| ------------------------------------------------------ | ---------------------------------------------------- |
| `vite/simulations/wave-machine/index.html`             | UIレイアウト（ナビバー、p5コンテナ、ボタン）         |
| `vite/simulations/wave-machine/css/style.css`          | レイアウト・アイコン反転スタイル                     |
| `vite/simulations/wave-machine/js/index.js`            | p5初期化、preload/setup/draw/windowResizedへの橋渡し |
| `vite/simulations/wave-machine/js/state.js`            | 共有状態管理、定数                                   |
| `vite/simulations/wave-machine/js/init.js`             | 初期設定（FPS/要素選択/値初期化）                    |
| `vite/simulations/wave-machine/js/logic.js`            | 描画ループ処理とUI処理（波・ストッパー・画像）       |
| `vite/simulations/wave-machine/js/incident-wave.js`    | 入射波クラス                                         |
| `vite/simulations/wave-machine/js/reflected-wave.js`   | 反射波クラス                                         |
| `vite/simulations/wave-machine/js/medium.js`           | 媒質クラス                                           |
| `vite/simulations/wave-machine/js/element-function.js` | 各操作ボタンのイベントハンドラ                       |

---

## 6. 既知の制約（現状）

- `startButton` / `stopButton` が UIに存在しない。
- `state.buttonClickedIs` は常に `true` に設定され、停止・再開機能は未実装。
- `state.speed` に上下限なしで負値可能。負速度時は時間遅延と波挙動が逆向きに見える。
- 波生成は史上無制限で `incidentWaves` / `reflectedWaves` が増加し描画負荷が高まる。
- ウィンドウリサイズで全状態が再初期化され現在の波が消える。
- 画像が Firebase Storage 依存。このURLの途切れで表示不可になる。

---

## 7. 未確定事項 / 今後拡張

- `buttonClickedIs` を活用した再生/停止着手の優先度を検討。
- `speed` の最小/最大値制御設定（安全な 1..10 の範囲など）を追加検討。
- 反射端 `fixedIs` を可視化するUI表示（状態ラベル）を追加検討。
- 波を吐き出すたび `MEDIUM_QUANTITY` のオブジェクト生成はメモリ負荷が高い。リングバッファ化など改善余地あり。
