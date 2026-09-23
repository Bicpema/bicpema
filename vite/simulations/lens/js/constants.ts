// constants.js は本シミュレーション内で共有する定数を管理するファイルです。

/** ヘッダー分の高さ（キャンバスサイズ計算で共通して使用） */
export const HEADER_HEIGHT = 60;

/** 光学ベンチの実長（cm）。物体・スクリーン・焦点距離のラベル表示に使用 */
export const WORKBENCH_LENGTH_CM = 15;

/** 物体・スクリーンの土台（マウント）の幅 */
export const MOUNT_WIDTH = 50;
/** 物体・スクリーンの土台（マウント）の高さ */
export const MOUNT_HEIGHT = 25;

/** 方眼の目盛り線の色（半透明の白） */
export const GRID_LINE_COLOR = [255, 100];
/** 焦点マークの縦方向の半分の長さ */
export const FOCUS_MARK_HALF_LENGTH = 30;

/** 虚像・実像の枠線の色（青） */
export const IMAGE_COLOR = [0, 0, 255];
/** 物体・結像位置を示す枠線の色（赤） */
export const OBJECT_COLOR = [255, 0, 0];
/** スクリーン上のインジケーターの色（緑） */
export const SCREEN_INDICATOR_COLOR = [0, 255, 0];
/** スクリーンの目盛り線の色（暗めの半透明白） */
export const SCREEN_TICK_COLOR = [255, 50];

/** 半分の凸レンズ・縞々レンズの遮蔽部の色（グレー） */
export const LENS_MOUNT_COLOR = 100;
/** 半分の凸レンズにおける投影像の透過度（アルファ値） */
export const TINT_ALPHA_NORMAL = 100;
/** 縞々レンズの遮蔽帯における投影像の透過度（アルファ値） */
export const TINT_ALPHA_DIM = 75;

/** 頭部画像の傾き角度（ラジアン） */
export const HEAD_TILT_ANGLE_RAD = Math.PI / 10;
