// constants.js は本シミュレーション内で共有する定数を管理するファイルです。

/** 仮想キャンバス幅 (scale(p.width/1000) で使用) */
export const VIRTUAL_W = 1000;
/** 仮想キャンバス高 (16:9) */
export const VIRTUAL_H = 562;

// 座標は元の820px幅から仮想1000px幅にスケール済み (×1000/820 ≈ 1.22)

/** ピストンの初期X座標（仮想座標系、元: 420） */
export const PISTON_INIT_X = 512;
/** シリンダー左端X座標（仮想座標系） */
export const CYL_LEFT = 183;
/** シリンダー上端Y座標（仮想座標系） */
export const CYL_TOP = 134;
/** シリンダー幅（仮想座標系） */
export const CYL_WIDTH = 634;
/** シリンダー高さ（仮想座標系） */
export const CYL_HEIGHT = 220;
/** シリンダー中心Y座標（仮想座標系） */
export const CYL_CENTER_Y = 244;
/** シリンダーの奥行き（楕円の幅、3D風表現用） */
export const CYL_DEPTH = 49;

/** 分子とピストン/壁との間に保つX方向の余白 */
export const MOLECULE_MARGIN = 27;
/** 分子の可動範囲の左端X座標 */
export const MOLECULE_X_MIN = 201;
/** 分子の可動範囲の上端Y座標 */
export const MOLECULE_Y_MIN = 146;
/** 分子の可動範囲の下端Y座標 */
export const MOLECULE_Y_MAX = 341;

/** ステップあたりの温度変化量 */
export const DT_UNIT = 0.3;
/** ステップあたりのピストン移動量（仮想座標系、元: 30） */
export const DV_UNIT = 37;
