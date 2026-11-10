import { describe, it, expect, vi } from "vitest";
import { CoordinateSystem } from "../../vite/ts/components/coordinate-system.js";
import {
  drawPlotArea,
  drawPolyline
} from "../../vite/ts/components/plot-area.js";

/** @returns {any} p5インスタンスのモック */
function createMockP() {
  return {
    width: 400,
    height: 300,
    CENTER: "center",
    TOP: "top",
    BOTTOM: "bottom",
    LEFT: "left",
    RIGHT: "right",
    HALF_PI: Math.PI / 2,
    color: vi.fn((...args) => `color(${args.join(",")})`),
    stroke: vi.fn(),
    noStroke: vi.fn(),
    strokeWeight: vi.fn(),
    fill: vi.fn(),
    noFill: vi.fn(),
    line: vi.fn(),
    rect: vi.fn(),
    text: vi.fn(),
    textSize: vi.fn(),
    textAlign: vi.fn(),
    translate: vi.fn(),
    rotate: vi.fn(),
    push: vi.fn(),
    pop: vi.fn()
  };
}

/** @type {any} */
const RED = "red";
/** @type {any} */
const BLUE = "blue";
/** @type {any} */
const GREEN = "green";
/** @type {any} */
const GRAY = "gray";
const bounds = { left: 100, top: 50, right: 300, bottom: 250 };
// 枠の中心(200,150)が原点、1単位=1px
const cs = new CoordinateSystem({ originX: 200, originY: 150, scaleX: 1 });

describe("drawPolyline", () => {
  it("隣り合う点をピクセル座標に変換して線で結ぶ", () => {
    const p = createMockP();
    drawPolyline(
      p,
      cs,
      [
        { x: 0, y: 0 },
        { x: 10, y: 20 },
        { x: 30, y: 20 }
      ],
      RED,
      3
    );
    expect(p.line.mock.calls).toEqual([
      [200, 150, 210, 130],
      [210, 130, 230, 130]
    ]);
    expect(p.stroke).toHaveBeenCalledWith(RED);
    expect(p.strokeWeight).toHaveBeenCalledWith(3);
  });

  it("点が2つ未満なら何も描かない", () => {
    const p = createMockP();
    drawPolyline(p, cs, [{ x: 1, y: 1 }], RED);
    drawPolyline(p, cs, [], RED);
    expect(p.line).not.toHaveBeenCalled();
    expect(p.push).not.toHaveBeenCalled();
  });

  it("太さの既定値は2で、描画状態をpush()/pop()で閉じる", () => {
    const p = createMockP();
    drawPolyline(
      p,
      cs,
      [
        { x: 0, y: 0 },
        { x: 1, y: 1 }
      ],
      RED
    );
    expect(p.strokeWeight).toHaveBeenCalledWith(2);
    expect(p.pop).toHaveBeenCalledTimes(p.push.mock.calls.length);
  });
});

