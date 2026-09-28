import { state } from "./state.js";
import { PISTON_Y_TOP } from "./constants.js";
import { bindToggleControls } from "../../../ts/bicpema-controls-controller.js";

/**
 * 再生・一時停止を切り替え、ボタンの表示を更新します。
 */
function onPlayPause() {
  state.isPlaying = !state.isPlaying;
  state.playButton.html(state.isPlaying ? "一時停止" : "再開");
}

/**
 * 熱機関のサイクルを初期状態に戻し、再生を再開します。
 */
function onReset() {
  state.stage = 0;
  state.t = 0;
  state.pistonY = PISTON_Y_TOP;
  state.weightOn = true;
  state.isPlaying = true;
  state.playButton.html("一時停止");
}

/**
 * ピストン位置を初期化し、再生・リセットボタンにイベントを登録します。
 * @param p - p5インスタンス
 */
export function elementPositionInit(p: p5) {
  state.pistonY = PISTON_Y_TOP;

  const { toggleButton } = bindToggleControls(p, {
    toggleSelector: "#playButton",
    resetSelector: "#resetButton",
    onToggle: onPlayPause,
    onReset
  });
  state.playButton = toggleButton;
}
