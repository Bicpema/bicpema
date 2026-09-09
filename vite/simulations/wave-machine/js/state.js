// state.js はシミュレーションの共有可変状態を管理するファイルです。

export const MEDIUM_QUANTITY = 100;

/** 媒質配置トラックの左右合計マージン(px)（ボタン/ストッパー用の余白） */
export const MEDIUM_TRACK_MARGIN = 200;
/** 描画コンテンツの左オフセット(px)（= MEDIUM_TRACK_MARGIN / 2） */
export const CONTENT_X_OFFSET = MEDIUM_TRACK_MARGIN / 2;
/** 波の振れ角の最大値（度） */
export const MAX_THETA = 30;
/** 振れ角から実際の波の角度への変換倍率 */
export const WAVE_FREQUENCY_SCALE = 6;
/** 振幅計算時にキャンバス高さを割る値 */
export const AMPLITUDE_SCALE_DIVISOR = 100;
/** ストッパー画像のリサイズ幅(px) */
export const STOPPER_WIDTH = 100;
/** ボタン画像のリサイズサイズ(px) */
export const BUTTON_SIZE = 50;

export const state = {
  mediums: null,
  /** 入射波の配列 */
  incidentWaves: [],
  /** 反射波の配列 */
  reflectedWaves: [],
  /** 波の速度 */
  speed: 1,
  /** 固定状態かどうか */
  fixedIs: true,
  /** ボタンがクリックされたかどうか */
  buttonClickedIs: true,
  /** ストッパーのX座標 */
  stopperX: 0,
  /** ストッパーのY座標 */
  stopperY: 0,
  /** ストッパーの参照 */
  stopper: null,
  /** ボタンの参照 */
  button: null,
  /** 減速ボタンの参照 */
  decelerationButton: null,
  /** 加速ボタンの参照 */
  accelerationButton: null
};
