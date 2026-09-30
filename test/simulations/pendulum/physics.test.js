import { describe, it, expect } from "vitest";
import {
  computePendulumAngle,
  computeDisplayScale
} from "../../../src/simulations/pendulum/ts/physics.js";

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

describe("computeDisplayScale", () => {
  const base = {
    pivotY: 100,
    halfPanelWidth: 300,
    ballRadius: 20,
    pendulums: [
      { stringLength: 500, theta0: 10 },
      { stringLength: 500, theta0: 20 }
    ]
  };

  it("十分に高いキャンバスでは等倍（上限値）になる", () => {
    expect(computeDisplayScale({ ...base, canvasHeight: 1200 })).toBe(1);
  });

  it("低いキャンバスでは最下点のおもりがキャンバス内に収まるよう縮小される", () => {
    const canvasHeight = 400;
    const pivotY = canvasHeight * 0.1;
    const scale = computeDisplayScale({ ...base, canvasHeight, pivotY });

    expect(scale).toBeLessThan(1);
    const lowestBallBottom = pivotY + 500 * scale + base.ballRadius;
    expect(lowestBallBottom).toBeLessThanOrEqual(canvasHeight);
  });

  it("振れ幅が大きい場合はおもりがパネルの横幅に収まるよう縮小される", () => {
    const scale = computeDisplayScale({
      ...base,
      canvasHeight: 2000,
      pendulums: [{ stringLength: 500, theta0: 60 }]
    });
    const extentX = 500 * scale * Math.sin(Math.PI / 3) + base.ballRadius;

    expect(scale).toBeLessThan(1);
    expect(extentX).toBeLessThanOrEqual(base.halfPanelWidth);
  });

  it("長い方の振り子に合わせて左右共通の倍率になる", () => {
    const scale = computeDisplayScale({
      ...base,
      canvasHeight: 600,
      pendulums: [
        { stringLength: 250, theta0: 10 },
        { stringLength: 1000, theta0: 10 }
      ]
    });

    expect(100 + 1000 * scale + base.ballRadius).toBeLessThanOrEqual(600);
  });

  it("下端の余白を指定するとその分だけ上に収まる", () => {
    const canvasHeight = 500;
    const bottomMargin = 64;
    const scale = computeDisplayScale({ ...base, canvasHeight, bottomMargin });

    expect(100 + 500 * scale + base.ballRadius).toBeLessThanOrEqual(
      canvasHeight - bottomMargin
    );
  });

  it("紐の長さが0以下・非数の振り子は無視する", () => {
    expect(
      computeDisplayScale({
        ...base,
        canvasHeight: 1200,
        pendulums: [
          { stringLength: 0, theta0: 10 },
          { stringLength: NaN, theta0: 10 }
        ]
      })
    ).toBe(1);
  });
});
