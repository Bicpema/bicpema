import { describe, it, expect } from "vitest";
import {
  computeFreqConst,
  computeStandingWaveDisplacement,
} from "../../../vite/simulations/air-column/js/physics.js";

describe("computeFreqConst", () => {
  it("閉管では (m・π)/(2L) で計算される", () => {
    const m = 3;
    const pipeL = 400;

    expect(computeFreqConst("closed", m, pipeL)).toBeCloseTo(
      (m * Math.PI) / (2 * pipeL),
      10
    );
  });

  it("開管では (n・π)/L で計算される", () => {
    const n = 2;
    const pipeL = 400;

    expect(computeFreqConst("open", n, pipeL)).toBeCloseTo(
      (n * Math.PI) / pipeL,
      10
    );
  });

  it("同じ次数・管長なら開管は閉管の2倍の定数になる", () => {
    const m = 1;
    const pipeL = 400;

    const closed = computeFreqConst("closed", m, pipeL);
    const open = computeFreqConst("open", m, pipeL);

    expect(open).toBeCloseTo(closed * 2, 10);
  });

  it("管が長いほど定数は小さくなる（波長が長くなる）", () => {
    const shortPipe = computeFreqConst("closed", 1, 200);
    const longPipe = computeFreqConst("closed", 1, 800);

    expect(longPipe).toBeLessThan(shortPipe);
  });
});

describe("computeStandingWaveDisplacement", () => {
  it("管の閉端(x=0)では常に腹（最大振幅）になる", () => {
    const amplitude = 10;
    const freqConst = 0.01;

    expect(
      computeStandingWaveDisplacement(amplitude, freqConst, 0, 1)
    ).toBeCloseTo(amplitude, 10);
  });

  it("時間項が0のとき変位は0になる（全時刻で共通のゼロ交差）", () => {
    const y = computeStandingWaveDisplacement(10, 0.02, 50, 0);

    expect(y).toBe(0);
  });

  it("y = A cos(x・freqConst) sin(ωt) の式に一致する", () => {
    const amplitude = 8;
    const freqConst = 0.015;
    const x = 120;
    const timeSinValue = 0.6;

    expect(
      computeStandingWaveDisplacement(amplitude, freqConst, x, timeSinValue)
    ).toBeCloseTo(amplitude * Math.cos(x * freqConst) * timeSinValue, 10);
  });
});
