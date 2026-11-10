import { drawDashedLine } from "../vite/ts/components/dashed-line.ts";
import { createP5Story } from "./p5-decorator.js";

export default {
  title: "描画部品/点線",
  parameters: { layout: "centered" },
  argTypes: {
    length: { control: { type: "range", min: 0, max: 300 } },
    angle: { control: { type: "range", min: 0, max: 360 } },
    weight: { control: { type: "range", min: 1, max: 10, step: 0.5 } },
    dashLength: { control: { type: "range", min: 2, max: 30 } },
    gapLength: { control: { type: "range", min: 2, max: 30 } }
  },
  args: { length: 200, angle: 30, weight: 1.5, dashLength: 8, gapLength: 6 }
};

/** 長さ・角度・太さ・線分長・間隔をコントロールで変更できる点線。 */
export const Default = {
  render: ({ length, angle, weight, dashLength, gapLength }) =>
    createP5Story((p) => {
      p.setup = () => {
        p.createCanvas(400, 300);
      };
      p.draw = () => {
        p.background(255);
        const rad = p.radians(angle);
        const cx = p.width / 2 - (length * Math.cos(rad)) / 2;
        const cy = p.height / 2 + (length * Math.sin(rad)) / 2;
        drawDashedLine(
          p,
          cx,
          cy,
          cx + length * Math.cos(rad),
          cy - length * Math.sin(rad),
          p.color(100),
          { weight, dashLength, gapLength }
        );
      };
    })
};
