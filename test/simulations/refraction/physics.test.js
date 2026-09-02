import { describe, it, expect } from "vitest";
import {
  computeSnellRatio,
  computeRefractionAngle,
} from "../../../vite/simulations/refraction/js/physics.js";

describe("computeSnellRatio", () => {
  it("入射角0では0を返す", () => {
    expect(computeSnellRatio(0, 1.5)).toBe(0);
  });

  it("sin(θ1)/n12 の式に一致する", () => {
    const theta1 = 0.5;
    const n12 = 1.5;

    expect(computeSnellRatio(theta1, n12)).toBeCloseTo(
      Math.sin(theta1) / n12,
      10
    );
  });
});

describe("computeRefractionAngle (スネルの法則)", () => {
  it("n1=n2（同じ媒質）のとき屈折角は入射角と等しい", () => {
    const theta1 = 0.4;
    const n12 = 1; // n2/n1 = 1

    expect(computeRefractionAngle(theta1, n12)).toBeCloseTo(theta1, 10);
  });

  it("n1 sinθ1 = n2 sinθ2 の関係を満たす", () => {
    const n1 = 1;
    const n2 = 1.5;
    const n12 = n2 / n1;
    const theta1 = 0.6;

    const theta2 = computeRefractionAngle(theta1, n12);

    expect(n1 * Math.sin(theta1)).toBeCloseTo(n2 * Math.sin(theta2), 10);
  });

  it("屈折率の大きい媒質へ入射すると屈折角は入射角より小さくなる", () => {
    const theta1 = 0.6;
    const n12 = 1.5; // n2 > n1

    const theta2 = computeRefractionAngle(theta1, n12);

    expect(theta2).toBeLessThan(theta1);
  });

  it("屈折率の小さい媒質へ入射すると屈折角は入射角より大きくなる", () => {
    const theta1 = 0.3;
    const n12 = 1 / 1.5; // n2 < n1

    const theta2 = computeRefractionAngle(theta1, n12);

    expect(theta2).toBeGreaterThan(theta1);
  });
});
