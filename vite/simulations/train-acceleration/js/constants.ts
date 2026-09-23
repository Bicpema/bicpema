/** 加速度の初期値 (m/s²)。index.html の accelerationInput の value と一致させる */
export const DEFAULT_ACCELERATION = 2.0;
/** 電車の初期x座標を求める際の分母（仮想キャンバス幅の何分の1の位置に配置するか） */
export const TRAIN_START_X_DIVISOR = 3;
/** v-tグラフのデータを記録する間隔 (秒) */
export const GRAPH_UPDATE_INTERVAL = 0.1;

/** 地面y座標を仮想キャンバス高さに対する比率で表した値 */
export const GROUND_Y_RATIO = 0.72;
/** 地面の塗りつぶしを開始するy座標の、地面基準線からのオフセット (px)。線路の描画領域を地面の上に確保する */
export const GROUND_FILL_Y_OFFSET = 28;

/** 電車の半幅（仮想ピクセル） */
export const TRAIN_HALF_W = 100;
/** 電車描画時の線の太さ (px)。車体外枠・車輪外枠に使用 */
export const TRAIN_STROKE_WEIGHT = 2;
/** 電車の車体色 [R, G, B]。v-tグラフの線色にも使用し、両者の色を一致させる */
export const TRAIN_BODY_COLOR_RGB = [30, 100, 200];

/** 前照灯・尾灯の車体端からの水平オフセット (px) */
export const TRAIN_LIGHT_OFFSET_X = 6;
/** 前照灯・尾灯の車体下端からの垂直オフセット (px) */
export const TRAIN_LIGHT_OFFSET_Y = 10;
/** 前照灯・尾灯の幅 (px) */
export const TRAIN_LIGHT_WIDTH = 10;
/** 前照灯・尾灯の高さ (px) */
export const TRAIN_LIGHT_HEIGHT = 8;

/** 車輪外側の色 */
export const WHEEL_OUTER_COLOR = 60;
/** 車輪外側の縁取り色 */
export const WHEEL_OUTER_STROKE_COLOR = 40;
/** 車輪中心（ハブ）の色 */
export const WHEEL_HUB_COLOR = 100;
/** 車輪半径 (WHEEL_R) に対するハブ（中心部）の直径比率 */
export const WHEEL_HUB_DIAMETER_RATIO = 0.5;

/** 情報パネルの主要テキスト（速さ・時間）のサイズ (px) */
export const INFO_PANEL_PRIMARY_TEXT_SIZE = 22;
/** 情報パネルの補足テキスト（加速度）のサイズ (px) */
export const INFO_PANEL_SECONDARY_TEXT_SIZE = 16;

/** v-tグラフのタイトルのフォントサイズ (px) */
export const CHART_TITLE_FONT_SIZE = 18;
/** v-tグラフの凡例・軸タイトルのフォントサイズ (px) */
export const CHART_AXIS_LABEL_FONT_SIZE = 14;
/** v-tグラフの目盛りラベルのフォントサイズ (px) */
export const CHART_TICK_FONT_SIZE = 12;
/** x軸上限の最小値 (s) */
export const CHART_X_AXIS_MIN_MAX = 10;
/** x軸上限を切り上げる際の目盛り単位 (s) */
export const CHART_X_AXIS_ROUND_UNIT = 10;
/** y軸上限の最小値 (m/s) */
export const CHART_Y_AXIS_MIN_MAX = 5;
/** y軸上限を切り上げる際の目盛り単位 (m/s) */
export const CHART_Y_AXIS_ROUND_UNIT = 5;
/** y軸上限計算時に観測最大速度へ加える余裕分 (m/s) */
export const CHART_Y_AXIS_VELOCITY_MARGIN = 1;
