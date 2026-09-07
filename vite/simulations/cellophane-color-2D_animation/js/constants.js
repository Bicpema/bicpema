// constants.js は本シミュレーション内で共有する定数を管理するファイルです。

/** 標準のframeRate */
export const FPS = 60;

/** カメラの原点からの距離(z方向)。setup()とwindowResized()で共通して使用 */
export const CAMERA_DISTANCE = 300;

/** 色計算の対象とする波長の下限(nm) */
export const WAVELENGTH_MIN = 380;
/** 色計算の対象とする波長の上限(nm) */
export const WAVELENGTH_MAX = 750;

/** 偏光板・セロハン・入力画像を配置するステージの一辺の長さ */
export const STAGE_SIZE = 200;
/** ステージの中心座標、およびステージの半分の長さに相当する値 */
export const STAGE_HALF_SIZE = STAGE_SIZE / 2;

/** セロハンの重なりを表現するための1枚あたりのz方向オフセット */
export const SHEET_Z_OFFSET = 0.1;

/** テープ幅を決めるsliderの最小値 */
export const TAPE_WIDTH_SLIDER_MIN = 10;
/** テープ幅を決めるsliderの最大値 */
export const TAPE_WIDTH_SLIDER_MAX = 400;
/** テープ幅を決めるsliderの初期値 */
export const TAPE_WIDTH_SLIDER_DEFAULT = 75;

/** 色計算前・初期化時に画像を塗りつぶす灰色のレベル(RGB各成分に使用) */
export const BLANK_IMAGE_GRAY_LEVEL = 200;

/** XYZ三刺激値をリニアsRGBへ変換する行列(CIE XYZ(D65) -> リニアsRGB) */
export const XYZ_TO_SRGB_MATRIX = [
  [3.2406, -1.5372, -0.4986],
  [-0.9689, 1.8758, 0.0415],
  [0.0557, -0.204, 1.057],
];

/** sRGBガンマ補正: リニア値がこの閾値以下の場合は線形変換を用いる */
export const SRGB_LINEAR_THRESHOLD = 0.0031308;
/** sRGBガンマ補正: 閾値以下での線形変換の係数 */
export const SRGB_LINEAR_SCALE = 12.92;
/** sRGBガンマ補正: 閾値超過時に使うガンマ値 */
export const SRGB_GAMMA = 2.4;
/** sRGBガンマ補正: 閾値超過時のスケール係数 */
export const SRGB_GAMMA_SCALE = 1.055;
/** sRGBガンマ補正: 閾値超過時のオフセット */
export const SRGB_GAMMA_OFFSET = 0.055;

/** グラフの凡例・軸タイトルの共通フォントサイズ */
export const GRAPH_LABEL_FONT_SIZE = 16;
/** グラフタイトルのフォントサイズ */
export const GRAPH_TITLE_FONT_SIZE = 20;
/** グラフの目盛りラベルのフォントサイズ */
export const GRAPH_TICK_FONT_SIZE = 14;
