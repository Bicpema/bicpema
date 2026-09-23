import { state } from "./state.js";

/**
 * グラフの切り替えボタンを押した時に走る。
 */
export function graphButtonFunction() {
  state.graphData = !state.graphData;
}

/**
 * 再生/一時停止ボタンが押されたときの処理。
 */
export function onPlayPause() {
  state.isPlaying = !state.isPlaying;
  state.playButton.html(state.isPlaying ? "一時停止" : "再開");
}
