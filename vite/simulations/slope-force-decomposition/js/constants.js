/** 仮想キャンバス幅 */
export const V_W = 1000;
/** 仮想キャンバス高さ */
export const V_H = 562;
/** フレームレート */
export const FPS = 30;
/** 斜面モードのスケール (px/N) */
export const SLOPE_SCALE = 2.0;
/** 斜面モードの重力加速度 */
export const GRAVITY = 9.8;
/** ラベルテキストの共通フォントサイズ */
export const LABEL_FONT_SIZE = 16;
/**
 * 重力(mg)ベクトル・ラベル・凡例の色
 * @type {readonly [number, number, number]}
 */
export const GRAVITY_COLOR = [40, 170, 70];
/**
 * 斜面方向成分(mg sinθ)ベクトル・ラベル・凡例の色
 * @type {readonly [number, number, number]}
 */
export const PARALLEL_COLOR = [220, 50, 50];
/**
 * 斜面垂直方向成分(mg cosθ)ベクトル・ラベル・凡例の色
 * @type {readonly [number, number, number]}
 */
export const PERPENDICULAR_COLOR = [50, 100, 220];
/** ブロックの高さ（斜面座標系） */
export const BLOCK_HEIGHT = 36;
