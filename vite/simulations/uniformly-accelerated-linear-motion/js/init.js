import { state } from "./state.js";
import { Car } from "./car.js";
import { MotionGraph } from "./graph.js";
import { FPS } from "./constants.js";
import {
  onReset,
  onPlayPause,
  onToggleModal,
  onCloseModal,
  onToggleGraph,
} from "./element-function.js";

/**
 * DOM要素をstateに格納し、イベントリスナーを設定する
 * @param {p5} p p5インスタンス
 */
export function elCreate(p) {
  state.initialVelocityInput = p.select("#initialVelocityInput");
  state.accelerationInput = p.select("#accelerationInput");
  state.showMarkersCheckBox = p.select("#showMarkersCheckBox");
  state.resetButton = p.select("#resetButton");
  state.playPauseButton = p.select("#playPauseButton");
  state.toggleModal = p.select("#toggleModal");
  state.closeModal = p.select("#closeModal");
  state.settingsModal = p.select("#settingsModal");

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
    .style("background-color", "rgba(255, 255, 255, 0.90)");
}

/**
 * シミュレーションの初期値を設定する
 * @param {p5} p p5インスタンス
 */
export function initValue(p) {
  p.frameRate(FPS);
  p.textAlign(p.CENTER, p.CENTER);
  if (state.font) p.textFont(state.font);
  p.textSize(16);

  const v0 = parseFloat(state.initialVelocityInput.value());
  const a = parseFloat(state.accelerationInput.value());
  state.car = new Car(v0, a);
  state.graph = new MotionGraph();
}
