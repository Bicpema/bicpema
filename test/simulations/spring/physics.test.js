import { describe, it, expect } from "vitest";
import {
  computeEffectiveSpringConstant,
  computeSpringPosition,
} from "../../../vite/simulations/spring/js/physics.js";

describe("computeEffectiveSpringConstant", () => {
  it("combination=1（単独）ではそのままのばね定数になる", () => {
    expect(computeEffectiveSpringConstant(10, 1)).toBe(10);
  });

  it("combination が文字列でも数値として判定される", () => {
    expect(computeEffectiveSpringConstant(10, "1")).toBe(10);
    expect(computeEffectiveSpringConstant(10, "2")).toBe(20);
    expect(computeEffectiveSpringConstant(10, "3")).toBeCloseTo(5, 10);
  });

  it("k が文字列でも戻り値は数値になる", () => {
    const result = computeEffectiveSpringConstant("10", "1");
    expect(result).toBe(10);
    expect(typeof result).toBe("number");
  });

  it("combination=2（並列）では2倍のばね定数になる", () => {
    expect(computeEffectiveSpringConstant(10, 2)).toBe(20);
  });

  it("combination=3（直列、同じk）では半分のばね定数になる", () => {
    expect(computeEffectiveSpringConstant(10, 3)).toBeCloseTo(5, 10);
  });

  it("並列は直列よりも合成ばね定数が大きくなる（同じkの場合）", () => {
    const parallel = computeEffectiveSpringConstant(8, 2);
    const series = computeEffectiveSpringConstant(8, 3);

    expect(parallel).toBeGreaterThan(series);
  });
});

describe("computeSpringPosition", () => {
  it("t=0では初期位置（振幅の位置）から始まる単振動になる", () => {
    const { x, y } = computeSpringPosition(10, 1, 5, 0);

    expect(x).toBeCloseTo(0, 10);
    expect(y).toBeCloseTo(5, 10);
  });

  it("振動の周期は T = 2π√(m/k) に一致する", () => {
    const springConstant = 10;
    const mass = 1;
    const amplitude = 5;
    const period = 2 * Math.PI * Math.sqrt(mass / springConstant);

    const atStart = computeSpringPosition(springConstant, mass, amplitude, 0);
    const afterOnePeriod = computeSpringPosition(
      springConstant,
      mass,
      amplitude,
      period
    );

    expect(afterOnePeriod.x).toBeCloseTo(atStart.x, 8);
    expect(afterOnePeriod.y).toBeCloseTo(atStart.y, 8);
  });

  it("変位の大きさは常に振幅を超えない（x^2+y^2 <= amplitude^2）", () => {
    const amplitude = 5;
    for (let t = 0; t <= 5; t += 0.37) {
      const { x, y } = computeSpringPosition(10, 1, amplitude, t);
      expect(x * x + y * y).toBeLessThanOrEqual(amplitude * amplitude + 1e-9);
    }
  });

  it("ばね定数が大きいほど同じ時間でより速く振動する（振動数が高い）", () => {
    const soft = computeSpringPosition(4, 1, 5, 0.5);
    const stiff = computeSpringPosition(40, 1, 5, 0.5);

    // 単純に位相が異なるため、同じ時刻での位置が異なることを確認する
    expect(soft.x).not.toBeCloseTo(stiff.x, 5);
  });
});
