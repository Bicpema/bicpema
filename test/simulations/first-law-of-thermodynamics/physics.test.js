import { describe, it, expect } from "vitest";
import {
  computeThermodynamicState,
  computeMoleculeSpeed,
} from "../../../vite/simulations/first-law-of-thermodynamics/js/physics.js";

describe("computeThermodynamicState", () => {
  it("step=0では熱量・仕事・内部エネルギー変化は全て0で、温度・ピストン位置は基準値のまま", () => {
    const result = computeThermodynamicState(0, 300, 512);

    expect(result.Q).toBe(0);
    expect(result.W).toBe(0);
    expect(result.dU).toBe(0);
    expect(result.T).toBe(300);
    expect(result.pistonXTarget).toBe(512);
  });

  it("Q・W・ΔUは全てstepと同じ値になる（定圧膨張のΔU = Q + Winの単純化モデル）", () => {
    const result = computeThermodynamicState(3, 300, 512);

    expect(result.Q).toBe(3);
    expect(result.W).toBe(3);
    expect(result.dU).toBe(3);
  });

  it("温度はステップ数に比例して上昇する", () => {
    const result = computeThermodynamicState(4, 300, 512, 0.3);

    expect(result.T).toBeCloseTo(300 + 4 * 0.3, 10);
  });

  it("ピストン目標位置はステップ数に比例して移動する（気体の膨張）", () => {
    const result = computeThermodynamicState(4, 300, 512, 0.3, 37);

    expect(result.pistonXTarget).toBe(512 + 4 * 37);
  });

  it("stepが負の場合は圧縮方向（温度低下・ピストン後退）になる", () => {
    const result = computeThermodynamicState(-2, 300, 512, 0.3, 37);

    expect(result.T).toBeLessThan(300);
    expect(result.pistonXTarget).toBeLessThan(512);
  });
});

describe("computeMoleculeSpeed", () => {
  it("温度が高いほど分子の速度が大きくなる", () => {
    const slow = computeMoleculeSpeed(300, 0.5);
    const fast = computeMoleculeSpeed(310, 0.5);

    expect(fast).toBeGreaterThan(slow);
  });

  it("速度は温度の1.5乗に比例する", () => {
    const t = 300;
    const z = 0.5;

    expect(computeMoleculeSpeed(t, z)).toBeCloseTo(
      Math.pow(t, 1.5) * (0.6 + z),
      6
    );
  });

  it("zが大きい分子ほど同じ温度でも速度が大きい", () => {
    const slow = computeMoleculeSpeed(300, 0);
    const fast = computeMoleculeSpeed(300, 1);

    expect(fast).toBeGreaterThan(slow);
  });
});
