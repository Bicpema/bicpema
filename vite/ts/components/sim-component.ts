import type p5 from "p5";

/**
 * シミュレーションの描画部品が実装する共通インターフェース。
 * 状態の更新（update）と描画（draw）を分離し、
 * 一時停止中はupdateを呼ばずdrawのみを呼ぶことで描画抑制の方針に沿えるようにする。
 */
export interface SimComponent {
  /** 1フレーム分の状態を更新する */
  update(): void;
  /** p5インスタンスに描画する */
  draw(p: p5): void;
}
