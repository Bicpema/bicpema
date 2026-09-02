import { describe, it, expect } from "vitest";
import {
  computeCoordinateBounds,
  computeSquareBounds,
} from "../../../vite/simulations/3d-strata-csv/js/physics.js";

describe("computeCoordinateBounds", () => {
  it("配列が空の場合は0〜0の範囲を返す", () => {
    expect(computeCoordinateBounds([])).toEqual({ min: 0, max: 0 });
  });

  it("最小値と最大値を正しく計算する", () => {
    expect(computeCoordinateBounds([5, -3, 10, 0])).toEqual({
      min: -3,
      max: 10,
    });
  });
});

describe("computeSquareBounds", () => {
  it("すでに正方形（同じ長さ）の場合は範囲を変更しない", () => {
    const result = computeSquareBounds(0, 100, 0, 100);

    expect(result).toEqual({ xMin: 0, xMax: 100, yMin: 0, yMax: 100 });
  });

  it("x方向が短い場合はx方向を左右均等に広げて正方形にする", () => {
    const result = computeSquareBounds(0, 50, 0, 100);

    expect(result.xMax - result.xMin).toBeCloseTo(100, 10);
    expect(result.yMin).toBe(0);
    expect(result.yMax).toBe(100);
    // 中心座標(25)を保ったまま左右均等に広がる
    expect((result.xMin + result.xMax) / 2).toBeCloseTo(25, 10);
  });

  it("y方向が短い場合はy方向を上下均等に広げて正方形にする", () => {
    const result = computeSquareBounds(0, 100, 20, 40);

    expect(result.yMax - result.yMin).toBeCloseTo(100, 10);
    expect(result.xMin).toBe(0);
    expect(result.xMax).toBe(100);
    expect((result.yMin + result.yMax) / 2).toBeCloseTo(30, 10);
  });

  it("拡張後は常にx方向とy方向の長さが等しくなる", () => {
    const result = computeSquareBounds(-10, 30, 5, 25);

    expect(result.xMax - result.xMin).toBeCloseTo(
      result.yMax - result.yMin,
      10
    );
  });
});
