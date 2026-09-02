import { describe, it, expect } from "vitest";
import {
  computeEquilibriumTemperature,
  computeTemperatureAtTime,
} from "../../../vite/simulations/conservation-of-heat-and-specific-heat/js/physics.js";

describe("computeEquilibriumTemperature", () => {
  it("熱容量が等しい場合は平衡温度が単純な平均になる", () => {
    expect(computeEquilibriumTemperature(10, 10, 90, 10)).toBeCloseTo(50, 10);
  });

  it("熱容量が大きい側に平衡温度が引き寄せられる（熱量の保存）", () => {
    // 高温側の熱容量が低温側より大きい場合、平衡温度は高温側に近づく
    const teq = computeEquilibriumTemperature(90, 10, 95, 15);

    expect(teq).toBeGreaterThan((95 + 15) / 2);
  });

  it("熱量の保存則 C_hot*(Thot0-Teq) = C_cold*(Teq-Tcold0) を満たす", () => {
    const cHot = 30;
    const cCold = 70;
    const thot0 = 95;
    const tcold0 = 15;

    const teq = computeEquilibriumTemperature(cHot, cCold, thot0, tcold0);

    expect(cHot * (thot0 - teq)).toBeCloseTo(cCold * (teq - tcold0), 8);
  });
});

describe("computeTemperatureAtTime", () => {
  it("t=0では初期温度そのものになる", () => {
    expect(computeTemperatureAtTime(50, 95, 0.1, 0)).toBeCloseTo(95, 10);
  });

  it("時間が十分経過すると平衡温度に収束する", () => {
    const teq = 50;
    const result = computeTemperatureAtTime(teq, 95, 0.1, 1000);

    expect(result).toBeCloseTo(teq, 6);
  });

  it("緩和係数が大きいほど早く平衡温度に近づく", () => {
    const teq = 50;
    const t0 = 95;
    const t = 5;

    const slow = computeTemperatureAtTime(teq, t0, 0.05, t);
    const fast = computeTemperatureAtTime(teq, t0, 0.5, t);

    expect(Math.abs(fast - teq)).toBeLessThan(Math.abs(slow - teq));
  });
});
