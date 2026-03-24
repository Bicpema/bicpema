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
    .parent(p.select("#p5Container"));

  state.graphToggleButton = p
    .createButton("📊 グラフを表示")
    .id("graphToggleButton")
    .parent(graphToggleParent)
    .class("btn btn-secondary mt-2");

  state.graphToggleButton.mousePressed(() => onToggleGraph());

  // グラフ用 canvas DIV
  p.createDiv('<canvas id="graphCanvas"></canvas>')
    .id("graph")
    .parent(p.select("#p5Container"))
    .class("rounded border border-1")
    .style("display", "none")
    .style("background-color", "rgba(255, 255, 255, 0.50)");
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
  state.ball = new Ball(initialHeight, 0);
  state.graph = new BallGraph();
}
