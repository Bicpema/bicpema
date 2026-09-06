// constants.js は本シミュレーション内で共有する定数を管理するファイルです。

/** 振り子（おもり）の個数 */
export const BALL_COUNT = 100;
/** フレームレート */
export const FPS = 60;
/** 振り子の長さデータのCSV上の列インデックス */
export const LENGTH_COLUMN = 3;
/** 重力加速度 (m/s^2) */
export const GRAVITY = 9.8;
/** 振り子の長さ（データ上の単位）をメートルに変換する係数 */
export const LENGTH_TO_METER_FACTOR = 0.25 / 300;
/** おもり画像の表示幅 = キャンバス幅 / この値 */
export const WEIGHT_IMAGE_WIDTH_DIVISOR = 50;
/** 案内テキストのフォントサイズ = キャンバス幅 / この値 */
export const GUIDE_TEXT_SIZE_DIVISOR = 25;
/** 支点のY座標 */
export const PIVOT_Y = 100;
/** 経過時間ラベルのX座標 */
export const TIME_LABEL_X = 100;
/** 経過時間ラベルのY座標 */
export const TIME_LABEL_Y = 100;
