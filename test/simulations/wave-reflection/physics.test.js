import { describe, it, expect } from "vitest";
import {
  computeIncidentDisplacement,
  computeReflectedDisplacement,
  computeCombinedDisplacement,
  computeWaveFront,
} from "../../../vite/simulations/wave-reflection/js/physics.js";

describe("computeIncidentDisplacement", () => {
  it("y = A sin(kx - ωt) の式に一致する", () => {
    const A = 10;
    const k = 0.2;
    const x = 30;
    const omega = 0.5;
    const t = 2;

    expect(computeIncidentDisplacement(A, k, x, omega, t)).toBeCloseTo(
      A * Math.sin(k * x - omega * t),
      10
    );
  });
});

describe("computeReflectedDisplacement", () => {
  const A = 10;
  const k = 0.2;
  const omega = 0.5;
  const wallX = 100;
  const mirrorOrigin = wallX * 2;

  it("自由端(free)では位相が反転しない", () => {
    const x = 80;
    const t = 2;

    const y = computeReflectedDisplacement(
      A,
      k,
      mirrorOrigin,
      x,
      omega,
      t,
      "free"
    );

    expect(y).toBeCloseTo(A * Math.sin(k * (mirrorOrigin - x) - omega * t), 10);
  });

  it("固定端(fixed)では自由端反射に対して位相が反転する", () => {
    const x = 80;
    const t = 2;

    const free = computeReflectedDisplacement(
      A,
      k,
      mirrorOrigin,
      x,
      omega,
      t,
      "free"
    );
    const fixed = computeReflectedDisplacement(
      A,
      k,
      mirrorOrigin,
      x,
      omega,
      t,
      "fixed"
    );

    expect(fixed).toBeCloseTo(-free, 10);
  });

  it("壁の位置(x=reflectX)では固定端反射波は入射波とちょうど逆符号になる", () => {
    for (let t = 0; t <= 10; t += 1.1) {
      const incident = computeIncidentDisplacement(A, k, wallX, omega, t);
      const reflected = computeReflectedDisplacement(
        A,
        k,
        mirrorOrigin,
        wallX,
        omega,
        t,
        "fixed"
      );
      expect(reflected).toBeCloseTo(-incident, 8);
    }
  });
});

describe("computeCombinedDisplacement", () => {
  it("入射波と反射波の和になる（波の重ね合わせ）", () => {
    const A = 10;
    const k = 0.2;
    const x = 50;
    const omega = 0.5;
    const t = 3;
    const mirrorOrigin = 200;
    const mode = "free";

    const expected =
      computeIncidentDisplacement(A, k, x, omega, t) +
      computeReflectedDisplacement(A, k, mirrorOrigin, x, omega, t, mode);

    expect(
      computeCombinedDisplacement(A, k, x, omega, t, mirrorOrigin, mode)
    ).toBeCloseTo(expected, 10);
  });

  it("固定端では壁の位置で常に節（変位0）になる", () => {
    const A = 10;
    const k = 0.2;
    const wallX = 100;
    const mirrorOrigin = wallX * 2;
    const omega = 0.5;

    for (let t = 0; t <= 10; t += 1.3) {
      const y = computeCombinedDisplacement(
        A,
        k,
        wallX,
        omega,
        t,
        mirrorOrigin,
        "fixed"
      );
      expect(y).toBeCloseTo(0, 8);
    }
  });
});

describe("computeWaveFront", () => {
  it("波の先端は時間に比例して進む", () => {
    expect(computeWaveFront(2, 5, 1000)).toBe(10);
  });

  it("上限を超えない", () => {
    expect(computeWaveFront(2, 1000, 100)).toBe(100);
  });
});
