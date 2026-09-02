import { describe, it, expect } from "vitest";
import {
  mapIndexToX,
  mapWaveformValueToY,
  mapSpectrumValueToY,
} from "../../../vite/simulations/oscilloscope/js/physics.js";

describe("mapIndexToX", () => {
  it("先頭のサンプルはx=0にマッピングされる", () => {
    expect(mapIndexToX(0, 100, 1000)).toBe(0);
  });

  it("中間のサンプルはキャンバス幅の中央にマッピングされる", () => {
    expect(mapIndexToX(50, 100, 1000)).toBeCloseTo(500, 10);
  });
});

describe("mapWaveformValueToY", () => {
  it("振幅0（無音）はキャンバスの中央にマッピングされる", () => {
    expect(mapWaveformValueToY(0, 400)).toBeCloseTo(200, 10);
  });

  it("振幅-1（最小）はキャンバス上端にマッピングされる", () => {
    expect(mapWaveformValueToY(-1, 400)).toBeCloseTo(0, 10);
  });

  it("振幅+1（最大）はキャンバス下端にマッピングされる", () => {
    expect(mapWaveformValueToY(1, 400)).toBeCloseTo(400, 10);
  });
});

describe("mapSpectrumValueToY", () => {
  it("強度0（無音）はキャンバス下端付近にマッピングされる", () => {
    expect(mapSpectrumValueToY(0, 400)).toBeCloseTo(395, 10);
  });

  it("強度255（最大）はキャンバス上端にマッピングされる", () => {
    expect(mapSpectrumValueToY(255, 400)).toBeCloseTo(0, 10);
  });

  it("強度が大きいほどyが小さくなる（上に描画される）", () => {
    const low = mapSpectrumValueToY(50, 400);
    const high = mapSpectrumValueToY(200, 400);

    expect(high).toBeLessThan(low);
  });
});
