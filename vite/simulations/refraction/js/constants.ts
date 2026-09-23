// constants.js は本シミュレーション内で共有する定数を管理するファイルです。

/** 入射側媒質の屈折率の初期値 */
export const INITIAL_N1 = 1;
/** 屈折側媒質の屈折率の初期値 */
export const INITIAL_N2 = 1.5;

/** 光源回転角の可動範囲（度）。±この値でクランプする */
export const ANGLE_LIMIT_DEG = 90;
/** 光源回転の1クリックあたりの変化量（度） */
export const ROTATE_STEP_DEG = 0.1;
/** 長押し継続時の光源回転の変化量（度） */
export const ROTATE_FAST_STEP_DEG = 0.5;
/** 屈折率の1クリックあたりの変化量 */
export const N_STEP = 0.1;
/** 屈折率の下限値 */
export const N_MIN = 0.1;
/** 長押しとみなすまでのフレーム数 */
export const LONG_PRESS_ACTIVATE_FRAMES = 10;
/** 長押しを高速変化に切り替えるフレーム数 */
export const LONG_PRESS_FAST_FRAMES = 30;

/** リモコンのクリック当たり判定半径（リモコン画像幅に対する除数） */
export const HIT_RADIUS_DIVISOR = 20;
/** リモコンボタンの当たり判定x位置（リモコン画像幅に対する分子、共通） */
export const REMOCON_HOTSPOT_X_NUMERATOR = 9;
/** リモコン上ボタンの当たり判定y位置（分子） */
export const REMOCON_HOTSPOT_TOP_Y_NUMERATOR = 3;
/** リモコン下ボタンの当たり判定y位置（分子） */
export const REMOCON_HOTSPOT_BOTTOM_Y_NUMERATOR = 7;
/** リモコンボタン位置の比率の分母 */
export const REMOCON_HOTSPOT_RATIO_DENOMINATOR = 10;
/** リモコン画像の初期リサイズ幅（キャンバス幅に対する除数） */
export const REMOCON_RESIZE_WIDTH_DIVISOR = 6;
/** リモコン上の数値ラベルのx位置オフセット（分子） */
export const REMOCON_LABEL_OFFSET_NUMERATOR = 5;
/** リモコン上の数値ラベルのx位置オフセット（分母） */
export const REMOCON_LABEL_OFFSET_DENOMINATOR = 12;
/** リモコン上の数値ラベル表示枠の幅（リモコン画像幅に対する除数） */
export const REMOCON_LABEL_WIDTH_DIVISOR = 3;
/** リモコン上の数値ラベル表示枠の高さ（リモコン画像高さに対する除数） */
export const REMOCON_LABEL_HEIGHT_DIVISOR = 2;
/** リモコン上の数値ラベルのy位置オフセット（リモコン画像高さに対する除数） */
export const REMOCON_LABEL_Y_OFFSET_DIVISOR = 4;

/** 光源の長さ（キャンバス高さに対する除数）。光線の起点半径の計算にも使う */
export const LIGHT_SOURCE_LENGTH_DIVISOR = 6;

/** 表示モードタブの数 */
export const MODE_TAB_COUNT = 4;
/** 表示モードタブ1つあたりの幅（キャンバス幅に対する除数） */
export const MODE_TAB_WIDTH_DIVISOR = 8;
/** 表示モードタブの高さ（キャンバス高さに対する除数） */
export const MODE_TAB_HEIGHT_DIVISOR = 20;

/** 入射角側の弧・ラベルの色（マゼンタ） */
export const INCIDENT_ANGLE_COLOR = [255, 0, 255];
/** 入射角の余角側の弧の色（シアン） */
export const COMPLEMENT_ANGLE_COLOR = [0, 255, 255];
/** 屈折角側の弧の色（緑） */
export const REFRACTED_ANGLE_COLOR = [0, 255, 0];
/** 光線の色（赤） */
export const RAY_COLOR = [255, 0, 0];
/** 中心軸線の色（半透明の白） */
export const AXIS_LINE_COLOR = [255, 100];

/** 角度を示す弧の直径（キャンバス高さに対する除数） */
export const ANGLE_ARC_DIAMETER_DIVISOR = 10;
/** 角度ラベルのx位置オフセット（分子） */
export const ANGLE_LABEL_X_OFFSET_NUMERATOR = 2;
/** 角度ラベルのy位置オフセット（分子） */
export const ANGLE_LABEL_Y_OFFSET_NUMERATOR = 4;
/** 角度ラベルの位置オフセットの分母 */
export const ANGLE_LABEL_OFFSET_DENOMINATOR = 50;
