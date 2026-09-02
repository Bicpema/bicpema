import { describe, it, expect } from "vitest";
import { Spring } from "../../../vite/simulations/elastic-force/js/class.js";
import { PX_PER_M } from "../../../vite/simulations/elastic-force/js/state.js";

describe("Spring", () => {
  it("初期状態では自然長のまま伸び縮みしていない", () => {
    const spring = new Spring(100, 200, 200, 50);

    expect(spring.currentLength).toBe(200);
    expect(spring.displacement).toBe(0);
    expect(spring.forceMagnitude).toBe(0);
  });

  it("伸びた分だけ変位(displacement)が正の値になる（PX_PER_Mでメートルに変換）", () => {
    const spring = new Spring(100, 200, 200, 50);
    spring.endX = 100 + 200 + PX_PER_M * 0.1; // 0.1m 伸ばす

    expect(spring.displacement).toBeCloseTo(0.1, 10);
  });

  it("縮んだ分だけ変位(displacement)が負の値になる", () => {
    const spring = new Spring(100, 200, 200, 50);
    spring.endX = 100 + 200 - PX_PER_M * 0.05; // 0.05m 縮める

    expect(spring.displacement).toBeCloseTo(-0.05, 10);
  });

  it("弾性力はフックの法則 F = k|x| に従う", () => {
    const spring = new Spring(100, 200, 200, 50);
    spring.endX = 100 + 200 + PX_PER_M * 0.1;

    expect(spring.forceMagnitude).toBeCloseTo(50 * 0.1, 10);
  });

  it("伸びでも縮みでも弾性力の大きさは変位の絶対値に比例する（符号を持たない）", () => {
    const stretched = new Spring(100, 200, 200, 50);
    stretched.endX = 100 + 200 + PX_PER_M * 0.1;
    const compressed = new Spring(100, 200, 200, 50);
    compressed.endX = 100 + 200 - PX_PER_M * 0.1;

    expect(stretched.forceMagnitude).toBeCloseTo(compressed.forceMagnitude, 10);
  });

  it("ばね定数が大きいほど同じ変位に対する弾性力が大きくなる", () => {
    const soft = new Spring(100, 200, 200, 10);
    const stiff = new Spring(100, 200, 200, 100);
    soft.endX = stiff.endX = 100 + 200 + PX_PER_M * 0.1;

    expect(stiff.forceMagnitude).toBeGreaterThan(soft.forceMagnitude);
  });

  it("isOverHandle() はバネ先端の判定半径内かどうかを返す", () => {
    const spring = new Spring(100, 200, 200, 50);

    expect(spring.isOverHandle(spring.endX, spring.endY)).toBe(true);
    expect(spring.isOverHandle(spring.endX + 1000, spring.endY)).toBe(false);
  });

  it("startDrag() / stopDrag() でドラッグ状態が切り替わる", () => {
    const spring = new Spring(100, 200, 200, 50);

    spring.startDrag(spring.endX);
    expect(spring.isDragging).toBe(true);

    spring.stopDrag();
    expect(spring.isDragging).toBe(false);
  });

  it("reset() で先端位置が自然長の位置に戻り、ドラッグ状態も解除される", () => {
    const spring = new Spring(100, 200, 200, 50);
    spring.endX = 500;
    spring.isDragging = true;

    spring.reset();

    expect(spring.endX).toBe(100 + 200);
    expect(spring.isDragging).toBe(false);
  });

  it("updateK() でばね定数を変更できる", () => {
    const spring = new Spring(100, 200, 200, 50);

    spring.updateK(80);

    expect(spring.k).toBe(80);
  });
});
