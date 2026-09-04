/** 仮想キャンバス幅 (px) */
export const CANVAS_WIDTH = 1000;
/** 仮想キャンバス高さ (px) */
export const CANVAS_HEIGHT = (1000 * 9) / 16;

/** 車の速度の最小値 (cm/s) */
export const MIN_CAR_SPEED = 1;
/** 車の速度の最大値 (cm/s) */
export const MAX_CAR_SPEED = 20;
/** 車の描画幅 (px)。高さは0を指定し、アスペクト比を保って自動調整する */
export const CAR_IMAGE_WIDTH = 100;
/** シミュレーションのフレームレート (fps) */
export const FRAME_RATE = 60;
/** 距離 (cm) をピクセルに換算する係数。1cmあたりのピクセル数 */
export const PX_PER_DISTANCE_UNIT = 50;
/** 低速な車でも軌跡データが画面幅全体に届くようにするための基準距離 (cm) */
export const CAR_TRAJECTORY_DISTANCE_THRESHOLD = 20;
/** グラフの経過時間軸の最大値、および軌跡・速度データの既定の記録点数 (s) */
export const DEFAULT_SIMULATION_DURATION = 10;

/** 車線ごとに確保する縦方向の領域の高さ (px)。道路帯の位置・スケール表示・車の位置合わせに使用 */
export const ROAD_AREA_HEIGHT = 50;
/** 道路帯の描画高さ (px) */
export const ROAD_HEIGHT = 25;
/** レイアウト切り替えの基準となる画面幅の閾値 (px) */
export const RESPONSIVE_BREAKPOINT = 992;
/** グラフ表示エリアの、キャンバス下端からの上方向マージン (px) */
export const GRAPH_TOP_OFFSET = 125;
/** グラフ切り替えボタンの、キャンバス下端からの上方向マージン (px) */
export const GRAPH_BUTTON_TOP_OFFSET = 140;

/** グラフタイトルのフォントサイズ (px) */
export const CHART_TITLE_FONT_SIZE = 20;
/** グラフの凡例・軸タイトルのフォントサイズ (px) */
export const CHART_LABEL_FONT_SIZE = 16;
/** 目盛りラベルのフォントサイズ (px)。Chart.jsの目盛りと、スケール表示の数値ラベルで共通利用 */
export const TICK_LABEL_FONT_SIZE = 14;
/** 黄色い車のグラフ表示色 */
export const YELLOW_CAR_COLOR = "rgb(200, 200, 50)";
/** 赤い車のグラフ表示色 */
export const RED_CAR_COLOR = "rgb(255, 0, 0)";

/** スケール目盛りの最小間隔 (px) */
export const SCALE_MINOR_TICK_INTERVAL = 5;
/** スケール主目盛り線の終端位置のオフセット (px) */
export const SCALE_MAJOR_TICK_LINE_END_OFFSET = 30;
/** スケール副目盛り線の終端位置のオフセット (px) */
export const SCALE_MINOR_TICK_LINE_END_OFFSET = 40;
/** スケール主目盛りラベルの表示位置のオフセット (px) */
export const SCALE_LABEL_OFFSET = 10;
