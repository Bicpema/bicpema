import { describe, it, expect } from "vitest";
import {
  composeForces,
  computeForceMagnitude,
  computeForceAngleDeg,
} from "../../../vite/simulations/force-composition/js/physics.js";

describe("composeForces", () => {
  it("2つの力ベクトルの成分ごとの和を返す（力の合成）", () => {
    expect(composeForces(3, 4, 1, 2)).toEqual({ x: 4, y: 6 });
  });

  it("逆向きの力は打ち消し合う", () => {
    expect(composeForces(5, 0, -5, 0)).toEqual({ x: 0, y: 0 });
  });
});

describe("computeForceMagnitude", () => {
  it("3-4-5の直角三角形でピタゴラスの定理通りの大きさになる", () => {
    // forceScale=1 のとき、ピクセル成分がそのままNとみなせる
    expect(computeForceMagnitude(3, 4, 1)).toBeCloseTo(5, 10);
  });

  it("forceScale で割った値が力の大きさ(N)になる", () => {
    expect(computeForceMagnitude(150, 200, 50)).toBeCloseTo(5, 10);
  });

  it("成分が0なら大きさも0", () => {
    expect(computeForceMagnitude(0, 0, 50)).toBe(0);
  });
});

describe("computeForceAngleDeg", () => {
  it("x軸正方向を0度とする", () => {
    expect(computeForceAngleDeg(10, 0)).toBeCloseTo(0, 10);
  });

  it("画面座標系のy下向きを物理座標系のy上向きに変換して角度を求める（上向き=90度）", () => {
    expect(computeForceAngleDeg(0, -10)).toBeCloseTo(90, 10);
  });

  it("画面下方向（y成分が正）は物理的には下向き=-90度になる", () => {
    expect(computeForceAngleDeg(0, 10)).toBeCloseTo(-90, 10);
  });

  it("x軸負方向は180度（またはその逆符号の-180度）", () => {
    // atan2 の分岐特性上 y=0 の符号によって ±180 になり得るため絶対値で比較する
    expect(Math.abs(computeForceAngleDeg(-10, 0))).toBeCloseTo(180, 10);
  });
});
