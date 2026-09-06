// constants.js は本シミュレーション内で共有する定数を管理するファイルです。

/** 温度ラベルのフォントサイズ */
export const LABEL_FONT_SIZE = 12;
/** グラフ上の現在値ラベルの背景の高さ */
export const LABEL_HEIGHT = 14;
/** 高温側を表す色（凡例・曲線・現在点で共通） */
export const HOT_COLOR = [255, 0, 0];
/** 低温側を表す色（凡例・曲線・現在点で共通） */
export const COLD_COLOR = [0, 0, 255];
/** 分子の揺れ幅の温度に対するスケール係数 */
export const MOLECULE_JITTER_SCALE = 0.3;
/** 分子の揺れ幅の最大値 */
export const MOLECULE_JITTER_MAX = 11;
