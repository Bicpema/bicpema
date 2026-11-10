import { describe, it, expect, vi } from "vitest";
import { drawWebglText } from "../../vite/ts/webgl-text.js";

/** @returns {any} 2D p5.Graphicsのモック */
function createMockGraphics() {
  return {
    width: 0,
    height: 0,
    pixelDensity: vi.fn(),
    resizeCanvas: vi.fn(),
    clear: vi.fn(),
    noStroke: vi.fn(),
    fill: vi.fn(),
    textSize: vi.fn(),
    textAlign: vi.fn(),
    text: vi.fn(),
    textWidth: vi.fn((t) => t.length * 10),
    textAscent: vi.fn(() => 10),
    textDescent: vi.fn(() => 4),
    remove: vi.fn()
  };
}

/** @returns {any} p5インスタンスのモック */
function createMockP() {
  const gl = { depthMask: vi.fn() };
  return {
    gl,
    drawingContext: gl,
    LEFT: "left",
    BASELINE: "alphabetic",
    createGraphics: vi.fn((w, h) => ({
      ...createMockGraphics(),
      width: w,
      height: h
    })),
    push: vi.fn(),
    pop: vi.fn(),
    noLights: vi.fn(),
    noStroke: vi.fn(),
    translate: vi.fn(),
    texture: vi.fn(),
    plane: vi.fn()
  };
}

describe("drawWebglText", () => {
  it("文字列をテクスチャ化して平面として描画する", () => {
    const p = createMockP();
    drawWebglText(p, "ab", 5, 6, 7, {
      size: 20,
      align: "left",
      baseline: "top"
    });
    expect(p.plane).toHaveBeenCalledTimes(1);
    // 幅 = 2文字*10 + 4、高さ = ascent(10)+2 + descent(4)+2 = 18
    const [w, h] = p.plane.mock.calls[0];
    expect([w, h]).toEqual([24, 18]);
    // left/top は表示サイズの半分だけ原点側にずらして左上を指定位置に合わせる
    expect(p.translate).toHaveBeenCalledWith(5 + 12, 6 + 9, 7);
    expect(p.noLights).toHaveBeenCalled();
    expect(p.gl.depthMask).toHaveBeenNthCalledWith(1, false);
    expect(p.gl.depthMask).toHaveBeenNthCalledWith(2, true);
  });

  it("同じ文字列はテクスチャを再利用する", () => {
    const p = createMockP();
    drawWebglText(p, "reuse", 0, 0, 0, { size: 14 });
    const created = p.createGraphics.mock.calls.length;
    drawWebglText(p, "reuse", 10, 0, 0, { size: 14 });
    expect(p.createGraphics).toHaveBeenCalledTimes(created);
    expect(p.plane).toHaveBeenCalledTimes(2);
  });

  it("slot指定時は文字列が変わったときだけ再描画する", () => {
    const p = createMockP();
    const opt = { size: 15, slot: "hud" };
    drawWebglText(p, "t=1", 0, 0, 0, opt);
    const tex = p.texture.mock.calls[0][0];
    drawWebglText(p, "t=1", 0, 0, 0, opt);
    expect(tex.text).toHaveBeenCalledTimes(1);
    drawWebglText(p, "t=22", 0, 0, 0, opt);
    expect(p.texture.mock.calls[2][0]).toBe(tex);
    expect(tex.text).toHaveBeenCalledTimes(2);
    expect(tex.resizeCanvas).toHaveBeenCalled();
  });
});
