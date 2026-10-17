import { Arrow } from "../vite/ts/components/arrow.ts";
import { createP5Story } from "./p5-decorator.js";

export default {
  title: "描画部品/矢印",
  parameters: { layout: "centered" },
  argTypes: {
    length: { control: { type: "range", min: 0, max: 300 } },
    angle: { control: { type: "range", min: 0, max: 360 } },
    weight: { control: { type: "range", min: 1, max: 10 } },
    headSize: { control: { type: "range", min: 4, max: 30 } }
  },
  args: { length: 150, angle: 30, weight: 3, headSize: 12 }
};

/** 長さ・角度・太さ・頭の大きさをコントロールで変更できる矢印。 */
export const Default = {
  render: ({ length, angle, weight, headSize }) =>
    createP5Story((p) => {
      const arrow = new Arrow(0, 0, 0, 0, null, {});
      p.setup = () => {
        p.createCanvas(400, 300);
        arrow.color = p.color(220, 50, 50);
      };
      p.draw = () => {
        p.background(255);
        const rad = p.radians(angle);
        const cx = p.width / 2 - (length * Math.cos(rad)) / 2;
        const cy = p.height / 2 + (length * Math.sin(rad)) / 2;
        arrow.set(
          cx,
          cy,
          cx + length * Math.cos(rad),
          cy - length * Math.sin(rad)
        );
        arrow.style = { weight, headSize };
        arrow.update();
        arrow.draw(p);
      };
    })
};
