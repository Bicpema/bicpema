import { state } from "./state.js";
import { BicpemaCanvasController } from "../../../lib/simulation/bicpema-canvas-controller.js";

export const canvasController = new BicpemaCanvasController();

// 温度変化はゆっくりで60fpsの滑らかさが不要なため20fpsに抑えている。
const FPS = 20;

/**
 * キャンバスを全画面に設定し、フレームレートと状態を初期化する。
 * @param p - p5インスタンス
 */
export function initSimulation(p: p5) {
  canvasController.fullScreen(p);
  p.frameRate(FPS);
  resetState();
}

/**
 * 経過時間と高温物体・低温物体の温度を初期値に戻し、熱平衡後の温度を計算する。
 */
export function resetState() {
  state.t = 0;
  state.Thot = state.Thot0;
  state.Tcold = state.Tcold0;
  state.Teq =
    (state.C_hot * state.Thot0 + state.C_cold * state.Tcold0) /
    (state.C_hot + state.C_cold);
}

/**
 * ウィンドウサイズの変更に合わせてキャンバスをリサイズする。
 * @param p - p5インスタンス
 */
export function windowResized(p: p5) {
  canvasController.resizeScreen(p);
}
