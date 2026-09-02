import { describe, it, expect } from "vitest";
import { computeDragProjectilePosition } from "../../../vite/simulations/projectile-motion/js/physics.js";

describe("computeDragProjectilePosition", () => {
  it("t=0 では初期位置がそのまま返る（空気抵抗なし）", () => {
    const { x, y } = computeDragProjectilePosition({
      t: 0,
      speed: 20,
      angleDeg: 30,
      mass: 10,
      k: 0,
      gravity: 9.8,
      posx0: 5,
      posy0: 10,
    });

    expect(x).toBeCloseTo(5, 10);
    expect(y).toBeCloseTo(10, 10);
  });

  it("t=0 では初期位置がそのまま返る（空気抵抗あり）", () => {
    const { x, y } = computeDragProjectilePosition({
      t: 0,
      speed: 20,
      angleDeg: 30,
      mass: 10,
      k: 1,
      gravity: 9.8,
      posx0: 5,
      posy0: 10,
    });

    expect(x).toBeCloseTo(5, 8);
    expect(y).toBeCloseTo(10, 8);
  });

  it("空気抵抗係数が小さい（k<0.1）場合は通常の放物運動の式に一致する", () => {
    const speed = 20;
    const angleDeg = 30;
    const gravity = 9.8;
    const t = 1;
    const theta = (angleDeg * Math.PI) / 180;

    const { x, y } = computeDragProjectilePosition({
      t,
      speed,
      angleDeg,
      mass: 10,
      k: 0.05,
      gravity,
      posx0: 0,
      posy0: 0,
    });

    // x = v0 cosθ t
    expect(x).toBeCloseTo(speed * Math.cos(theta) * t, 10);
    // y = -v0 sinθ t + 0.5 g t^2 （下向きを正とする画面座標）
    expect(y).toBeCloseTo(
      -speed * Math.sin(theta) * t + 0.5 * gravity * t * t,
      10
    );
  });

  it("空気抵抗係数が大きい（k>=0.1）場合は線形抵抗の解析解に一致する", () => {
    const speed = 20;
    const angleDeg = 30;
    const mass = 10;
    const k = 1;
    const gravity = 9.8;
    const t = 1;
    const theta = (angleDeg * Math.PI) / 180;
    const decay = 1 - Math.exp((-k / mass) * t);

    const { x, y } = computeDragProjectilePosition({
      t,
      speed,
      angleDeg,
      mass,
      k,
      gravity,
      posx0: 0,
      posy0: 0,
    });

    expect(x).toBeCloseTo((mass / k) * speed * Math.cos(theta) * decay, 10);
    expect(y).toBeCloseTo(
      (mass / k) * (-speed * Math.sin(theta) - (mass * gravity) / k) * decay +
        ((mass * gravity) / k) * t,
      10
    );
  });

  it("k=0.1 の境界値では空気抵抗ありの式が使われる", () => {
    const speed = 20;
    const angleDeg = 30;
    const mass = 10;
    const k = 0.1;
    const gravity = 9.8;
    const t = 1;
    const theta = (angleDeg * Math.PI) / 180;
    const decay = 1 - Math.exp((-k / mass) * t);
    const expectedX = (mass / k) * speed * Math.cos(theta) * decay;

    const { x } = computeDragProjectilePosition({
      t,
      speed,
      angleDeg,
      mass,
      k,
      gravity,
      posx0: 0,
      posy0: 0,
    });

    expect(x).toBeCloseTo(expectedX, 10);
    // 抵抗なしの式とは一致しない（境界で式が切り替わっていることの確認）
    expect(x).not.toBeCloseTo(speed * Math.cos(theta) * t, 2);
  });

  it("時間が十分経過すると空気抵抗により水平方向の到達距離が頭打ちになる", () => {
    const speed = 20;
    const angleDeg = 30;
    const mass = 10;
    const k = 1;
    const gravity = 9.8;
    const theta = (angleDeg * Math.PI) / 180;

    const near = computeDragProjectilePosition({
      t: 200,
      speed,
      angleDeg,
      mass,
      k,
      gravity,
      posx0: 0,
      posy0: 0,
    });
    const far = computeDragProjectilePosition({
      t: 500,
      speed,
      angleDeg,
      mass,
      k,
      gravity,
      posx0: 0,
      posy0: 0,
    });

    const terminalX = (mass / k) * speed * Math.cos(theta);
    expect(near.x).toBeCloseTo(terminalX, 5);
    expect(far.x).toBeCloseTo(terminalX, 5);
  });
});
