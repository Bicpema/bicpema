// state.js はシミュレーションの共有可変状態を管理するファイルです。

// 仮想キャンバスの寸法
export const V_W = 1000;
export const V_H = 562;

// スケール: 1 m = 400 px
export const PX_PER_M = 400;

// 壁のレイアウト
export const WALL_X = 55;
export const WALL_W = 80;
export const WALL_TOP = 60;
export const WALL_BOTTOM = 502;
export const ATTACH_X = WALL_X + WALL_W;

// バネの自然長・制限値（px）
export const NATURAL_LENGTH = 280;
export const MIN_SPRING_LENGTH = 50;
export const MAX_SPRING_LENGTH = 680;

// バネ取り付けY座標（上・中・下）
export const SPRING_Y_POSITIONS = [175, 281, 387];

export const state = {
  /** バネの配列 */
  springs: [],
  /** ばね定数スライダーの参照 */
  springConstantInput: null,
  /** ばね定数表示ラベルの参照 */
  springConstantDisplay: null,
  /** 設定モーダルの参照 */
  settingsModal: null,
};
