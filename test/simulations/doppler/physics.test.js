import { describe, it, expect } from "vitest";
import { computeSourcePosition } from "../../../vite/simulations/doppler/js/physics.js";

describe("computeSourcePosition", () => {
  it("count=0では初期位置(offset)そのものになる", () => {
    expect(computeSourcePosition(10, 0, 60)).toBe(50);
  });

  it("音源は等速直線運動する（位置は経過時間に比例）", () => {
    const speed = 20;
    const fps = 60;

    const posAt1s = computeSourcePosition(speed, 60, fps);
    const posAt2s = computeSourcePosition(speed, 120, fps);

    expect(posAt2s - 50 - (posAt1s - 50)).toBeCloseTo(speed, 8);
  });

  it("速さが2倍になれば同じ時間での移動距離も2倍になる", () => {
    const count = 60;
    const fps = 60;

    const slow = computeSourcePosition(10, count, fps) - 50;
    const fast = computeSourcePosition(20, count, fps) - 50;

    expect(fast).toBeCloseTo(slow * 2, 8);
  });

  it("offsetを指定するとその値を基準位置とする", () => {
    expect(computeSourcePosition(0, 0, 60, 100)).toBe(100);
  });
});
