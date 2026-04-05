// state.js はシミュレーションの共有可変状態を管理するファイルです。

export const MEDIUM_QUANTITY = 100;

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
  accelerationButton: null,
};
