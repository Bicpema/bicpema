// constants.jsは物理定数・レイアウト値・色などシミュレーション全体で使う定数を定義する専用のファイルです。

/** キャンバスの論理幅 (px) */
export const CANVAS_WIDTH = 1000;
/** キャンバスの論理高さ (px)。16:9のアスペクト比 */
export const CANVAS_HEIGHT = (CANVAS_WIDTH * 9) / 16;
/** 地面の高さ（キャンバス下端から地面上端までの距離） (px) */
export const GROUND_HEIGHT = 50;
/** 1ピクセルあたり何Nの力か (N/px) */
export const FORCE_SCALE = 0.05;
/** 1メートルあたりのピクセル数 */
export const PIXELS_PER_METER = 60;
/** 台車がキャンバス右端をこの距離だけ超えたら自動リセットする (px) */
export const CART_RESET_MARGIN = 200;

/** 台車の初期x座標（論理ピクセル） */
export const INITIAL_CART_X = 250;
/** 質量入力の最小値 (kg) */
export const MIN_MASS_INPUT = 0.5;
/** 質量入力の最大値 (kg) */
export const MAX_MASS_INPUT = 5;

/** 台車の車輪半径 (px) */
export const CART_WHEEL_RADIUS = 28;
/** 台車の車体幅 (px) */
export const CART_BODY_WIDTH = 160;
/** 台車の車体高さ (px) */
export const CART_BODY_HEIGHT = 55;
/** 台車の荷台幅 (px) */
export const CART_BOX_WIDTH = 90;
/** 台車の荷台高さ (px) */
export const CART_BOX_HEIGHT = 70;

/** 力の矢印を表示する最小ドラッグ距離 (px)。これ未満では矢印を描画しない */
export const MIN_ARROW_DRAG_DISTANCE = 5;
/** 力の矢印の色 [R, G, B] */
export const FORCE_ARROW_COLOR = [200, 40, 40];
/** ドラッグ操作ヒントの線・矢印の色（グレースケール） */
export const DRAG_HINT_COLOR = 160;
/** 情報パネル内の補足テキストの色（グレースケール） */
export const INFO_PANEL_MUTED_TEXT_COLOR = 200;
