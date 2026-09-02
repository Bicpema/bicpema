import { describe, it, expect } from "vitest";
import { Cylinder } from "../../../vite/simulations/archimedes-principle/js/cylinder.js";

describe("Cylinder.getSubmergedFraction", () => {
  it("完全に水面より上にあるときは0を返す", () => {
    // 円柱底面(cy)が水面より上（bottomY <= waterSurfaceY）
    const cylinder = new Cylinder(0, 50, 20, 40, 1.0);

    expect(cylinder.getSubmergedFraction(100)).toBe(0);
  });

  it("完全に水没しているときは1を返す", () => {
    // 円柱頂面(cy-h)が水面より下（topY >= waterSurfaceY）
    const cylinder = new Cylinder(0, 300, 20, 40, 1.0);

    expect(cylinder.getSubmergedFraction(100)).toBe(1);
  });

  it("半分水没しているときは0.5を返す", () => {
    // waterSurfaceY=100, h=40 のとき bottomY=120 なら半分水没
    const cylinder = new Cylinder(0, 120, 20, 40, 1.0);

    expect(cylinder.getSubmergedFraction(100)).toBeCloseTo(0.5, 10);
  });
});

describe("Cylinder.update (アルキメデスの原理)", () => {
  it("密度が水より大きい（沈む）物体は完全水没状態で下向きに加速する", () => {
    const cylinder = new Cylinder(0, 300, 20, 40, 2.0); // 完全水没、密度2.0

    cylinder.update(100, 1000);

    expect(cylinder.ay).toBeGreaterThan(0); // 下向き加速度
  });

  it("密度が水より小さい（浮く）物体は完全水没状態で上向きに加速する", () => {
    const cylinder = new Cylinder(0, 300, 20, 40, 0.5); // 完全水没、密度0.5

    cylinder.update(100, 1000);

    expect(cylinder.ay).toBeLessThan(0); // 上向き加速度
  });

  it("密度が水と等しい物体は完全水没状態で加速度0になる（重力と浮力が釣り合う）", () => {
    const cylinder = new Cylinder(0, 300, 20, 40, 1.0); // 完全水没、密度1.0(水と同じ)

    cylinder.update(100, 1000);

    expect(cylinder.ay).toBeCloseTo(0, 10);
  });

  it("ドラッグ中は物理更新をスキップする", () => {
    const cylinder = new Cylinder(0, 300, 20, 40, 2.0);
    cylinder.dragging = true;
    const cyBefore = cylinder.cy;
    const vyBefore = cylinder.vy;

    cylinder.update(100, 1000);

    expect(cylinder.cy).toBe(cyBefore);
    expect(cylinder.vy).toBe(vyBefore);
  });

  it("水槽の底に到達すると跳ね返り、底より下には沈まない", () => {
    const cylinder = new Cylinder(0, 300, 20, 40, 5.0); // 非常に重い
    cylinder.vy = 50; // 大きな下向き速度

    cylinder.update(100, 320);

    expect(cylinder.cy).toBeLessThanOrEqual(320);
  });
});

describe("Cylinder.isOver", () => {
  it("円柱の範囲内の座標に対してtrueを返す", () => {
    const cylinder = new Cylinder(100, 200, 20, 40, 1.0);

    expect(cylinder.isOver(100, 180)).toBe(true);
  });

  it("円柱の範囲外の座標に対してfalseを返す", () => {
    const cylinder = new Cylinder(100, 200, 20, 40, 1.0);

    expect(cylinder.isOver(500, 500)).toBe(false);
  });
});
