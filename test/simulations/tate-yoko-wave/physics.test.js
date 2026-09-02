import { describe, it, expect } from "vitest";
import {
  computeWaveDisplacement,
  computeArrivalTime,
} from "../../../vite/simulations/tate-yoko-wave/js/physics.js";

describe("computeArrivalTime", () => {
  it("到達時刻は距離を波の速さ(v=ω/k)で割った値になる", () => {
    const k = 0.5;
    const omega = 2;
    const x0 = 100;
    const xStart = 0;
    const v = omega / k;

    expect(computeArrivalTime(k, omega, x0, xStart)).toBeCloseTo(
      (x0 - xStart) / v,
      10
    );
  });

  it("波源に近いほど到達時刻は早い", () => {
    const k = 0.5;
    const omega = 2;
    const xStart = 0;

    const near = computeArrivalTime(k, omega, 50, xStart);
    const far = computeArrivalTime(k, omega, 200, xStart);

    expect(near).toBeLessThan(far);
  });
});

describe("computeWaveDisplacement", () => {
  it("波がまだ到達していない位置では変位は0になる", () => {
    const A = 10;
    const k = 0.5;
    const omega = 2;
    const xStart = 0;
    const x0 = 1000; // 遠い位置
    const t = 0.1; // 到達前の短い時間

    expect(computeWaveDisplacement(A, k, omega, x0, xStart, t)).toBe(0);
  });

  it("波が到達した後は y = -A sin(k(x0-xStart) - ωt) の式に従う", () => {
    const A = 10;
    const k = 0.5;
    const omega = 2;
    const xStart = 0;
    const x0 = 10;
    const t = 100; // 十分に到達している時間

    const expected = -A * Math.sin(k * (x0 - xStart) - omega * t);
    expect(computeWaveDisplacement(A, k, omega, x0, xStart, t)).toBeCloseTo(
      expected,
      10
    );
  });

  it("波源そのもの(x0=xStart)では到達と同時に単振動を始める", () => {
    const A = 10;
    const k = 0.5;
    const omega = 2;
    const xStart = 0;

    const y = computeWaveDisplacement(A, k, omega, xStart, xStart, 1);

    expect(y).toBeCloseTo(-A * Math.sin(-omega * 1), 10);
  });

  it("変位の大きさは振幅Aを超えない", () => {
    const A = 7;
    const k = 0.3;
    const omega = 1.5;
    const xStart = 0;

    for (let t = 0; t <= 20; t += 1.7) {
      const y = computeWaveDisplacement(A, k, omega, 5, xStart, t);
      expect(Math.abs(y)).toBeLessThanOrEqual(A + 1e-9);
    }
  });
});
