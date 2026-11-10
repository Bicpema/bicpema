import { CoordinateSystem } from "../vite/ts/components/coordinate-system.ts";
import { drawPlotArea } from "../vite/ts/components/plot-area.ts";
import { createP5Story } from "./p5-decorator.js";

export default {
  title: "描画部品/グラフ枠",
  parameters: { layout: "centered" },
  argTypes: {
    slope: { control: { type: "range", min: -5, max: 5, step: 0.5 } },
    showLegend: { control: "boolean" },
    showGrid: { control: "boolean" }
  },
  args: { slope: 2, showLegend: true, showGrid: true }
};

/** 背景・グリッド・折れ線・軸線・目盛り・軸タイトル・凡例をまとめて描画するグラフ枠（F = kx の例）。 */
export const Default = {
  render: ({ slope, showLegend, showGrid }) =>
    createP5Story((p) => {
      p.setup = () => {
        p.createCanvas(400, 320);
      };
      p.draw = () => {
        p.background(255);
        const bounds = { left: 60, top: 40, right: 380, bottom: 280 };
        // x: ±50、y: ±50 を枠いっぱいに対応させる
        const cs = new CoordinateSystem({
          originX: 220,
          originY: 160,
          scaleX: 160 / 50,
          scaleY: 120 / 50
        });
        const points = [
          { x: -50, y: Math.max(-50, Math.min(50, -50 * slope)) },
          { x: 50, y: Math.max(-50, Math.min(50, 50 * slope)) }
        ];
        drawPlotArea(p, cs, {
          bounds,
          gridStepX: showGrid ? 10 : undefined,
          gridStepY: showGrid ? 10 : undefined,
          series: [
            {
              points,
              color: p.color(30, 100, 220),
              weight: 2.5,
              label: `F = ${slope}x`
            }
          ],
          axisLine: {},
          ticks: { stepX: 25, stepY: 25 },
          labels: {
            xTitle: "x (cm)",
            yTitle: "F (N)",
            title: "フックの法則"
          },
          legend: showLegend ? { position: { x: 70, y: 48 } } : undefined
        });
      };
    })
};
