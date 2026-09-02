import { describe, it, expect, beforeEach } from "vitest";
import { calcEquilibrium } from "../../../vite/simulations/three-force-equilibrium/js/logic.js";
import { state } from "../../../vite/simulations/three-force-equilibrium/js/state.js";

beforeEach(() => {
  state.anchorA = { x: 115, y: 90 };
  state.anchorB = { x: 420, y: 90 };
  state.ring = { x: 265, y: 310 };
  state.weight = 20;
  state.T1 = 0;
  state.T2 = 0;
  state.isEquilibrium = false;
});

describe("calcEquilibrium", () => {
  it("左右対称な配置では糸の張力T1・T2が等しくなる", () => {
    state.ring = { x: 100, y: 100 };
    state.anchorA = { x: 50, y: 0 };
    state.anchorB = { x: 150, y: 0 };
    state.weight = 10;

    calcEquilibrium();

    expect(state.isEquilibrium).toBe(true);
    expect(state.T1).toBeCloseTo(state.T2, 8);
    expect(state.T1).toBeGreaterThan(0);
  });

  it("釣り合いが成立するとき、力の水平成分の和は0になる", () => {
    state.ring = { x: 100, y: 100 };
    state.anchorA = { x: 20, y: 10 };
    state.anchorB = { x: 180, y: 30 };
    state.weight = 15;

    calcEquilibrium();

    expect(state.isEquilibrium).toBe(true);
    const d1 = Math.hypot(
      state.anchorA.x - state.ring.x,
      state.anchorA.y - state.ring.y
    );
    const d2 = Math.hypot(
      state.anchorB.x - state.ring.x,
      state.anchorB.y - state.ring.y
    );
    const u1x = (state.anchorA.x - state.ring.x) / d1;
    const u2x = (state.anchorB.x - state.ring.x) / d2;

    expect(state.T1 * u1x + state.T2 * u2x).toBeCloseTo(0, 6);
  });

  it("釣り合いが成立するとき、力の垂直成分の和が重力とつり合う", () => {
    state.ring = { x: 100, y: 100 };
    state.anchorA = { x: 20, y: 10 };
    state.anchorB = { x: 180, y: 30 };
    state.weight = 15;

    calcEquilibrium();

    const d1 = Math.hypot(
      state.anchorA.x - state.ring.x,
      state.anchorA.y - state.ring.y
    );
    const d2 = Math.hypot(
      state.anchorB.x - state.ring.x,
      state.anchorB.y - state.ring.y
    );
    const u1y = (state.anchorA.y - state.ring.y) / d1;
    const u2y = (state.anchorB.y - state.ring.y) / d2;

    expect(state.T1 * u1y + state.T2 * u2y + state.weight).toBeCloseTo(0, 6);
  });

  it("アンカーとリングがほぼ重なる場合は釣り合わないと判定する", () => {
    state.ring = { x: 100, y: 100 };
    state.anchorA = { x: 101, y: 100 };
    state.anchorB = { x: 150, y: 50 };

    calcEquilibrium();

    expect(state.isEquilibrium).toBe(false);
  });

  it("2本の糸が一直線上にある（行列式が0に近い）場合は釣り合わないと判定する", () => {
    state.ring = { x: 100, y: 100 };
    state.anchorA = { x: 50, y: 50 };
    state.anchorB = { x: 150, y: 150 };

    calcEquilibrium();

    expect(state.isEquilibrium).toBe(false);
  });

  it("計算上の張力が負になる配置では釣り合わないと判定する", () => {
    state.ring = { x: 100, y: 100 };
    state.anchorA = { x: 150, y: 50 };
    state.anchorB = { x: 200, y: 80 };
    state.weight = 10;

    calcEquilibrium();

    expect(state.isEquilibrium).toBe(false);
  });
});
