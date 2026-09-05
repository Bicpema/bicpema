import { state } from "./state.js";
import {
  onHeightChange,
  onDragCoefficientChange,
  onReset,
  onPlayPause,
  onToggleGraph,
  clampHeight,
  clampDragCoefficient,
} from "./element-function.js";
import { Ball } from "./ball.js";
import { BallGraph } from "./graph.js";
import { initModal } from "../../../js/bicpema-modal-controller.js";
import { bindToggleControls } from "../../../js/bicpema-controls-controller.js";

export const FPS = 30;

/**
 * DOM要素を選択してstateに格納し、イベントリスナーを設定する
 * @param {p5} p p5インスタンス
 */
export function elCreate(p) {
  state.heightInput = p.select("#heightInput");
  state.heightInput.input(() => onHeightChange());

  state.dragCoefficientInput = p.select("#dragCoefficientInput");
  state.dragCoefficientInput.input(() => onDragCoefficientChange());

  const { toggleButton, resetButton } = bindToggleControls(p, {
    toggleSelector: "#playPauseButton",
    resetSelector: "#resetButton",
    onToggle: () => onPlayPause(),
    onReset: () => onReset(),
  });
  state.playPauseButton = toggleButton;
  state.resetButton = resetButton;

  initModal({
    openSelectors: "#toggleModal",
    modalSelector: "#settingsModal",
    closeSelectors: "#closeModal",
  });

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
      "mt-2 cursor-pointer rounded bg-neutral-600 px-3 py-1.5 text-white hover:bg-neutral-500"
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

  const initialHeight = clampHeight(parseFloat(state.heightInput.value()));
  const initialDragCoefficient = clampDragCoefficient(
    parseFloat(state.dragCoefficientInput.value())
  );
  state.ball = new Ball(initialHeight, initialDragCoefficient);
  state.graph = new BallGraph();
}
