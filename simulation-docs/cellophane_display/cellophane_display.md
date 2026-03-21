# 偏光色を再現するシミュレーション（cellophane_display）設計書

## 1. 概要

- 対象: セロハンテープの偏光色（干渉色）をCIE等色関数ベースで計算・可視化するp5.jsシミュレーション。
- 想定利用者: 物理・光学の学習者、研究者（高校〜大学程度）。
- 確定事項:
  - 設定モーダルで偏光板配置（平行/直交ニコル）・光路差・セロハン組の追加削除ができる。
  - 1枚目・2枚目の偏光板透過後の色をRGBで計算・表示する。
  - スクリーンショットボタンで画面を保存できる。
  - 右にスペクトルグラフパネルを表示する。
- 推定事項:
  - Firebase StorageからCSVデータ（等色関数・光学系データ）を `preload` でロードする。

## 2. 画面設計

- 画面構成:
  - 上部バー（ホームアイコン、タイトル「偏光色を再現するシミュレーション」、情報アイコン）。
  - 左半分にp5キャンバス（WEBGL、セロハンテープ配置の可視化）。
  - 右半分に色表示パネル（偏光板透過前後の色）とスペクトルグラフ（Chart.js）。
  - 左下に「シミュレーションの設定」ボタン・スクリーンショットボタン。
- UI要素:
  - 設定モーダル:
    - 偏光板の重ね方選択（平行ニコル配置 / 直交ニコル配置）。
    - 光路差入力（opdInput、min=0）。
    - セロハンテープ組の追加・削除ボタン。
    - セロハンテープ組の設定（各組の枚数・角度スライダー）。
  - 色表示: 1枚目の偏光板を透過・2枚目の偏光板を透過の色ボックス。
  - グラフ: スペクトル分布グラフ（mainSpectrumGraph）。
- 確定事項:
  - 右クリックのコンテキストメニューは無効化（`oncontextmenu="return false"`）。
  - bodyは固定レイアウトでスクロール不可。
  - 再生/停止ボタンなし（インタラクティブ設定変更型）。

## 3. 機能仕様

- 設定変更時の再計算:
  - polarizerSelect変更・opdInput変更・セロハン設定変更で色を再計算し即時反映。
- セロハン組の追加:
  - 「追加」ボタンで `state.cellophaneNum` を増加し、設定UIを動的追加。
- セロハン組の削除:
  - 「削除」ボタンで `state.cellophaneNum` を減少し、設定UIを削除。
- スクリーンショット:
  - 「スクリーンショット」ボタンでキャンバスをpng保存。
- 上矢印キー:
  - 描画状態フラグ（BisDead, CisDead等）をリセットし再描画をトリガー。
- 境界条件:
  - opdInputはmin=0。
  - セロハン枚数の上限は推定（UIにより可変）。

## 4. ロジック仕様

- 実行モデル:
  - p5.jsインスタンスモード（preload/setup/draw/windowResized/keyPressed）を利用。
  - ESModule（`import`）ベースで実装。
  - WEBGLモードでキャンバス作成（p.WEBGL）。
- 状態管理:
  - cmfTable/osTable/dTable/dTableOPP/rTable: Firebase StorageからロードしたCSVテーブル。
  - cellophaneNum / cellophaneArr: セロハン組の数と各組の設定配列。
  - rBefore/gBefore/bBefore: 1枚目偏光板透過後のRGB。
  - rAfter/gAfter/bAfter: 2枚目偏光板透過後のRGB。
  - BisDead/CisDead/DrawisDead等: 分割描画の進行フラグ。
  - clusters/clusterColors/labels: k-meansクラスター分類用データ。
- 描画処理:
  - `beforeColorCalculate()` でpreload後に色計算の事前処理を実行。
  - `createStartimg()` で初期画像を生成。
  - draw内で `drawSimulation(p)` を呼び分割描画を進行。
- 計算モデル:
  - CIE等色関数（cmfTable）と光学系データ（osTable/dTable/rTable）を用いてXYZ刺激値を計算。
  - XYZ→RGB変換でセロハン透過後の色を算出。
  - k-meansクラスタリングでセロハン領域を分類（推定）。
- 推定事項:
  - `p.camera(0, 0, 300, ...)` でWEBGLカメラを正面配置し2D的に使用。

## 5. ファイル構成と責務

- vite/simulations/cellophane_display/index.html
  - 画面のDOM（上部バー、左右分割レイアウト、設定モーダル、色表示）と `js/index.js` の参照を保持。
- vite/simulations/cellophane_display/css/style.css
  - 全体レイアウト、左右分割、スクロール無効化をスタイリング。
- vite/simulations/cellophane_display/js/index.js
  - p5インスタンス起動・preload（CSVテーブル/画像ロード）・setup/draw/keyPressed/windowResizedを定義。
- vite/simulations/cellophane_display/js/state.js
  - `state` オブジェクト（テーブルデータ・RGB値・セロハン設定・描画フラグ・クラスター・Chart参照等）。
- vite/simulations/cellophane_display/js/init.js
  - `initValue(p)` で状態初期化。`elCreate(p)` でUI要素をstateに紐付けしボタンイベントをセット。
- vite/simulations/cellophane_display/js/logic.js
  - `drawSimulation(p)` で描画処理。`beforeColorCalculate()` で事前計算。`createStartimg()` で初期画像生成。
- vite/simulations/cellophane_display/js/element-function.js
  - セロハン追加・削除・設定変更ハンドラとスクリーンショット処理。
- vite/simulations/cellophane_display/js/bicpema-canvas-controller.js
  - キャンバスサイズ設定とリサイズ処理（`false, true` モードで高さ優先）。

```mermaid
flowchart TD
  A["index.html"] --> C["js/index.js"]
  A --> B["css/style.css"]
  C --> D["js/init.js"]
  C --> E["js/logic.js"]
  C --> F["js/state.js"]
  C --> G["js/element-function.js"]
  D --> F
  E --> F
  G --> F
```

## 6. 状態遷移

- 本シミュレーションは再生/停止の概念を持たず、設定変更に即時反応するインタラクティブ型。

```mermaid
flowchart TD
  S0[初期化済み（描画待機）]
  S1[色計算中（分割描画進行）]
  S2[描画完了]

  S0 -->|setup完了| S1
  S1 -->|分割描画完了| S2
  S2 -->|設定変更| S1
  S2 -->|上矢印キー| S1
```

## 7. 既知の制約

- Firebase StorageからのCSVロードに失敗すると描画が正常に行われない。
- セロハン組が増えると計算量が増大し描画が重くなる。
- WEBGLモードのため一部p5.js 2D描画関数の挙動が異なる場合がある。
- リサイズ時はキャンバスサイズのみ変更され、計算結果は保持される。

## 8. 未確定事項

- 情報アイコンの挙動（リンクやモーダル）が未実装かどうか。
- k-meansクラスタリングの詳細パラメータ（iterations, dilationSize等）の教材上の意味。
- Chart.jsのグラフ（mainChartObj/subChartObj）の切替条件。
- セロハン枚数の上限値。
