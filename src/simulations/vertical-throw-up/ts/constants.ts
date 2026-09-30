/** 重力加速度 (m/s^2) */
export const GRAVITY = 9.8;
/** ボール半径 (px) */
export const BALL_RADIUS = 15;
/** 初速度の初期値 (m/s)。HTML側の初速度入力欄の初期値 (value="30") と対応 */
export const DEFAULT_INITIAL_VELOCITY = 30;
/** 初速度入力の最小値 (m/s) */
export const MIN_INITIAL_VELOCITY = 5;
/** 初速度入力の最大値 (m/s) */
export const MAX_INITIAL_VELOCITY = 50;

/** 仮想キャンバス幅 (px)。p.scale(p.width / CANVAS_VIRTUAL_WIDTH) で実キャンバス幅に合わせる */
export const CANVAS_VIRTUAL_WIDTH = 1000;
/** 地面の高さ (px) */
export const GROUND_HEIGHT = 50;
/** 地面の描画幅 (px)。左側のアニメーションエリアの幅に対応 */
export const GROUND_WIDTH = 545;
/** ボールの水平方向の描画位置 (px) */
export const BALL_X = 200;
/** アニメーションエリア上部の余白 (px)。最高到達点がエリア内に収まるよう高さスケール計算に使用 */
export const ANIMATION_AREA_TOP_MARGIN = 30;
/** 高さスケール計算時に確保する余裕の割合。値が小さいほど最高到達点の手前に余白ができる */
export const HEIGHT_SCALE_RATIO = 0.85;

/** 情報表示テキスト（最高到達点・速度・時間などのラベル）のサイズ (px) */
export const ANNOTATION_TEXT_SIZE = 14;
/** 最高到達点の目安線の破線パターン */
export const MAX_HEIGHT_LINE_DASH = [8, 8];
/** グラフのゼロライン（v-t グラフの y=0）の破線パターン */
export const ZERO_LINE_DASH = [5, 5];
