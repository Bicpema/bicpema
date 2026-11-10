import { describe, it, expect, vi } from "vitest";
import { CoordinateSystem } from "../../vite/ts/components/coordinate-system.js";
import { drawGrid } from "../../vite/ts/components/grid.js";

/** @returns {any} p5インスタンスのモック */
function createMockP() {
  return {
    width: 100,
    height: 80,
    color: vi.fn((...args) => `color(${args.join(",")})`),
    stroke: vi.fn(),
    strokeWeight: vi.fn(),
    line: vi.fn(),
    push: vi.fn(),
    pop: vi.fn()
  };
}

describe("drawGrid", () => {
  const cs = new CoordinateSystem({ originX: 50, originY: 40, scaleX: 1 });

  it("原点を通る縦線・横線を範囲内に引く", () => {
    const p = createMockP();
    drawGrid(p, cs, { stepX: 25, stepY: 20 });
    const lines = p.line.mock.calls;
    expect(lines).toContainEqual([0, 0, 0, 80]);
    expect(lines).toContainEqual([50, 0, 50, 80]);
    expect(lines).toContainEqual([100, 0, 100, 80]);
    expect(lines).toContainEqual([0, 40, 100, 40]);
    expect(lines).toContainEqual([0, 0, 100, 0]);
    expect(lines).toContainEqual([0, 80, 100, 80]);
    expect(lines).toHaveLength(5 + 5);
  });

  it("stepX/stepYを省略した方向は描画しない", () => {
    const p = createMockP();
    drawGrid(p, cs, { stepX: 50 });
    expect(p.line).toHaveBeenCalledTimes(3);
    expect(
      p.line.mock.calls.every((/** @type {number[]} */ c) => c[0] === c[2])
    ).toBe(true);
  });

  it("boundsで描画範囲を制限する", () => {
    const p = createMockP();
    drawGrid(p, cs, {
      stepX: 10,
      bounds: { left: 40, top: 10, right: 60, bottom: 30 }
    });
    expect(p.line.mock.calls).toEqual([
      [40, 10, 40, 30],
      [50, 10, 50, 30],
      [60, 10, 60, 30]
    ]);
  });

  it("色と太さを指定でき、省略時は既定値を使う", () => {
    const p = createMockP();
    drawGrid(p, cs, { stepX: 50 });
    expect(p.color).toHaveBeenCalledWith(168, 206, 221);
    expect(p.strokeWeight).toHaveBeenCalledWith(1);

    const q = createMockP();
    drawGrid(q, cs, {
      stepX: 50,
      color: /** @type {any} */ ("red"),
      weight: 3
    });
    expect(q.stroke).toHaveBeenCalledWith("red");
    expect(q.strokeWeight).toHaveBeenCalledWith(3);
    expect(q.color).not.toHaveBeenCalled();
  });

  it("flipY=falseでも画面座標の範囲に線を引く", () => {
    const p = createMockP();
    const down = new CoordinateSystem({ originY: 10, flipY: false });
    drawGrid(p, down, {
      stepY: 30,
      bounds: { left: 0, top: 0, right: 5, bottom: 80 }
    });
    expect(p.line.mock.calls.map((/** @type {number[]} */ c) => c[1])).toEqual([
      10, 40, 70
    ]);
  });

  it("描画状態をpush()/pop()で閉じる", () => {
    const p = createMockP();
    drawGrid(p, cs, { stepX: 50, stepY: 50 });
    expect(p.push).toHaveBeenCalledTimes(1);
    expect(p.pop).toHaveBeenCalledTimes(1);
    expect(p.pop.mock.invocationCallOrder[0]).toBeGreaterThan(
      p.line.mock.invocationCallOrder.at(-1)
    );
  });
});
