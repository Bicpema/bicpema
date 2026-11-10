import { describe, it, expect } from "vitest";
import { Train } from "../../../vite/simulations/train-acceleration/ts/class.js";

describe("Train", () => {
  it("初期状態は位置0・速さ0で静止している", () => {
    const train = new Train();

    expect(train.position).toBe(0);
    expect(train.velocity).toBe(0);
  });

  it("step() は v = at、x = at²/2 の等加速度直線運動になる", () => {
    const train = new Train();

    for (let i = 0; i < 100; i++) train.step(0.01, 2);

    expect(train.velocity).toBeCloseTo(2, 10);
    expect(train.position).toBeCloseTo(1, 10);
  });

  it("減速して速さが0になった後は停止し、負にならない", () => {
    const train = new Train();
    train.step(1, 2);

    for (let i = 0; i < 10; i++) train.step(0.5, -2);

    expect(train.velocity).toBe(0);
  });

  it("ステップの途中で停止した場合は停止位置（v²/2|a|）までしか進まない", () => {
    const train = new Train();
    train.velocity = 2;

    train.step(10, -4);

    expect(train.velocity).toBe(0);
    expect(train.position).toBeCloseTo(0.5, 10);
  });

  it("停止中に加速度が0以下なら動かない", () => {
    const train = new Train();

    train.step(1, 0);
    train.step(1, -3);

    expect(train.velocity).toBe(0);
    expect(train.position).toBe(0);
  });

  it("停止後に加速度を正にすると再び加速する", () => {
    const train = new Train();
    train.step(1, -3);

    train.step(1, 3);

    expect(train.velocity).toBe(3);
  });

  it("reset() で初期状態に戻る", () => {
    const train = new Train();
    train.step(2, 3);

    train.reset();

    expect(train.velocity).toBe(0);
    expect(train.position).toBe(0);
  });
});
