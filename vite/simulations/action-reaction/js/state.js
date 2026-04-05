// state.js はシミュレーションの共有可変状態を管理するファイルです。

// ────────────────────────────────────────────
// 仮想キャンバス寸法（px）
// ────────────────────────────────────────────
export const V_W = 1000;
export const V_H = 562;

// 左パネル（物理シーン）: x = 0 〜 PANEL_DIVIDER_X
// 右パネル（作用反作用の説明）: x = PANEL_DIVIDER_X 〜 V_W
export const PANEL_DIVIDER_X = 560;

// ────────────────────────────────────────────
// 物理定数
// ────────────────────────────────────────────
export const G = 9.8; // 重力加速度 m/s²

// ────────────────────────────────────────────
// 机のパラメータ（仮想座標）
// ────────────────────────────────────────────
export const DESK_CENTER_X = 270; // 机の中心 X 座標
export const DESK_TOP_Y = 350;    // 机の天板上面 Y 座標
export const DESK_WIDTH = 310;    // 机の幅（px）
export const DESK_THICKNESS = 30; // 机の天板の厚さ（px）
export const DESK_LEG_WIDTH = 20; // 机の脚の幅（px）
export const DESK_LEG_HEIGHT = 110; // 机の脚の高さ（px）
export const FLOOR_Y = 490;       // 床の Y 座標

// ────────────────────────────────────────────
// 本のパラメータ
// ────────────────────────────────────────────
export const BOOK_WIDTH = 110; // 本の幅（px）
export const BOOK_HEIGHT = 24; // 本の高さ（px）
export const MAX_BOOKS = 5;    // 最大冊数
export const INIT_NUM_BOOKS = 1; // 初期冊数
export const INIT_BOOK_MASS = 0.5; // 初期質量 kg/冊

// ────────────────────────────────────────────
// 矢印の最大長（px）
// ────────────────────────────────────────────
export const MAX_ARROW_LEN = 150;
export const MIN_ARROW_LEN = 30;

// ────────────────────────────────────────────
// カラー定義 [R, G, B]
// ────────────────────────────────────────────
export const GRAVITY_COLOR = [210, 50, 50];         // 赤 - 重力（地球→本）
export const REACTION_EARTH_COLOR = [220, 130, 20]; // オレンジ - 本→地球
export const NORMAL_COLOR = [50, 120, 210];          // 青 - 垂直抗力（机→本）
export const REACTION_DESK_COLOR = [150, 60, 200];  // 紫 - 本→机
export const FLOOR_NORMAL_COLOR = [40, 170, 70];    // 緑 - 地面→机

// ────────────────────────────────────────────
// 共有状態
// ────────────────────────────────────────────
export const state = {
  /** 日本語フォント */
  font: null,
  /** 積み上げている本の数 */
  numBooks: INIT_NUM_BOOKS,
  /** 本1冊の質量（kg） */
  bookMass: INIT_BOOK_MASS,

  /** DOM 要素参照 */
  settingsModal: null,
  bookMassInput: null,
  bookMassDisplay: null,
};
