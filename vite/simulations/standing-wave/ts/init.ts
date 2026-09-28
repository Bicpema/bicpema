import { state } from "./state.js";
import { MARGIN, WAVELENGTH, PERIOD_FRAMES } from "./constants.js";
import { bindToggleControls } from "../../../ts/bicpema-controls-controller.js";

/**
 * 波長・波数・角振動数・波の速さ・振幅を初期化する。
 * @param p - p5インスタンス
 */
export function settingInit(p: p5) {
  state.wavelength = WAVELENGTH;
  state.k = p.TWO_PI / state.wavelength;
  state.omega = p.TWO_PI / PERIOD_FRAMES;
  state.v = state.omega / state.k;
  state.A = state.wavelength / 5;
}

/**
 * スタート／ストップボタンとリセットボタンにイベントを登録する。
 * @param p - p5インスタンス
 */
export function elementSelectInit(p: p5) {
  const { toggleButton } = bindToggleControls(p, {
    toggleSelector: "#moveBtn",
    resetSelector: "#resetBtn",
    /** 再生状態を切り替える。 */
    onToggle: () => toggleMove(toggleButton?.elt),
    /** シミュレーションをリセットする。 */
    onReset: () => resetSim(toggleButton?.elt)
  });
}

/**
 * キャンバスの余白と描画領域の幅・高さを設定する。
 * @param p - p5インスタンス
 */
export function elementPositionInit(p: p5) {
  state.margin = MARGIN;
  state.innerW = p.width - state.margin * 2;
  state.innerH = p.height - state.margin * 2;
}

/**
 * 時刻と左右の波の先端位置を初期化し、停止状態にする。
 * @param p - p5インスタンス
 */
export function valueInit(p: p5) {
  state.t = 0;
  state.rightFront = 0;
  state.leftFront = state.innerW;
  state.running = false;
}

/**
 * 再生・停止を切り替え、ボタンの表示とスタイルを更新する。
 * @param moveBtn - スタート／ストップボタンの要素
 */
function toggleMove(moveBtn: HTMLElement | null | undefined) {
  state.running = !state.running;
  if (!moveBtn) return;
  if (!state.running) {
    moveBtn.textContent = "スタート";
    moveBtn.classList.remove("bg-red-600", "hover:bg-red-500");
    moveBtn.classList.add("bg-blue-600", "hover:bg-blue-500");
  } else {
    moveBtn.textContent = "ストップ";
    moveBtn.classList.remove("bg-blue-600", "hover:bg-blue-500");
    moveBtn.classList.add("bg-red-600", "hover:bg-red-500");
  }
}

/**
 * 時刻と波の先端位置を初期化して停止状態に戻し、ボタンの表示をスタートに戻す。
 * @param moveBtn - スタート／ストップボタンの要素
 */
function resetSim(moveBtn: HTMLElement | null | undefined) {
  state.t = 0;
  state.rightFront = 0;
  state.leftFront = state.innerW;
  state.running = false;
  if (!moveBtn) return;
  moveBtn.textContent = "スタート";
  moveBtn.classList.remove("bg-red-600", "hover:bg-red-500");
  moveBtn.classList.add("bg-blue-600", "hover:bg-blue-500");
}
