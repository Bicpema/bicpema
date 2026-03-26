// state.js はシミュレーションの共有可変状態を管理するファイルです。

// ────────────────────────────────────────────
// 仮想キャンバス寸法（px）
// ────────────────────────────────────────────
export const V_W = 1000;
export const V_H = 562;

// 左パネル（物理シミュレーション）: x = 0 〜 PANEL_DIVIDER_X
// 右パネル（力のベクトル図）: x = PANEL_DIVIDER_X 〜 V_W
export const PANEL_DIVIDER_X = 505;

// 天井の下端 y 座標
export const CEILING_Y = 75;

// ────────────────────────────────────────────
// 描画パラメータ
// ────────────────────────────────────────────
export const ANCHOR_RADIUS = 14;
export const RING_RADIUS = 15;
export const WEIGHT_SIZE = 36;
export const WEIGHT_HANG_LENGTH = 90; // リングから重りまでの糸の長さ（px）

// 力の矢印スケール（px/N）：左パネルでの物理表示用
export const ARROW_SCALE = 3.0;

// ────────────────────────────────────────────
// カラー定義 [R, G, B]
// ────────────────────────────────────────────
export const T1_COLOR = [50, 110, 210];  // 糸1の張力（青）
export const T2_COLOR = [200, 55, 55];   // 糸2の張力（赤）
export const W_COLOR = [40, 160, 70];    // 重力（緑）
export const RING_COLOR = [235, 160, 30]; // リング（オレンジ）

// ────────────────────────────────────────────
// 初期位置（リセット用）
// ────────────────────────────────────────────
export const INIT_ANCHOR_A = { x: 115, y: 90 };
export const INIT_ANCHOR_B = { x: 420, y: 90 };
export const INIT_RING = { x: 265, y: 310 };
export const INIT_WEIGHT = 20;

// ────────────────────────────────────────────
// 共有状態
// ────────────────────────────────────────────
export const state = {
  /** 日本語フォント */
  font: null,
  /** アンカーA（左側の天井固定点） */
  anchorA: { ...INIT_ANCHOR_A },
  /** アンカーB（右側の天井固定点） */
  anchorB: { ...INIT_ANCHOR_B },
  /** 中心リングの位置 */
  ring: { ...INIT_RING },
  /** おもりの重さ（N） */
  weight: INIT_WEIGHT,

  /** 計算された糸1の張力（N） */
  T1: 0,
  /** 計算された糸2の張力（N） */
  T2: 0,
  /** 釣り合いが成立しているか */
  isEquilibrium: false,

  /** ドラッグ中の要素（'anchorA' | 'anchorB' | 'ring' | null） */
  dragging: null,
  dragOffsetX: 0,
  dragOffsetY: 0,

  /** DOM要素参照 */
  settingsModal: null,
  weightInput: null,
  weightDisplay: null,
};
