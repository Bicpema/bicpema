import { describe, it, expect, vi } from "vitest";
import { drawDashedLine } from "../../vite/ts/components/dashed-line.js";

/** @returns {any} p5インスタンスのモック */
function createMockP() {
  return {
    stroke: vi.fn(),
    strokeWeight: vi.fn(),
    line: vi.fn()
  };
}

describe("drawDashedLine", () => {
  it("長さが1px未満の線は何も描画しない", () => {
    const p = createMockP();
    drawDashedLine(p, 0, 0, 0.5, 0, /** @type {any} */ ("red"));
    expect(p.line).not.toHaveBeenCalled();
    expect(p.stroke).not.toHaveBeenCalled();
  });

  it("既定の太さは1.5で、指定した色で描画する", () => {
    const p = createMockP();
    drawDashedLine(p, 0, 0, 100, 0, /** @type {any} */ ("red"));
    expect(p.stroke).toHaveBeenCalledWith("red");
    expect(p.strokeWeight).toHaveBeenCalledWith(1.5);
  });

  it("線分8px・間隔6pxの周期で分割し、最後の線分は終点で切る", () => {
    const p = createMockP();
    drawDashedLine(p, 0, 0, 30, 0, /** @type {any} */ ("red"));
    expect(p.line.mock.calls).toEqual([
      [0, 0, 8, 0],
      [14, 0, 22, 0],
      [28, 0, 30, 0]
    ]);
  });

  it("斜めの線も終点を超えない", () => {
    const p = createMockP();
    drawDashedLine(p, 0, 0, 3, 4, /** @type {any} */ ("red"));
    expect(p.line).toHaveBeenCalledTimes(1);
    const [, , x2, y2] = p.line.mock.calls[0];
    expect(x2).toBeCloseTo(3);
    expect(y2).toBeCloseTo(4);
  });

  it("オプションで太さ・線分長・間隔を変更できる", () => {
    const p = createMockP();
    drawDashedLine(p, 0, 0, 10, 0, /** @type {any} */ ("red"), {
      weight: 3,
      dashLength: 2,
      gapLength: 3
    });
    expect(p.strokeWeight).toHaveBeenCalledWith(3);
    expect(p.line.mock.calls).toEqual([
      [0, 0, 2, 0],
      [5, 0, 7, 0]
    ]);
  });
});
