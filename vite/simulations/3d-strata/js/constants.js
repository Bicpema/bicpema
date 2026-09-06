// constants.js は本シミュレーション内で共有する定数を管理するファイルです。

/** 初期カメラの視点位置X座標 */
export const CAMERA_EYE_X = 800;
/** 初期カメラの視点位置Y座標 */
export const CAMERA_EYE_Y = -500;
/** 初期カメラの視点位置Z座標 */
export const CAMERA_EYE_Z = 800;

/** 日本語フォント読み込み後の基本文字サイズ */
export const JA_FONT_SIZE = 25;

/** ワールド座標系の下限値（経度・緯度方向のマッピング先、格子線・柱状図の座標計算で共通使用） */
export const WORLD_MIN = -500;
/** ワールド座標系の上限値（経度・緯度・深さ方向のマッピング先、格子線・柱状図の座標計算で共通使用） */
export const WORLD_MAX = 500;
/** 格子線ループの上限（経度・緯度方向の全長。WORLD_MAX - WORLD_MINに相当） */
export const WORLD_SIZE = 1000;
/** 格子線の間隔 */
export const GRID_STEP = 50;
/** 座標ラベルを表示する間隔（GRID_STEPの倍数ごとに表示） */
export const GRID_LABEL_STEP = 100;

/** 背景色（明るいグレー） */
export const BACKGROUND_COLOR = 240;

/** 座標軸の線の太さ */
export const AXIS_STROKE_WEIGHT = 3;
/** 格子線・方角マークなど、座標軸以外の線の太さ */
export const GRID_STROKE_WEIGHT = 1;

/**
 * x軸（経度方向）の色（赤）
 * @type {readonly [number, number, number]}
 */
export const X_AXIS_COLOR = [255, 0, 0];
/**
 * y軸（緯度方向）の色（青）
 * @type {readonly [number, number, number]}
 */
export const Y_AXIS_COLOR = [0, 0, 255];
/**
 * z軸（深さ方向）の色（緑）
 * @type {readonly [number, number, number]}
 */
export const Z_AXIS_COLOR = [0, 255, 0];
/**
 * 格子線の色（半透明のグレー）
 * @type {readonly [number, number]}
 */
export const GRID_LINE_COLOR = [170, 150];

/** 柱状図（ボーリング柱状体）の不透明度 */
export const STRATA_COLUMN_ALPHA = 200;
/** 地層を結ぶ平面の不透明度 */
export const STRATA_PLANE_ALPHA = 150;
/** 柱状図の柱の幅・奥行き（ワールド座標系での大きさ） */
export const STRATA_COLUMN_SIZE = 50;

/**
 * 地点名マーカー（円錐）の色（赤）
 * @type {readonly [number, number, number]}
 */
export const PLACE_MARKER_COLOR = [255, 0, 0];
/** 地点名マーカー・ラベルの縦方向オフセット（柱状図最上部からの距離） */
export const PLACE_MARKER_VERTICAL_OFFSET = -25;

/** 地点名マーカーの回転演出における1フレームあたりの角度増分（度） */
export const ROTATION_INCREMENT_DEG = 2;

/**
 * 深さ方向スケールの一時的な固定値。
 * 今後軸ラベルの最小値と最大値をスライダーで変更できる仕様に変える必要がある（緊急的な措置）。
 */
export const Z_MIN_OVERRIDE = -53;
