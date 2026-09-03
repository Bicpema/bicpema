import { state } from "./state.js";
import {
  onHeightChange,
  onReset,
  onPlayPause,
  onToggleModal,
  onCloseModal,
  onToggleGraph,
} from "./element-function.js";
import { Ball } from "./ball.js";
import { BallGraph } from "./graph.js";

export const FPS = 30;

/**
 * DOM要素を選択してstateに格納し、イベントリスナーを設定する
 * @param {p5} p p5インスタンス
 */
export function elCreate(p) {
  state.heightInput = p.select("#heightInput");
  state.resetButton = p.select("#resetButton");
  state.playPauseButton = p.select("#playPauseButton");
  state.toggleModal = p.select("#toggleModal");
  state.closeModal = p.select("#closeModal");
  state.settingsModal = p.select("#settingsModal");

  state.heightInput.input(() => onHeightChange());
  state.resetButton.mousePressed(() => onReset());
  state.playPauseButton.mousePressed(() => onPlayPause());
  state.toggleModal.mousePressed(() => onToggleModal());
  state.closeModal.mousePressed(() => onCloseModal());

  // グラフトグルボタン
  const graphToggleParent = p
    .createDiv()
    .id("graphToggleParent")
    .parent(p.select("#p5Container"))
    .class("absolute top-10 left-5 z-[1000]");

  state.graphToggleButton = p
    .createButton("📊 グラフを表示")
    .id("graphToggleButton")
    .parent(graphToggleParent)
    .class(
      "mt-2 cursor-pointer rounded bg-neutral-600 px-3 py-1.5 text-white hover:bg-neutral-500",
    );

  state.graphToggleButton.mousePressed(() => onToggleGraph());
}

/**
 * キャンバス設定とシミュレーションの初期値を設定する
 * @param {p5} p p5インスタンス
 */
export function initValue(p) {
  p.frameRate(FPS);
  p.textAlign(p.CENTER, p.CENTER);
  p.textFont(state.font);
  p.textSize(16);

  const initialHeight = parseFloat(state.heightInput.value());
  state.ball = new Ball(initialHeight);
  state.graph = new BallGraph();
}
