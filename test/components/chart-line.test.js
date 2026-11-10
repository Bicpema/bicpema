import { describe, it, expect, vi, beforeEach } from "vitest";

/** @type {any[]} */
const chartInstances = [];
class FakeChart {
  /**
   * @param {any} canvas - canvas
   * @param {any} config - 設定
   */
  constructor(canvas, config) {
    this.canvas = canvas;
    this.config = config;
    this.data = config.data;
    this.options = config.options;
    this.update = vi.fn();
    this.destroy = vi.fn();
    chartInstances.push(this);
  }
}
vi.mock("chart.js/auto", () => ({ default: FakeChart }));
vi.mock("../../vite/ts/bicpema-dom.js", () => ({
  getCanvasElement: vi.fn((id) => (id === "missing" ? null : { id }))
}));

const { ChartLine } = await import("../../vite/ts/components/chart-line.js");

/**
 * @param {Partial<any>} [overrides] - 上書きする設定
 * @returns {any} ChartLineの設定
 */
function createOptions(overrides = {}) {
  return {
    canvasId: "c",
    title: "t",
    axes: [
      { id: "x", direction: "x", title: "時間", max: 5 },
      {
        id: "y",
        direction: "y",
        title: "速度",
        color: "red",
        max: 10,
        maxRatio: 1.2
      }
    ],
    datasets: [{ label: "v", color: "red", data: [] }],
    ...overrides
  };
}

/** 非同期の読み込み完了を待つ */
const flush = () =>
  new Promise((resolve) => {
    setTimeout(resolve, 0);
  });

describe("ChartLine", () => {
  beforeEach(() => {
    chartInstances.length = 0;
  });

  it("初回のupdateでChart.jsを読み込み、チャートを1回だけ生成する", async () => {
    const line = new ChartLine(createOptions());
    line.update();
    line.update();
    await flush();
    expect(chartInstances).toHaveLength(1);
    const { config } = chartInstances[0];
    expect(config.type).toBe("scatter");
    expect(config.options.scales.y.max).toBe(12);
    expect(config.options.scales.y.title.color).toBe("red");
  });

  it("2回目以降のupdateはdestroyせずdataとmaxだけ更新する", async () => {
    const opts = createOptions();
    const line = new ChartLine(opts);
    line.update();
    await flush();
    const chart = chartInstances[0];
    opts.datasets[0].data.push({ x: 1, y: 20 });
    line.update();
    expect(chart.destroy).not.toHaveBeenCalled();
    expect(chart.data.datasets[0].data).toBe(opts.datasets[0].data);
    expect(chart.options.scales.y.max).toBe(24);
    expect(chart.options.scales.x.max).toBe(5);
    expect(chart.update).toHaveBeenLastCalledWith("none");
    expect(chartInstances).toHaveLength(1);
  });

  it("複数軸では、yAxisIDが一致するデータセットだけで最大値を求める", async () => {
    const opts = createOptions({
      axes: [
        { id: "x", direction: "x", title: "t", max: 5 },
        { id: "y", direction: "y", title: "a", max: 1, maxRatio: 1 },
        {
          id: "y1",
          direction: "y",
          title: "b",
          max: 1,
          maxRatio: 1,
          position: "right"
        }
      ],
      datasets: [
        { label: "a", color: "red", data: [{ x: 0, y: 3 }] },
        { label: "b", color: "blue", data: [{ x: 0, y: 8 }], yAxisID: "y1" }
      ]
    });
    const line = new ChartLine(opts);
    line.update();
    await flush();
    line.update();
    const { scales } = chartInstances[0].options;
    expect(scales.y.max).toBe(3);
    expect(scales.y1.max).toBe(8);
    expect(scales.y1.position).toBe("right");
  });

  it("resetはデータを空にして軸の最大値を初期値へ戻す", async () => {
    const opts = createOptions();
    const line = new ChartLine(opts);
    line.update();
    await flush();
    opts.datasets[0].data.push({ x: 1, y: 20 });
    line.update();
    line.reset();
    expect(opts.datasets[0].data).toHaveLength(0);
    expect(chartInstances[0].options.scales.y.max).toBe(10);
    expect(chartInstances[0].destroy).not.toHaveBeenCalled();
  });

  it("disposeでdestroyし、以降のupdateでは再生成しない", async () => {
    const line = new ChartLine(createOptions());
    line.update();
    await flush();
    line.dispose();
    expect(chartInstances[0].destroy).toHaveBeenCalledTimes(1);
    line.update();
    await flush();
    expect(chartInstances).toHaveLength(1);
  });

  it("canvasが無い場合は生成しない", async () => {
    const line = new ChartLine(createOptions({ canvasId: "missing" }));
    line.update();
    await flush();
    expect(chartInstances).toHaveLength(0);
  });

  it("見た目の任意設定（点の半径・破線・塗りつぶし・フォント・グリッド）をChart.jsへ渡す", async () => {
    const line = new ChartLine(
      createOptions({
        showLegend: true,
        titleFontSize: 18,
        legendFontSize: 13,
        axes: [
          { id: "x", direction: "x", title: "t", max: 5 },
          {
            id: "y1",
            direction: "y",
            title: "v",
            max: 5,
            titleFontSize: 14,
            tickFontSize: 12,
            hideGrid: true
          }
        ],
        datasets: [
          {
            label: "v",
            color: "red",
            data: [],
            yAxisID: "y1",
            pointRadius: 0,
            borderDash: [6, 4],
            fillColor: "rgba(255,0,0,0.1)",
            tension: 0.2
          }
        ]
      })
    );
    line.update();
    await flush();
    const { options, data } = chartInstances[0].config;
    expect(options.plugins.title.font.size).toBe(18);
    expect(options.plugins.legend.labels.font.size).toBe(13);
    expect(options.scales.y1.title.font.size).toBe(14);
    expect(options.scales.y1.ticks.font.size).toBe(12);
    expect(options.scales.y1.grid.drawOnChartArea).toBe(false);
    expect(data.datasets[0]).toMatchObject({
      pointRadius: 0,
      borderDash: [6, 4],
      fill: true,
      backgroundColor: "rgba(255,0,0,0.1)",
      tension: 0.2
    });
  });

  it("drawは何も描画しない", () => {
    const line = new ChartLine(createOptions());
    const p = {};
    expect(() => line.draw(/** @type {any} */ (p))).not.toThrow();
  });
});
