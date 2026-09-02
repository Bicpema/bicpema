import { describe, it, expect } from "vitest";
import { SlopeCart } from "../../../vite/simulations/slope-cart-motion/js/slope-cart.js";
import { PX_PER_M } from "../../../vite/simulations/slope-cart-motion/js/function.js";

describe("SlopeCart", () => {
  it("初期状態は指定した角度・斜面長で静止している", () => {
    const cart = new SlopeCart(30, 5);

    expect(cart.angleDeg).toBe(30);
    expect(cart.slopeLengthM).toBe(5);
    expect(cart.time).toBe(0);
    expect(cart.s).toBe(0);
    expect(cart.v).toBe(0);
    expect(cart.isAtBottom).toBe(false);
  });

  it("斜面方向の加速度は g*sinθ で計算される", () => {
    const cart = new SlopeCart(30, 5);

    expect(cart.accel).toBeCloseTo(9.8 * Math.sin((30 * Math.PI) / 180), 10);
  });

  it("角度0度（水平）では加速度は0になる", () => {
    const cart = new SlopeCart(0, 5);

    expect(cart.accel).toBeCloseTo(0, 10);
  });

  it("update() は等加速度直線運動の式 s=0.5at^2, v=at に従う", () => {
    const cart = new SlopeCart(30, 100);

    cart.update(1);

    expect(cart.s).toBeCloseTo(0.5 * cart.accel * 1 ** 2, 10);
    expect(cart.v).toBeCloseTo(cart.accel * 1, 10);
    expect(cart.time).toBeCloseTo(1, 10);
  });

  it("斜面の下端（台車の幅を除いた最大変位）に達すると停止する", () => {
    const cart = new SlopeCart(30, 1);

    cart.update(10);

    const maxDisp = 1 - cart.CART_W / PX_PER_M;
    expect(cart.s).toBeCloseTo(maxDisp, 10);
    expect(cart.isAtBottom).toBe(true);
    // 停止時の速度はエネルギー保存 v = sqrt(2*a*maxDisp) から求まる
    expect(cart.v).toBeCloseTo(Math.sqrt(2 * cart.accel * maxDisp), 10);
  });

  it("停止後は update() を呼んでも状態が変化しない", () => {
    const cart = new SlopeCart(30, 1);
    cart.update(10);
    const sAtBottom = cart.s;

    cart.update(1);

    expect(cart.s).toBe(sAtBottom);
  });

  it("角度が急なほど同じ時間でより大きく加速する", () => {
    const gentle = new SlopeCart(10, 100);
    const steep = new SlopeCart(60, 100);

    gentle.update(1);
    steep.update(1);

    expect(steep.v).toBeGreaterThan(gentle.v);
  });

  it("reset() で時間・変位・速度・停止状態が初期化される", () => {
    const cart = new SlopeCart(30, 100);
    cart.update(1);

    cart.reset();

    expect(cart.time).toBe(0);
    expect(cart.s).toBe(0);
    expect(cart.v).toBe(0);
    expect(cart.isAtBottom).toBe(false);
  });

  it("setAngle() で角度と加速度が更新され、状態がリセットされる", () => {
    const cart = new SlopeCart(30, 100);
    cart.update(1);

    cart.setAngle(45);

    expect(cart.angleDeg).toBe(45);
    expect(cart.accel).toBeCloseTo(9.8 * Math.sin((45 * Math.PI) / 180), 10);
    expect(cart.time).toBe(0);
    expect(cart.s).toBe(0);
  });
});
