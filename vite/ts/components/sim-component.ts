import type p5 from "p5";

/**
 * シミュレーションの描画部品が実装する共通インターフェース。
 * 状態の更新（update）と描画（draw）を分離し、
 * 一時停止中はupdateを呼ばずdrawのみを呼ぶことで描画抑制の方針に沿えるようにする。
 * 複数の部品は ComponentGroup（component-group.ts）でまとめて扱える。
 */
export interface SimComponent {
  /** 1フレーム分の状態を更新する */
  update(): void;
  /** p5インスタンスに描画する */
  draw(p: p5): void;
  /** 状態を初期状態に戻す（シミュレーションのリセット時に呼ぶ） */
  reset(): void;
  /** 保持しているリソースを解放する。呼んだ後は再利用しない */
  dispose(): void;
}
