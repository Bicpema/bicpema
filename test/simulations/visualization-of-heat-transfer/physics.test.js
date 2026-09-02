import { describe, it, expect } from "vitest";
import { computeTemperatureAtTime } from "../../../vite/simulations/visualization-of-heat-transfer/js/physics.js";

describe("computeTemperatureAtTime", () => {
  it("t=0では初期温度そのものになる", () => {
    expect(computeTemperatureAtTime(50, 95, 0.1, 0)).toBeCloseTo(95, 10);
  });

  it("時間が十分経過すると平衡温度に収束する", () => {
    const result = computeTemperatureAtTime(50, 95, 0.1, 1000);

    expect(result).toBeCloseTo(50, 6);
  });

  it("低温側の物体は平衡温度に向かって上昇する", () => {
    const early = computeTemperatureAtTime(50, 15, 0.1, 1);
    const later = computeTemperatureAtTime(50, 15, 0.1, 10);

    expect(later).toBeGreaterThan(early);
    expect(later).toBeLessThanOrEqual(50);
  });

  it("高温側の物体は平衡温度に向かって下降する", () => {
    const early = computeTemperatureAtTime(50, 95, 0.1, 1);
    const later = computeTemperatureAtTime(50, 95, 0.1, 10);

    expect(later).toBeLessThan(early);
    expect(later).toBeGreaterThanOrEqual(50);
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
