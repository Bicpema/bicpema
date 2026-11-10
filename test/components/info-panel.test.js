import { describe, it, expect, vi } from "vitest";
import {
  INFO_PANEL_STYLE,
  layoutInfoPanel,
  drawInfoPanel
} from "../../vite/ts/components/info-panel.js";

/** @returns {any} p5インスタンスのモック */
function createMockP() {
  return {
    push: vi.fn(),
    pop: vi.fn(),
    fill: vi.fn(),
    stroke: vi.fn(),
    noStroke: vi.fn(),
    strokeWeight: vi.fn(),
    rect: vi.fn(),
    line: vi.fn(),
    text: vi.fn(),
    textSize: vi.fn(),
    textAlign: vi.fn(),
    textFont: vi.fn(),
    textStyle: vi.fn(),
    drawingContext: {},
    LEFT: "left",
    RIGHT: "right",
    CENTER: "center",
    BOLD: "bold"
  };
}

const rows = [
  { label: "速度 v", value: "3.4", unit: "m/s" },
  { label: "時刻 t", value: "1.0", unit: "s", dividerAbove: true }
];

describe("layoutInfoPanel", () => {
  it("既定では左上の余白位置に置き、高さは行数と余白から決まる", () => {
    const s = INFO_PANEL_STYLE;
    const layout = layoutInfoPanel(rows);
    expect(layout.x).toBe(s.margin);
    expect(layout.y).toBe(s.margin);
    expect(layout.height).toBe(2 * s.rowHeight + s.paddingY * 2);
    expect(layout.columns).toBe(1);
    expect(layout.rowTops).toEqual([
      s.margin + s.paddingY,
      s.margin + s.paddingY + s.rowHeight
    ]);
  });

  it("anchorX=right・anchorY=bottomでは基準点がパネルの右下になる", () => {
    const layout = layoutInfoPanel(rows, {
      x: 500,
      y: 300,
      anchorX: "right",
      anchorY: "bottom"
    });
    expect(layout.x + layout.width).toBe(500);
    expect(layout.y + layout.height).toBe(300);
  });

  it("2つ目の数値を持つ行があると2列分の幅になる", () => {
    const one = layoutInfoPanel(rows);
    const two = layoutInfoPanel([{ ...rows[0], secondValue: "30" }]);
    expect(two.columns).toBe(2);
    expect(two.width - one.width).toBe(
      INFO_PANEL_STYLE.valueWidth +
        INFO_PANEL_STYLE.unitGap +
        INFO_PANEL_STYLE.unitWidth
    );
  });

  it("labelWidthで幅を広げられる", () => {
    const base = layoutInfoPanel(rows);
    const wide = layoutInfoPanel(rows, { labelWidth: 200 });
    expect(wide.width - base.width).toBe(200 - INFO_PANEL_STYLE.labelWidth);
  });
});

describe("drawInfoPanel", () => {
  it("背景を1つ描き、ラベル・数値・単位を行ごとに描画する", () => {
    const p = createMockP();
    drawInfoPanel(p, rows);
    expect(p.rect).toHaveBeenCalledTimes(1);
    expect(p.text).toHaveBeenCalledWith(
      "速度 v",
      expect.any(Number),
      expect.any(Number)
    );
    expect(p.text).toHaveBeenCalledWith(
      "3.4",
      expect.any(Number),
      expect.any(Number)
    );
    expect(p.text).toHaveBeenCalledWith(
      "m/s",
      expect.any(Number),
      expect.any(Number)
    );
    expect(p.text).toHaveBeenCalledTimes(6);
  });

  it("区切り線は2行目以降のdividerAboveの行にだけ引く", () => {
    const p = createMockP();
    drawInfoPanel(p, [
      { ...rows[0], dividerAbove: true },
      { ...rows[1], dividerAbove: false }
    ]);
    expect(p.line).not.toHaveBeenCalled();
    drawInfoPanel(p, rows);
    expect(p.line).toHaveBeenCalledTimes(1);
  });

  it("文字サイズはラベル・数値・単位の3段階のみを使う", () => {
    const p = createMockP();
    drawInfoPanel(p, [{ ...rows[0], secondValue: "1", secondUnit: "°" }]);
    const sizes = new Set(
      p.textSize.mock.calls.map((/** @type {any[]} */ c) => c[0])
    );
    expect(sizes).toEqual(
      new Set([
        INFO_PANEL_STYLE.labelSize,
        INFO_PANEL_STYLE.valueSize,
        INFO_PANEL_STYLE.unitSize
      ])
    );
  });

  it("数値は等幅フォントの太字で描画する", () => {
    const p = createMockP();
    drawInfoPanel(p, rows);
    expect(p.textFont).toHaveBeenCalledWith(INFO_PANEL_STYLE.numberFont);
    expect(p.textStyle).toHaveBeenCalledWith("bold");
  });

  it("行の色を数値に使い、描画状態をpush/popで閉じる", () => {
    const p = createMockP();
    drawInfoPanel(p, [{ label: "a", value: "1", color: "red" }]);
    expect(p.fill).toHaveBeenCalledWith("red");
    expect(p.push.mock.calls.length).toBe(p.pop.mock.calls.length);
  });

  it("配置結果を返す", () => {
    const p = createMockP();
    const layout = drawInfoPanel(p, rows, { x: 100, y: 50 });
    expect(layout.x).toBe(100);
    expect(layout.y).toBe(50);
  });
});
