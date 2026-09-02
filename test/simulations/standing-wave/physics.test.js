import { describe, it, expect } from "vitest";
import {
  computeRightWaveDisplacement,
  computeLeftWaveDisplacement,
  computeStandingWaveDisplacement,
  computeWaveFronts,
} from "../../../vite/simulations/standing-wave/js/physics.js";

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
  it("y = A sin(kx + ωt) の式に一致する", () => {
    const A = 20;
    const k = 0.1;
    const x = 50;
    const omega = 0.2;
    const t = 3;

    expect(computeLeftWaveDisplacement(A, k, x, omega, t)).toBeCloseTo(
      A * Math.sin(k * x + omega * t),
      10
    );
  });
});

describe("computeStandingWaveDisplacement", () => {
  it("右向き波と反射波の重ね合わせ（波の独立性）で計算される", () => {
    const A = 10;
    const k = 0.1;
    const x = 40;
    const omega = 0.3;
    const t = 2;
    const innerW = 100;

    const expected =
      A * Math.sin(k * x - omega * t) +
      A * Math.sin(k * (innerW - x) - omega * t);

    expect(
      computeStandingWaveDisplacement(A, k, x, omega, t, innerW)
    ).toBeCloseTo(expected, 10);
  });

  it("節（node）となる位置では常に変位が0になる", () => {
    // k*innerW = π のとき、反射端 x=0 は全時刻で節になる
    // (境界で右向き波と反射波が逆位相で打ち消し合う)
    const A = 15;
    const innerW = 100;
    const k = Math.PI / innerW;
    const omega = 0.4;
    const nodeX = 0;

    for (let t = 0; t <= 5; t += 1.3) {
      const y = computeStandingWaveDisplacement(A, k, nodeX, omega, t, innerW);
      expect(y).toBeCloseTo(0, 6);
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
