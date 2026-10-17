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
export const TRAIN_HALF_W = 120;
/** レール上端のy座標を仮想キャンバス高さに対する比率で表した値 */
export const GROUND_Y_RATIO = 0.7;

/** 枕木の間隔（仮想ピクセル。2.4m） */
export const TIE_SPACING = 24;
/** 距離標の間隔（仮想ピクセル。20m） */
export const MARKER_SPACING = 200;

/** 配色。他のシミュレーションと揃えた白背景の配色で、v-t図の線色と電車の車体色を揃える */
export const COLOR = {
  train: "rgb(60, 150, 255)",
  outline: "#2b3440",
  ground: "#6b4423",
  groundLight: "#c9a98a",
  sleeper: "#7a5230",
  rail: "#8a8f98",
  marker: "#c9a14a",
  text: "#444",
  textMuted: "#777",
  accelerating: "#16a34a",
  decelerating: "#dc2626"
} as const;

/** 文字のフォント（Zen Maru Gothic の読み込みが完了するまでの代替を含む） */
export const FONT_FAMILY =
  "'Zen Maru Gothic', 'Hiragino Maru Gothic ProN', sans-serif";
/** 他のシミュレーションと共通の丸ゴシックのフォントファイル */
export const FONT_URL =
  "https://firebasestorage.googleapis.com/v0/b/bicpema.firebasestorage.app/o/public%2Fassets%2Ffont%2FZenMaruGothic-Regular.ttf?alt=media&token=9b248da2-ed3a-46a3-b447-46a98775d580";

/** v-tグラフのx軸の初期最大値と下限 (s) */
export const CHART_X_MIN_MAX = 10;
/** v-tグラフのy軸の初期最大値と下限 (m/s) */
export const CHART_Y_MIN_MAX = 5;
/** 軸の最大値を実データ最大値から広げる倍率 */
export const CHART_MAX_RATIO = 1.2;
