// constants.js は本シミュレーション内で共有する定数を管理するファイルです。

/** 巻き線インデックスの最小値 */
export const TURNS_MIN = 4;
/** 巻き線インデックスの最大値 */
export const TURNS_MAX = 19;
/** 巻き線の増減ステップ */
export const TURNS_STEP = 5;

/** ラベルテキストの共通フォントサイズ */
export const LABEL_FONT_SIZE = 16;
/** 電流の矢印・ラベルの色（赤） */
export const CURRENT_COLOR = [255, 0, 0];
/** 一次電流の最大振幅 */
export const PRIMARY_CURRENT_AMPLITUDE = 15;
/** 電流矢印の矢じりの突出量スケール */
export const ARROWHEAD_PROTRUSION_SCALE = 10;

/** オシロスコープ描画領域の幅 */
export const OSCILLO_WIDTH = 200;
/** オシロスコープ描画領域の高さ */
export const OSCILLO_HEIGHT = 200;
/** オシロスコープの背景色 */
export const OSCILLO_BG_COLOR = [75, 127, 127, 220];
/** 波形の色（シアン） */
export const WAVEFORM_COLOR = [0, 255, 255];
/** 波形の線の太さ */
export const WAVEFORM_STROKE_WEIGHT = 2;
