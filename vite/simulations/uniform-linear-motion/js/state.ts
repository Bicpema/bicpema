import type p5 from "p5";
import type { Chart } from "chart.js";
import type { CAR } from "./car.js";

export const state: {
  YELLOW_CAR: CAR | null;
  RED_CAR: CAR | null;
  YELLOW_CAR_IMG: p5.Image | null;
  RED_CAR_IMAGE: p5.Image | null;
  graphData: boolean;
  graphChart: Chart | null;
  isPlaying: boolean;
  /** elCreate内で必ず設定されるため、それ以降のイベントハンドラ内では非nullとして扱える */
  playButton: p5.Element | null;
} = {
  YELLOW_CAR: null,
  RED_CAR: null,
  YELLOW_CAR_IMG: null,
  RED_CAR_IMAGE: null,
  graphData: true,
  graphChart: null,
  isPlaying: true,
  playButton: null
};
