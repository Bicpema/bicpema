export const state = {
  // --- ロードアセット ---
  font: null,

  // --- F1/F2 矢印先端座標（原点からの相対位置、グリッドスナップ済み） ---
  f1TipX: 150, // 3 格子右
  f1TipY: -100, // 2 格子上
  f2TipX: -50, // 1 格子左
  f2TipY: -100, // 2 格子上

  // --- ドラッグ状態 ---
  dragging: null, // null | 'f1' | 'f2'
};
