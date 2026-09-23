// init.ts は初期処理専用のファイルです。
// DOM要素の取得・イベントリスナーの登録、シミュレーションの初期値設定を行う。

import { state, DEFAULT_GRAVITY, DEFAULT_MASS } from "./state.js";
import {
  onGravityChange,
  onMassChange,
  onGravityToggle,
  onNormalToggle,
  onEarthReactionToggle,
  onNormalReactionToggle,
  onClearBooks,
  onPlayPause,
  onReset
} from "./element-function.js";
import { initModal } from "../../../js/bicpema-modal-controller.js";
import { bindToggleControls } from "../../../js/bicpema-controls-controller.js";

/** シミュレーションのフレームレート */
export const FPS = 60;

/**
 * DOM要素を取得してstateに格納し、イベントリスナーを登録する。
 * @param p p5インスタンス
 */
export function settingInit(p: p5): void {
  p.frameRate(FPS);
  p.textAlign(p.CENTER, p.CENTER);
  p.textSize(14);
}

/**
 * 仮想DOM（設定モーダル・ボタン類）を読み込み、イベントを登録する。
 * @param p p5インスタンス
 */
export function elementSelectInit(p: p5): void {
  state.gravityCheckBox = p.select("#gravityCheckBox");
  state.normalCheckBox = p.select("#normalCheckBox");
  state.earthReactionCheckBox = p.select("#earthReactionCheckBox");
  state.normalReactionCheckBox = p.select("#normalReactionCheckBox");
  state.gravityInput = p.select("#gravityInput");
  state.gravityDisplay = p.select("#gravityDisplay");
  state.massInput = p.select("#massInput");
  state.massDisplay = p.select("#massDisplay");
  state.clearBooksButton = p.select("#clearBooksButton");

  state.gravityCheckBox?.changed(() => onGravityToggle());
  state.normalCheckBox?.changed(() => onNormalToggle());
  state.earthReactionCheckBox?.changed(() => onEarthReactionToggle());
  state.normalReactionCheckBox?.changed(() => onNormalReactionToggle());
  state.gravityInput?.input(() => onGravityChange());
  state.massInput?.input(() => onMassChange());
  state.clearBooksButton?.mousePressed(() => onClearBooks());

  const { toggleButton } = bindToggleControls(p, {
    toggleSelector: "#playPauseButton",
    resetSelector: "#resetButton",
    onToggle: () => onPlayPause(),
    onReset: () => onReset()
  });
  state.playPauseButton = toggleButton;

  initModal({
    openSelectors: ".settings-modal-open",
    modalSelector: "#settingsModal",
    closeSelectors: ".modal-close"
  });
}

/**
 * 仮想DOMの初期表示位置・初期値を設定する。
 * @param p p5インスタンス
 */
export function elementPositionInit(_p: p5): void {}

/**
 * シミュレーションの初期値を設定する。
 * @param p p5インスタンス
 */
export function valueInit(p: p5): void {
  p.textFont("sans-serif");
  state.gravityInput?.value(DEFAULT_GRAVITY);
  state.massInput?.value(DEFAULT_MASS);
  state.gravityDisplay?.html(DEFAULT_GRAVITY.toFixed(1));
  state.massDisplay?.html(DEFAULT_MASS.toFixed(1));

  // Firebase Storageが到達不能でもブロックしないよう、setup内で非同期にフォントを読み込む
  p.loadFont(
    "https://firebasestorage.googleapis.com/v0/b/bicpema.firebasestorage.app/o/public%2Fassets%2Ffont%2FZenMaruGothic-Regular.ttf?alt=media&token=9b248da2-ed3a-46a3-b447-46a98775d580",
    (f: p5.Font) => {
      state.font = f;
    },
    () => {
      state.font = null;
    }
  );
}
