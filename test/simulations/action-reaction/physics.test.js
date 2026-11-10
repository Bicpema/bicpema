import { describe, it, expect } from "vitest";
import {
  MAX_BOOKS,
  clampBookCount,
  computeArrowScale,
  computeForces,
  forceName,
  formatNewton,
  netForceOnBook
} from "../../../vite/simulations/action-reaction/ts/physics.js";
import {
  bookBottomY,
  distanceToSegment,
  forceSegment,
  pointInRect
} from "../../../vite/simulations/action-reaction/ts/geometry.js";

/**
 * id が一致する力を探す。
 * @param {import("../../../vite/simulations/action-reaction/ts/physics.js").Force[]} forces - 力の配列
 * @param {string} id - 力の id
 * @returns {import("../../../vite/simulations/action-reaction/ts/physics.js").Force} 見つかった力
 */
const byId = (forces, id) => {
  const found = forces.find((f) => f.id === id);
  if (!found) throw new Error(`力が見つかりません: ${id}`);
  return found;
};

describe("computeForces", () => {
  it("本が0冊のときは力がない", () => {
    expect(computeForces(0, 1, 9.8)).toEqual([]);
  });

  it("本1冊では4つの力がすべて mg になる", () => {
    const forces = computeForces(1, 1, 9.8);
    expect(forces).toHaveLength(4);
    for (const f of forces) expect(f.magnitude).toBeCloseTo(9.8, 10);
    expect(byId(forces, "gravity-1")).toMatchObject({
      receiver: "book",
      direction: "down",
      kind: "gravity"
    });
    expect(byId(forces, "normal-1")).toMatchObject({
      receiver: "book",
      direction: "up",
      kind: "normal"
    });
    expect(byId(forces, "earth-1")).toMatchObject({
      receiver: "earth",
      direction: "up",
      kind: "reaction"
    });
    expect(byId(forces, "push-1")).toMatchObject({
      receiver: "desk",
      direction: "down",
      kind: "reaction"
    });
  });

  it.each([2, 3, 4, 5])("%i冊で垂直抗力は (n-k+1)mg、重力は mg になる", (n) => {
    const m = 1.5;
    const g = 9.8;
    const forces = computeForces(n, m, g);
    expect(forces).toHaveLength(4 * n);
    for (let k = 1; k <= n; k++) {
      expect(byId(forces, `gravity-${k}`).magnitude).toBeCloseTo(m * g, 10);
      expect(byId(forces, `earth-${k}`).magnitude).toBeCloseTo(m * g, 10);
      expect(byId(forces, `normal-${k}`).magnitude).toBeCloseTo(
        (n - k + 1) * m * g,
        10
      );
      expect(byId(forces, `push-${k}`).magnitude).toBeCloseTo(
        (n - k + 1) * m * g,
        10
      );
    }
  });

  it("2冊目以降の押す力の受け手は下の本、1冊目は机になる", () => {
    const forces = computeForces(3, 1, 9.8);
    expect(byId(forces, "push-1")).toMatchObject({
      receiver: "desk",
      receiverBook: null
    });
    expect(byId(forces, "push-2")).toMatchObject({
      receiver: "book",
      receiverBook: 1
    });
    expect(byId(forces, "push-3")).toMatchObject({
      receiver: "book",
      receiverBook: 2
    });
  });

  it("すべての本で受け手にはたらく鉛直方向の力がつり合う", () => {
    for (let n = 1; n <= MAX_BOOKS; n++) {
      const forces = computeForces(n, 1, 9.8);
      for (let k = 1; k <= n; k++) {
        expect(netForceOnBook(forces, k)).toBeCloseTo(0, 10);
      }
    }
  });

  it("本 k にはたらく上の本から押される力は (n-k)mg になる", () => {
    const n = 4;
    const forces = computeForces(n, 1, 9.8);
    for (let k = 1; k < n; k++) {
      const pushFromAbove = byId(forces, `push-${k + 1}`);
      expect(pushFromAbove.receiverBook).toBe(k);
      expect(pushFromAbove.magnitude).toBeCloseTo((n - k) * 9.8, 10);
    }
  });

  it("作用反作用のペアは大きさが等しく向きが逆で、受け手が異なる", () => {
    const forces = computeForces(5, 1, 9.8);
    for (const f of forces) {
      const partner = byId(forces, f.pairId);
      expect(partner.pairId).toBe(f.id);
      expect(partner.magnitude).toBeCloseTo(f.magnitude, 10);
      expect(partner.direction).not.toBe(f.direction);
      expect(
        partner.receiver === f.receiver &&
          partner.receiverBook === f.receiverBook
      ).toBe(false);
    }
  });

  it("同じ本にはたらく重力と垂直抗力（つり合いの2力）は作用反作用のペアではない", () => {
    const forces = computeForces(1, 1, 9.8);
    expect(byId(forces, "gravity-1").pairId).not.toBe("normal-1");
    expect(byId(forces, "normal-1").pairId).not.toBe("gravity-1");
  });

  it("g=0 のとき大きさはすべて0になる", () => {
    for (const f of computeForces(3, 1, 0)) expect(f.magnitude).toBe(0);
  });

  it("負の質量や gは0として扱う（NaN・負の大きさを返さない）", () => {
    for (const f of computeForces(2, -1, 9.8)) expect(f.magnitude).toBe(0);
    for (const f of computeForces(2, 1, -9.8)) expect(f.magnitude).toBe(0);
  });

  it("冊数は0〜最大冊数へ丸められる", () => {
    expect(computeForces(99, 1, 9.8)).toHaveLength(4 * MAX_BOOKS);
    expect(computeForces(-3, 1, 9.8)).toEqual([]);
    expect(computeForces(Number.NaN, 1, 9.8)).toEqual([]);
  });
});

