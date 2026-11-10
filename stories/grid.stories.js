import { CoordinateSystem } from "../vite/ts/components/coordinate-system.ts";
import { drawGrid } from "../vite/ts/components/grid.ts";
import { createP5Story } from "./p5-decorator.js";

export default {
  title: "描画部品/グリッド",
  parameters: { layout: "centered" },
  argTypes: {
    stepX: { control: { type: "range", min: 10, max: 100, step: 5 } },
    stepY: { control: { type: "range", min: 10, max: 100, step: 5 } },
    weight: { control: { type: "range", min: 0.5, max: 5, step: 0.5 } },
    originX: { control: { type: "range", min: 0, max: 400 } },
    originY: { control: { type: "range", min: 0, max: 300 } }
  },
  args: { stepX: 40, stepY: 40, weight: 1, originX: 200, originY: 150 }
};

/** 間隔・太さ・原点位置をコントロールで変更できるグリッド。原点を必ず通る位置から線を引く。 */
export const Default = {
  render: ({ stepX, stepY, weight, originX, originY }) =>
    createP5Story((p) => {
      p.setup = () => {
        p.createCanvas(400, 300);
      };
      p.draw = () => {
        p.background(255);
        const cs = new CoordinateSystem({ originX, originY });
        drawGrid(p, cs, { stepX, stepY, weight });
        p.stroke(0);
        p.strokeWeight(2);
        p.line(originX - 6, originY, originX + 6, originY);
        p.line(originX, originY - 6, originX, originY + 6);
      };
    })
};

/** boundsで描画範囲を制限したグリッド（中央の矩形内のみ）。 */
export const WithBounds = {
  render: ({ stepX, stepY, weight, originX, originY }) =>
    createP5Story((p) => {
      p.setup = () => {
        p.createCanvas(400, 300);
      };
      p.draw = () => {
        p.background(255);
        const cs = new CoordinateSystem({ originX, originY });
        drawGrid(p, cs, {
          stepX,
          stepY,
          weight,
          bounds: { left: 50, top: 50, right: 350, bottom: 250 }
        });
      };
    })
};
