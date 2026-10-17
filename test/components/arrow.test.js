import { describe, it, expect, vi } from "vitest";
import {
  drawArrow,
  drawArrowWithLabel,
  Arrow
} from "../../vite/ts/components/arrow.js";

/** @returns {any} p5インスタンスのモック */
function createMockP() {
  return {
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
    text: vi.fn(),
    CENTER: "center"
  };
}

describe("drawArrow", () => {
  it("長さが2px未満の矢印は何も描画しない", () => {
    const p = createMockP();
    drawArrow(p, 0, 0, 1, 1, /** @type {any} */ ("red"));
    expect(p.line).not.toHaveBeenCalled();
    expect(p.triangle).not.toHaveBeenCalled();
  });

  it("線分と頭を描画し、既定の太さは3", () => {
    const p = createMockP();
    drawArrow(p, 0, 0, 100, 0, /** @type {any} */ ("red"));
    expect(p.strokeWeight).toHaveBeenCalledWith(3);
    expect(p.line).toHaveBeenCalledWith(0, 0, 100, 0);
    expect(p.translate).toHaveBeenCalledWith(100, 0);
    expect(p.rotate).toHaveBeenCalledWith(0);
    expect(p.triangle).toHaveBeenCalledWith(
      0,
      0,
      -12,
      12 / 2.2,
      -12,
      -12 / 2.2
    );
  });

  it("styleで太さと頭の大きさを変更できる", () => {
    const p = createMockP();
    drawArrow(p, 0, 0, 0, 50, /** @type {any} */ ("blue"), {
      weight: 5,
      headSize: 20,
      headWidthDivisor: 2
    });
    expect(p.strokeWeight).toHaveBeenCalledWith(5);
    expect(p.triangle).toHaveBeenCalledWith(0, 0, -20, 10, -20, -10);
  });
});

describe("Arrow", () => {
  it("色が未設定の場合は描画しない", () => {
    const p = createMockP();
    new Arrow(0, 0, 50, 0).draw(p);
    expect(p.line).not.toHaveBeenCalled();
  });

  it("set()で更新した座標で描画する", () => {
    const p = createMockP();
    const arrow = new Arrow(0, 0, 0, 0, /** @type {any} */ ("green"));
    arrow.set(10, 20, 110, 20);
    arrow.update();
    arrow.draw(p);
    expect(p.line).toHaveBeenCalledWith(10, 20, 110, 20);
  });
});

describe("drawArrowWithLabel", () => {
  it("長さが2px未満の場合は矢印もラベルも描画しない", () => {
    const p = createMockP();
    drawArrowWithLabel(p, 0, 0, 1, 0, /** @type {any} */ ("red"), "F");
    expect(p.line).not.toHaveBeenCalled();
    expect(p.text).not.toHaveBeenCalled();
  });

  it("ラベルは中点から法線方向に既定18pxずらして描画する", () => {
    const p = createMockP();
    drawArrowWithLabel(p, 0, 0, 100, 0, /** @type {any} */ ("red"), "F");
    expect(p.line).toHaveBeenCalledTimes(1);
    expect(p.textSize).toHaveBeenCalledWith(16);
    expect(p.text).toHaveBeenCalledWith("F", 50, 18);
  });

  it("オプションで文字サイズ・ずれ・矢印の太さを変更できる", () => {
    const p = createMockP();
    drawArrowWithLabel(p, 0, 0, 0, 100, /** @type {any} */ ("red"), "G", {
      labelFontSize: 20,
      labelOffset: 10,
      weight: 5
    });
    expect(p.textSize).toHaveBeenCalledWith(20);
    expect(p.strokeWeight).toHaveBeenCalledWith(5);
    const [label, x, y] = p.text.mock.calls[0];
    expect(label).toBe("G");
    expect(x).toBeCloseTo(-10);
    expect(y).toBeCloseTo(50);
  });
});
