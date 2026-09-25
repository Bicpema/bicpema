import type p5 from "p5";

/** シミュレーションの共有状態 */
export const state: {
  font: p5.Font | null;
  slopeAngle: number;
  mass: number;
  groundImg: p5.Image | null;
  slopeAngleInput: p5.Element | null;
  slopeAngleValue: p5.Element | null;
  massInput: p5.Element | null;
  massValue: p5.Element | null;
} = {
  /** フォント */
  font: null,
  /** 斜面の角度（度） */
  slopeAngle: 30,
  /** 斜面モードの質量（kg） */
  mass: 10,
  /** 地面テクスチャ画像（読み込み完了・失敗までnull） */
  groundImg: null,
  /** UI要素（p.select()で取得するまではnull） */
  slopeAngleInput: null,
  slopeAngleValue: null,
  massInput: null,
  massValue: null
};
