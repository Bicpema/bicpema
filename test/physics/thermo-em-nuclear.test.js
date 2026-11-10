import { describe, it, expect } from "vitest";
import * as t from "../../vite/ts/physics/thermodynamics.js";
import * as e from "../../vite/ts/physics/electromagnetism.js";
import * as n from "../../vite/ts/physics/nuclear.js";

describe("thermodynamics", () => {
  it("熱容量・温度変化", () => {
    expect(t.computeHeatCapacity(100, 4.2)).toBeCloseTo(420);
    expect(t.computeTemperatureChange(420, 100, 4.2)).toBeCloseTo(1);
    expect(t.computeTemperatureChange(100, 0, 4.2)).toBe(0);
  });

  it("熱平衡温度", () => {
    expect(t.computeEquilibriumTemperature(1, 80, 1, 20)).toBe(50);
    expect(t.computeEquilibriumTemperature(0, 80, 0, 20)).toBeNaN();
  });

  it("第一法則・熱効率・二乗平均速度", () => {
    expect(t.computeInternalEnergyChange(30, -10)).toBe(20);
    expect(t.computeThermalEfficiency(100, 60)).toBeCloseTo(0.4);
    expect(t.computeThermalEfficiency(0, 0)).toBe(0);
    // 窒素 300K: 約517 m/s
    expect(t.computeRmsSpeed(300, 0.028)).toBeCloseTo(517, -1);
  });
});

describe("electromagnetism", () => {
  it("直線電流の磁場", () => {
    expect(e.computeStraightCurrentField(1, 1)).toBeCloseTo(2e-7, 10);
    expect(e.computeStraightCurrentField(-1, 1)).toBeCloseTo(2e-7, 10);
    expect(e.computeStraightCurrentField(0, 1)).toBe(0);
    expect(e.computeStraightCurrentField(1, 0)).toBe(Infinity);
  });

  it("変圧器", () => {
    expect(e.computeSecondaryVoltage(100, 10, 20)).toBe(200);
    expect(e.computeSecondaryCurrent(10, 10, 20)).toBe(5);
  });
});

describe("nuclear", () => {
  it("半減期", () => {
    expect(n.computeDecayFraction(5, 0)).toBe(1);
    expect(n.computeDecayFraction(5, 5)).toBe(0.5);
    expect(n.computeRemainingCount(1000, 5, 10)).toBe(250);
  });
});
