# シミュレーション実装方法

## 実装の流れ

```mermaid
flowchart TD
  A[npm run new:simulation を実行] --> B[日本語名・英語名を入力]
  B --> C[vite/simulations/シミュレーション名/ が生成される]
  C --> D[index.html / CSS / JS を実装]
  D --> E[hugo server + npm run dev で動作確認]
  E --> F[content/post/ に記事を追加]
  F --> G[PR を作成してマージ]
```

## 関連ページ

- [ファイル構成（リポジトリ全体）](./repository-files.md) — リポジトリ全体のディレクトリ構成
- [ファイル構成（シミュレーション）](./simulation-files.md) — `vite/` ディレクトリの構成

## 雛形の生成

リポジトリルートで以下を実行します。

```bash
npm run new:simulation
```

対話形式で以下を入力します。

| 項目                     | 例               |
| ------------------------ | ---------------- |
| 日本語名                 | `ドップラー効果` |
| 英語名（ハイフン区切り） | `doppler`        |

実行後、`vite/simulations/doppler/` に基本テンプレートが生成されます。

生成された `ts/index.ts` には、共通コンポーネント（`vite/ts/components/`）の使用例が含まれており、ビルドするとサンプルの矢印・点線が表示されます。

- `Arrow`（`SimComponent`）: `update()` / `draw(p)` で更新・描画する、状態を持つ矢印
- `drawDashedLine` / `drawArrowWithLabel`: 状態を持たない描画関数

実装を始める際は、`index.ts` 内の「共通コンポーネントの使用例」ブロックと `demoArrow` を削除し、必要な部品に置き換えてください。

## 実装パターン

