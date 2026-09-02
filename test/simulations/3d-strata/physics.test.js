import { describe, it, expect } from "vitest";
import { computeCoordinateBounds } from "../../../vite/simulations/3d-strata/js/physics.js";

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

  it("値が1つだけの場合は最小値=最大値になる", () => {
    expect(computeCoordinateBounds([7])).toEqual({ min: 7, max: 7 });
  });

  it("負の値のみの場合も正しく計算する", () => {
    expect(computeCoordinateBounds([-10, -5, -20])).toEqual({
      min: -20,
      max: -5,
    });
  });
});
