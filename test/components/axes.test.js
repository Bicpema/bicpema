import { describe, it, expect, vi } from "vitest";
import { drawAxes } from "../../vite/ts/components/axes.js";
import { CoordinateSystem } from "../../vite/ts/components/coordinate-system.js";

/** @returns {any} p5インスタンスのモック */
function createMockP() {
  return {
    width: 400,
    height: 300,
    CENTER: "center",
    color: vi.fn((v) => `color(${v})`),
    stroke: vi.fn(),
    strokeWeight: vi.fn(),
    fill: vi.fn(),
    line: vi.fn(),
    push: vi.fn(),
    pop: vi.fn(),
    translate: vi.fn(),
    rotate: vi.fn(),
    noStroke: vi.fn(),
    triangle: vi.fn(),
    textSize: vi.fn(),
    textAlign: vi.fn(),
    textLeading: vi.fn(),
    text: vi.fn()
  };
}

const cs = new CoordinateSystem({ originX: 200, originY: 150 });

describe("drawAxes", () => {
  it("既定では原点から右と上へ、キャンバスの端から10px内側まで軸を引く", () => {
    const p = createMockP();
    drawAxes(p, cs);
    expect(p.line).toHaveBeenCalledTimes(2);
    expect(p.line).toHaveBeenCalledWith(200, 150, 390, 150);
    expect(p.line).toHaveBeenCalledWith(200, 150, 200, 10);
  });

  it("bothDirectionsで左と下にも軸を伸ばす", () => {
    const p = createMockP();
    drawAxes(p, cs, { bothDirections: true });
    expect(p.line).toHaveBeenCalledTimes(4);
    expect(p.line).toHaveBeenCalledWith(200, 150, 10, 150);
    expect(p.line).toHaveBeenCalledWith(200, 150, 200, 290);
  });

  it("extentで矢印先端の位置を指定できる", () => {
    const p = createMockP();
    drawAxes(p, cs, { extent: { right: 300, top: 50 } });
    expect(p.line).toHaveBeenCalledWith(200, 150, 300, 150);
    expect(p.line).toHaveBeenCalledWith(200, 150, 200, 50);
  });

  it("showYAxisがfalseなら横軸のみ描画する", () => {
    const p = createMockP();
    drawAxes(p, cs, { showYAxis: false, bothDirections: true });
    expect(p.line).toHaveBeenCalledTimes(2);
    for (const [, y1, , y2] of p.line.mock.calls) {
      expect(y1).toBe(150);
      expect(y2).toBe(150);
    }
  });

  it("showXAxisがfalseなら縦軸のみ描画する", () => {
    const p = createMockP();
    drawAxes(p, cs, { showXAxis: false });
    expect(p.line).toHaveBeenCalledTimes(1);
    expect(p.line).toHaveBeenCalledWith(200, 150, 200, 10);
  });

  it("ラベル未指定ならテキストを描画しない", () => {
    const p = createMockP();
    drawAxes(p, cs);
    expect(p.text).not.toHaveBeenCalled();
  });

  it("軸ラベルと原点ラベルを既定位置に描画する", () => {
    const p = createMockP();
    drawAxes(p, cs, { xLabel: "x", yLabel: "y", originLabel: "O" });
    expect(p.text).toHaveBeenCalledWith("x", 392, 170);
    expect(p.text).toHaveBeenCalledWith("y", 180, 10);
    expect(p.text).toHaveBeenCalledWith("O", 186, 164);
  });

  it("ラベル位置を指定できる", () => {
    const p = createMockP();
    drawAxes(p, cs, {
      xLabel: "t",
      xLabelPosition: { x: 1, y: 2 }
    });
    expect(p.text).toHaveBeenCalledWith("t", 1, 2);
  });

  it("yLabelVerticalで1文字ずつ改行して縦書きにする", () => {
    const p = createMockP();
    drawAxes(p, cs, {
      yLabel: "炭素",
      yLabelVertical: true,
      labelFontSize: 13
    });
    expect(p.textLeading).toHaveBeenCalledWith(13);
    expect(p.text).toHaveBeenCalledWith("炭\n素", 180, 10);
  });

  it("描画状態をpush()/pop()で閉じる", () => {
    const p = createMockP();
    drawAxes(p, cs, { xLabel: "x" });
    expect(p.push).toHaveBeenCalled();
    expect(p.pop).toHaveBeenCalledTimes(p.push.mock.calls.length);
    expect(p.push.mock.invocationCallOrder[0]).toBeLessThan(
      p.line.mock.invocationCallOrder[0]
    );
    expect(p.pop.mock.invocationCallOrder.at(-1)).toBeGreaterThan(
      p.text.mock.invocationCallOrder.at(-1)
    );
  });
});
