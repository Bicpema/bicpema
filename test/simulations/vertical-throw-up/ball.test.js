import { describe, it, expect } from "vitest";
import { Ball } from "../../../vite/simulations/vertical-throw-up/js/ball.js";

describe("Ball", () => {
  it("初期状態は高さ0・指定した初速度で静止している", () => {
    const ball = new Ball(30);

    expect(ball.height).toBe(0);
    expect(ball.velocity).toBe(30);
    expect(ball.time).toBe(0);
    expect(ball.isMoving).toBe(false);
    // maxHeight = v0^2 / (2g)
    expect(ball.maxHeight).toBeCloseTo((30 * 30) / (2 * 9.8), 5);
  });

  it("停止中は update() を呼んでも状態が変化しない", () => {
    const ball = new Ball(30);

    ball.update(1);

    expect(ball.time).toBe(0);
    expect(ball.height).toBe(0);
  });

  it("start() 後は鉛直投げ上げの物理法則に従って速度・高さが更新される", () => {
    const ball = new Ball(30);
    ball.start();

    ball.update(1);

    // v = v0 - g * t
    expect(ball.velocity).toBeCloseTo(30 - 9.8, 5);
    // h = v0 * t - 0.5 * g * t^2
    expect(ball.height).toBeCloseTo(30 * 1 - 0.5 * 9.8 * 1 ** 2, 5);
    expect(ball.time).toBeCloseTo(1, 5);
  });

  it("最高到達点では速度が0になる", () => {
    const ball = new Ball(9.8);
    ball.start();

    // v0/g = 1s で最高点に到達
    ball.update(1);

    expect(ball.velocity).toBeCloseTo(0, 5);
    expect(ball.height).toBeCloseTo(ball.maxHeight, 5);
  });

  it("落下して高さ0に戻ると停止し、高さは0でクランプされる", () => {
    const ball = new Ball(9.8);
    ball.start();

    // 落下時間 2*v0/g = 2s のはずなので、大きな dt で一気に着地させる
    ball.update(5);

    expect(ball.height).toBe(0);
    expect(ball.isMoving).toBe(false);
  });

  it("運動中は履歴データ(history)を記録する", () => {
    const ball = new Ball(30);
    ball.start();

    ball.update(0.1);

    expect(ball.history.length).toBe(1);
    expect(ball.history[0]).toEqual({
      t: ball.time,
      y: ball.height,
      v: ball.velocity,
    });
  });

  it("stop() で運動を停止できる", () => {
    const ball = new Ball(30);
    ball.start();
    ball.update(1);
    ball.stop();

    const heightBeforeStop = ball.height;
    ball.update(1);

    expect(ball.isMoving).toBe(false);
    expect(ball.height).toBe(heightBeforeStop);
  });

  it("reset() で初速度・高さ・時間・履歴・最高到達点が初期化される", () => {
    const ball = new Ball(30);
    ball.start();
    ball.update(1);

    ball.reset(20);

    expect(ball.initialVelocity).toBe(20);
    expect(ball.height).toBe(0);
    expect(ball.velocity).toBe(20);
    expect(ball.time).toBe(0);
    expect(ball.isMoving).toBe(false);
    expect(ball.maxHeight).toBeCloseTo((20 * 20) / (2 * 9.8), 5);
    expect(ball.history).toEqual([]);
  });
});
