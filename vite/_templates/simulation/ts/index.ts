// index.tsはメインのメソッドを呼び出すためのエントリーポイントです。

import p5 from "p5";
import "../../../css/tailwind.css";
import { BicpemaCanvasController } from "../../../ts/bicpema-canvas-controller.js";
import { hideLoadingSpinner } from "../../../ts/bicpema-loading-spinner.js";
import { Arrow, drawArrowWithLabel } from "../../../ts/components/arrow.js";
import { ComponentGroup } from "../../../ts/components/component-group.js";
import { drawDashedLine } from "../../../ts/components/dashed-line.js";
import {
  settingInit,
  elementSelectInit,
  elementPositionInit,
  valueInit
} from "./init.js";

/**
 * シミュレーションのスケッチを定義する。
 * @param p - p5インスタンス
 */
const sketch = (p: p5) => {
  const canvasController = new BicpemaCanvasController();
  let isFirstDraw = true;

  // 共通コンポーネント（vite/ts/components/）の使用例です。
  // 実装時にはこのサンプル（demoArrow と draw() 内の「共通コンポーネントの使用例」ブロック）を削除してください。
  const demoArrow = new Arrow();
  // 複数の部品は ComponentGroup にまとめる。引数は「一時停止中か」を返す関数で、
  // 一時停止中は update() がスキップされ draw(p) のみ実行される。
  // 再生・停止の状態を持つシミュレーションでは、その状態を返す関数に置き換える。
  const components = new ComponentGroup(() => false);
  components.add(demoArrow);

  // /** フォントなどの素材を読み込む。 */
  // p.preload = () => {
  //   font = p.loadFont("...");
  // };

  /** キャンバスを生成し、初期設定を行う。 */
  p.setup = () => {
    canvasController.fullScreen(p);
    settingInit(p);
    elementSelectInit(p);
    elementPositionInit(p);
    valueInit(p);
    demoArrow.color = p.color(255, 120, 120);
    demoArrow.set(300, 500, 700, 300);
  };

  /** 毎フレームの描画を行う。 */
  p.draw = () => {
    p.scale(p.width / 1000);
    p.background(0);
    // drawGraph(p);

    // --- 共通コンポーネントの使用例（ここから）---
    // 状態を持つ部品は SimComponent（update() / draw(p)）として扱う。
    // 一時停止中は update() を呼ばず draw(p) のみ呼ぶ。
    // リセット時は components.reset()、破棄時は components.dispose() を呼ぶ。
    components.update();
    components.draw(p);
    // 状態を持たない描画は関数で呼び出す。
    drawDashedLine(p, 300, 500, 700, 500, p.color(160), { dashLength: 10 });
    drawArrowWithLabel(p, 300, 500, 300, 300, p.color(120, 200, 255), "ラベル");
    // --- 共通コンポーネントの使用例（ここまで）---

    if (isFirstDraw) {
      isFirstDraw = false;
      hideLoadingSpinner();
    }
  };

  /** ウィンドウサイズの変更に合わせてキャンバスとDOMの位置を再設定する。 */
  p.windowResized = () => {
    canvasController.resizeScreen(p);
    elementPositionInit(p);
  };
};

new p5(sketch);
