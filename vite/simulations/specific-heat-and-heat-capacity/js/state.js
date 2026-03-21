// グローバル状態管理オブジェクト
export const state = {
  /** 物質Aの種類選択 (0=アルミ, 1=鉄, 2=銅, 3=銀, 4=水銀) */
  materialA: 0,
  /** 物質Bの種類選択 (0=アルミ, 1=鉄, 2=銅, 3=銀, 4=水銀) */
  materialB: 0,
  /** 物質Aの質量選択 (0=大/0.3kg, 1=小/0.1kg) */
  massA: 1,
  /** 物質Bの質量選択 (0=大/0.3kg, 1=小/0.1kg) */
  massB: 0,
  /** バーナー画像 */
  burnerImg: null,
  /** フォント */
  font: null,
  /** 物質A選択セレクト */
  materialSelectA: null,
  /** 物質B選択セレクト */
  materialSelectB: null,
  /** 物質A質量セレクト */
  massSelectA: null,
  /** 物質B質量セレクト */
  massSelectB: null,
};
