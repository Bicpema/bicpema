// element-function.ts は仮想DOMメソッド管理専用のファイルです。

import { state } from "./state.js";
import { resetGraph } from "./graph.js";

/** 再生・一時停止ボタンの表示を、再生状態と経過の有無に合わせて更新する。 */
const updatePlayPauseButton = () => {
  const button = document.getElementById("playPauseButton");
  if (!button) return;
  if (state.isPlaying) {
    button.textContent = "⏸ 一時停止";
  } else {
    button.textContent = state.stepCount === 0 ? "▶ 開始" : "▶ 再開";
  }
};

/** 加速度の表示値（設定パネル内）を更新する。 */
const updateAccelerationLabel = () => {
  const label = document.getElementById("accelerationValue");
  if (label) label.textContent = state.acceleration.toFixed(1);
};

/** 再生・一時停止ボタンが押されたときの処理。 */
export const onPlayPause = () => {
  state.isPlaying = !state.isPlaying;
  updatePlayPauseButton();
};

/** リセットボタンが押されたときの処理。電車・経過時間・v-t図を初期状態に戻す。 */
export const onReset = () => {
  state.isPlaying = false;
  state.stepCount = 0;
  state.train.reset();
  state.vtData.length = 0;
  resetGraph();
  state.needsRedraw = true;
  updatePlayPauseButton();
};

/** 加速度スライダーが操作されたときの処理。再生中でも反映される。 */
export const onAccelerationInput = () => {
  const input = document.getElementById(
    "accelerationInput"
  ) as HTMLInputElement | null;
  if (!input) return;
  const value = parseFloat(input.value);
  if (Number.isNaN(value)) return;
  state.acceleration = value;
  state.needsRedraw = true;
  updateAccelerationLabel();
};
