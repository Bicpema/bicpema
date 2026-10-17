import { drawAxes } from "../vite/ts/components/axes.ts";
import { CoordinateSystem } from "../vite/ts/components/coordinate-system.ts";
import { createP5Story } from "./p5-decorator.js";

export default {
  title: "描画部品/座標軸",
  parameters: { layout: "centered" },
  argTypes: {
    originX: { control: { type: "range", min: 50, max: 350 } },
    originY: { control: { type: "range", min: 50, max: 250 } },
    bothDirections: { control: "boolean" },
    showXAxis: { control: "boolean" },
    showYAxis: { control: "boolean" },
    yLabelVertical: { control: "boolean" },
    weight: { control: { type: "range", min: 1, max: 6 } }
  },
  args: {
    originX: 200,
    originY: 150,
    bothDirections: true,
    showXAxis: true,
    showYAxis: true,
    yLabelVertical: false,
    weight: 2
  }
};

/** 原点・軸の方向・縦書きラベル・太さをコントロールで変更できる座標軸。 */
export const Default = {
  render: ({
    originX,
    originY,
    bothDirections,
    showXAxis,
    showYAxis,
    yLabelVertical,
    weight
  }) =>
    createP5Story((p) => {
      p.setup = () => {
        p.createCanvas(400, 300);
      };
      p.draw = () => {
        p.background(255);
        drawAxes(p, new CoordinateSystem({ originX, originY }), {
          xLabel: "x",
          yLabel: yLabelVertical ? "縦軸" : "y",
          originLabel: "O",
          bothDirections,
          showXAxis,
          showYAxis,
          yLabelVertical,
          weight
        });
      };
    })
};
