import { describe, it, expect } from "vitest";
import { computeDragFreeFall } from "../../../vite/simulations/free-fall/js/physics.js";

describe("computeDragFreeFall", () => {
  it("k が0のとき等加速度運動の式と一致する", () => {
    const { distanceFallen, velocity } = computeDragFreeFall({
      t: 1,
      gravity: 9.8,
      k: 0,
    });

    expect(velocity).toBeCloseTo(9.8, 5);
    expect(distanceFallen).toBeCloseTo(0.5 * 9.8 * 1 ** 2, 5);
  });

  it("k が正の場合、速度は終端速度 gravity/k に漸近する", () => {
    const gravity = 9.8;
    const k = 1;
    const terminalVelocity = gravity / k;

    const { velocity } = computeDragFreeFall({ t: 50, gravity, k });

    expect(velocity).toBeCloseTo(terminalVelocity, 3);
  });

  it("k が NaN の場合は抵抗なし扱いとして NaN を伝播させない", () => {
    const { distanceFallen, velocity } = computeDragFreeFall({
      t: 1,
      gravity: 9.8,
      k: NaN,
    });

    expect(Number.isFinite(velocity)).toBe(true);
    expect(Number.isFinite(distanceFallen)).toBe(true);
    expect(velocity).toBeCloseTo(9.8, 5);
  });

  it("k が Infinity の場合は抵抗なし扱いとして NaN を伝播させない", () => {
    const { distanceFallen, velocity } = computeDragFreeFall({
      t: 1,
      gravity: 9.8,
      k: Infinity,
    });

    expect(Number.isFinite(velocity)).toBe(true);
    expect(Number.isFinite(distanceFallen)).toBe(true);
  });
});
