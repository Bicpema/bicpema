import { describe, it, expect } from "vitest";
import { computeTemperatureChange } from "../../../vite/simulations/specific-heat-and-heat-capacity/js/physics.js";

describe("computeTemperatureChange", () => {
  it("Q = mcΔT の関係から温度変化 ΔT = Q/(mc) を計算する", () => {
    const heat = 1000;
    const mass = 0.1;
    const specificHeat = 900;

    expect(computeTemperatureChange(heat, mass, specificHeat)).toBeCloseTo(
      heat / (mass * specificHeat),
      10
    );
  });

  it("質量が大きいほど同じ熱量での温度上昇は小さくなる（熱しにくい）", () => {
    const light = computeTemperatureChange(1000, 0.1, 900);
    const heavy = computeTemperatureChange(1000, 0.5, 900);

    expect(heavy).toBeLessThan(light);
  });

  it("比熱が大きいほど同じ熱量・質量での温度上昇は小さくなる", () => {
    const lowSpecificHeat = computeTemperatureChange(1000, 0.1, 140); // 水銀
    const highSpecificHeat = computeTemperatureChange(1000, 0.1, 901); // アルミ

    expect(highSpecificHeat).toBeLessThan(lowSpecificHeat);
  });

  it("熱量が2倍になれば温度変化も2倍になる（比例関係）", () => {
    const base = computeTemperatureChange(500, 0.2, 400);
    const doubled = computeTemperatureChange(1000, 0.2, 400);

    expect(doubled).toBeCloseTo(base * 2, 10);
  });
});
