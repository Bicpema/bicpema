import { describe, it, expect } from "vitest";
import { computeSlideDisplacement } from "../../../vite/simulations/normal-force/js/physics.js";

describe("computeSlideDisplacement", () => {
  it("count=0（経過時間0）では変位は0になる", () => {
    const { dx, dy } = computeSlideDisplacement(9.8, 30, 0);

    expect(dx).toBe(0);
    expect(dy).toBe(0);
  });

  it("角度0度（水平）では鉛直方向の変位は生じない", () => {
    const { dx, dy } = computeSlideDisplacement(9.8, 0, 60);

    expect(dx).toBeCloseTo(0, 10);
    expect(dy).toBeCloseTo(0, 10);
  });

  it("角度90度（垂直）では水平方向の変位は生じない", () => {
    const { dx, dy } = computeSlideDisplacement(9.8, 90, 60);

    expect(dx).toBeCloseTo(0, 8);
    expect(dy).toBeCloseTo(9.8 * 1, 8);
  });

  it("水平・鉛直成分は g*sinθ*cosθ, g*sin²θ の式に一致する", () => {
    const gravity = 9.8;
    const angleDeg = 30;
    const count = 120;
    const fps = 60;
    const theta = (angleDeg * Math.PI) / 180;
    const t = count / fps;

    const { dx, dy } = computeSlideDisplacement(gravity, angleDeg, count, fps);

    expect(dx).toBeCloseTo(gravity * Math.sin(theta) * Math.cos(theta) * t, 10);
    expect(dy).toBeCloseTo(gravity * Math.sin(theta) * Math.sin(theta) * t, 10);
  });

  it("角度が大きいほど鉛直方向の変位の割合が大きくなる", () => {
    const shallow = computeSlideDisplacement(9.8, 20, 60);
    const steep = computeSlideDisplacement(9.8, 70, 60);

    expect(steep.dy / steep.dx).toBeGreaterThan(shallow.dy / shallow.dx);
  });

  it("経過フレーム数(count)が増えるほど変位も大きくなる", () => {
    const early = computeSlideDisplacement(9.8, 30, 30);
    const later = computeSlideDisplacement(9.8, 30, 60);

    expect(later.dx).toBeGreaterThan(early.dx);
    expect(later.dy).toBeGreaterThan(early.dy);
  });
});
