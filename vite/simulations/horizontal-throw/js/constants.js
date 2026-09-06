// 物理定数
/** 重力加速度 (m/s^2) */
export const GRAVITY = 9.8;

// 初期値・入力範囲
/** 初期の高さの初期値 (m) */
export const DEFAULT_INITIAL_HEIGHT = 30;
/** 初速度の初期値 (m/s) */
export const DEFAULT_INITIAL_VELOCITY = 15;
/** 高さ入力の最小値 (m) */
export const MIN_HEIGHT_INPUT = 10;
/** 高さ入力の最大値 (m) */
export const MAX_HEIGHT_INPUT = 80;
/** 初速度入力の最小値 (m/s) */
export const MIN_VELOCITY_INPUT = 5;
/** 初速度入力の最大値 (m/s) */
export const MAX_VELOCITY_INPUT = 30;

// 3D シーン定数
/** 台の幅 (m) */
export const PLATFORM_W_M = 10;
/** 台の厚み (px) ─ 浮かせた薄い棚 */
export const PLATFORM_THICK = 18;
/** 台の奥行き (px) */
export const PLATFORM_D = 20;
/** 地面の奥行き (px) */
export const GROUND_D = 30;
/** 地面の厚み (px) */
export const GROUND_THICK = 16;
/** 球の半径 (px) */
export const BALL_R = 14;
/** 速度矢印スケール */
export const ARROW_SCALE_3D = 3.5;
/** 残像を残す時間間隔 (秒) */
export const GHOST_INTERVAL = 0.35;
/** 残像の最大数 */
export const GHOST_MAX = 35;
/** 残像球の不透明度 (0-255) */
export const GHOST_ALPHA = 160;
/** 残像球の半径倍率 (対 BALL_R) */
export const GHOST_BALL_RADIUS_RATIO = 0.65;
/** x方向球・y方向球の半径倍率 (対 BALL_R) */
export const COMPONENT_BALL_RADIUS_RATIO = 0.88;

// カメラスケール固定基準値 (設定変更でズームしない)
/** 基準初期高さ (m) */
export const CAM_REF_H = 80;
/** 基準初速度 (m/s) */
export const CAM_REF_V = 30;
/** シーンの余白比率 (キャンバスに対するシーン表示範囲の割合) */
export const CAMERA_MARGIN_RATIO = 0.78;

// 色 (同じ意味の色を複数箇所で使い回すため定数化) [R, G, B]
/** メイン球 (放物線軌道) の色 @type {[number, number, number]} */
export const MAIN_BALL_COLOR = [255, 215, 30];
/** x方向の残像・ガイドラインの色 @type {[number, number, number]} */
export const X_DIRECTION_COLOR = [50, 210, 80];
/** x方向球・vx矢印の色 @type {[number, number, number]} */
export const X_DIRECTION_BALL_COLOR = [50, 215, 85];
/** y方向球・vy矢印の色 @type {[number, number, number]} */
export const Y_DIRECTION_BALL_COLOR = [245, 205, 35];
/** x方向ラベルの色 (3D空間内ラベル・HUD共通) @type {[number, number, number]} */
export const X_DIRECTION_LABEL_COLOR = [80, 220, 100];

// 不透明度 (同じ意味で複数箇所に使われるアルファ値, 0-255)
/** ガイドライン (x/y方向の補助線) の不透明度 */
export const GUIDELINE_ALPHA = 100;
/** x方向球・y方向球の不透明度 */
export const COMPONENT_BALL_ALPHA = 235;
/** 速度矢印の不透明度 */
export const VELOCITY_ARROW_ALPHA = 230;
/** 残像の格子線の不透明度 */
export const GHOST_GRID_ALPHA = 75;

// テキストサイズ・レイアウト比率
/** 3D空間内ラベルの最小サイズ (px) */
export const MIN_3D_LABEL_SIZE = 12;
/** 3D空間内ラベルサイズのスケール係数 (対 S: px/m) */
export const LABEL_SIZE_SCALE = 1.6;
/** HUDフォントの最小サイズ (px) */
export const MIN_HUD_FONT_SIZE = 13;
/** HUDフォントサイズの画面幅に対する比率 */
export const HUD_FONT_SIZE_RATIO = 0.018;
/** HUD行の高さ倍率 (対 フォントサイズ) */
export const HUD_LINE_HEIGHT_RATIO = 1.5;
/** HUDの余白 (px) */
export const HUD_MARGIN = 15;
