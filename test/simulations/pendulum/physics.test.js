import { describe, it, expect } from "vitest";
import { computePendulumAngle } from "../../../vite/simulations/pendulum/js/physics.js";

describe("computePendulumAngle", () => {
  it("count=0では振れ角は初期角度θ0そのものになる", () => {
    const theta0Deg = 15;
    const angle = computePendulumAngle(theta0Deg, 500, 9.8, 0);

    expect(angle).toBeCloseTo((theta0Deg * Math.PI) / 180, 10);
  });

  it("振り子の周期は T = 2π√(L/g) に一致する", () => {
    const theta0Deg = 10;
    const stringLengthPx = 500;
    const gravity = 9.8;
    const fps = 60;
    const lengthM = stringLengthPx / (50 * 100);
    const period = 2 * Math.PI * Math.sqrt(lengthM / gravity);

    const atStart = computePendulumAngle(
      theta0Deg,
      stringLengthPx,
      gravity,
      0,
      fps
    );
    const afterOnePeriod = computePendulumAngle(
      theta0Deg,
      stringLengthPx,
      gravity,
      period * fps,
      fps
    );

    expect(afterOnePeriod).toBeCloseTo(atStart, 6);
  });

  it("振り子が長いほど周期が長くなる（同じ経過時間ではより小さい位相が進む）", () => {
    const theta0Deg = 10;
    const gravity = 9.8;
    const count = 30;

    const shortPendulum = computePendulumAngle(theta0Deg, 200, gravity, count);
    const longPendulum = computePendulumAngle(theta0Deg, 800, gravity, count);

    // 短い振り子ほど速く振動するため、同時刻での|角度|の変化がより大きい
    expect(Math.abs(shortPendulum)).toBeLessThan((theta0Deg * Math.PI) / 180);
    expect(longPendulum).not.toBeCloseTo(shortPendulum, 5);
  });

  it("振れ角の絶対値は初期角度θ0を超えない", () => {
    const theta0Deg = 20;
    const theta0Rad = (theta0Deg * Math.PI) / 180;

    for (let count = 0; count <= 600; count += 37) {
      const angle = computePendulumAngle(theta0Deg, 500, 9.8, count);
      expect(Math.abs(angle)).toBeLessThanOrEqual(theta0Rad + 1e-9);
    }
  });
});
