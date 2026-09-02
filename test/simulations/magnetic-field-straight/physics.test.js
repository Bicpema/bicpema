import { describe, it, expect } from "vitest";
import {
  computeMagneticFieldStrength,
  computeFieldDirection,
} from "../../../vite/simulations/magnetic-field-straight/js/physics.js";

describe("computeMagneticFieldStrength", () => {
  it("電流0では磁場も0になる", () => {
    expect(computeMagneticFieldStrength(0, 50)).toBe(0);
  });

  it("B = |I|/r の式に一致する", () => {
    expect(computeMagneticFieldStrength(3, 50)).toBeCloseTo(3 / 50, 10);
  });

  it("電流の符号によらず磁場の大きさは同じになる（|I|を使う）", () => {
    const positive = computeMagneticFieldStrength(2, 50);
    const negative = computeMagneticFieldStrength(-2, 50);

    expect(positive).toBe(negative);
  });

  it("電流からの距離が遠いほど磁場は弱くなる", () => {
    const near = computeMagneticFieldStrength(2, 30);
    const far = computeMagneticFieldStrength(2, 100);

    expect(far).toBeLessThan(near);
  });
});

describe("computeFieldDirection", () => {
  it("正の電流では反時計回りになる", () => {
    expect(computeFieldDirection(2)).toBe("counterclockwise");
  });

  it("負の電流では時計回りになる", () => {
    expect(computeFieldDirection(-2)).toBe("clockwise");
  });

  it("電流がほぼ0のときは磁場なしと判定する", () => {
    expect(computeFieldDirection(0)).toBe("none");
    expect(computeFieldDirection(0.05)).toBe("none");
    expect(computeFieldDirection(-0.05)).toBe("none");
  });
});
