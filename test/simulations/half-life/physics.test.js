import { describe, it, expect } from "vitest";
import {
  computeDecayFraction,
  computeRemainingCount,
} from "../../../vite/simulations/half-life/js/physics.js";

describe("computeDecayFraction", () => {
  it("t=0では残存割合1（崩壊していない）", () => {
    expect(computeDecayFraction(8, 0)).toBe(1);
  });

  it("t=半減期では残存割合が1/2になる", () => {
    expect(computeDecayFraction(8, 8)).toBeCloseTo(0.5, 10);
  });

  it("t=半減期の2倍では残存割合が1/4になる", () => {
    expect(computeDecayFraction(8, 16)).toBeCloseTo(0.25, 10);
  });

  it("t=半減期の3倍では残存割合が1/8になる", () => {
    expect(computeDecayFraction(5730, 5730 * 3)).toBeCloseTo(0.125, 10);
  });

  it("半減期が短いほど同じ経過時間での崩壊が進む（残存割合が小さくなる）", () => {
    const shortHalfLife = computeDecayFraction(8, 20);
    const longHalfLife = computeDecayFraction(5730, 20);

    expect(shortHalfLife).toBeLessThan(longHalfLife);
  });
});

describe("computeRemainingCount", () => {
  it("t=0では初期個数のまま", () => {
    expect(computeRemainingCount(1000, 8, 0)).toBe(1000);
  });

  it("t=半減期では初期個数の半分になる", () => {
    expect(computeRemainingCount(1000, 8, 8)).toBeCloseTo(500, 8);
  });

  it("t=半減期の4倍では初期個数の1/16になる", () => {
    expect(computeRemainingCount(1600, 8, 32)).toBeCloseTo(100, 8);
  });
});
