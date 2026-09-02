import { describe, it, expect } from "vitest";
import { Cart } from "../../../vite/simulations/force-and-acceleration/js/class.js";

describe("Cart", () => {
  it("初期状態は指定した位置・質量で静止している", () => {
    const cart = new Cart(100, 2);

    expect(cart.x).toBe(100);
    expect(cart.mass).toBe(2);
    expect(cart.velocity).toBe(0);
    expect(cart.force).toBe(0);
    expect(cart.acceleration).toBe(0);
  });

  it("update() は運動方程式 a = F/m に従って加速度を計算する", () => {
    const cart = new Cart(0, 2);
    cart.force = 4;

    cart.update(1, 100);

    expect(cart.acceleration).toBeCloseTo(4 / 2, 10);
  });

  it("update() は速度を a*dt ずつ増加させ、位置を v*pxPerMeter*dt ずつ進める", () => {
    const cart = new Cart(0, 2);
    cart.force = 4;

    cart.update(1, 100);

    // a = 2, v = 0 + 2*1 = 2
    expect(cart.velocity).toBeCloseTo(2, 10);
    // x = 0 + 2 * 100 * 1
    expect(cart.x).toBeCloseTo(2 * 100 * 1, 10);
  });

  it("同じ力でも質量が大きいほど加速度は小さくなる", () => {
    const lightCart = new Cart(0, 1);
    const heavyCart = new Cart(0, 10);
    lightCart.force = 5;
    heavyCart.force = 5;

    lightCart.update(1, 100);
    heavyCart.update(1, 100);

    expect(lightCart.acceleration).toBeGreaterThan(heavyCart.acceleration);
  });

  it("速度は0未満にならない", () => {
    const cart = new Cart(0, 2);
    cart.velocity = 0;
    cart.force = -10;

    cart.update(1, 100);

    expect(cart.velocity).toBe(0);
  });

  it("これまでの最大の力・加速度とその時の質量を記録し続ける", () => {
    const cart = new Cart(0, 2);

    cart.force = 4;
    cart.update(1, 100);
    expect(cart.maxForce).toBe(4);
    expect(cart.massAtMaxForce).toBe(2);
    expect(cart.maxAcceleration).toBeCloseTo(2, 10);
    expect(cart.massAtMaxAcceleration).toBe(2);

    // より小さい力に変化しても最大値は保持される
    cart.force = 1;
    cart.update(1, 100);
    expect(cart.maxForce).toBe(4);
    expect(cart.massAtMaxForce).toBe(2);
  });

  it("台車の左右端座標は中心座標と幅から計算される", () => {
    const cart = new Cart(200, 2);

    expect(cart.rightEdge).toBe(200 + cart.BODY_W / 2);
    expect(cart.leftEdge).toBe(200 - cart.BODY_W / 2);
  });

  it("reset() で位置・速度・力・加速度が初期状態に戻る（最大値の履歴は保持される）", () => {
    const cart = new Cart(100, 2);
    cart.force = 4;
    cart.update(1, 100);

    cart.reset();

    expect(cart.x).toBe(100);
    expect(cart.velocity).toBe(0);
    expect(cart.force).toBe(0);
    expect(cart.acceleration).toBe(0);
    expect(cart.maxForce).toBe(4);
  });
});
