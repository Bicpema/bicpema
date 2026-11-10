import { drawInfoPanel } from "../vite/ts/components/info-panel.ts";
import { createP5Story } from "./p5-decorator.js";

export default {
  title: "描画部品/情報パネル",
  parameters: { layout: "centered" },
  argTypes: {
    velocity: { control: { type: "range", min: -20, max: 20, step: 0.1 } },
    twoColumns: { control: "boolean" }
  },
  args: { velocity: 3.4, twoColumns: false }
};

/** 速度・時刻・加速度を並べた情報パネル。数値は等幅で右揃えになる。 */
export const Default = {
  render: ({ velocity, twoColumns }) =>
    createP5Story(
      (p) => {
        p.setup = () => {
          p.createCanvas(480, 300);
        };
        p.draw = () => {
          p.background(235);
          const angle = twoColumns
            ? { secondValue: "30.0", secondUnit: "°" }
            : {};
          drawInfoPanel(
            p,
            [
              {
                label: "速度 v",
                value: velocity.toFixed(2),
                unit: "m/s",
                ...angle
              },
              { label: "時刻 t", value: "1.25", unit: "s", ...angle },
              {
                label: "加速度 a",
                value: "9.80",
                unit: "m/s²",
                color: "rgb(220, 50, 50)",
                dividerAbove: true,
                ...angle
              }
            ],
            {
              x: p.width - 14,
              y: p.height - 14,
              anchorX: "right",
              anchorY: "bottom"
            }
          );
        };
      },
      { width: 480, height: 300 }
    )
};
