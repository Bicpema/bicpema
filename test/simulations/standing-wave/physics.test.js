import { describe, it, expect } from "vitest";
import {
  computeRightWaveDisplacement,
  computeLeftWaveDisplacement,
  computeStandingWaveDisplacement,
  computeWaveFronts
} from "../../../vite/simulations/standing-wave/ts/physics.js";

describe("computeRightWaveDisplacement", () => {
  it("y = A sin(kx - ωt) の式に一致する", () => {
    const A = 20;
    const k = 0.1;
    const x = 50;
    const omega = 0.2;
    const t = 3;

    expect(computeRightWaveDisplacement(A, k, x, omega, t)).toBeCloseTo(
      A * Math.sin(k * x - omega * t),
      10
    );
  });

  it("t=0では静止した正弦波 y = A sin(kx) になる", () => {
    const A = 10;
    const k = 0.1;
    const x = 20;

    expect(computeRightWaveDisplacement(A, k, x, 0.5, 0)).toBeCloseTo(
      A * Math.sin(k * x),
      10
    );
  });
});

describe("computeLeftWaveDisplacement", () => {
  it("固定端反射波 y = A sin(k(x - 2L) + ωt) の式に一致する", () => {
    const A = 20;
    const k = 0.1;
    const x = 50;
    const omega = 0.2;
    const t = 3;
    const innerW = 130;

    expect(computeLeftWaveDisplacement(A, k, x, omega, t, innerW)).toBeCloseTo(
      A * Math.sin(k * (x - 2 * innerW) + omega * t),
      10
    );
  });
});

describe("computeStandingWaveDisplacement", () => {
  it("右向き波と固定端反射波の重ね合わせ（波の独立性）で計算される", () => {
    const A = 10;
    const k = 0.1;
    const x = 40;
    const omega = 0.3;
    const t = 2;
    const innerW = 100;

    const expected =
      computeRightWaveDisplacement(A, k, x, omega, t) +
      computeLeftWaveDisplacement(A, k, x, omega, t, innerW);

    expect(
      computeStandingWaveDisplacement(A, k, x, omega, t, innerW)
    ).toBeCloseTo(expected, 10);
  });

  it("描画領域の幅が波長の整数倍でなくても、反射端 x=innerW は常に節になる", () => {
    const A = 15;
    const k = (2 * Math.PI) / 200;
    const omega = 0.4;

    for (const innerW of [333, 517, 802, 1000]) {
      for (let t = 0; t <= 5; t += 1.3) {
        const y = computeStandingWaveDisplacement(
          A,
          k,
          innerW,
          omega,
          t,
          innerW
        );
        expect(y).toBeCloseTo(0, 6);
      }
    }
  });

  it("節の位置は反射端から半波長ごとに並び、幅が変わっても保たれる", () => {
    const A = 15;
    const wavelength = 200;
    const k = (2 * Math.PI) / wavelength;
    const omega = 0.4;

    for (const innerW of [450, 777]) {
      for (let t = 0; t <= 5; t += 1.3) {
        const y = computeStandingWaveDisplacement(
          A,
          k,
          innerW - wavelength / 2,
          omega,
          t,
          innerW
        );
        expect(y).toBeCloseTo(0, 6);
      }
    }
  });
});

describe("computeWaveFronts", () => {
  it("時間の経過とともに右向き波面は右へ、左向き波面は左へ進む", () => {
    const innerW = 500;
    const { rightFront, leftFront } = computeWaveFronts(2, 10, innerW);

    expect(rightFront).toBe(20);
    expect(leftFront).toBe(innerW - 20);
  });

  it("右向き波面はキャンバス幅を超えない", () => {
    const { rightFront } = computeWaveFronts(2, 1000, 500);

    expect(rightFront).toBe(500);
  });

  it("左向き波面は0未満にならない", () => {
    const { leftFront } = computeWaveFronts(2, 1000, 500);

    expect(leftFront).toBe(0);
  });
});
