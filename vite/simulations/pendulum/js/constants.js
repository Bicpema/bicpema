// constants.js は本シミュレーション内で共有する定数を管理するファイルです。

/** 重力加速度 (m/s^2) */
export const GRAVITY = 9.8;
/** 振れ角計算のデフォルトフレームレート */
export const DEFAULT_FPS = 60;
/** 支点のY座標 */
export const PIVOT_Y = 100;
/** 長さ入力(m)を内部の長さ単位(px)に変換する係数 */
export const LENGTH_INPUT_SCALE = 50;
/** 内部の長さ単位(px)を物理計算用のメートルに変換する係数 */
export const LENGTH_TO_METER_DIVISOR = LENGTH_INPUT_SCALE * 100;
/** おもりの表示半径 = キャンバス幅 / この値 */
export const BALL_RADIUS_DIVISOR = 50;
/** おもり画像の表示幅 = キャンバス幅 / この値 */
export const WEIGHT_IMAGE_WIDTH_DIVISOR = 18;
/** 振り子の初期の紐の長さ（内部単位） */
export const INITIAL_STRING_LENGTH = 500;
/** 左の振り子の初期の振れ角（度） */
export const INITIAL_LEFT_ANGLE_DEG = 10;
/** 右の振り子の初期の振れ角（度） */
export const INITIAL_RIGHT_ANGLE_DEG = 15;
/** グリッド線の間隔(px) */
export const GRID_STEP = 10;
/** 太線を描画するグリッド間隔(px) */
export const MAJOR_GRID_INTERVAL = 50;
/** 太いグリッド線の太さ */
export const GRID_STROKE_WEIGHT_MAJOR = 3;
/** 細いグリッド線の太さ */
export const GRID_STROKE_WEIGHT_MINOR = 1;
/** 背景線の透明度 */
export const BACKGROUND_STROKE_ALPHA = 100;
/** パネル枠線の太さ */
export const PANEL_BORDER_STROKE_WEIGHT = 5;
/** 残像表示の透明度 */
export const AFTERIMAGE_ALPHA = 150;
