import { describe, it, expect } from "vitest";
import {
  computeOpticalPathDifference,
  computeTransmittance,
} from "../../../vite/simulations/cellophane/js/physics.js";

describe("computeOpticalPathDifference", () => {
  it("枚数0では光路差は0になる", () => {
    expect(computeOpticalPathDifference(0, 212.6)).toBe(0);
  });

  it("光路差はセロハンの枚数に比例する", () => {
    const perSheet = 212.6;

    expect(computeOpticalPathDifference(3, perSheet)).toBeCloseTo(
      3 * perSheet,
      10
    );
  });
});

describe("computeTransmittance", () => {
  it("光路差0のとき透過率は0になる（直交ニコルで暗状態）", () => {
    expect(computeTransmittance(0, 600)).toBeCloseTo(0, 10);
  });

  it("光路差が波長の半分のとき透過率は最大の1になる", () => {
    const wavelength = 600;

    expect(computeTransmittance(wavelength / 2, wavelength)).toBeCloseTo(1, 10);
  });

  it("光路差が波長の整数倍のとき透過率は0に戻る（周期性）", () => {
    const wavelength = 600;

    expect(computeTransmittance(wavelength, wavelength)).toBeCloseTo(0, 8);
    expect(computeTransmittance(wavelength * 2, wavelength)).toBeCloseTo(0, 8);
  });

  it("透過率は常に0〜1の範囲に収まる", () => {
    const wavelength = 550;
    for (let opd = 0; opd <= 2000; opd += 37) {
      const t = computeTransmittance(opd, wavelength);
      expect(t).toBeGreaterThanOrEqual(0);
      expect(t).toBeLessThanOrEqual(1);
    }
  });
});
