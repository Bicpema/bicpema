import type p5 from "p5";
import { state } from "./state.js";
import { initModal } from "../../../lib/simulation/bicpema-modal-controller.js";
import { bindToggleControls } from "../../../lib/simulation/bicpema-controls-controller.js";

/** 電流の強さの初期値（A） */
const INITIAL_CURRENT = 1;

/**
 * 設定値を初期化する（現在は処理なし）。
 * @param p - p5インスタンス
 */
export function settingInit(p: p5) {}

/**
 * DOM要素の選択を初期化する（現在は処理なし）。
 * @param p - p5インスタンス
 */
export function elementSelectInit(p: p5) {}

/**
 * 電流の強さのラベルをスライダーの値に合わせて更新する。
 */
function updateControlLabels() {
  const currentSlider = document.getElementById(
    "currentSlider"
  ) as HTMLInputElement | null;
  const currentLabel = document.getElementById("currentLabel");
  if (currentSlider && currentLabel) {
    currentLabel.textContent = `電流の強さ: ${parseFloat(currentSlider.value).toFixed(1)} A`;
  }
}

/**
 * 電流スライダーの入力イベントを登録し、ラベルを初期表示する。
 * @param p - p5インスタンス
 */
export function elementPositionInit(p: p5) {
  const currentSlider = document.getElementById("currentSlider");
  if (currentSlider) {
    // oxlint-disable-next-line unicorn/prefer-add-event-listener -- 呼び出しのたびに再実行されるため、代入で単一ハンドラのみを保つ
    currentSlider.oninput = updateControlLabels;
  }

  updateControlLabels();
}

/**
 * 再生・リセットボタンと設定モーダルにイベントを登録する。
 * @param p - p5インスタンス
 */
export function valueInit(p: p5) {
  const playPauseButton = document.getElementById("playPauseButton");
  if (!playPauseButton) return;

  const currentSlider = document.getElementById(
    "currentSlider"
  ) as HTMLInputElement | null;

  bindToggleControls(p, {
    toggleSelector: "#playPauseButton",
    resetSelector: "#resetButton",
    /** 再生・一時停止を切り替え、ボタンの表示を更新する。 */
    onToggle: () => {
      state.isRunning = !state.isRunning;
      playPauseButton.textContent = state.isRunning ? "⏸ 一時停止" : "▶ 再開";
    },
    /** 時間と電流値を初期値に戻して停止し、表示を更新する。 */
    onReset: () => {
      state.isRunning = false;
      state.t = 0;
      if (currentSlider) currentSlider.value = String(INITIAL_CURRENT);
      updateControlLabels();
      playPauseButton.textContent = "▶ 開始";
    }
  });

  initModal({
    openSelectors: "#toggleModal",
    modalSelector: "#settingsModal",
    closeSelectors: "#settingsModal .modal-close"
  });
}
