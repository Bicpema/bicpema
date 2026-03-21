export const state = {
  /** 熱機関の4過程 (0~3) */
  stage: 0,
  /** おもりが乗っているか */
  weightOn: true,
  /** アニメーションカウンタ */
  t: 0,
  /** ピストンY座標（仮想1200x800座標系） */
  pistonY: 160,
  /** 炎画像 */
  img_flame: null,
  /** おもり画像 */
  img_weight: null,
  /** 氷画像 */
  img_ice: null,
  /** フォント */
  font: null,
  /** 再生中かどうか */
  isPlaying: true,
};
