import type p5 from "p5";
import type { SimComponent } from "./sim-component.js";

/**
 * 複数の SimComponent をまとめて扱うグループ。
 * 一時停止中は update() をスキップして draw(p) のみ実行し、
 * パフォーマンス方針（一時停止中の更新抑制）を構造で守れるようにする。
 */
export class ComponentGroup implements SimComponent {
  private readonly components: SimComponent[] = [];

  /**
   * @param isPaused - 一時停止中かどうかを返す関数（省略時: 常に再生中）
   */
  constructor(private readonly isPaused: () => boolean = () => false) {}

  /**
   * 部品を追加する。update / draw / reset / dispose は追加順に呼ばれる。
   * @param component - 追加する部品
   * @returns 追加した部品（`const arrow = group.add(new Arrow())` のように使える）
   */
  add<T extends SimComponent>(component: T): T {
    this.components.push(component);
    return component;
  }

  /** 一時停止中でなければ、全部品の状態を更新する */
  update(): void {
    if (this.isPaused()) return;
    for (const c of this.components) c.update();
  }

  /**
   * 全部品を描画する（一時停止中も描画する）。
   * @param p - p5インスタンス
   */
  draw(p: p5): void {
    for (const c of this.components) c.draw(p);
  }

  /** 全部品を初期状態に戻す */
  reset(): void {
    for (const c of this.components) c.reset();
  }

  /** 全部品を破棄し、グループから取り除く */
  dispose(): void {
    for (const c of this.components) c.dispose();
    this.components.length = 0;
  }
}
