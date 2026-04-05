// state.js はシミュレーションの共有可変状態を管理するファイルです。

// 仮想キャンバスの寸法
export const V_W = 1000;
export const V_H = 562;

// スケール: 1 m = 400 px
export const PX_PER_M = 400;

// 壁のレイアウト（左半分に配置）
export const WALL_X = 20;
export const WALL_W = 60;
export const WALL_TOP = 180;
export const WALL_BOTTOM = 382;
export const ATTACH_X = WALL_X + WALL_W;

// バネの自然長・制限値（px）
// NATURAL_LENGTH = 200px = 50cm (PX_PER_M=400)
// 最大伸び: +50cm = 200px → MAX = 200 + 200 = 400px（グラフ軸上限 +50cm に一致）
// 最大縮み: -40cm = 160px → MIN = 200 - 160 = 40px（縮みすぎてバネ長ゼロを防ぐ）
export const NATURAL_LENGTH = 200;
export const MIN_SPRING_LENGTH = 40;
export const MAX_SPRING_LENGTH = 400;

// バネ取り付けY座標（中央1本）
export const SPRING_Y = 281;

// グラフ領域（右半分）
export const GRAPH_LEFT = 530;
export const GRAPH_RIGHT = 980;
export const GRAPH_TOP = 80;
export const GRAPH_BOTTOM = 480;
// x軸レンジ（cm単位、±GRAPH_X_RANGE cm）
export const GRAPH_X_RANGE = 50;

export const state = {
  /** バネの配列 */
  springs: [],
  /** ばね定数スライダーの参照 */
  springConstantInput: null,
  /** ばね定数表示ラベルの参照 */
  springConstantDisplay: null,
  /** 設定モーダルの参照 */
  settingsModal: null,
  /** 壁（地面）画像 */
  wallImg: null,
};
