import { CoordinateSystem } from "../vite/ts/components/coordinate-system.ts";
import { createP5Story } from "./p5-decorator.js";

export default {
  title: "描画部品/座標系",
  parameters: { layout: "centered" },
  argTypes: {
    scale: { control: { type: "range", min: 10, max: 80 } },
    originX: { control: { type: "range", min: 0, max: 400 } },
    originY: { control: { type: "range", min: 0, max: 300 } },
    gridStep: { control: { type: "range", min: 0.5, max: 5, step: 0.5 } },
    flipY: { control: "boolean" }
  },
  args: { scale: 40, originX: 200, originY: 150, gridStep: 1, flipY: true }
};

/** 原点・スケール・Y軸反転・グリッド間隔を変更でき、マウス位置を物理座標で表示する。 */
export const Default = {
  render: ({ scale, originX, originY, gridStep, flipY }) =>
    createP5Story((p) => {
      const cs = new CoordinateSystem({
        originX,
        originY,
        scaleX: scale,
        flipY
      });
      p.setup = () => {
        p.createCanvas(400, 300);
      };
      p.draw = () => {
        p.background(255);
        p.stroke(168, 206, 221);
        p.strokeWeight(1);
        for (const x of cs.gridValuesX(0, p.width, gridStep)) {
          p.line(cs.toPxX(x), 0, cs.toPxX(x), p.height);
        }
        for (const y of cs.gridValuesY(0, p.height, gridStep)) {
          p.line(0, cs.toPxY(y), p.width, cs.toPxY(y));
        }
        p.stroke(0);
        p.strokeWeight(2);
        p.line(0, originY, p.width, originY);
        p.line(originX, 0, originX, p.height);
        const m = cs.toPhys(p.mouseX, p.mouseY);
        p.noStroke();
        p.fill(0);
        p.textSize(14);
        p.text(`(${m.x.toFixed(2)}, ${m.y.toFixed(2)})`, 8, 20);
      };
    })
};
