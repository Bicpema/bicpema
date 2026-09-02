import { describe, it, expect } from "vitest";
import { Ball } from "../../../vite/simulations/horizontal-throw/js/ball.js";

describe("Ball", () => {
  it("初期状態は指定した高さ・初速度で静止している", () => {
    const ball = new Ball(30, 15);

    expect(ball.height).toBe(30);
    expect(ball.x).toBe(0);
    expect(ball.vx).toBe(15);
    expect(ball.vy).toBe(0);
    expect(ball.time).toBe(0);
    expect(ball.isMoving).toBe(false);
  });

  it("停止中は update() を呼んでも状態が変化しない", () => {
    const ball = new Ball(30, 15);

    ball.update(1);

    expect(ball.time).toBe(0);
    expect(ball.height).toBe(30);
    expect(ball.x).toBe(0);
  });

  it("start() 後は水平投射の物理法則に従って位置・速度が更新される", () => {
    const ball = new Ball(30, 15);
    ball.start();

    ball.update(1);

    // x = v0 * t
    expect(ball.x).toBeCloseTo(15, 5);
    // y = h0 - 0.5 * g * t^2
    expect(ball.height).toBeCloseTo(30 - 0.5 * 9.8 * 1 ** 2, 5);
    // vx は初速度のまま一定
    expect(ball.vx).toBe(15);
    // vy = g * t
    expect(ball.vy).toBeCloseTo(9.8, 5);
  });

  it("地面（高さ0）に到達すると停止し、着地点の座標に補正される", () => {
    const ball = new Ball(4.9, 10);
    ball.start();

    // 落下時間 t = sqrt(2h/g) = 1s のはずなので、大きな dt で一気に着地させる
    ball.update(10);

    const expectedLandingTime = Math.sqrt((2 * 4.9) / 9.8);
    expect(ball.height).toBe(0);
    expect(ball.isMoving).toBe(false);
    expect(ball.x).toBeCloseTo(10 * expectedLandingTime, 5);
  });

  it("運動中は軌跡データ(trail)を記録する", () => {
    const ball = new Ball(30, 15);
    ball.start();

    ball.update(0.1);
    ball.update(0.1);

    expect(ball.trail.length).toBe(2);
    expect(ball.trail[0]).toEqual({ x: ball.trail[0].x, y: ball.trail[0].y });
  });

  it("stop() で運動を停止できる", () => {
    const ball = new Ball(30, 15);
    ball.start();
    ball.update(1);
    ball.stop();

    const heightBeforeStop = ball.height;
    const xBeforeStop = ball.x;
    ball.update(1);

    expect(ball.isMoving).toBe(false);
    expect(ball.height).toBe(heightBeforeStop);
    expect(ball.x).toBe(xBeforeStop);
  });

  it("reset() で初期高さ・初速度・時間・軌跡が初期化される", () => {
    const ball = new Ball(30, 15);
    ball.start();
    ball.update(1);

    ball.reset(50, 20);

    expect(ball.initialHeight).toBe(50);
    expect(ball.initialVelocity).toBe(20);
    expect(ball.height).toBe(50);
    expect(ball.x).toBe(0);
    expect(ball.vx).toBe(20);
    expect(ball.vy).toBe(0);
    expect(ball.time).toBe(0);
    expect(ball.isMoving).toBe(false);
    expect(ball.trail).toEqual([]);
    expect(ball.ghosts).toEqual([]);
  });
});
