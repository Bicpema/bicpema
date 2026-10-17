// constants.ts は定数管理専用のファイルです。

/** フレームレート。60fps標準の物理アニメーションのため60に設定する */
export const FPS = 60;
/** 仮想キャンバス幅（実キャンバス幅との比で拡大縮小する） */
export const V_W = 1000;
/** 仮想ピクセル/メートル（1m = 10 仮想px） */
export const PX_PER_METER = 10;

/** 加速度の初期値 (m/s²)。index.html の accelerationInput の value と一致させる */
export const DEFAULT_ACCELERATION = 2;
/** v-tグラフへ点を追加するフレーム間隔（0.1秒ごと） */
export const SAMPLE_EVERY_FRAMES = FPS / 10;

/** 電車の中心x座標（仮想ピクセル）。電車は画面中央に固定し、背景が流れる */
export const TRAIN_X = V_W / 2;
/** 電車の半幅（仮想ピクセル） */
export const TRAIN_HALF_W = 100;
/** 地面（レール上端）のy座標を仮想キャンバス高さに対する比率で表した値 */
export const GROUND_Y_RATIO = 0.72;
/** 電車の車体色 [R, G, B]。v-tグラフの線色にも使用し、両者の色を一致させる */
export const TRAIN_BODY_COLOR_RGB = [30, 100, 200] as const;

/** 枕木の間隔（仮想ピクセル。4m） */
export const TIE_SPACING = 40;
/** 距離標の間隔（仮想ピクセル。20m） */
export const MARKER_SPACING = 200;

/** v-tグラフのx軸の初期最大値と下限 (s) */
export const CHART_X_MIN_MAX = 10;
/** v-tグラフのy軸の初期最大値と下限 (m/s) */
export const CHART_Y_MIN_MAX = 5;
/** 軸の最大値を実データ最大値から広げる倍率 */
export const CHART_MAX_RATIO = 1.2;
