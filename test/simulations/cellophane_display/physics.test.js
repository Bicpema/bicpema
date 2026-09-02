import { describe, it, expect } from "vitest";
import { computePhaseRetardation } from "../../../vite/simulations/cellophane_display/js/physics.js";

describe("computePhaseRetardation", () => {
  it("枚数0または光路差0では位相差は0になる", () => {
    expect(computePhaseRetardation(100, 0, 270, 550)).toBe(0);
    expect(computePhaseRetardation(100, 2, 0, 550)).toBe(0);
  });

  it("(dispersion * sheetCount * 2 * opd * π) / wavelength / 100 の式に一致する", () => {
    const dispersion = 105.3;
    const sheetCount = 2;
    const opd = 270;
    const wavelength = 550;

    expect(
      computePhaseRetardation(dispersion, sheetCount, opd, wavelength)
    ).toBeCloseTo(
      (dispersion * sheetCount * 2 * opd * Math.PI) / wavelength / 100,
      10
    );
  });

  it("セロハンの枚数が増えるほど位相差は大きくなる", () => {
    const one = computePhaseRetardation(100, 1, 270, 550);
    const two = computePhaseRetardation(100, 2, 270, 550);

    expect(two).toBeCloseTo(one * 2, 10);
  });

  it("波長が長いほど同じ光路差での位相差は小さくなる", () => {
    const shortWave = computePhaseRetardation(100, 1, 270, 400);
    const longWave = computePhaseRetardation(100, 1, 270, 700);

    expect(longWave).toBeLessThan(shortWave);
  });
});
