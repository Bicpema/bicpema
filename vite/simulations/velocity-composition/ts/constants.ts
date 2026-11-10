/** 仮想キャンバス幅 */
export const V_W = 1000;
/** 仮想キャンバス高さ */
export const V_H = 562;
/** 川の下端Y座標（手前の岸の上端） */
export const RIVER_BOTTOM = 320;
/** 船のY座標（川の中央付近） */
export const BOAT_Y = 160;
/** フレームレート */
export const FPS = 30;
/** 速度(m/s)を画面上の移動量(px)に変換する係数 */
export const PX_PER_MPS = 20;
/** 水の粒子が画面外に消えてから再出現するまでのX方向の余白 */
export const WATER_PARTICLE_MARGIN = 60;
/** 船が画面外に消えてから反対側に再出現するまでのX方向の余白 */
export const BOAT_WRAP_MARGIN = 100;

// 色 [R, G, B]（色覚多様性に配慮したOkabe-Ito配色。背景が明るいため濃い色を使う）
/** 川の速度(v川)を表す色: 朱色 */
export const RIVER_COLOR = [213, 94, 0] as const;
/** 船の速度(v船)を表す色: 青 */
export const BOAT_COLOR = [0, 114, 178] as const;
/** 合成速度(v合)を表す色: 青緑 */
export const COMPOSITE_COLOR = [0, 158, 115] as const;

// 背景・図形の色（彩度を抑えた配色）
export const BACKGROUND_GRAY = 238;
export const WATER_COLOR = [208, 226, 240] as const;
export const WATER_LINE_COLOR = [150, 185, 214] as const;
export const BANK_COLOR = [224, 232, 218] as const;
export const BANK_EDGE_COLOR = [196, 208, 188] as const;
export const TEXT_COLOR = [51, 65, 85] as const;
export const TEXT_MUTED_COLOR = [100, 116, 139] as const;
export const HULL_COLOR = [71, 85, 105] as const;
export const CABIN_COLOR = [241, 245, 249] as const;
export const PANEL_FILL = [255, 255, 255, 235] as const;
export const PANEL_STROKE = [203, 213, 225] as const;

// 文字サイズ
export const LABEL_FONT_SIZE = 15;
export const PANEL_FONT_SIZE = 14;
export const SCENE_FONT_SIZE = 16;

// 矢印
/** 速度矢印の太さ */
export const ARROW_WEIGHT = 3.5;
/** 速度矢印の頭の長さ */
export const ARROW_HEAD_SIZE = 11;
