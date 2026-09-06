// constants.js は本シミュレーション内で共有する定数を管理するファイルです。

/**
 * フレームレート。崩壊曲線・原子グリッドの状態更新が中心で、
 * 60fpsの滑らかさは不要なため30に抑えている。
 */
export const FRAME_RATE = 30;

/** ヨウ素131の半減期（日） */
export const HALF_LIFE_IODINE_131 = 8;
/** 炭素14の半減期（年） */
export const HALF_LIFE_CARBON_14 = 5730;
/** セシウム137の半減期（年） */
export const HALF_LIFE_CESIUM_137 = 30;

/** 初期の半減期（炭素14） */
export const INITIAL_HALF_LIFE = HALF_LIFE_CARBON_14;
/** グラフの最大時間 = 半減期 * この倍率 */
export const MAX_YEARS_MULTIPLIER = 5;
/** 1フレームあたりの時間増分 = 半減期 / この分割数 */
export const TIME_STEPS_PER_MAX_YEARS = 150;

/** 原子グリッドの1辺の原子数の初期値 */
export const INITIAL_GRID_SIDE = 8;
/** 原子の総数の初期値 (= INITIAL_GRID_SIDE の2乗) */
export const INITIAL_ATOM_COUNT = INITIAL_GRID_SIDE * INITIAL_GRID_SIDE;
/** 原子グリッドの1辺の原子数の最小値 */
export const MIN_GRID_SIDE = 4;
/** 原子グリッドの1辺の原子数の最大値 */
export const MAX_GRID_SIDE = 30;
