import { describe, it, expect } from "vitest";
import {
  computeAngularVelocity,
  ANGULAR_VELOCITY_R,
  WAVELENGTH_R,
  WAVELENGTH_G,
  WAVELENGTH_B,
} from "../../../vite/simulations/cellophane/js/constants.js";

describe("computeAngularVelocity", () => {
  it("赤色光の波長では基準の角速度ANGULAR_VELOCITY_Rと一致する", () => {
    expect(computeAngularVelocity(WAVELENGTH_R)).toBeCloseTo(
      ANGULAR_VELOCITY_R,
      10
    );
  });

  it("角速度は波長に反比例する（波長が短いほど角速度は大きい）", () => {
    const velocityR = computeAngularVelocity(WAVELENGTH_R);
    const velocityG = computeAngularVelocity(WAVELENGTH_G);
    const velocityB = computeAngularVelocity(WAVELENGTH_B);

    expect(velocityB).toBeGreaterThan(velocityG);
    expect(velocityG).toBeGreaterThan(velocityR);
  });

  it("描画される波の空間的な波長比がWAVELENGTH_R/G/Bの比と一致する", () => {
    const velocityR = computeAngularVelocity(WAVELENGTH_R);
    const velocityG = computeAngularVelocity(WAVELENGTH_G);
    const velocityB = computeAngularVelocity(WAVELENGTH_B);

    // 波の空間的な波長は角速度に反比例するため、角速度の積が
    // 波長の積と比例することを確認する（波長比 = 角速度比の逆数）
    expect(velocityR * WAVELENGTH_R).toBeCloseTo(velocityG * WAVELENGTH_G, 10);
    expect(velocityG * WAVELENGTH_G).toBeCloseTo(velocityB * WAVELENGTH_B, 10);
  });
});
