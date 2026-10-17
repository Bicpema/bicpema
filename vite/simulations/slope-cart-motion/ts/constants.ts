// constants.js はマジックナンバーを排除するための名前付き定数を管理するファイルです。

/** 重力加速度 (m/s²) */
export const GRAVITY = 9.8;

/** v-tグラフの「記録テープのデータ」系列の色（点・線で共通） */
export const RECORDED_DATA_COLOR = "rgb(220, 60, 60)";

/** v-tグラフの軸タイトルの共通フォントサイズ */
export const AXIS_TITLE_FONT_SIZE = 14;

/** v-tグラフの目盛りラベルの共通フォントサイズ */
export const AXIS_TICK_FONT_SIZE = 12;

// ============================================================
// 情報パネル（左上）のレイアウト・配色（仮想座標系: 1000×562）
// ============================================================

/** パネル左上のx・y座標 */
export const INFO_PANEL_X = 14;
export const INFO_PANEL_Y = 14;
/** パネルの幅 */
export const INFO_PANEL_W = 250;
/** パネルの角丸半径 */
export const INFO_PANEL_RADIUS = 12;
/** パネル内側の余白（左右） */
export const INFO_PANEL_PADDING_X = 16;
/** パネル内側の余白（上下） */
export const INFO_PANEL_PADDING_Y = 10;
/** 1行の高さ */
export const INFO_PANEL_ROW_H = 34;
/** 行ラベル（時刻 t など）の文字サイズ */
export const INFO_PANEL_LABEL_SIZE = 12;
/** 数値の文字サイズ */
export const INFO_PANEL_VALUE_SIZE = 20;
/** 単位の文字サイズ */
export const INFO_PANEL_UNIT_SIZE = 12;
/** 単位の表示幅（数値の右端を揃えるための固定幅） */
export const INFO_PANEL_UNIT_W = 40;
/** 数値に使う等幅フォント（桁ずれ防止） */
export const INFO_PANEL_NUMBER_FONT =
  "ui-monospace, Menlo, Consolas, monospace";
/** パネル背景色 */
export const INFO_PANEL_BG_COLOR = "rgb(255, 255, 255)";
/** パネルの枠線色 */
export const INFO_PANEL_BORDER_COLOR = "rgb(209, 213, 219)";
/** 区切り線の色 */
export const INFO_PANEL_DIVIDER_COLOR = "rgb(229, 231, 235)";
/** ラベル・単位の文字色 */
export const INFO_PANEL_MUTED_COLOR = "rgb(107, 114, 128)";
/** 数値の文字色 */
export const INFO_PANEL_VALUE_COLOR = "rgb(17, 24, 39)";
/** パネルの影 */
export const INFO_PANEL_SHADOW = "rgba(0, 0, 0, 0.18)";
