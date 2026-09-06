// constants.js は本シミュレーション内で共有する定数を管理するファイルです。

/** 波源のX座標（横波側の描画範囲の左端でもある） */
export const WAVE_ORIGIN_X = 60;
/** 軸線の右余白（波の描画範囲の右端は p.width - この値） */
export const AXIS_RIGHT_MARGIN = 50;
/** 軸の矢印（三角形）の長さ */
export const ARROW_LENGTH = 10;

/** 通常の粒子の表示サイズ */
export const PARTICLE_SIZE = 5;
/** 注目粒子（フォーカス粒子）の表示サイズ */
export const FOCUS_PARTICLE_SIZE = 8;

/** 波を表す色（赤） */
export const WAVE_COLOR = [255, 0, 0];
/** 注目粒子の変位前（原点）を表す色（青） */
export const FOCUS_ORIGIN_COLOR = [0, 100, 255];
/** 変位を示す矢印の色（緑） */
export const ARROW_COLOR = [0, 200, 0];
