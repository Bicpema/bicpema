import { describe, it, expect } from "vitest";
import {
  computeSecondaryVoltage,
  computeSecondaryCurrentAmplitude,
} from "../../../vite/simulations/transformer/js/physics.js";

describe("computeSecondaryVoltage", () => {
  it("巻数が同じなら電圧も変化しない", () => {
    expect(computeSecondaryVoltage(10, 5, 5)).toBe(10);
  });

  it("V2 = V1 × (N2/N1) の式に一致する", () => {
    expect(computeSecondaryVoltage(10, 4, 8)).toBeCloseTo(10 * (8 / 4), 10);
  });

  it("二次巻数が一次より多いと昇圧する", () => {
    const v2 = computeSecondaryVoltage(10, 4, 8);
    expect(v2).toBeGreaterThan(10);
  });

  it("二次巻数が一次より少ないと降圧する", () => {
    const v2 = computeSecondaryVoltage(10, 8, 4);
    expect(v2).toBeLessThan(10);
  });
});

describe("computeSecondaryCurrentAmplitude", () => {
  it("同位相のとき I2 = I1 × (N1/N2) になる", () => {
    const i2 = computeSecondaryCurrentAmplitude(15, 4, 8, true);
    expect(i2).toBeCloseTo(15 * (4 / 8), 10);
  });

  it("逆位相のとき同位相の場合と符号が反転する", () => {
    const inPhase = computeSecondaryCurrentAmplitude(15, 4, 8, true);
    const outOfPhase = computeSecondaryCurrentAmplitude(15, 4, 8, false);

    expect(outOfPhase).toBeCloseTo(-inPhase, 10);
  });

  it("昇圧側（二次巻数が多い）ほど二次電流は小さくなる", () => {
    const stepUp = computeSecondaryCurrentAmplitude(15, 4, 8, true);
    const stepDown = computeSecondaryCurrentAmplitude(15, 8, 4, true);

    expect(stepUp).toBeLessThan(stepDown);
  });
});
