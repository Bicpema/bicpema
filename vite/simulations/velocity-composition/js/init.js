import { state } from "./state.js";
import { FPS, V_W, RIVER_BOTTOM } from "./constants.js";
import { Boat, WaterParticle, Person } from "./boat.js";
import {
  onBoatSpeedChange,
  onRiverSpeedChange,
  onReset,
  onPlayPause,
} from "./element-function.js";
import { initModal } from "../../../js/bicpema-modal-controller.js";
import { bindToggleControls } from "../../../js/bicpema-controls-controller.js";

/**
 * DOM要素を選択してstateに格納し、イベントリスナーを設定する。
 * @param {p5} p p5インスタンス
 */
export function elCreate(p) {
  state.boatSpeedInput = p.select("#boatSpeedInput");
  state.riverSpeedInput = p.select("#riverSpeedInput");
  state.boatSpeedValue = p.select("#boatSpeedValue");
  state.riverSpeedValue = p.select("#riverSpeedValue");

  if (state.boatSpeedInput)
    state.boatSpeedInput.input(() => onBoatSpeedChange());
  if (state.riverSpeedInput)
    state.riverSpeedInput.input(() => onRiverSpeedChange());

  const { toggleButton, resetButton } = bindToggleControls(p, {
    toggleSelector: "#playPauseButton",
    resetSelector: "#resetButton",
    onToggle: onPlayPause,
    onReset,
  });
  state.playPauseButton = toggleButton;
  state.resetButton = resetButton;

  initModal({
    openSelectors: "#toggleModal",
    modalSelector: "#settingsModal",
    closeSelectors: "#closeModal",
  });
}

/**
 * キャンバス設定とシミュレーションの初期値を設定する。
 * @param {p5} p p5インスタンス
 */
export function initValue(p) {
  p.frameRate(FPS);
  p.textAlign(p.CENTER, p.CENTER);
  if (state.font) {
    p.textFont(state.font);
  }
  p.textSize(16);

  const boatSpeed = state.boatSpeedInput
    ? parseFloat(state.boatSpeedInput.value())
    : 5;
  const riverSpeed = state.riverSpeedInput
    ? parseFloat(state.riverSpeedInput.value())
    : 3;

  state.boat = new Boat(boatSpeed, riverSpeed);
  state.person = new Person(880, RIVER_BOTTOM + 100);

  state.waterParticles = [];
  for (let i = 0; i < 40; i++) {
    state.waterParticles.push(
      new WaterParticle(p, p.random(0, V_W), p.random(20, RIVER_BOTTOM - 20))
    );
  }
}
