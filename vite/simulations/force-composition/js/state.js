import { GRID_STEP } from "./constants.js";

export const state = {
  // --- ロードアセット ---
  font: null,

  // --- F1/F2 矢印先端座標（原点からの相対位置、グリッドスナップ済み） ---
  f1TipX: 3 * GRID_STEP, // 3 格子右
  f1TipY: -2 * GRID_STEP, // 2 格子上
  f2TipX: -1 * GRID_STEP, // 1 格子左
  f2TipY: -2 * GRID_STEP, // 2 格子上

  // --- ドラッグ状態 ---
  dragging: null // null | 'f1' | 'f2'
};
