import { describe, it, expect, beforeEach } from "vitest";
import {
  update,
  PM,
  RULER_INIT_LENGTH,
} from "../../../vite/simulations/cart-work-ruler/js/logic.js";
import { state } from "../../../vite/simulations/cart-work-ruler/js/state.js";

beforeEach(() => {
  state.mass_kg = 0.5;
  state.v0_ms = 2.0;
  state.force_N = 5;
  state.approachX_px = 30;
  state.velocity_ms = 2.0;
  state.penetration_m = 0;
  state.criticalExceeded = false;
  state.phase = "idle";
  state.isRunning = false;
  state.playPauseButton = { html: () => {}, attribute: () => {} };
});

describe("update (approach phase)", () => {
  it("接近フェーズでは台車が初速度で等速直線運動する", () => {
    state.phase = "approach";

    update(undefined, 0.1);

    expect(state.approachX_px).toBeCloseTo(30 + state.v0_ms * PM * 0.1, 8);
    expect(state.phase).toBe("approach");
  });

  it("台車が本に接触する位置まで到達すると contact フェーズに移行する", () => {
    state.phase = "approach";

    // 十分大きい dt で一気に接触位置まで進める
    update(undefined, 10);

    expect(state.phase).toBe("contact");
  });
});

describe("update (contact phase)", () => {
  it("接触中は F=ma の減速度で速度が減少する", () => {
    state.phase = "contact";
    state.mass_kg = 0.5;
    state.force_N = 5;
    state.velocity_ms = 2.0;

    update(undefined, 0.1);

    const decel = state.force_N / state.mass_kg; // 10 m/s^2
    expect(state.velocity_ms).toBeCloseTo(2.0 - decel * 0.1, 8);
    expect(state.phase).toBe("contact");
  });

  it("台形近似（平均速度×時間）でめり込み距離が増加する", () => {
    state.phase = "contact";
    state.mass_kg = 0.5;
    state.force_N = 5;
    state.velocity_ms = 2.0;

    const v0 = state.velocity_ms;
    const decel = state.force_N / state.mass_kg;
    const dt = 0.1;

    update(undefined, dt);

    const vNew = v0 - decel * dt;
    expect(state.penetration_m).toBeCloseTo(0.5 * (v0 + vNew) * dt, 8);
  });

  it("速度が0に達すると停止し、それ以上進まない（運動エネルギーの消費）", () => {
    state.phase = "contact";
    state.mass_kg = 1;
    state.force_N = 10;
    state.velocity_ms = 1; // decel = 10 m/s^2 なので 0.1s で停止する

    update(undefined, 1); // 大きなdtで一気に停止させる

    expect(state.velocity_ms).toBe(0);
    expect(state.phase).toBe("stopped");
    expect(state.isRunning).toBe(false);
    expect(state.criticalExceeded).toBe(false);
  });

  it("停止時のめり込み距離は仕事とエネルギーの関係 F*d = 1/2*m*v0^2 を満たす", () => {
    state.phase = "contact";
    state.mass_kg = 1;
    state.force_N = 10;
    state.velocity_ms = 1;
    const v0 = state.velocity_ms;

    update(undefined, 1);

    const work = state.force_N * state.penetration_m;
    const initialKineticEnergy = 0.5 * state.mass_kg * v0 * v0;
    expect(work).toBeCloseTo(initialKineticEnergy, 6);
  });

  it("最大めり込み距離を超える場合は臨界超過として停止する", () => {
    state.phase = "contact";
    state.mass_kg = 1000; // 非常に重く、減速がほぼ起きない
    state.force_N = 0.001;
    state.velocity_ms = 5;

    update(undefined, 1000); // 極端に大きなdtで最大めり込みに到達させる

    const maxPen = RULER_INIT_LENGTH / PM;
    expect(state.penetration_m).toBeCloseTo(maxPen, 8);
    expect(state.velocity_ms).toBe(0);
    expect(state.phase).toBe("stopped");
    expect(state.criticalExceeded).toBe(true);
  });
});
