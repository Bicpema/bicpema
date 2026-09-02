import { describe, it, expect } from "vitest";
import { CAR } from "../../../vite/simulations/uniform-linear-motion/js/car.js";

describe("CAR", () => {
  it("指定した速度で初期化される", () => {
    const car = new CAR(0, 0, null, 5, [], []);

    expect(car.posx).toBe(0);
    expect(car.posy).toBe(0);
    expect(car.speed).toBe(5);
  });

  it("速度は1〜20の範囲にクランプされる", () => {
    expect(new CAR(0, 0, null, 0, [], []).speed).toBe(1);
    expect(new CAR(0, 0, null, -5, [], []).speed).toBe(1);
    expect(new CAR(0, 0, null, 30, [], []).speed).toBe(20);
    expect(new CAR(0, 0, null, 20, [], []).speed).toBe(20);
  });

  it("不正な速度が渡された場合は1にフォールバックする", () => {
    expect(new CAR(0, 0, null, NaN, [], []).speed).toBe(1);
    expect(new CAR(0, 0, null, undefined, [], []).speed).toBe(1);
  });

  it("update() は等速直線運動として x座標を進める（1フレームあたり speed*50/60）", () => {
    const car = new CAR(0, 0, null, 6, [], []);

    car.update();

    expect(car.posx).toBeCloseTo((50 * 6) / 60, 10);
  });

  it("update() を複数回呼ぶと移動距離は経過フレーム数に比例する（等速運動）", () => {
    const car = new CAR(0, 0, null, 10, [], []);

    car.update();
    car.update();
    car.update();

    expect(car.posx).toBeCloseTo(3 * ((50 * 10) / 60), 10);
  });

  it("速度が大きい車ほど同じフレーム数でより遠くまで進む", () => {
    const slowCar = new CAR(0, 0, null, 2, [], []);
    const fastCar = new CAR(0, 0, null, 10, [], []);

    for (let i = 0; i < 10; i++) {
      slowCar.update();
      fastCar.update();
    }

    expect(fastCar.posx).toBeGreaterThan(slowCar.posx);
  });
});
