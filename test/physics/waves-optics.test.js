import { describe, it, expect } from "vitest";
import * as w from "../../vite/ts/physics/waves.js";
import * as o from "../../vite/ts/physics/optics.js";

describe("waves", () => {
  it("進行波・定常波", () => {
    expect(w.computeTravelingWave(2, 4, 8, 0, 0)).toBeCloseTo(0);
    expect(w.computeTravelingWave(2, 4, 8, 0, 1)).toBeCloseTo(2);
    expect(w.computeStandingWave(1, 4, 8, 0, 0)).toBeCloseTo(0);
    expect(w.computeStandingWave(1, 4, 8, 2, 0)).toBeCloseTo(2);
  });

  it("角波数表記の正弦波（進行方向）と波面", () => {
    const k = Math.PI / 2;
    const omega = Math.PI;
    expect(w.computeSineWave(2, k, 1, omega, 0)).toBeCloseTo(2);
    expect(w.computeSineWave(2, k, 1, omega, 0.5, 1)).toBeCloseTo(
      2 * Math.sin(k - omega * 0.5)
    );
    expect(w.computeSineWave(2, k, 1, omega, 0.5, -1)).toBeCloseTo(
      2 * Math.sin(k + omega * 0.5)
    );
    expect(w.computeWaveFrontDistance(2, 3, 10)).toBe(6);
    expect(w.computeWaveFrontDistance(2, 30, 10)).toBe(10);
    expect(w.computeWaveFrontDistance(2, 0, 10)).toBe(0);
  });

  it("波の速さ・到達時間・ドップラー効果", () => {
    expect(w.computeWaveSpeed(2, 3)).toBe(6);
    expect(w.computeArrivalTime(10, 5)).toBe(2);
    expect(w.computeArrivalTime(10, 0)).toBe(Infinity);
    expect(w.computeDopplerFrequency(400, 340, 0, 0)).toBe(400);
    expect(w.computeDopplerFrequency(340, 340, 0, 34)).toBeCloseTo(
      (340 * 340) / 306
    );
  });

  it("気柱の共鳴波長", () => {
    expect(w.computeClosedTubeWavelength(1, 1)).toBe(4);
    expect(w.computeClosedTubeWavelength(1, 2)).toBeCloseTo(4 / 3);
    expect(w.computeOpenTubeWavelength(1, 1)).toBe(2);
  });
});

describe("optics", () => {
  it("スネルの法則（入射角0°・全反射）", () => {
    expect(o.computeRefractionAngle(1, 1.5, 0)).toBe(0);
    const r = o.computeRefractionAngle(1, 1.5, Math.PI / 6);
    expect(Math.sin(r ?? 0) * 1.5).toBeCloseTo(0.5);
    expect(o.computeRefractionAngle(1.5, 1, Math.PI / 3)).toBeNull();
  });

  it("臨界角", () => {
    expect(o.computeCriticalAngle(1.5, 1)).toBeCloseTo(Math.asin(1 / 1.5));
    expect(o.computeCriticalAngle(1, 1.5)).toBeNull();
  });

  it("レンズの式・倍率", () => {
    expect(o.computeImageDistance(10, 20)).toBeCloseTo(20);
    expect(o.computeImageDistance(10, 10)).toBeNull();
    expect(o.computeImageDistance(10, 5)).toBeCloseTo(-10);
    expect(o.computeLensMagnification(20, 20)).toBe(1);
  });

  it("位相差", () => {
    expect(o.computePhaseDifference(0, 500)).toBe(0);
    expect(o.computePhaseDifference(250, 500)).toBeCloseTo(Math.PI);
  });
});
