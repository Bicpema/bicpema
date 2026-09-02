import { describe, it, expect } from "vitest";
import {
  computeConvexLensImageDistance,
  computeConcaveLensImageDistance,
  computeMagnification,
} from "../../../vite/simulations/lens/js/physics.js";

describe("computeConvexLensImageDistance", () => {
  it("b = a*f / (f - a) の式に一致する", () => {
    const a = 30;
    const f = 10;

    expect(computeConvexLensImageDistance(a, f)).toBeCloseTo(
      (a * f) / (f - a),
      10
    );
  });

  it("物体が焦点距離の2倍の位置にあるとき、像の距離の大きさも焦点距離の2倍になる", () => {
    const f = 10;
    const a = 2 * f;

    const b = computeConvexLensImageDistance(a, f);

    expect(Math.abs(b)).toBeCloseTo(2 * f, 8);
  });

  it("物体が焦点距離に近づくほど像の距離の大きさは大きくなる", () => {
    const f = 10;
    const farB = computeConvexLensImageDistance(9, f);
    const closerB = computeConvexLensImageDistance(9.9, f);

    expect(Math.abs(closerB)).toBeGreaterThan(Math.abs(farB));
  });
});

describe("computeConcaveLensImageDistance", () => {
  it("b = a*f / (a + f) の式に一致する", () => {
    const a = 30;
    const f = 10;

    expect(computeConcaveLensImageDistance(a, f)).toBeCloseTo(
      (a * f) / (a + f),
      10
    );
  });

  it("像までの距離の大きさは常に物体距離より小さくなる（凹レンズは縮小した虚像を作る）", () => {
    const a = 30;
    const f = 10;

    const b = computeConcaveLensImageDistance(a, f);

    expect(Math.abs(b)).toBeLessThan(a);
  });

  it("焦点距離が長いほど像までの距離も長くなる", () => {
    const a = 30;

    const shortF = computeConcaveLensImageDistance(a, 5);
    const longF = computeConcaveLensImageDistance(a, 20);

    expect(longF).toBeGreaterThan(shortF);
  });
});

describe("computeMagnification", () => {
  it("倍率は像の距離と物体の距離の比になる", () => {
    expect(computeMagnification(20, 10)).toBe(2);
    expect(computeMagnification(5, 10)).toBe(0.5);
  });
});
