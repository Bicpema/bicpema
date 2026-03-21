// グローバル状態管理オブジェクト
export const state = {
  /** 波の反射の種類を選択するセレクトボックス */
  reflectSelect: null,
  /** シミュレーション開始ボタン */
  startButton: null,
  /** シミュレーション停止ボタン */
  stopButton: null,
  /** シミュレーション再開ボタン */
  restartButton: null,
  /** シミュレーションリセットボタン */
  resetButton: null,
  /** 波の種類を選択するセレクトボックス */
  waveSelect: null,
  /** 波の移動速度を入力する数値入力 */
  speedInput: null,
  /** 波の振幅を入力する数値入力 */
  amplitudeInput: null,
  /** 媒質の波の配列 */
  mediumWave: [],
  /** 波の配列 */
  waveArr: [],
  /** 波の移動状態 */
  moveIs: false,
};
