// state.js はシミュレーションの共有可変状態を管理するファイルです。

/** ナビゲーションバーの高さ(px) */
export const NAV_HEIGHT = 60;
/** 操作パネルの高さ = windowHeight / この値 */
export const CONTROL_PANEL_HEIGHT_DIVISOR = 10;
/** 操作パネルを何等分してボタンを配置するか */
export const BUTTON_COLUMN_DIVISOR = 8;
/** 坂の角度の初期値[°] */
export const DEFAULT_SLOPE_ANGLE = 20;
export const SLOPE_ANGLE_MIN = 0;
export const SLOPE_ANGLE_MAX = 89.9;
export const INPUT_STEP = 0.1;
/** 質量の初期値[kg] */
export const DEFAULT_WEIGHT = 15;
export const WEIGHT_MIN = 0;
export const WEIGHT_MAX = 20;
/** 重力加速度の初期値[m/s^2] */
export const DEFAULT_GRAVITY = 9.8;
export const GRAVITY_MIN = 0;
export const GRAVITY_MAX = 20;

/** シミュレーションの共有状態 */
export const state = {
  /** 操作パネルの背景div */
  backgroundDiv: null,
  /** スタートボタン */
  startButton: null,
  /** ストップボタン */
  stopButton: null,
  /** リセットボタン */
  resetButton: null,
  /** 坂の角度入力のラベル */
  slopeAngleButtonLabel: null,
  /** 坂の角度入力 */
  slopeAngleButton: null,
  /** 質量入力のラベル */
  weightButtonLabel: null,
  /** 質量入力 */
  weightButton: null,
  /** 重力加速度入力のラベル */
  gravityButtonLabel: null,
  /** 重力加速度入力 */
  gravityButton: null,
  /** 表示パターン切り替えボタン1 */
  sortButton1: null,
  /** 表示パターン切り替えボタン2 */
  sortButton2: null,
  /** 表示パターン切り替えボタン3 */
  sortButton3: null,
  /** 経過フレーム数（累積カウンタ） */
  count: 0,
  /** 坂の幅（px） */
  slopeWidth: 0,
  /** 地面のy座標（px） */
  groundHeight: 0,
  /** 物体の幅（px） */
  materialWidth: 0,
  /** 物体の高さ（px） */
  materialHeight: 0,
  /** 坂の基準点のx座標（px） */
  referencePoint: 0,
  /** レイアウトの最小単位（px） */
  minimumUnit: 0,
  /** シミュレーションが再生中かどうか */
  clickedCount: false,
  /** リセット直後かどうか */
  resetCount: true,
  /** 坂を滑る物体 */
  material: null,
};
