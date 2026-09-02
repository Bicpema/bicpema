import { describe, it, expect, beforeEach } from "vitest";
import { Ball } from "../../../vite/simulations/vertical-throw-down/js/ball.js";
import { state } from "../../../vite/simulations/vertical-throw-down/js/state.js";

beforeEach(() => {
  state.vtData = [];
  state.ytData = [];
});

describe("Ball", () => {
  it("初期状態は指定した高さ・初速度で静止している", () => {
    const ball = new Ball(80, 10);

    expect(ball.height).toBe(80);
    expect(ball.velocity).toBe(10);
    expect(ball.time).toBe(0);
    expect(ball.isMoving).toBe(false);
  });

  it("停止中は update() を呼んでも状態が変化しない", () => {
    const ball = new Ball(80, 10);

    ball.update(1);

    expect(ball.time).toBe(0);
    expect(ball.height).toBe(80);
  });

  it("start() 後は鉛直投げ下ろしの物理法則に従って速度・高さが更新される", () => {
    const ball = new Ball(80, 10);
    ball.start();

    ball.update(1);

    // v = v0 + g * t
    expect(ball.velocity).toBeCloseTo(10 + 9.8, 5);
    // h = h0 - (v0 * t + 0.5 * g * t^2)
    expect(ball.height).toBeCloseTo(80 - (10 * 1 + 0.5 * 9.8 * 1 ** 2), 5);
    expect(ball.time).toBeCloseTo(1, 5);
  });

  it("地面（高さ1）に到達すると停止し、高さは1でクランプされる", () => {
    const ball = new Ball(1.5, 10);
    ball.start();

    ball.update(10);

    expect(ball.height).toBe(1);
    expect(ball.isMoving).toBe(false);
  });

  it("運動中は一定間隔でグラフ用データを記録する", () => {
    const ball = new Ball(80, 10);
    ball.start();

    ball.update(0.1);

    expect(state.vtData.length).toBeGreaterThan(0);
    expect(state.ytData.length).toBeGreaterThan(0);
    expect(state.vtData[0]).toEqual({ x: 0.1, y: expect.any(Number) });
  });

  it("stop() で運動を停止できる", () => {
    const ball = new Ball(80, 10);
    ball.start();
    ball.update(1);
    ball.stop();

    const heightBeforeStop = ball.height;
    ball.update(1);

    expect(ball.isMoving).toBe(false);
    expect(ball.height).toBe(heightBeforeStop);
  });

  it("reset() で初期高さ・初速度・時間・グラフデータが初期化される", () => {
    const ball = new Ball(80, 10);
    ball.start();
    ball.update(1);

    ball.reset(50, 20);

    expect(ball.initialHeight).toBe(50);
    expect(ball.initialVelocity).toBe(20);
    expect(ball.height).toBe(50);
    expect(ball.velocity).toBe(20);
    expect(ball.time).toBe(0);
    expect(ball.isMoving).toBe(false);
    expect(state.vtData).toEqual([]);
    expect(state.ytData).toEqual([]);
  });

  it("reset() に初速度を渡さない場合は現在の初速度を維持する", () => {
    const ball = new Ball(80, 10);

    ball.reset(50);

    expect(ball.initialHeight).toBe(50);
    expect(ball.initialVelocity).toBe(10);
    expect(ball.velocity).toBe(10);
  });
});