シミュレーションには **2 つの実装パターン** がありますが、[Issue #512](https://github.com/Bicpema/bicpema/issues/512) により **パターン A（p5 インスタンスモード）に統一する方針** が決定しています。新規シミュレーションは必ずパターン A で実装してください。

パターン B（グローバルモード）はp5.jsのAPIを`window`のグローバル関数として直接定義するため、TypeScript化（[#424](https://github.com/Bicpema/bicpema/issues/424)）で導入した型チェック（`checkJs`/`.ts`）との相性が悪く、新規実装では使用しません。既存のパターン B 実装は、[#511](https://github.com/Bicpema/bicpema/issues/511) の段階移行の中でパターン A へ書き換えたうえで`.ts`化します。

### パターン A — ES モジュール + p5 インスタンスモード（標準）

採用しているシミュレーションの標準構成です。新規シミュレーションは`npm run new:simulation`が生成するひな形（`vite/_templates/simulation/`配下）がこの構成に沿っているため、そのまま実装を進めてください。

```txt
vite/simulations/{name}/
├── index.html
├── css/
│   └── style.css
└── ts/
    ├── index.ts               # エントリーポイント（p5 スケッチの定義）
    ├── init.ts                # 初期化処理
    ├── state.ts               # 共有状態の管理
    ├── logic.ts               # シミュレーションのロジック
    ├── element-function.ts    # UI コントロールのイベントハンドラー
    ├── class.ts               # クラス定義
    └── graph.ts               # グラフ描画処理
```

キャンバスサイズ制御（`BicpemaCanvasController`）やローディングスピナー制御は`vite/ts/`配下の共通モジュールとして提供されており、各シミュレーションからimportして利用します。

`index.ts` の基本構造:

```ts
import p5 from "p5";
import "../../../css/tailwind.css";
import { BicpemaCanvasController } from "../../../ts/bicpema-canvas-controller.js";
import { hideLoadingSpinner } from "../../../ts/bicpema-loading-spinner.js";
import {
    settingInit,
    elementSelectInit,
    elementPositionInit,
    valueInit
} from "./init.js";

const sketch = (p: p5) => {
    const canvasController = new BicpemaCanvasController();
    let isFirstDraw = true;

    p.setup = () => {
        canvasController.fullScreen(p);
        settingInit(p);
        elementSelectInit(p);
        elementPositionInit(p);
        valueInit(p);
    };

    p.draw = () => {
        // 毎フレームの描画処理

        if (isFirstDraw) {
            isFirstDraw = false;
            hideLoadingSpinner();
        }
    };

    p.windowResized = () => {
        canvasController.resizeScreen(p);
        elementPositionInit(p);
    };
};

new p5(sketch);
```

`BicpemaCanvasController`はオプションオブジェクトを1つ受け取ります。すべて省略可能で、既定値は標準の2D・全画面・16:9固定表示になるよう設定されています。

| オプション          | 型                       | 既定値     | 説明                                                                                                  |
| ------------------- | ------------------------ | ---------- | ----------------------------------------------------------------------------------------------------- |
| `fixedAspectRatio`  | `boolean`                | `true`     | `true`の場合、16:9比率を維持したままキャンバスを配置する。`false`の場合は利用可能領域いっぱいに広がる |
| `is3D`              | `boolean`                | `false`    | `true`の場合、WEBGLモードの3Dキャンバスを生成する                                                     |
| `widthRatio`        | `number`（`0.0`〜`1.0`） | `1.0`      | 算出した幅に対して掛け合わせる比率                                                                    |
| `heightRatio`       | `number`（`0.0`〜`1.0`） | `1.0`      | 算出した高さに対して掛け合わせる比率                                                                  |
| `panelSelector`     | `string \| null`         | `null`     | 指定した場合、そのDOM要素のサイズをウィンドウサイズの代わりに利用可能領域として使用する               |
| `bottomBarSelector` | `string \| null`         | `null`     | 指定した場合、そのDOM要素の高さ（+4px）を利用可能な高さから差し引く                                   |
| `heightMode`        | `"aspect" \| "half"`     | `"aspect"` | `"half"`の場合、アスペクト比の計算を行わず、利用可能な高さの半分をそのままキャンバスの高さにする      |

既定値以外を指定する場合は、必要なオプションのみを渡します。

```ts
// 3Dシミュレーションで、パネル要素を利用可能領域とする例
const canvasController = new BicpemaCanvasController({
    is3D: true,
    panelSelector: "#p5Canvas"
});
```

### 描画・UI部品のコンポーネント化

複数のシミュレーションで重複しがちな描画部品は、`vite/ts/components/` 配下に共通コンポーネントとして切り出します（[Issue #818](https://github.com/Bicpema/bicpema/issues/818)）。

- **共通インターフェース**: `vite/ts/components/sim-component.ts` の `SimComponent`（`update()` で状態更新、`draw(p)` で描画、`reset()` で初期状態へ戻す、`dispose()` でリソース解放）。一時停止中は `update()` を呼ばず `draw(p)` のみ呼ぶことで、[パフォーマンス方針](#パフォーマンス方針)の描画抑制に沿えます。
- **部品のまとめ管理**: `vite/ts/components/component-group.ts` の `ComponentGroup` が複数の `SimComponent` を束ね、`update()` / `draw(p)` / `reset()` / `dispose()` を一括で呼びます。コンストラクターに「一時停止中か」を返す関数を渡すと、一時停止中は `update()` をスキップして `draw(p)` のみ実行します（`new ComponentGroup(() => !isPlaying)` のように使います）。
- **設定値の反映**: 設定パネルの値は、呼び出し側（`onChange` 等のハンドラー）が部品のプロパティへ直接代入します（例: `arrow.color = ...`）。イベントバスやリアクティブ化は行いません。
- **配置場所**: 1ファイル1コンポーネント（ケバブケース）で `vite/ts/components/` に置きます。シミュレーション固有の部品は従来どおり各シミュレーションの `ts/class.ts` に置きます。
- **提供済みの部品**: 矢印（`arrow.ts`）・点線（`dashed-line.ts`）・座標系（`coordinate-system.ts`、p5非依存の物理座標とピクセルの変換）・Chart.jsのグラフ（`chart-line.ts`、[ChartLineの使い方](#chartlineの使い方)）。使用例は`npm run new:simulation`が生成するひな形の`ts/index.ts`にあります。再生・停止ボタンのバインディングは従来どおり `vite/ts/bicpema-controls-controller.ts` が担います。
- **描画状態の規約**: 部品は描画の前後で`stroke`・`strokeWeight`・`fill`・`textSize`・`textAlign`などの描画状態を呼び出し側へ残さないよう、内部で`push()`/`pop()`により閉じます。呼び出し側は、部品の描画後に前の描画状態へ依存せず、必要な`stroke`/`fill`を自分で設定してください（例: 矢印の後にテキストを描く場合は`fill`を明示する）。
- **関数とクラスの選び方**: 関数は、引数だけで描画が決まり、フレームをまたいで保持すべき状態がない場合に使います。クラスは、座標や色などを保持して更新・再描画する場合に使います。どちらの場合も上記の描画状態の規約に従います。
- **既存シミュレーションの移行**: 一括移行はせず、修正するタイミングで段階的に移行します。移行済み: `force-decomposition` / `slope-force-decomposition` / `force-composition` / `archimedes-principle` / `three-force-equilibrium` / `velocity-composition` / `tate-yoko-wave`（矢印）。
- **Storybook**: UI部品の確認用に導入しています（`@storybook/html-vite`）。`npm run storybook` で起動し（`http://localhost:6006`）、`npm run build:storybook` で静的ビルドします。設定は `.storybook/`、storiesはシミュレーションのビルド対象（`vite/`）に混ざらないよう、リポジトリ直下の `stories/` に `*.stories.js` として置きます。
    - `.storybook/preview.js` で `vite/css/tailwind.css` を読み込み、本番と同じ見た目で確認できます。
    - `.storybook/main.js` の `viteFinal` で、Viteのroot（`./vite`）をリポジトリ直下に戻し、Tailwindのプラグインを追加しています。
    - storiesから `?bicpema` 付きでimportしたHTML（例: `import html from "./settings-modal.html?bicpema"`）は、`<bicpema-*>` タグがシミュレーションのビルドと同じ処理で展開されます。
    - 現在のstoriesは再生・リセットボタン、設定ボタン・設定モーダル、ナビバー、ローディングスピナー、フォーム部品、矢印（`Arrow`）、点線、グリッド、グラフ枠（`drawPlotArea`）です。追加手順は[コンポーネント追加手順](#コンポーネント追加手順)を参照してください。p5を使うstoryは `stories/p5-decorator.js` の `createP5Story()` で作成してください。storyの切り替え（要素の取り外し）時に `p.remove()` で後始末されます。
    - CIは `.github/workflows/storybook.yml` でパスフィルター付きのビルド検査を行います。

#### 重複している部品の候補一覧

`vite/simulations/`（45件）を調査した、重複部品の候補です（[Issue #819](https://github.com/Bicpema/bicpema/issues/819)、2026-10-17時点）。切り出しは、この一覧を元に後続Issueで優先度の高いものから進めます。一覧は切り出しや移行が進むたびに更新してください。

| 部品                         | 重複の状況                                                                                                                                                                                                                                                                    | 切り出し先（案）                                                                          | 状態                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| ---------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 矢印                         | `drawArrow`を独自定義していた7件（`archimedes-principle` / `three-force-equilibrium` / `velocity-composition` / `force-composition` / `tate-yoko-wave` / `slope-force-decomposition` / `force-decomposition`）は、ラッパーを除去して共通の`drawArrow`を直接呼ぶ形に移行済み   | `components/arrow.ts`                                                                     | 提供済み。`force-decomposition`・`slope-force-decomposition`・`force-composition`・`archimedes-principle`・`three-force-equilibrium`・`velocity-composition`・`tate-yoko-wave`は移行済み                                                                                                                                                                                                                                                                                           |
| 矢印（用途別の派生）         | `drawArrowWithLabel`（`velocity-composition` / `force-composition`）、`drawForceArrow`（`cart-work-ruler` / `force-and-acceleration`）、`drawFlowArrow`（`magnetic-field-straight`）、`arrow`（`normal-force`）など                                                           | `components/arrow.ts`にラベル付きの描画を追加し、派生は共通の矢印を呼ぶ形にする           | `drawArrowWithLabel`を提供済み。`force-composition`は共通の関数を直接呼ぶ形に移行済み（`velocity-composition`のラベル付き矢印は背景付きの独自ラベルのため`drawVelocityArrow`として残している）。`cart-work-ruler`（`drawForceArrow`）も移行済み。残すもの: `force-and-acceleration`（線を矢印の頭の手前で止める・太さ5で、共通の矢印だと先端がはみ出して見た目が変わる）、`magnetic-field-straight`（WEBGLの円錐で描く3D矢印）、`normal-force`（斜面の角度に応じた頭だけの三角形） |
| グラフ（Chart.js）           | `ts/graph.ts`を持つ: `cellophane` / `cellophane-color-2` / `free-fall` / `slope-cart-motion` / `train-acceleration` / `uniformly-accelerated-linear-motion` / `vertical-throw-down`。Chart.js利用は他にも`spring` / `uniform-linear-motion` / `cellophane-color-2d-animation` | `components/`配下にChart.jsのグラフを生成・更新する部品                                   | 未着手（等加速度運動系の`graph.ts`が近い構造のため、先に差分を確認する）                                                                                                                                                                                                                                                                                                                                                                                                           |
| グラフ（p5描画）             | `drawGraph`を独自定義: `cellophane-color-2` / `cellophane-color-2d-animation` / `elastic-force` / `conservation-of-heat-and-specific-heat` / `visualization-of-heat-transfer`                                                                                                 | 上記Chart.js版と統合できるか、軸・目盛りの描画を別部品にするかを後続Issueで判断する       | 提供済み（`components/plot-area.ts`の`drawPlotArea`。シミュレーションの移行は未着手）                                                                                                                                                                                                                                                                                                                                                                                              |
| 座標軸・グリッド             | `drawGrid`・`drawAxes`（いずれも移行済み。独自定義は`check:duplicate-components`で検出）                                                                                                                                                                                      | `components/coordinate-system.ts`（座標変換）→ `components/grid.ts`・`components/axes.ts` | `CoordinateSystem`（原点・スケール・Y軸反転・原点基準のグリッド値）と、それを使う`drawGrid`（`grid.ts`）を提供済み。`wave-reflection`・`standing-wave`・`force-composition`・`oscilloscope`・`force-decomposition`の`drawGrid`も移行済み。`axes.ts`（`drawAxes`）も提供済みで、`force-decomposition`・`force-composition`・`half-life`・`tate-yoko-wave`は軸を移行済み                                                                                                             |
| 点線                         | `drawDashed`: `force-decomposition` / `slope-force-decomposition`（同一実装）。同様の処理: `force-composition` / `lens` / `normal-force`                                                                                                                                      | `components/dashed-line.ts`                                                               | 提供済み。`force-decomposition`・`slope-force-decomposition`・`force-composition`・`lens`は移行済み。`normal-force`は一点鎖線（`[10, 5, 2, 5]`）で、`drawDashedLine`の等間隔の点線では表現できないため残す                                                                                                                                                                                                                                                                         |
| 再生・停止・リセットボタン   | 全件が`bindToggleControls` / `bindStartStopControls`を利用済み（リセットボタンのみのシミュレーションは`bindResetControl`）                                                                                                                                                    | 既存の`bicpema-controls-controller.ts`を継続（クラス化は不要）                            | 移行済み                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| ボタンのマークアップ         | 再生・リセットボタンのHTML（Tailwindクラス）が各`index.html`にコピーされている                                                                                                                                                                                                | `<bicpema-*>`タグ（`vite/_build/bicpemaComponents.js`）として共通化する案                 | 調査済み。共通化しない（[判断](#再生リセットボタンのマークアップの共通化判断)を参照）                                                                                                                                                                                                                                                                                                                                                                                              |
| 初期化・イベントハンドラー群 | `drawSimulation`（30件）、`elCreate`（29件）、`initValue`（27件）、`settingInit`（15件）、`onReset`（13件）、`onPlayPause`（11件）などが同名で各シミュレーションに存在する                                                                                                    | 中身はシミュレーション固有のため、共通化の対象外（ひな形の構成で揃っている）              | 対象外                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |

#### 再生・リセットボタンのマークアップの共通化判断

[Issue #848](https://github.com/Bicpema/bicpema/issues/848)（2026-10-17時点）の調査結果です。`vite/simulations/`（45件）のうち、リセットボタンを持つのは27件です。

| 観点   | 調査結果                                                                                                                                                                                                                                                       |
| ------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| ID     | リセットは`resetButton`（22件）・`resetBtn`（4件）・`restartButton`（1件）。再生は`playPauseButton`（13件）・`startButton` / `stopButton`（各4件）・`playButton`（2件）・`toggleBtn`（1件）で、`bindToggleControls`等のセレクタ指定で吸収している              |
| 個数   | リセットのみの1個（`archimedes-principle`など）、再生とリセットの2個、開始・停止・リセットの3個（`doppler` / `pendulum` / `oscilloscope` / `spring`）が混在する                                                                                                |
| 配置   | 左下の`absolute bottom-5 left-5 z-[1000] flex flex-wrap gap-2.5`（約15件）が最多。ほかに`bottom-0 start-0 m-3`系、`bottom-0 end-0`（`pendulum`は右下）、`m-1`、コンテナなし（`heat-engine` / `uniform-linear-motion`など約10件は設定パネル内などに配置）がある |
| クラス | 色（`neutral` / `green` / `blue` / `red`）・余白（`m-1` / `mr-2`）・サイズ（`px-3 py-2`と`px-5 py-2.5`など）が異なり、ボタンのクラス文字列だけでリセット6種・再生5種以上ある。ラベルも「リセット」以外が混在する                                               |

`bicpemaComponents.js`の`<bicpema-*>`タグは、ナビバー・スピナー・設定ボタンなど、全シミュレーションでほぼ同一の構造と配置を持つ部品を、ビルド時に展開する仕組みです。属性で変えられるのは`variant`・`panel-class`などごく一部で、中身（設定項目）はタグの子要素として渡します。

判断は**共通化しない**（現状維持）とします。理由は以下のとおりです。

- 配置・個数・ID・色・ラベルの差異が大きく、タグ化するには属性やスロットが多くなる。差異を属性で吸収すると、手書きのTailwindクラスより読みにくくなる
- 挙動の共通化は`bicpema-controls-controller.ts`（`bindToggleControls` / `bindStartStopControls`）で済んでおり、`stories/play-controls.stories.js`もこれを使って確認できている。マークアップ側はセレクタで差異を吸収できている
- 見た目を統一する目的なら、タグ化よりも`vite/css/tailwind.css`の`@layer components`にボタンのクラス（例: `.btn-play`・`.btn-reset`）を追加するほうが、既存の手書きのIDや配置を保てて移行の影響範囲も小さい
- 手書きの検出（`npm run check:template-compliance`）は、配置・IDが多様なため誤検出が多くなり、現状では費用に見合わない

見た目の統一が必要になった場合は、`@layer components`へのクラス追加を先に検討してください。

#### グラフ描画の共通コンポーネント化の設計（推奨案）

[Issue #847](https://github.com/Bicpema/bicpema/issues/847) で `graph.ts` / `drawGraph` の差分を調査した結果と、推奨する設計です。実装は後続Issueで行います。

**調査結果**

- Chart.js版は、`getCanvasElement` → `createLazyImporter`（遅延読み込み）→ `new Chart(ctx, { type: "scatter" | "line", ... })` の骨格が共通です。差分は主に次の4点です。
    - 描画方式: `free-fall` / `uniformly-accelerated-linear-motion` / `slope-cart-motion` / `train-acceleration` / `cellophane-color-2` は更新のたびに `destroy()` して作り直す方式、`vertical-throw-down` は `Chart` を使い回して `data` と `scales.*.max` だけを更新する方式（`update("none")`）です。
    - 軸: `free-fall` は左右2軸（`y` と `y1`）、`vertical-throw-down` は v-t / y-t の2つのcanvas、他は1軸です。
    - 軸の最大値: 実データの最大値に倍率（1.05〜1.2）や余白（0.5秒）を掛けるルールが、シミュレーションごとに少しずつ異なります。
    - 固定の見た目: 凡例・タイトル・フォントサイズ・`animation: false`・`maintainAspectRatio: false` はほぼ同じです。
- 参考に `cellophane` は `line` 型で2つのグラフ、`spring` は `line` 型でばね1・ばね2の2つのグラフ（`logic.ts` 内に定義）を持ち、`graph.ts` の構造とは異なります。
- p5版の `drawGraph` のうち `cellophane-color-2` / `cellophane-color-2d-animation` は、実際にはp5ではなくChart.js（スペクトル）の描画です。p5で描いているのは `elastic-force`（直線 F = kx、固定レンジ±50）と、`conservation-of-heat-and-specific-heat` / `visualization-of-heat-transfer`（温度の時間変化）の3件のみです。
- p5版は背景矩形・グリッド・軸・目盛り・凡例・データ線を直接ピクセル座標で書いており、座標変換（`p.map` や `pxPerCm`）と軸・グリッドの描画がグラフごとに重複しています。これは `CoordinateSystem`・`drawGrid`・`drawAxes` で置き換えられる範囲です。

**採用する設計**

1. Chart.js版とp5版は統合しません。描画エンジン・更新方法・サイズ指定が異なり、1つのインターフェースにするとオプションが肥大化するためです。
1. Chart.js版は `components/chart-line.ts`（仮称）に切り出します。
    - 形: 状態を持つためクラス（`ChartLine`）とします。コンストラクターで canvas の ID・`type`・軸設定（軸ID・タイトル・色・初期の最大値）・データセット設定（ラベル・色・データ配列の参照）を受け取ります。
    - メソッド: `setData` 相当は不要で、データ配列を参照渡しにして `update()` で `data` の再設定と `scales.*.max` の自動調整（実データの最大値 × 倍率）を行います。`draw(p)` は何もしません（Chart.js自身が描画するため）。`reset()` でデータを空に戻し、`dispose()` で `destroy()` します。
    - `update()` は `chart.update("none")` を使い、`destroy()` → 再生成はしません（`vertical-throw-down` の方式に揃え、毎フレームの生成物を避ける[パフォーマンス方針](#パフォーマンス方針)に合わせます）。
    - 遅延読み込みは `createLazyImporter` を内部で使い、失敗後に再試行しないフラグも部品側で持ちます。
    - `SimComponent` に載せます。ただし Chart.js は p5 の描画ループの外で描くため、`draw(p)` は空とし、`ComponentGroup` へ入れるかは任意です（一時停止中の `update()` 抑制を一括管理したいときに入れます）。
    - 2軸（`free-fall`）は軸設定を複数渡せる形で対応し、v-t / y-t のように複数canvasが必要な場合は、`ChartLine` を2つ生成して扱います。
1. p5版は、まず `CoordinateSystem`・`drawGrid`・`drawAxes`（提供済み）への移行を優先します。グラフ特有の部分だけを `components/plot-area.ts`（仮称）として関数で切り出します。
    - 範囲: 背景矩形、目盛りの値ラベル、軸ラベル、凡例、折れ線（`drawPolyline` 相当）。
    - 形: 状態を持たない関数（`drawPlotArea(p, cs, style)` など）とし、`SimComponent` には載せません。データ点の配列を受け取って線を引くだけで、毎フレームの更新は呼び出し側のシミュレーションが行います。
1. 軸・目盛りは別部品として扱います（上記のとおり `axes.ts` / `grid.ts` を再利用）。Chart.js版は軸をChart.js自身が描くため、軸の共通化はp5版のみが対象です。

**移行順の推奨**: 等加速度運動系（`free-fall` / `uniformly-accelerated-linear-motion` / `vertical-throw-down` / `slope-cart-motion` / `train-acceleration`）→ `cellophane-color-2` など → p5版（`elastic-force` → 温度グラフ2件）の順に、各部品のPRで1件以上を移行します。

#### drawPlotArea の使い方

`components/plot-area.ts` は、p5版グラフの共通部分を状態を持たない関数として提供します（[Issue #858](https://github.com/Bicpema/bicpema/issues/858)）。`SimComponent` には載せず、データの更新は呼び出し側が毎フレーム行います。

- `drawPlotArea(p, cs, style)`: 背景矩形 → グリッド → 折れ線 → 軸線 → 目盛りの値ラベル → 軸タイトル・グラフタイトル → 凡例の順に重ねて描画します。座標変換は `CoordinateSystem`、グリッドは `drawGrid` を使います。
- `drawPolyline(p, cs, points, color, weight)`: 物理座標の点列を折れ線で描画します。`drawPlotArea` の `series` を使わず単体でも呼べます。
- `style.bounds` 以外はすべて省略可能です。`gridStepX` / `gridStepY` / `axisLine` / `ticks` / `labels` / `legend` は、指定したものだけ描画します。
- 矢印付きの軸が必要な場合は、`drawPlotArea` の後に `drawAxes` を呼びます。
- 描画状態は `push()` / `pop()` で閉じており、呼び出し側へ残しません。

```ts
import { CoordinateSystem } from "../../../ts/components/coordinate-system.js";
import { drawPlotArea } from "../../../ts/components/plot-area.js";

// 枠の中心を原点にして x: ±50 cm, y: ±50 N を枠いっぱいに対応させる
const bounds = { left: 60, top: 40, right: 380, bottom: 280 };
const cs = new CoordinateSystem({
    originX: 220,
    originY: 160,
    scaleX: 160 / 50,
    scaleY: 120 / 50
});

drawPlotArea(p, cs, {
    bounds,
    gridStepX: 10,
    gridStepY: 10,
    series: [
        {
            points: [
                { x: -50, y: -50 },
                { x: 50, y: 50 }
            ],
            color: p.color(30, 100, 220),
            weight: 2.5,
            label: "F = kx"
        }
    ],
    axisLine: {},
    ticks: { stepX: 10, stepY: 10 },
    labels: { xTitle: "x (cm)", yTitle: "F (N)", title: "フックの法則" },
    legend: {}
});
```

#### ChartLineの使い方

`vite/ts/components/chart-line.ts` の `ChartLine` は、Chart.jsの折れ線・散布図を扱う `SimComponent` です（[Issue #855](https://github.com/Bicpema/bicpema/issues/855)）。

- コンストラクターに canvas の ID（`canvasId`）・`type`（`scatter` / `line`、省略時は `scatter`）・軸設定（`axes`、複数軸可）・データセット設定（`datasets`）を渡します。`title`・`showLegend` も指定できます。
- データ配列は参照渡しです。シミュレーション側で配列へ点を追加し、`update()` を呼ぶと `data` と `scales.*.max` だけを更新して `chart.update("none")` を呼びます（`destroy()` による再生成はしません）。
- 軸に `maxRatio` を指定すると、`update()` のたびに最大値を「実データの最大値 × `maxRatio`」へ自動調整します（下限は `minMax`、省略時は初期の `max`）。2軸の場合は、データセットの `yAxisID` が一致する軸だけで最大値を求めます。
- Chart.jsは `createLazyImporter` で遅延読み込みします。初回の `update()` で読み込みを始め、完了後にチャートを生成します。読み込みに失敗した場合は再試行せず、ログのみ出力します。
- `reset()` はデータ配列を空にして軸の最大値を初期値へ戻し、`dispose()` はチャートを `destroy()` します。`draw(p)` は何もしません（Chart.js自身が描画するため）。
- v-t / y-t のように複数の canvas が必要な場合は、`ChartLine` を canvas ごとに生成します。

```ts
const vtGraph = new ChartLine({
    canvasId: "vtCanvas",
    title: "v-t グラフ",
    axes: [
        { id: "x", direction: "x", title: "時間 t [s]", max: 5 },
        {
            id: "y",
            direction: "y",
            title: "速度 v [m/s]",
            color: "rgb(220, 60, 60)",
            max: 10,
            maxRatio: 1.2
        }
    ],
    datasets: [
        { label: "速度 v (m/s)", color: "rgb(220, 60, 60)", data: vtData }
    ]
});
// 毎フレーム（再生中のみ）
vtGraph.update();
```

#### 重複定義の検査

`npm run check:duplicate-components`（CIの`check-duplicate-components.yml`でも実行）が、`vite/simulations/` 内で `drawArrow` / `drawArrowWithLabel` / `drawDashed` / `drawDashedLine` を独自に定義していないかを検査します。未移行の既存分は `scripts/duplicate-components-allowlist.json` に `シミュレーション名:関数名` 形式で登録します（現在は全件移行済みで空です）。新しい重複はCIで失敗し、移行して解消済みなのに許可リストへ残っているエントリも失敗するため、移行時は許可リストから削除してください。検査対象の関数名を増やす場合は `scripts/_lib/checkDuplicateComponents.js` の `COMPONENT_FUNCTION_NAMES` に追加します。

優先度は、重複数と実装の同一性から、矢印の派生 → 点線 → 座標軸・グリッド → グラフの順を推奨します。

### パターン B — グローバルモード（旧実装・移行対象）

古いシミュレーションで採用していた構成です。新規作成では使用せず、既存実装は順次パターン A へ移行します。

```txt
vite/simulations/{name}/
├── index.html
├── style.css
└── sketch.js    # p5 グローバルモードのスケッチ
```

## 実装上の注意

- スクロールが発生しないよう、`html, body { overflow: hidden; height: 100%; }` を設定する
- ナビバー・ローディングスピナー・設定ボタン・設定モーダルの外枠は、マークアップを手書きせず[共通UIコンポーネント](#共通uiコンポーネント)の `<bicpema-*>` タグで記述する
- 設定モーダル・操作ボタン・フォーム部品などシミュレーション間で共通のUIパーツは、ユーティリティクラスを個別に並べる前に `vite/css/tailwind.css` の `@layer components`（`.modal-panel` / `.btn-settings-modal-open` / `.form-control` 等）に既存のコンポーネントクラスがないか確認し、再利用する
- 再生・停止ボタンは左下に配置する
- 設定表示ボタンは右上に配置する
- 重いファイル（フォント、画像等）は [Firebase Storage](https://console.firebase.google.com/project/bicpema/storage) にアップロードし、URL で参照する
- 既存シミュレーションのフォルダー名（URL）を変更する場合は、`firebase.json` に旧URLからのリダイレクトを必ず追加する（[掲載URLの維持とリダイレクト](../development-flow.md#掲載urlの維持とリダイレクト)）
- フォントは `setup()` 内で `loadFont()` を使って非同期ロードし、Firebase Storage が到達不能でもスケッチ起動をブロックしないようにする
- `.ts` ファイルのドキュメントコメントは [TSDoc](https://tsdoc.org/) 記法で書く。`npm run lint` の `tsdoc/syntax` ルールで検査される
    - 型はTypeScriptの型注釈で表すため、`@param {number} x` のような `{型}` は書かず、`@param x - 説明` の形式にする
    - 戻り値は `@returns 説明` と書く（`{型}` は書かない）。`@type` / `@constructor` などJSDoc固有のタグは使わない
    - オブジェクト引数のプロパティは `@param params.t` とせず、親の `@param` の説明に ``- `t`: 説明`` の箇条書きで記載する
    - 省略可能な引数の既定値は `[fps=60]` とせず、説明に「（省略時: 60）」と記載する
    - 本文中の `@` `<` `>` `{` `}` はTSDocの構文と解釈されるため、`` `@types/p5` `` のようにコードスパンで囲む
- `.ts` ファイルでは、以下の宣言にドキュメントコメント（`/** */`）を必ず書く。`npm run lint` の `jsdoc-js/require-jsdoc` ルール（`eslint-plugin-jsdoc` の `require-jsdoc`）で検査される
    - 関数: 関数宣言（`function f() {}`）と、変数・プロパティに代入するアロー関数・関数式（`const sketch = (p: p5) => {}`、`p.setup = () => {}`、`{ onReset: () => {} }`、関数内のローカルな補助関数など）
    - メソッド: クラスのメソッド（`constructor`・getter・setter、クラスのプロパティに代入したアロー関数を含む）と、interface・型定義のメソッドシグネチャ（`option(value: string): unknown;`）
    - クラス宣言
    - `export` の有無は問わない。他の関数の引数として直接渡すコールバック（`arr.map((x) => x * 2)`、`addEventListener("click", () => {})` など）は対象外

## 共通UIコンポーネント

シミュレーション間で共通のUIパーツは、`index.html` に `<bicpema-*>` タグで記述します。タグはビルド時に Vite プラグイン（`vite/_build/bicpemaComponents.js`）が共通のマークアップへ展開するため、DOM構造やスタイルを変更する場合は同ファイルを修正するだけで全シミュレーションに反映されます。

| タグ                                                  | 展開後                                                                                        | 属性（省略可）                                                                                                          |
| ----------------------------------------------------- | --------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| `<bicpema-nav-bar></bicpema-nav-bar>`                 | ページ上部のナビバー（`#navBar`）                                                             | `title`: 表示するタイトル（省略時は `<title>` の内容）                                                                  |
| `<bicpema-loading-spinner></bicpema-loading-spinner>` | ローディングスピナー（`#loadingSpinner`）                                                     | なし                                                                                                                    |
| `<bicpema-settings-button></bicpema-settings-button>` | 設定モーダルを開くボタン（`.settings-modal-open`）                                            | `id`: ボタンのid、`class`: ラッパーの配置クラス（省略時は右上）                                                         |
| `<bicpema-settings-modal>…</bicpema-settings-modal>`  | 設定モーダルの外枠（見出し・閉じるボタン）。タグの中身を設定項目として差し込む                | `id`（既定: `simulationSettingModal`）、`title`（既定: `シミュレーションの設定`）、`variant`、`panel-class`（下記参照） |
| `<bicpema-icon name="camera"></bicpema-icon>`         | [Bootstrap Icons](https://icons.getbootstrap.com/) のSVGアイコン（`aria-hidden="true"` 付き） | `name`: アイコン名（必須）、`size`: 幅・高さのpx（既定: `16`）、`class`: 追加するクラス                                 |

- 閉じタグは省略できません。未知のタグ名や展開できないタグがあるとビルドエラーになります
- HTMLコメント内のタグは展開されません（コメントアウトした利用例をそのまま残せます）
- 開閉などの振る舞いは従来どおり `initModal()`（`vite/ts/bicpema-modal-controller.ts`）・`hideLoadingSpinner()`（`vite/ts/bicpema-loading-spinner.ts`）が担います
- 実行時にJSで挿入せずビルド時に展開するのは、ローディングスピナーをJSバンドル読み込み前から表示し、`#navBar` の高さを `BicpemaCanvasController` の初期化前に確定させるためです
- `npm run dev`（`vite build --watch`）の実行中に `vite/_build/bicpemaComponents.js` を変更した場合は、変更を反映するため `npm run dev` を再起動してください
- `<bicpema-settings-modal>` の `variant` は `light`（既定。背景を暗くした白いモーダル）と `dark`（`.modal-panel` の暗色パネル。背景を暗くせず、設定を変えながらシミュレーションを見られる）から選びます
- `<bicpema-settings-modal>` の `panel-class` にはパネルの幅を指定します。`light` では既定の `w-full max-w-lg` を置き換え、`dark` では `.modal-panel` の幅を上書きします（例: `panel-class="w-[340px] max-[576px]:w-[290px]"`）
- 閉じるボタンは `id` を持たないため、`initModal()` の `closeSelectors` には `#<モーダルのid> .modal-close` を指定します
- ナビバーの左端には解説ページへ戻るボタン（`#navBackButton`）が表示されます。戻り先はビルド時に `content/post/*/index.md` 内の `/vite/simulations/<名前>/` へのリンクから決まり、リンクしている記事がない場合はトップページになります
    - 直前のページが戻り先の解説ページの場合は履歴を1つ戻り（記事のスクロール位置を保つ）、教科書のQRコード等から直接開いた場合は戻り先へ遷移します
    - 記事のリンクを追加・変更した場合は、`npm run build` で再ビルドすると戻り先に反映されます
- アイコンは `<svg>` をべた書きせず `<bicpema-icon>` で記述します（例: `<bicpema-icon name="camera" size="20" class="pb-1"></bicpema-icon>`）。アイコン名は [Bootstrap Icons](https://icons.getbootstrap.com/) の一覧で確認でき、存在しない名前を指定するとビルドエラーになります。SVGはビルド時に `bootstrap-icons` パッケージ（`devDependencies`）から読み込みます
- `<bicpema-settings-modal>` の中身など、他の `<bicpema-*>` タグの内側に書いた `<bicpema-icon>` も展開されます
- アイコンは装飾扱い（`aria-hidden="true"`）のため、アイコンのみのボタンにはボタン側に `aria-label` を付与してください
- ナビバー・ローディングスピナー・設定ボタン（`.settings-modal-open` / `.btn-settings-modal-open`）・設定モーダル（`.modal-panel` / `.modal-close`）を手書きしている場合、Bootstrap IconsのSVG（`class="bi bi-..."`）をべた書きしている場合、`npm run check:template-compliance` がエラーにします。データ登録用など設定以外の目的のモーダルを手書きする場合は、`scripts/template-compliance-allowlist.js` の `NON_SETTINGS_MODAL_SLUGS` に追加してください

## パフォーマンス方針

[Issue #406](https://github.com/Bicpema/bicpema/issues/406) の調査で、`frameRate`・`pixelDensity`の扱いがシミュレーションごとにバラバラで、不要な描画・計算負荷につながっていることが分かりました。新規実装・既存実装の改善では以下の方針に従ってください。

### frameRate

- 動きが連続的な物理アニメーション（自由落下・振り子・波動など、ほとんどのシミュレーション）は **60fps** を標準とします。
- 温度変化やグラフの推移など、変化がゆっくりで60fpsの滑らかさが不要な場合に限り、**20〜30fps** への引き下げを許容します。その場合は該当箇所にコメントで理由を残してください（例: `conservation-of-heat-and-specific-heat/ts/init.ts`）。
- `p.frameRate(...)` は **`setup()`内で一度だけ** 呼び出してください。`draw()`内で毎フレーム呼び出すと無駄な処理になるうえ、他の設定を意図せず上書きする原因になります。
- フレームレートの値は他のロジックからも参照できるよう、マジックナンバーではなく`FPS`のような名前付き定数として定義してください。

### pixelDensity

- 高DPI環境（`displayDensity()`が3以上の端末等）でそのまま追従すると、キャンバスの実ピクセル数が過大になり描画負荷が急増します。
- `BicpemaCanvasController.fullScreen(p)`を使うシミュレーション（標準構成）では、内部で自動的に`p.pixelDensity(Math.min(p.displayDensity(), 2))`が適用されるため、個別対応は不要です。
- `BicpemaCanvasController`を使わず独自に`p.createCanvas(...)`するシミュレーション（レガシー実装等）では、同様の上限を自前で設定してください。

### 一時停止・アイドル時の負荷削減

- 一時停止中や、開始前の待機状態でも`draw()`は呼ばれ続けます。動きが止まっている間は物理演算や重い再描画を省略できないか検討してください。
- 入力欄の値をライブ反映する目的などで、`draw()`内で状態を作り直す実装が散見されますが、`new`によるオブジェクトの再生成は避け、既存インスタンスのフィールド更新に留めてください（例: `projectile-motion/ts/logic.ts`の待機状態描画）。
- 完全に静止させられる場面（グラフや説明パネルのみを表示する等）では`p.noLoop()` / `p.loop()`の利用も検討してください。

### 毎フレームの生成物を避ける

- 配列・オブジェクト・画像・フォント・`p.createGraphics()`によるオフスクリーンキャンバスなどは、可能な限り`preload()`/`setup()`で一度だけ生成し、`draw()`内での再生成は避けてください。
- リサイズなどキャンバスサイズに依存する生成物は、`windowResized`のタイミングでのみ再生成してください。

### 計測方法

代表シミュレーションの実効frameRateとJSヒープ使用量は、以下のコマンドで計測できます。

```bash
npm run build
npm run benchmark:performance -- --filter=free-fall,projectile-motion
```

`--device-scale=3`のように`deviceScaleFactor`を上げると、高DPI環境を模したcanvasの実ピクセルサイズ（pixelDensityの上限が効いているか）も確認できます。

なお、ペイント頻度は`requestAnimationFrame`ベースで計測しているため、`p.frameRate(...)`で間引いているシミュレーションでは実際の`draw()`実行頻度より高い値が出ます（p5内部では間引き中も画面更新のたびに`requestAnimationFrame`は呼ばれ続けるため）。低frameRateの効果を確認したい場合は、JSヒープ使用量の推移など他の指標と合わせて判断してください。

## コンポーネント追加手順

共通の描画部品を `vite/ts/components/` に追加するときの手順です（[Issue #833](https://github.com/Bicpema/bicpema/issues/833)）。背景は[描画・UI部品のコンポーネント化](#描画ui部品のコンポーネント化)を参照してください。

### 1. 切り出す対象を決める

- 2つ以上のシミュレーションで同じ実装が重複しているものを対象にします（候補は[重複している部品の候補一覧](#重複している部品の候補一覧)）。1つのシミュレーションでしか使わない部品は、そのシミュレーションの `ts/class.ts` に置きます。
- 中身がシミュレーション固有のもの（`drawSimulation` / `settingInit` など）は共通化の対象外です。

### 2. 命名と種類を決める

- ファイル名は半角英小文字・数字のケバブケース（例: `grid-lines.ts`）で、1ファイル1コンポーネントとします。
- 状態を持たない描画は関数にします。関数名は `draw` + パスカルケース（例: `drawGridLines`）、オプションは `<パスカルケース>Style` 型の最終引数にまとめます。
- 毎フレーム状態を更新する部品はクラスにします。クラス名はパスカルケース（例: `GridLines`）で、`update()`（状態の更新）と `draw(p)`（描画のみ。状態は変更しない）を持たせ、`SimComponent`（`sim-component.ts`）と互換な形にします。一時停止中は `update()` を呼ばず `draw(p)` だけを呼びます。
- p5はインスタンスモードで扱い、引数 `p` として受け取ります（グローバルの `p5` 関数は使いません）。描画後に変わる `stroke` / `fill` などの状態は、TSDocに明記します。

### 3. ひな形を生成する

```bash
npm run new:component
```

コンポーネント名（ケバブケース）・Storybookの日本語名・種類（`function` / `class`）を入力すると、以下の3ファイルが生成されます。既存の名前と重複する場合はエラーになります。

| ファイル                         | 内容                                                                        |
| -------------------------------- | --------------------------------------------------------------------------- |
| `vite/ts/components/<name>.ts`   | コンポーネント本体（関数またはクラス）                                      |
| `test/components/<name>.test.js` | Vitestの単体テスト。p5はモック（`vi.fn()`）で差し替える                     |
| `stories/<name>.stories.js`      | Storybookのstory。`stories/p5-decorator.js` の `createP5Story()` で描画する |

生成された内容は仮実装です。コンポーネント本体を実装し、test・storyを内容に合わせて書き換えてください。

### 4. test・storyの置き場所

- 単体テストは `test/components/<name>.test.js` に置きます（命名は本体と同じケバブケース）。
- storyは `stories/<name>.stories.js` に置きます。`<bicpema-*>` タグを使うUI部品のstoryは、`stories/<name>.html` を `?bicpema` 付きでimportします（例: `stories/settings-modal.stories.js`）。
- 既存のstories: 再生・リセットボタン / 設定ボタンと設定モーダル / ナビバー / ローディングスピナー / フォーム部品（`.form-label`・`.form-control`）/ 矢印 / 点線 / グリッド / グラフ枠。

### 5. 必須チェックリスト

新しい部品には、test と story を必須とします。PRを出す前に確認してください。

- [ ] `vite/ts/components/<name>.ts` に本体があり、公開する関数・クラス・メソッドにTSDocがある
- [ ] `test/components/<name>.test.js` がある（描画の呼び出し・オプションの既定値・境界値を検証している。クラスは `update()` と `draw()` の分離、`draw()` が状態を変更しないことも検証している）
- [ ] `stories/<name>.stories.js` がある（コントロールでオプションを変更でき、`npm run storybook` で見た目を確認した）
- [ ] 重複していたシミュレーションのうち、1件以上を共通部品へ移行した（または移行しない理由をPRに書いた）
- [ ] [重複している部品の候補一覧](#重複している部品の候補一覧)の「状態」を更新した
- [ ] `npm run lint` / `npm run typecheck` / `npm test` / `npm run format:check` が通る
- [ ] `npm run lint:md`（docsを変更した場合）と `npm run build:storybook` が通る

## 記事の追加

シミュレーションを公開するには、対応する Hugo 記事も追加します。

```bash
hugo new post/{記事名}/index.md
# 例
hugo new post/ドップラー効果/index.md
```

生成されたファイルのフロントマターを編集して、タイトル・説明・サムネイル画像 URL などを設定します。

```yaml
---
title: "ドップラー効果"
description: "音源や観測者が動くときに音の高さが変わる現象を体験できます。"
image: "https://storage.googleapis.com/..."
categories:
    - 波動
tags:
    - 音波
---
```

本文冒頭の「シミュレーションのリンク」節には、`simulation-link` ショートコードでシミュレーションへのリンクを記述します。フロントマターの `image`（サムネイル）と `title` を使ったカードとして表示されます。

```markdown
## シミュレーションのリンク

{{< simulation-link "/vite/simulations/doppler/" >}}
```

引数のパスは `/vite/simulations/<名前>/` 形式で記述してください。記事とシミュレーションのリンク整合性チェック（`npm run check:article-links`）や、シミュレーションのナビバーの戻るボタンの遷移先は、このパスから決まります。

### タグ付けルール

[Issue #625](https://github.com/Bicpema/bicpema/issues/625) の整理により、`tags` / `categories` / `series` は以下の規則に従います。

- `tags` は `["物理", "<分野タグ>", "<高校 or 大学>", ...記事固有のキーワード]` の順で構成する（複数学年に該当する場合は `"高校", "大学"` の順で両方入れる）
- `categories` は `["<分野タグ>"]`（1記事1分野）
- `series` は分野ごとに固定の1つが対応する

| 分野タグ（`categories`） | `series`     |
| ------------------------ | ------------ |
| 力学                     | 力学入門     |
| 波動                     | 波動と音     |
| 熱                       | 熱力学基礎   |
| 電磁気                   | 電磁気学基礎 |
| 原子物理                 | 原子物理入門 |
| 光学                     | 光学入門     |
| 地学                     | 地学入門     |

光学（レンズ・屈折・偏光色など）と地学（地層など）は、対応する記事がまだ存在しないシミュレーション向けに新設した分野です。今後これらのシミュレーションを記事化する際は、上表の `categories` / `series` を使用してください。
