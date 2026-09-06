// constants.js は本シミュレーション内で共有する定数を管理するファイルです。

/** フレームレート */
export const FPS = 60;
/** 描画座標系の幅 */
export const W = 1000;
/** 描画座標系の高さ */
export const H = ((1000 * 9) / 16) * 0.9;
/** 音源の初期X座標（背景グリッドの原点X座標でもある） */
export const ORIGIN_X = 50;
/** 音速 (m/s) */
export const SOUND_SPEED = 340;
/** 背景グリッドの間隔(px) */
export const GRID_STEP = 10;
/** 太線を描画するグリッド間隔(px) */
export const MAJOR_GRID_INTERVAL = 100;
/** 太いグリッド線の太さ */
export const MAJOR_GRID_STROKE_WEIGHT = 2;
/** 細いグリッド線の太さ */
export const MINOR_GRID_STROKE_WEIGHT = 1;
