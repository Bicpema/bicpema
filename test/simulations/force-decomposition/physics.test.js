import { describe, it, expect } from "vitest";
import { decomposeForce } from "../../../vite/simulations/force-decomposition/js/physics.js";

describe("decomposeForce", () => {
  it("0度では全て水平成分になる", () => {
    const { x, y } = decomposeForce(10, 0);

    expect(x).toBeCloseTo(10, 10);
    expect(y).toBeCloseTo(0, 10);
  });

  it("90度では全て垂直成分になる（画面座標系では上向き=負）", () => {
    const { x, y } = decomposeForce(10, 90);

    expect(x).toBeCloseTo(0, 10);
    expect(y).toBeCloseTo(-10, 10);
  });

  it("45度では水平・垂直成分が等しくなる", () => {
    const { x, y } = decomposeForce(10, 45);

    expect(x).toBeCloseTo(-y, 10);
    expect(x).toBeCloseTo(10 * Math.cos(Math.PI / 4), 10);
  });

  it("分解した成分の大きさの二乗和は元の力の大きさの二乗に等しい（三平方の定理）", () => {
    const magnitude = 7;
    const { x, y } = decomposeForce(magnitude, 37);

    expect(x * x + y * y).toBeCloseTo(magnitude * magnitude, 8);
  });

  it("180度では負の水平成分になる", () => {
    const { x, y } = decomposeForce(10, 180);

    expect(x).toBeCloseTo(-10, 10);
    expect(y).toBeCloseTo(0, 10);
  });
});
