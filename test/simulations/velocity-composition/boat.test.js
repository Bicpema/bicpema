import { describe, it, expect } from "vitest";
import { Boat } from "../../../vite/simulations/velocity-composition/js/boat.js";
import { V_W } from "../../../vite/simulations/velocity-composition/js/constants.js";

describe("Boat", () => {
  it("指定した船速・川速で初期化される", () => {
    const boat = new Boat(2, 3);

    expect(boat.boatSpeed).toBe(2);
    expect(boat.riverSpeed).toBe(3);
    expect(boat.x).toBeCloseTo(V_W * 0.55, 10);
    expect(boat.isMoving).toBe(false);
  });

  it("合成速度は川の速度と船の速度の和になる（速度の合成）", () => {
    const boat = new Boat(2, 3);
    expect(boat.compositeSpeed).toBe(5);

    // 上流向き（負）の船速でも同じ式が成り立つ
    const upstreamBoat = new Boat(-4, 3);
    expect(upstreamBoat.compositeSpeed).toBe(-1);
  });

  it("船が川の流速と同じ速さで逆走すると岸から見て静止する", () => {
    const boat = new Boat(-3, 3);
    expect(boat.compositeSpeed).toBe(0);
  });

  it("停止中は update() を呼んでも位置が変化しない", () => {
    const boat = new Boat(2, 3);
    const x0 = boat.x;

    boat.update(1);

    expect(boat.x).toBe(x0);
  });

  it("isMoving が true のとき合成速度に応じて左方向（負方向）へ移動する", () => {
    const boat = new Boat(2, 3);
    boat.isMoving = true;
    const x0 = boat.x;

    boat.update(1);

    // PX_PER_MPS = 20 で合成速度5m/sぶん左（x減少）に進む
    expect(boat.x).toBeCloseTo(x0 - 5 * 20 * 1, 10);
  });

  it("画面左端を超えると右端に、右端を超えると左端に折り返す", () => {
    const boat = new Boat(0, 0);
    boat.isMoving = true;

    boat.x = -101;
    boat.update(0);
    expect(boat.x).toBe(1100);

    boat.x = 1101;
    boat.update(0);
    expect(boat.x).toBe(-100);
  });

  it("reset() で船速・川速・位置・動作状態が初期化される", () => {
    const boat = new Boat(2, 3);
    boat.isMoving = true;
    boat.x = 500;

    boat.reset(5, 1);

    expect(boat.boatSpeed).toBe(5);
    expect(boat.riverSpeed).toBe(1);
    expect(boat.x).toBeCloseTo(V_W * 0.55, 10);
    expect(boat.isMoving).toBe(false);
  });
});
