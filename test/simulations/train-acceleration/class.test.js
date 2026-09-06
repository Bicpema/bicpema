import { describe, it, expect } from "vitest";
import { Train } from "../../../vite/simulations/train-acceleration/js/class.js";
import { TRAIN_HALF_W } from "../../../vite/simulations/train-acceleration/js/constants.js";

describe("Train", () => {
  it("初期状態は指定したx座標・速度0で静止している", () => {
    const train = new Train(50);

    expect(train.startX).toBe(50);
    expect(train.x).toBe(50);
    expect(train.velocity).toBe(0);
    expect(train.trackOffset).toBe(0);
  });

  it("update() は加速度に応じて速度・位置を更新する（等加速度直線運動）", () => {
    const train = new Train(0);

    // v = a * t, dx = v * pxPerMeter * dt
    train.update(1, 2, 10, 1000);

    expect(train.velocity).toBeCloseTo(2, 10);
    expect(train.x).toBeCloseTo(2 * 10 * 1, 10);
    expect(train.trackOffset).toBeCloseTo(2 * 10 * 1, 10);
  });

  it("速度は0未満にならない（後退しない）", () => {
    const train = new Train(0);
    train.velocity = 1;

    train.update(1, -5, 10, 1000);

    expect(train.velocity).toBe(0);
    expect(train.x).toBe(0);
  });

  it("update() を複数回呼ぶと速度が加速度に応じて累積する", () => {
    const train = new Train(0);

    train.update(1, 1, 10, 1000);
    train.update(1, 1, 10, 1000);
    train.update(1, 1, 10, 1000);

    expect(train.velocity).toBeCloseTo(3, 10);
  });

  it("右端を超えると左端に折り返す", () => {
    const train = new Train(0);
    train.velocity = 100;
    train.x = 1050;

    train.update(1, 0, 1, 1000);

    expect(train.x).toBe(-TRAIN_HALF_W);
  });

  it("reset() で位置・速度・線路オフセットが初期状態に戻る", () => {
    const train = new Train(50);
    train.update(1, 2, 10, 1000);

    train.reset();

    expect(train.x).toBe(50);
    expect(train.velocity).toBe(0);
    expect(train.trackOffset).toBe(0);
  });
});
