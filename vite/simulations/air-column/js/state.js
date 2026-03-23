// state.js はシミュレーションの共有可変状態を管理するファイルです。

export const state = {
  /** 管の種類セレクト要素の参照 */
  typeSelect: null,
  /** 倍振動数増加ボタンの参照 */
  plusBtn: null,
  /** 倍振動数減少ボタンの参照 */
  minusBtn: null,
  /** 管の長さ増加ボタンの参照 */
  L_plusBtn: null,
  /** 管の長さ減少ボタンの参照 */
  L_minusBtn: null,
  /** 倍振動数表示スパンの参照 */
  mnDisplay: null,
  /** 管の長さ表示スパンの参照 */
  pipeLDisplay: null,
  /** アニメーション時刻 */
  time: 0,
  /** 管の種類: 'closed' または 'open' */
  type: "closed",
  /** 倍振動数 */
  m_n: 1,
  /** 気柱管の長さ (px) */
  pipeL: 400,
  /** 管の左端 X 座標 (px) */
  startX: 100,
  /** 管の中心 Y 座標 (px) */
  pipeY: 0,
  /** 波の振幅 (px) */
  Amp: 40,
  /** 残像描画用オフスクリーングラフィクス */
  waveLayer: null,
};
