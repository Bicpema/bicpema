/** 重力加速度 (m/s^2) */
export const GRAVITY = 9.8;
/** ボール半径 (px) */
export const BALL_RADIUS = 15;
/** 初速度のデフォルト値 (m/s) */
export const DEFAULT_INITIAL_VELOCITY = 10;
/** グラフデータ記録間隔 (秒) */
export const GRAPH_DATA_INTERVAL = 0.05;
/** 地面到達とみなす高さ (m)。この高さ以下になると運動を停止する */
export const GROUND_LEVEL_HEIGHT = 1;
/** 高さ入力の最小値 (m) */
export const MIN_HEIGHT_INPUT = 10;
/** 高さ入力の最大値 (m) */
export const MAX_HEIGHT_INPUT = 100;
/** 初速度入力の最小値 (m/s) */
export const MIN_INITIAL_VELOCITY_INPUT = 1;
/** 初速度入力の最大値 (m/s) */
export const MAX_INITIAL_VELOCITY_INPUT = 30;

/** 仮想キャンバス幅 (px)。p.scale(p.width / CANVAS_VIRTUAL_WIDTH) で実キャンバス幅に合わせる */
export const CANVAS_VIRTUAL_WIDTH = 1000;
/** 地面の高さ (px) */
export const GROUND_HEIGHT = 50;
/** 建物の高さ (px)。MAX_HEIGHT_INPUT (m) に対応する見た目上の高さ */
export const BUILDING_HEIGHT = 400;
/** 建物の中心X座標 (px) */
export const BUILDING_CENTER_X = 400;
/** 高さ (m) をピクセルに換算する係数 */
export const HEIGHT_SCALE = BUILDING_HEIGHT / MAX_HEIGHT_INPUT;

/** ラベルテキストのサイズ (px) */
export const LABEL_TEXT_SIZE = 16;
/** 状態表示テキストのサイズ (px) */
export const STATUS_TEXT_SIZE = 18;
/** 目盛り線の破線パターン */
export const SCALE_LINE_DASH = [10, 10];
/** 線の太さ (px) */
export const LINE_STROKE_WEIGHT = 2;

/** 速度ベクトル矢印の長さの速度倍率 (px / (m/s)) */
export const ARROW_LENGTH_VELOCITY_SCALE = 2;
/** 速度ベクトル矢印の最大長 (px) */
export const ARROW_MAX_LENGTH = 80;
