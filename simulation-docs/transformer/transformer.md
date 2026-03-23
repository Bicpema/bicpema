# 変圧器シミュレーション 設計ドキュメント

## 概要

変圧器（トランス）の動作原理を視覚化するシミュレーション。一次コイルと二次コイルの巻数比によって電圧がどのように変化するかを、磁力線・オシロスコープ波形・電流矢印とともに表示する。

## ファイル構成

```
vite/simulations/transformer/
├── index.html
├── css/
│   └── style.css
└── js/
    ├── index.js                   # エントリーポイント
    ├── state.js                   # 共有状態管理
    ├── init.js                    # 初期化処理
    ├── logic.js                   # 描画ロジック
    ├── element-function.js        # DOM イベントハンドラ
    └── bicpema-canvas-controller.js  # キャンバスサイズ管理
```

## 画面レイアウト

```
┌─────────────────────────────────────────────────────────────────┐
│ Navbar: 位相ラジオ | 速度ラジオ | 一次コイル±ボタン | 二次コイル±ボタン │
├─────────────────────────────────────────────────────────────────┤
│  オシロスコープ1  │      変圧器・コイル・磁力線      │  オシロスコープ2  │
│  （一次電圧）     │                               │  （二次電圧）     │
│                  │  一次コイル巻数 / 二次コイル巻数  │                  │
└─────────────────────────────────────────────────────────────────┘
```

## 状態変数（state.js）

| 変数 | 型 | 初期値 | 説明 |
|------|----|--------|------|
| img1 | p5.Image | null | 変圧器本体の画像 |
| img2 | p5.Image | null | コイル横部分の画像 |
| img3 | p5.Image | null | コイル斜め部分の画像 |
| count1 | number | 19 | 一次コイル巻数-1（表示は count1+1） |
| count2 | number | 4 | 二次コイル巻数-1（表示は count2+1） |
| k | number | 5 | 波数（オシロスコープ） |
| omega | number | 1 | 角速度（速度ラジオで 1 or 5） |
| t | number | 0 | 時刻（毎フレームインクリメント） |
| phase | boolean | true | 位相（true: 同位相, false: 逆位相） |
| minCount | number | 4 | 巻数の最小値-1（表示 5） |
| maxCount | number | 19 | 巻数の最大値-1（表示 20） |
| angle | number | -20 | コイル斜め部分の傾き角度（度） |
| amp | number | 30 | 振幅（参照用） |
| topY1 | number | 0 | 一次コイル最新ループのY座標 |
| topY2 | number | 0 | 二次コイル最新ループのY座標 |

## 描画ロジック（logic.js）

### drawSimulation(p)

毎フレーム呼び出されるメイン描画関数。

1. `updateFromDOM()` で DOM ラジオボタンの値を state に反映
2. `background(255)` でクリア
3. 巻数テキスト表示（一次・二次）
4. `translate(width*0.318, 0)` して変圧器画像・磁力線・コイル描画
5. `translate(width*0.045, height*0.25)` してオシロスコープ1描画
6. `translate(width*0.773, height*0.25)` してオシロスコープ2描画
7. `state.t++` で時刻更新

### drawTransformerImage(p)

Firebase Storage から読み込んだ変圧器本体画像（img1）を描画。

### drawMagline(p)

- 青色の矩形ループで磁力線を表示
- `sin(-omega*t)` の符号で矢印の向きを切り替え（磁束の向き表現）

### drawCoil1(p) / drawCoil2(p)

- img2（横部分）と img3（斜め部分、`rotate(angle)` で傾け）を組み合わせて巻線を描画
- `count1` / `count2` の値に応じてループ数を変える
- 電流矢印（drawCurrent1 / drawCurrent2）を描画

### drawOscillo1(p)

一次電圧波形: `y = h/2 + V1 * sin(k*x - omega*t)`

### drawOscillo2(p)

二次電圧波形:
- 同位相: `y = h/2 + V2 * sin(k*x - omega*t)`
- 逆位相: `y = h/2 - V2 * sin(k*x - omega*t)`
- 振幅 V2 = V1 * (count2+1) / (count1+1)（巻数比で変圧）

## UI コントロール（index.html）

| 要素 | ID | 機能 |
|------|-----|------|
| ラジオ | name="phase" | 同位相（phasetrue）/ 逆位相（phasefalse）切替 |
| ラジオ | name="speed" | 速度 1（ゆっくり）/ 5（はやい）切替 |
| ボタン | coil1PlusBtn | 一次コイル巻数+5 |
| ボタン | coil1MinusBtn | 一次コイル巻数-5 |
| ボタン | coil2PlusBtn | 二次コイル巻数+5 |
| ボタン | coil2MinusBtn | 二次コイル巻数-5 |
| span | count1Display | 一次コイル巻数表示（count1+1） |
| span | count2Display | 二次コイル巻数表示（count2+1） |

## 画像リソース（Firebase Storage）

| 変数 | URL パス |
|------|----------|
| img1 | `public/assets/img/trans/Transformer.png` |
| img2 | `public/assets/img/trans/coil1.png` |
| img3 | `public/assets/img/trans/coil2.png` |

## キャンバス設定

- `BicpemaCanvasController(false, false, 1.0, 1.0)` — 固定比率なし、フルウィンドウ
- `angleMode(DEGREES)` 使用
- `frameRate(60)`
