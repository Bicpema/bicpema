import { describe, it, expect } from "vitest";
import { decomposeGravityOnSlope } from "../../../vite/simulations/slope-force-decomposition/js/physics.js";

describe("decomposeGravityOnSlope", () => {
  it("重力の大きさは mg になる", () => {
    const { gravity } = decomposeGravityOnSlope(2, 9.8, 30);

    expect(gravity).toBeCloseTo(2 * 9.8, 10);
  });

  it("角度0度（水平）では斜面方向成分は0、垂直方向成分は重力そのものになる", () => {
    const { gravity, parallel, perpendicular } = decomposeGravityOnSlope(
      2,
      9.8,
      0
    );

    expect(parallel).toBeCloseTo(0, 10);
    expect(perpendicular).toBeCloseTo(gravity, 10);
  });

  it("角度90度（垂直な壁）では斜面方向成分が重力そのものになり、垂直方向成分は0になる", () => {
    const { gravity, parallel, perpendicular } = decomposeGravityOnSlope(
      2,
      9.8,
      90
    );

    expect(parallel).toBeCloseTo(gravity, 8);
    expect(perpendicular).toBeCloseTo(0, 8);
  });

  it("斜面方向・垂直方向成分は mg*sinθ, mg*cosθ の式に一致する", () => {
    const mass = 3;
    const gravity = 9.8;
    const angleDeg = 40;
    const theta = (angleDeg * Math.PI) / 180;

    const { parallel, perpendicular } = decomposeGravityOnSlope(
      mass,
      gravity,
      angleDeg
    );

    expect(parallel).toBeCloseTo(mass * gravity * Math.sin(theta), 10);
    expect(perpendicular).toBeCloseTo(mass * gravity * Math.cos(theta), 10);
  });

  it("分解した成分の二乗和は重力の大きさの二乗に等しい（三平方の定理）", () => {
    const { gravity, parallel, perpendicular } = decomposeGravityOnSlope(
      5,
      9.8,
      37
    );

    expect(parallel ** 2 + perpendicular ** 2).toBeCloseTo(gravity ** 2, 8);
  });

  it("角度が大きいほど斜面方向成分が大きくなる", () => {
    const shallow = decomposeGravityOnSlope(2, 9.8, 20);
    const steep = decomposeGravityOnSlope(2, 9.8, 70);

    expect(steep.parallel).toBeGreaterThan(shallow.parallel);
  });
});
