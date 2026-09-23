// constants.js はマジックナンバーを排除するための名前付き定数を管理するファイルです。

/** ドラッグ判定のヒットマージン（アンカー・リングの半径に加算する余白, px） */
export const DRAG_HIT_MARGIN = 6;

/** 力の数値ラベル（T1・T2・W）で共通して使うフォントサイズ */
export const FORCE_LABEL_FONT_SIZE = 14;

/** リング・アンカー間の距離がこれ未満なら方向ベクトルが不安定として釣り合い計算をスキップする（px） */
export const MIN_STRING_LENGTH = 5;

/** 連立方程式の行列式がこれ未満なら2本の糸がほぼ平行とみなし解なしとする */
export const DETERMINANT_EPSILON = 0.01;
