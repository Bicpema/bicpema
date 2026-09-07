// constants.js は本シミュレーション内で共有する定数を管理するファイルです。

/** 標準のframeRate */
export const FPS = 60;

/** セロハンの組数の上限（program上の制限、last_otherCellophaneNums等の要素数） */
export const MAX_CELLOPHANE_GROUPS = 15;

/** カメラのZ座標（原点からの距離）。setup()とwindowResized()の両方で使用 */
export const CAMERA_DISTANCE = 300;

/** 入力用白画像の一辺のサイズ (px) */
export const IMAGE_SIZE = 200;

/**
 * 入力画像の初期化に使う色（明るいグレー、不透明）。
 * createStartimg()とcolabNum2_normal()のpixels初期化で共通利用する。
 * @type {readonly [number, number, number, number]}
 */
export const INITIAL_PIXEL_COLOR = [200, 200, 200, 255];

/** セロハン等が無い場合の既定のグレー値（平行ニコル配置時の各チャンネル値） */
export const DEFAULT_GRAY = 200;

/** テープ幅を決定するsliderの最小値 (px) */
export const TAPE_WIDTH_SLIDER_MIN = 10;
/** テープ幅を決定するsliderの最大値 (px) */
export const TAPE_WIDTH_SLIDER_MAX = 400;
/** テープ幅を決定するsliderの初期値 (px) */
export const TAPE_WIDTH_SLIDER_DEFAULT = 75;

/** セロハン(偏光板含む)のサイズ(高さ)。テープの4隅の点の計算で使用 */
export const CELLOPHANE_RADIUS = 111;

/** 偏光板のサイズ（一辺の長さ） */
export const POLARIZER_SIZE = 200;
/** セロハン1枚あたりのZ方向の厚み */
export const CELLOPHANE_THICKNESS = 0.1;

/** 直交ニコル配置における、平行ニコル配置からの偏光板の角度オフセット (度) */
export const CROSSED_POLARIZER_OFFSET_DEG = 90;

/** 補助線のZ方向のオフセット */
export const GUIDE_LINE_Z_OFFSET = -60;
/** 補助線の片側の長さ（原点からの距離） */
export const GUIDE_LINE_HALF_LENGTH = 100;

/** XYZ表色系からsRGBへの変換行列（IEC 61966-2-1のsRGB変換行列） */
export const XYZ_TO_SRGB_MATRIX = [
  [3.2406, -1.5372, -0.4986],
  [-0.9689, 1.8758, 0.0415],
  [0.0557, -0.204, 1.057],
];

/** 等色関数・分散データを積算する波長の下限 (nm) */
export const WAVELENGTH_MIN = 380;
/** 等色関数・分散データを積算する波長の上限 (nm) */
export const WAVELENGTH_MAX = 750;

/** sRGBガンマ補正の線形区間・非線形区間の境界値 */
export const SRGB_GAMMA_THRESHOLD = 0.0031308;
/** sRGBガンマ補正の線形区間の傾き */
export const SRGB_LINEAR_SCALE = 12.92;
/** sRGBガンマ補正（非線形区間）のスケール係数 */
export const SRGB_GAMMA_SCALE = 1.055;
/** sRGBガンマ補正（非線形区間）の指数 (1/2.4) */
export const SRGB_GAMMA_EXPONENT = 1 / 2.4;
/** sRGBガンマ補正（非線形区間）のオフセット */
export const SRGB_GAMMA_OFFSET = 0.055;

/** 分割計算の初期バッチサイズ */
export const BATCH_SIZE_INITIAL = 100;
/** 分割計算のバッチサイズの下限（フレームレート低下時に縮小する） */
export const BATCH_SIZE_MIN = 25;
/** 分割計算のバッチサイズの上限（フレームレート余裕時に拡大する） */
export const BATCH_SIZE_MAX = 1000;
/** 分割計算のバッチサイズを拡大する際の倍率 */
export const BATCH_SIZE_GROWTH_FACTOR = 1.5;
/** 分割計算のバッチサイズを調整する基準となるフレームレート (fps) */
export const BATCH_FPS_THRESHOLD = 30;
