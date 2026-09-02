import { describe, it, expect } from "vitest";
import { computePendulumWaveAngle } from "../../../vite/simulations/pendulum-wave/js/physics.js";

describe("computePendulumWaveAngle", () => {
  it("count=0では振れ角は0になる（sin(0)=0）", () => {
    const angle = computePendulumWaveAngle(0.3, 300, 9.8, 0);

    expect(angle).toBe(0);
  });

  it("周期 T = 2π√(L/g) だけ経過すると同じ角度に戻る", () => {
    const theta0 = 0.3;
    const length = 300;
    const gravity = 9.8;
    const fps = 60;
    const lengthM = length * (0.25 / 300);
    const period = 2 * Math.PI * Math.sqrt(lengthM / gravity);

    const early = computePendulumWaveAngle(theta0, length, gravity, 5, fps);
    const oneCycleLater = computePendulumWaveAngle(
      theta0,
      length,
      gravity,
      5 + period * fps,
      fps
    );

    expect(oneCycleLater).toBeCloseTo(early, 6);
  });

  it("振り子が長いほどゆっくり振動する（同時刻での位相差が生じる）", () => {
    const theta0 = 0.3;
    const gravity = 9.8;
    const count = 20;

    const short = computePendulumWaveAngle(theta0, 100, gravity, count);
    const long = computePendulumWaveAngle(theta0, 500, gravity, count);

    expect(short).not.toBeCloseTo(long, 5);
  });

  it("振れ角の絶対値は初期振れ幅θ0を超えない", () => {
    const theta0 = 0.4;

    for (let count = 0; count <= 600; count += 41) {
      const angle = computePendulumWaveAngle(theta0, 300, 9.8, count);
      expect(Math.abs(angle)).toBeLessThanOrEqual(theta0 + 1e-9);
    }
  });
});
