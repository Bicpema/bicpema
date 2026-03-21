import { state } from "./state.js";

/**
 * グラフの切り替えボタンを押した時に走る。
 */
export function graphButtonFunction() {
  state.graphData = !state.graphData;
}
