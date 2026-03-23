// state.js はシミュレーションの共有可変状態を管理するファイルです。

export const state = {
  /** 変圧器本体の画像 */
  img1: null,
  /** 一次コイルの画像 */
  img2: null,
  /** 二次コイルの画像 */
  img3: null,
  /** 一次コイルの巻数 - 1（表示は count1+1） */
  count1: 19,
  /** 二次コイルの巻数 - 1（表示は count2+1） */
  count2: 4,
  /** 波数 */
  k: 5,
  /** 角速度 */
  omega: 1,
  /** 時刻 */
  t: 0,
  /** 位相（true: 同位相, false: 逆位相） */
  phase: true,
  /** 巻数の最小値 - 1 */
  minCount: 4,
  /** 巻数の最大値 - 1 */
  maxCount: 19,
  /** コイルの傾き角度（度） */
  angle: -20,
  /** 振幅 */
  amp: 30,
  /** 一次コイル最上部のY座標 */
  topY1: 0,
  /** 二次コイル最上部のY座標 */
  topY2: 0,
  /** DOM参照 */
  phaseRadios: null,
  speedRadios: null,
  coil1PlusBtn: null,
  coil1MinusBtn: null,
  coil2PlusBtn: null,
  coil2MinusBtn: null,
  count1Display: null,
  count2Display: null,
};
