// init.ts は初期処理専用のファイルです。

import type p5 from "p5";
import { initModal } from "../../../ts/bicpema-modal-controller.js";
import { bindToggleControls } from "../../../ts/bicpema-controls-controller.js";
import { BALANCE_COLOR, FPS, REACTION_COLOR } from "./constants.js";
import {
  onDisplayChange,
  onGravityChange,
  onPlayPause,
  onReset,
  recomputeForces
} from "./element-function.js";
import { state } from "./state.js";

/** 暗くした（薄くした）矢印の不透明度（0〜255）。ペア強調時に他の力へ適用する。 */
const DIM_ALPHA = 70;

/**
 * シミュレーションそのものの設定を行います。
 * @param p - p5インスタンス
 */
export function settingInit(p: p5): void {
  p.frameRate(FPS);
}

/**
 * 仮想DOMを読み込み、イベントを登録します。
 * @param p - p5インスタンス
 */
export function elementSelectInit(p: p5): void {
  state.gravityInput = p.select("#gravityInput");
  state.gravityDisplay = p.select("#gravityDisplay");
  state.showGravityCheckBox = p.select("#showGravityCheckBox");
  state.showNormalCheckBox = p.select("#showNormalCheckBox");
  state.showReactionCheckBox = p.select("#showReactionCheckBox");
  state.showNumbersCheckBox = p.select("#showNumbersCheckBox");

  state.gravityInput?.input(() => onGravityChange());
  for (const el of [
    state.showGravityCheckBox,
    state.showNormalCheckBox,
    state.showReactionCheckBox,
    state.showNumbersCheckBox
  ]) {
    el?.changed(() => onDisplayChange());
  }

  const { toggleButton } = bindToggleControls(p, {
    toggleSelector: "#playPauseButton",
    resetSelector: "#resetButton",
    /** 再生・一時停止を切り替える。 */
    onToggle: () => onPlayPause(),
    /** 本の冊数とgを初期状態へ戻す。 */
    onReset: () => onReset()
  });
  state.playPauseButton = toggleButton;

  initModal({
    openSelectors: "#toggleModal",
    modalSelector: "#settingsModal",
    closeSelectors: "#settingsModal .modal-close"
  });
}

/**
 * 初期値を設定します。色は毎フレームの生成を避けるためここで一度だけ作ります。
 * @param p - p5インスタンス
 */
export function valueInit(p: p5): void {
  const [br, bg, bb] = BALANCE_COLOR;
  const [rr, rg, rb] = REACTION_COLOR;
  state.colors = {
    balance: p.color(br, bg, bb),
    balanceDim: p.color(br, bg, bb, DIM_ALPHA),
    reaction: p.color(rr, rg, rb),
    reactionDim: p.color(rr, rg, rb, DIM_ALPHA)
  };
  recomputeForces();
}
