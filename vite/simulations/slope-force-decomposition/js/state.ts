/** シミュレーションの共有状態 */
export const state = {
  /** フォント */
  font: null,
  /** 斜面の角度（度） */
  slopeAngle: 30,
  /** 斜面モードの質量（kg） */
  mass: 10,
  /** 地面テクスチャ画像（読み込み完了・失敗までnull） */
  groundImg: null as p5.Image | null,
  /** UI要素（p.select()で取得するまではnull） */
  slopeAngleInput: null as p5.Element | null,
  slopeAngleValue: null as p5.Element | null,
  massInput: null as p5.Element | null,
  massValue: null as p5.Element | null
};