describe("drawPlotArea", () => {
  it("背景矩形を枠の位置・大きさ・既定の角丸で描画する", () => {
    const p = createMockP();
    drawPlotArea(p, cs, { bounds });
    expect(p.rect).toHaveBeenCalledWith(100, 50, 200, 200, 8);
    expect(p.fill).toHaveBeenCalledWith("color(250)");
  });

  it("backgroundにfalseを渡すと矩形を描画しない", () => {
    const p = createMockP();
    drawPlotArea(p, cs, { bounds, background: false });
    expect(p.rect).not.toHaveBeenCalled();
  });

  it("背景の角丸を指定できる", () => {
    const p = createMockP();
    drawPlotArea(p, cs, { bounds, background: { radius: 0 } });
    expect(p.rect).toHaveBeenCalledWith(100, 50, 200, 200, 0);
  });

  it("グリッド間隔を省略すると線を描画しない", () => {
    const p = createMockP();
    drawPlotArea(p, cs, { bounds });
    expect(p.line).not.toHaveBeenCalled();
  });

  it("グリッドを枠の範囲内にだけ描画する", () => {
    const p = createMockP();
    drawPlotArea(p, cs, { bounds, gridStepX: 50 });
    expect(p.line.mock.calls).toEqual([
      [100, 50, 100, 250],
      [150, 50, 150, 250],
      [200, 50, 200, 250],
      [250, 50, 250, 250],
      [300, 50, 300, 250]
    ]);
  });

  it("系列ごとに折れ線を描画する", () => {
    const p = createMockP();
    drawPlotArea(p, cs, {
      bounds,
      series: [
        {
          points: [
            { x: 0, y: 0 },
            { x: 10, y: 10 }
          ],
          color: BLUE
        },
        {
          points: [
            { x: 0, y: 0 },
            { x: -10, y: 10 }
          ],
          color: GREEN
        }
      ]
    });
    expect(p.line.mock.calls).toEqual([
      [200, 150, 210, 140],
      [200, 150, 190, 140]
    ]);
  });

  it("axisLineで原点を通る横線と縦線を枠いっぱいに引く", () => {
    const p = createMockP();
    drawPlotArea(p, cs, { bounds, axisLine: {} });
    expect(p.line.mock.calls).toEqual([
      [100, 150, 300, 150],
      [200, 50, 200, 250]
    ]);
    expect(p.strokeWeight).toHaveBeenCalledWith(1.5);
  });

  it("目盛りの値ラベルを描画し、0は描画しない", () => {
    const p = createMockP();
    drawPlotArea(p, cs, {
      bounds,
      ticks: { stepX: 50, stepY: 100, format: (v) => `${v}!` }
    });
    const texts = p.text.mock.calls;
    expect(texts).toContainEqual(["-50!", 150, 156]);
    expect(texts).toContainEqual(["50!", 250, 156]);
    expect(texts).toContainEqual(["100!", 194, 50]);
    expect(texts).toContainEqual(["-100!", 194, 250]);
    expect(texts.some((/** @type {any[]} */ c) => c[0] === "0!")).toBe(false);
  });

  it("formatを省略すると数値をそのまま文字列にする", () => {
    const p = createMockP();
    drawPlotArea(p, cs, { bounds, ticks: { stepX: 100 } });
    expect(p.text).toHaveBeenCalledWith("-100", 100, 156);
  });

  it("stepを省略した方向の値ラベルは描画しない", () => {
    const p = createMockP();
    drawPlotArea(p, cs, { bounds, ticks: { stepX: 100 } });
    expect(p.text).toHaveBeenCalledTimes(2);
  });

  it("軸タイトルとグラフタイトルを枠の外に描画する", () => {
    const p = createMockP();
    drawPlotArea(p, cs, {
      bounds,
      labels: { xTitle: "時間", yTitle: "速さ", title: "v-tグラフ" }
    });
    expect(p.text).toHaveBeenCalledWith("時間", 200, 280);
    expect(p.text).toHaveBeenCalledWith("速さ", 0, 0);
    expect(p.translate).toHaveBeenCalledWith(60, 150);
    expect(p.rotate).toHaveBeenCalledWith(-Math.PI / 2);
    expect(p.text).toHaveBeenCalledWith("v-tグラフ", 200, 22);
  });

  it("ラベル未指定ならテキストを描画しない", () => {
    const p = createMockP();
    drawPlotArea(p, cs, { bounds });
    expect(p.text).not.toHaveBeenCalled();
  });

  it("凡例はlabelを持つ系列だけを並べる", () => {
    const p = createMockP();
    const points = [
      { x: 0, y: 0 },
      { x: 1, y: 1 }
    ];
    drawPlotArea(p, cs, {
      bounds,
      series: [
        { points, color: RED, label: "A" },
        { points, color: GRAY },
        { points, color: BLUE, label: "B" }
      ],
      legend: {}
    });
    const texts = p.text.mock.calls;
    expect(texts).toEqual([
      ["A", 134, 67.5],
      ["B", 134, 86.5]
    ]);
    expect(p.line).toHaveBeenCalledWith(108, 67.5, 128, 67.5);
    expect(p.line).toHaveBeenCalledWith(108, 86.5, 128, 86.5);
  });

  it("凡例の位置を指定できる", () => {
    const p = createMockP();
    drawPlotArea(p, cs, {
      bounds,
      series: [{ points: [], color: RED, label: "A" }],
      legend: { position: { x: 0, y: 0 }, fontSize: 10, lineHeight: 20 }
    });
    expect(p.text).toHaveBeenCalledWith("A", 26, 10);
  });

  it("描画状態をpush()/pop()で閉じる", () => {
    const p = createMockP();
    drawPlotArea(p, cs, {
      bounds,
      gridStepX: 50,
      ticks: { stepX: 50 },
      labels: { yTitle: "y" }
    });
    expect(p.pop).toHaveBeenCalledTimes(p.push.mock.calls.length);
    expect(p.push.mock.invocationCallOrder[0]).toBeLessThan(
      p.rect.mock.invocationCallOrder[0]
    );
    expect(p.pop.mock.invocationCallOrder.at(-1)).toBeGreaterThan(
      p.text.mock.invocationCallOrder.at(-1)
    );
  });
});
