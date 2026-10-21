import { describe, it, expect } from "vitest";
import * as m from "../../vite/ts/physics/mechanics.js";

describe("mechanics", () => {
  it("加速度 a=F/m（質量0・力0・負の値）", () => {
    expect(m.computeAcceleration(10, 2)).toBe(5);
    expect(m.computeAcceleration(10, 0)).toBe(0);
    expect(m.computeAcceleration(0, 2)).toBe(0);
    expect(m.computeAcceleration(-6, 2)).toBe(-3);
    expect(m.computeAcceleration(6, -2)).toBe(0);
  });

  it("合力", () => {
    expect(m.computeNetForce([])).toBe(0);
    expect(m.computeNetForce([5, -3, 1])).toBe(3);
  });

  it("力の分解・合成（0°/90°）", () => {
    const f0 = m.decomposeForce(10, 0);
    expect(f0.x).toBeCloseTo(10);
    expect(f0.y).toBeCloseTo(0);
    const f90 = m.decomposeForce(10, 90);
    expect(f90.x).toBeCloseTo(0);
    expect(f90.y).toBeCloseTo(10);
    expect(m.composeForces({ x: 3, y: 0 }, { x: 0, y: 4 }).magnitude).toBe(5);
  });

  it("等加速度直線運動", () => {
    expect(m.computeUniformAccelVelocity(2, 3, 2)).toBe(8);
    expect(m.computeUniformAccelDisplacement(2, 3, 2)).toBe(10);
    expect(m.computeUniformAccelDisplacement(2, 3, 0)).toBe(0);
  });

  it("空気抵抗あり自由落下は k=0 で等加速度運動と一致し、終端速度に近づく", () => {
    const a = m.computeDragFreeFall({ t: 1, gravity: 9.8, k: 0 });
    expect(a.velocity).toBeCloseTo(9.8);
    expect(a.distanceFallen).toBeCloseTo(4.9);
    const b = m.computeDragFreeFall({ t: 100, gravity: 9.8, k: 0.5 });
    expect(b.velocity).toBeCloseTo(9.8 / 0.5, 5);
    expect(m.computeDragFreeFall({ t: 0, gravity: 9.8, k: 0.5 })).toEqual({
      distanceFallen: 0,
      velocity: 0
    });
  });

  it("斜面上の重力成分（0°/90°）", () => {
    const flat = m.computeSlopeGravityComponents(2, 0, 10);
    expect(flat.parallel).toBeCloseTo(0);
    expect(flat.perpendicular).toBeCloseTo(20);
    const wall = m.computeSlopeGravityComponents(2, 90, 10);
    expect(wall.parallel).toBeCloseTo(20);
    expect(wall.perpendicular).toBeCloseTo(0);
  });

  it("単振り子の周期", () => {
    expect(m.computePendulumPeriod(1, 9.8)).toBeCloseTo(2.0071, 3);
  });

  it("ばね", () => {
    expect(m.computeParallelSpringConstant([2, 3])).toBe(5);
    expect(m.computeSeriesSpringConstant([2, 2])).toBe(1);
    expect(m.computeSeriesSpringConstant([])).toBe(0);
    expect(m.computeSeriesSpringConstant([2, 0])).toBe(0);
    expect(m.computeSpringForce(4, -0.5)).toBe(-2);
  });
});