describe("clampBookCount", () => {
  it("範囲外・非整数・非有限値を丸める", () => {
    expect(clampBookCount(-1)).toBe(0);
    expect(clampBookCount(2.9)).toBe(2);
    expect(clampBookCount(10)).toBe(MAX_BOOKS);
    expect(clampBookCount(Number.POSITIVE_INFINITY)).toBe(0);
  });
});

describe("computeArrowScale", () => {
  it("冊数が少ないときは基準の縮尺になる", () => {
    expect(computeArrowScale(1, 9.8, 4, 150, 46)).toBeCloseTo(4, 10);
  });

  it("最大の力の矢印が上限の長さに収まる", () => {
    const scale = computeArrowScale(5, 9.8, 4, 150, 100);
    expect(5 * 9.8 * scale).toBeLessThanOrEqual(150 + 1e-9);
  });

  it("重力の矢印が上限の長さに収まる", () => {
    const scale = computeArrowScale(1, 20, 4, 500, 46);
    expect(20 * scale).toBeLessThanOrEqual(46 + 1e-9);
  });

  it("重さが0以下でも有限の正の値を返す", () => {
    expect(computeArrowScale(3, 0, 4, 150, 46)).toBe(4);
    expect(computeArrowScale(3, -5, 4, 150, 46)).toBe(4);
  });
});

describe("表示用の文字列", () => {
  it("力の大きさをN単位で小数第1位まで表す", () => {
    expect(formatNewton(9.8)).toBe("9.8 N");
    expect(formatNewton(49)).toBe("49.0 N");
    expect(formatNewton(Number.NaN)).toBe("0.0 N");
  });

  it("力の名前に受け手が含まれる", () => {
    const forces = computeForces(2, 1, 9.8);
    expect(forceName(byId(forces, "gravity-1"))).toContain("本にはたらく");
    expect(forceName(byId(forces, "earth-1"))).toContain("地球にはたらく");
    expect(forceName(byId(forces, "push-1"))).toContain("机にはたらく");
    expect(forceName(byId(forces, "push-2"))).toContain("下の本にはたらく");
  });
});

describe("geometry", () => {
  it("pointInRect は境界を含めて判定する", () => {
    const rect = { x: 10, y: 10, w: 20, h: 20 };
    expect(pointInRect(10, 10, rect)).toBe(true);
    expect(pointInRect(30, 30, rect)).toBe(true);
    expect(pointInRect(31, 20, rect)).toBe(false);
  });

  it("distanceToSegment は線分の端点・内部・長さ0を扱う", () => {
    const seg = { x1: 0, y1: 0, x2: 10, y2: 0 };
    expect(distanceToSegment(5, 3, seg)).toBeCloseTo(3, 10);
    expect(distanceToSegment(-4, 3, seg)).toBeCloseTo(5, 10);
    expect(distanceToSegment(3, 4, { x1: 0, y1: 0, x2: 0, y2: 0 })).toBe(5);
  });

  it("forceSegment は向きと長さに従い、同じ本の力どうしの作用点が重ならない", () => {
    const forces = computeForces(2, 1, 9.8);
    const out = { x1: 0, y1: 0, x2: 0, y2: 0 };
    const up = { ...forceSegment(byId(forces, "normal-1"), 40, out) };
    expect(up.y2).toBeCloseTo(up.y1 - 40, 10);
    expect(up.y1).toBeCloseTo(bookBottomY(1), 10);
    const down = { ...forceSegment(byId(forces, "push-1"), 40, out) };
    expect(down.y2).toBeCloseTo(down.y1 + 40, 10);

    const xs = new Set();
    for (const f of forces) {
      xs.add(`${f.bookIndex}:${forceSegment(f, 10, out).x1}`);
    }
    expect(xs.size).toBe(forces.length);
  });
});
