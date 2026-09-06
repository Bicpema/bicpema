// constants.js は本シミュレーション内で共有する定数を管理するファイルです。

/** ヘッダー分の高さ（キャンバスサイズ計算で共通して使用） */
export const HEADER_HEIGHT = 60;

/** キャンバス幅の分子（windowWidthに対する比率 2/3） */
export const CANVAS_WIDTH_NUMERATOR = 2;
/** キャンバス幅の分母（windowWidthに対する比率 2/3） */
export const CANVAS_WIDTH_DENOMINATOR = 3;
/** キャンバス高さの分子（使用可能高さに対する比率 8/9） */
export const CANVAS_HEIGHT_NUMERATOR = 8;
/** キャンバス高さの分母（使用可能高さに対する比率 8/9） */
export const CANVAS_HEIGHT_DENOMINATOR = 9;

/** 右側パネル（グラフ・光の色表示）の縦方向の分割数 */
export const RIGHT_PANEL_ROW_COUNT = 10;
/** スペクトルグラフの高さ（RIGHT_PANEL_ROW_COUNT分割中の行数） */
export const GRAPH_HEIGHT_ROWS = 4.5;
/** 等色関数グラフの上端位置（RIGHT_PANEL_ROW_COUNT分割中の行数オフセット） */
export const CMF_GRAPH_TOP_OFFSET_ROWS = 5.5;

/** 高DPI環境での過大な描画負荷を避けるための、pixelDensityの上限値 */
export const MAX_PIXEL_DENSITY = 2;
/** WEBGLで毎フレーム900本(rays_number × RGB3色)のRayを描画するため、負荷抑制用に設定するフレームレート */
export const FPS = 30;

/** 入射光の表示色（CSS背景色文字列、setup()とwindowResized()で共通利用） */
export const INCIDENT_LIGHT_CSS_COLOR = "rgb(144,181,130)";

/** 描画する光線の本数（RGB各色ごと） */
export const RAYS_PER_COLOR = 300;
/** 光線のZ座標の初期分布の起点 */
export const RAY_Z_START = 150;
/** 光線のZ座標の初期分布の範囲（RAY_Z_STARTから減算する幅の合計） */
export const RAY_Z_RANGE = 300;
/** 光線が往復するZ座標の上限・下限の絶対値（これを超えると反対側へリセットする） */
export const RAY_Z_LIMIT = 150;

/** 偏光板のZ座標の絶対値（開始側は+、終了側は-） */
export const POLARIZER_Z = 100;
/** 偏光板のサイズ（一辺の長さ） */
export const POLARIZER_SIZE = 125;

/** 波長700 nmの光の1フレーム当たりの回転角速度（度）。赤色光の基準値 */
export const ANGULAR_VELOCITY_R = (2 * 180) / 25;
/** 緑色光の角速度の、赤色光に対する比 */
export const ANGULAR_VELOCITY_RATIO_G = 0.78;
/** 青色光の角速度の、赤色光に対する比 */
export const ANGULAR_VELOCITY_RATIO_B = 0.62214285714;

/** 波長600 nm(赤)のセロハン1枚あたりの光路差 (nm) */
export const OPD_PER_SHEET_R = 212.596704;
/** 波長550 nm(緑)のセロハン1枚あたりの光路差 (nm) */
export const OPD_PER_SHEET_G = 213.5303046;
/** 波長450 nm(青)のセロハン1枚あたりの光路差 (nm) */
export const OPD_PER_SHEET_B = 215.5841246;

/** 赤色光の波長 (nm) */
export const WAVELENGTH_R = 600;
/** 緑色光の波長 (nm) */
export const WAVELENGTH_G = 550;
/** 青色光の波長 (nm) */
export const WAVELENGTH_B = 450;

/** 波を表現する際の振幅（sin波によるオフセット距離） */
export const WAVE_AMPLITUDE = 25;
/** 波を球で表現する際の球の半径 */
export const WAVE_POINT_RADIUS = 1.5;

/** 光の強さが強い（表示ON）ときの不透明度 */
export const FULL_OPACITY = 255;
/** 光の強さが弱い（表示OFFに近い）ときの不透明度 */
export const DIM_OPACITY = 50;
/** 波を線で表現する際の、表示OFFに近いときの線の太さ */
export const DIM_STROKE_WEIGHT = 0.1;

/**
 * 赤色光の表示色
 * @type {readonly [number, number, number]}
 */
export const RED_COLOR = [255, 0, 0];
/**
 * 緑色光の表示色
 * @type {readonly [number, number, number]}
 */
export const GREEN_COLOR = [0, 255, 0];
/**
 * 青色光の表示色
 * @type {readonly [number, number, number]}
 */
export const BLUE_COLOR = [0, 0, 255];
