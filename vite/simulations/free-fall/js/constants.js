/** 重力加速度 (m/s^2) */
export const GRAVITY = 9.8;
/** ボール半径 (px) */
export const BALL_RADIUS = 15;
/** グラフデータ記録間隔 (秒) */
export const GRAPH_DATA_INTERVAL = 0.05;
/** 地面到達とみなす高さ (m)。この高さ以下になると運動を停止する */
export const GROUND_LEVEL_HEIGHT = 1;
/** 高さ入力の最小値 (m) */
export const MIN_HEIGHT_INPUT = 10;
/** 高さ入力の最大値 (m) */
export const MAX_HEIGHT_INPUT = 100;

/** 仮想キャンバス幅 (px)。p.scale(p.width / CANVAS_VIRTUAL_WIDTH) で実キャンバス幅に合わせる */
export const CANVAS_VIRTUAL_WIDTH = 1000;
/** 目盛り線の左右マージン (px) */
export const SCALE_LINE_MARGIN = 100;
/** 地面の高さ (px) */
export const GROUND_HEIGHT = 50;
/** 建物の高さ (px)。MAX_HEIGHT_INPUT (m) に対応する見た目上の高さ */
export const BUILDING_HEIGHT = 400;
/** 高さ (m) をピクセルに換算する係数 */
export const HEIGHT_SCALE = BUILDING_HEIGHT / MAX_HEIGHT_INPUT;

/** ラベルテキストのサイズ (px) */
export const LABEL_TEXT_SIZE = 16;
/** 状態表示テキストのサイズ (px) */
export const STATUS_TEXT_SIZE = 18;
/** 目盛り線の破線パターン */
export const SCALE_LINE_DASH = [10, 6];
/** 線の太さ (px) */
export const LINE_STROKE_WEIGHT = 2;
