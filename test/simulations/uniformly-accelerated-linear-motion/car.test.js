import { describe, it, expect, beforeEach } from "vitest";
import { Car } from "../../../vite/simulations/uniformly-accelerated-linear-motion/js/car.js";
import { state } from "../../../vite/simulations/uniformly-accelerated-linear-motion/js/state.js";
import { MAX_TIME } from "../../../vite/simulations/uniformly-accelerated-linear-motion/js/constants.js";

beforeEach(() => {
  state.xtData = [];
  state.vtData = [];
});

describe("Car", () => {
  it("初期状態は指定した初速度で静止している", () => {
    const car = new Car(5, 2);

    expect(car.initialVelocity).toBe(5);
    expect(car.acceleration).toBe(2);
    expect(car.velocity).toBe(5);
    expect(car.position).toBe(0);
    expect(car.time).toBe(0);
    expect(car.isMoving).toBe(false);
  });

  it("停止中は update() を呼んでも状態が変化しない", () => {
    const car = new Car(5, 2);

    car.update(1);

    expect(car.time).toBe(0);
    expect(car.position).toBe(0);
  });

  it("start() 後は等加速度直線運動の物理法則に従って速度・位置が更新される", () => {
    const car = new Car(5, 2);
    car.start();

    car.update(1);

    // v = v0 + a * t
    expect(car.velocity).toBeCloseTo(5 + 2 * 1, 10);
    // x = v0 * t + 0.5 * a * t^2
    expect(car.position).toBeCloseTo(5 * 1 + 0.5 * 2 * 1 ** 2, 10);
    expect(car.time).toBeCloseTo(1, 10);
  });

  it("負の加速度でも減速運動として正しく計算される", () => {
    const car = new Car(10, -3);
    car.start();

    car.update(1);

    expect(car.velocity).toBeCloseTo(10 - 3 * 1, 10);
    expect(car.position).toBeCloseTo(10 * 1 - 0.5 * 3 * 1 ** 2, 10);
  });

  it("最大表示時間に達すると時刻・速度・位置がクランプされ運動が停止する", () => {
    const car = new Car(5, 2);
    car.start();

    car.update(MAX_TIME + 10);

    expect(car.time).toBe(MAX_TIME);
    expect(car.velocity).toBeCloseTo(5 + 2 * MAX_TIME, 10);
    expect(car.position).toBeCloseTo(
      5 * MAX_TIME + 0.5 * 2 * MAX_TIME ** 2,
      10
    );
    expect(car.isMoving).toBe(false);
  });

  it("運動中は一定間隔でグラフ用データを記録する", () => {
    const car = new Car(5, 2);
    car.start();

    car.update(0.1);

    expect(state.xtData.length).toBeGreaterThan(0);
    expect(state.vtData.length).toBeGreaterThan(0);
  });

  it("運動中は一定時間ごとに等時間マーカーを記録する", () => {
    const car = new Car(5, 2);
    car.start();

    // MARKER_INTERVAL は 0.5s なので 1s 経過で2つのマーカーが記録される
    car.update(1);

    expect(car.markers.length).toBe(2);
    expect(car.markers[0].t).toBeCloseTo(0.5, 5);
    expect(car.markers[1].t).toBeCloseTo(1, 5);
  });

  it("stop() で運動を停止できる", () => {
    const car = new Car(5, 2);
    car.start();
    car.update(1);
    car.stop();

    const positionBeforeStop = car.position;
    car.update(1);

    expect(car.isMoving).toBe(false);
    expect(car.position).toBe(positionBeforeStop);
  });

  it("reset() で初速度・加速度・時間・グラフデータが初期化される", () => {
    const car = new Car(5, 2);
    car.start();
    car.update(1);

    car.reset(8, -1);

    expect(car.initialVelocity).toBe(8);
    expect(car.acceleration).toBe(-1);
    expect(car.velocity).toBe(8);
    expect(car.position).toBe(0);
    expect(car.time).toBe(0);
    expect(car.isMoving).toBe(false);
    expect(car.markers).toEqual([]);
    expect(state.xtData).toEqual([]);
    expect(state.vtData).toEqual([]);
  });
});
