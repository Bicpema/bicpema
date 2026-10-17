// graph.js - v-tグラフ描画専用のファイルです。

import { state } from "./state.js";
import { SLOPE_LENGTH_M } from "./function.js";
import {
  RECORDED_DATA_COLOR,
  AXIS_TITLE_FONT_SIZE,
  AXIS_TICK_FONT_SIZE
} from "./constants.js";
import {
  ChartLine,
  type ChartLineAxis,
  type ChartPoint
} from "../../../ts/components/chart-line.js";

/** 理論直線の色 */
const THEORETICAL_COLOR = "rgba(100, 160, 255, 0.6)";
/** 理論直線の点の間隔 (s) */
const THEORETICAL_STEP_S = 0.05;
/** 時間軸の最大値に加える余白 (s) */
const TIME_AXIS_MARGIN_S = 0.1;
/** 速度軸の最大値の余白倍率 */
const VELOCITY_AXIS_MARGIN_RATIO = 1.1;

/** 理論直線のデータ（`updateGraph()` のたびに同じ配列を作り直す） */
const theoreticalData: ChartPoint[] = [];

const timeAxis: ChartLineAxis = {
  id: "x",
  direction: "x",
  title: "時間 t [s]",
  max: 1,
  titleFontSize: AXIS_TITLE_FONT_SIZE,
  tickFontSize: AXIS_TICK_FONT_SIZE
};

const velocityAxis: ChartLineAxis = {
  id: "y",
  direction: "y",
  title: "速度 v [m/s]",
  max: 1,
  titleFontSize: AXIS_TITLE_FONT_SIZE,
  tickFontSize: AXIS_TICK_FONT_SIZE
};

const chartLine = new ChartLine({
  canvasId: "graphCanvas",
  title: "v-tグラフ（速度-時間グラフ）",
  titleFontSize: 16,
  legendFontSize: 13,
  showLegend: true,
  axes: [timeAxis, velocityAxis],
  datasets: [
    {
      label: "理論値 v = at",
      color: THEORETICAL_COLOR,
      data: theoreticalData,
      pointRadius: 0,
      borderDash: [6, 4]
    },
    {
      label: "記録テープのデータ",
      color: RECORDED_DATA_COLOR,
      data: state.vtData,
      pointRadius: 5
    }
  ]
});

/**
 * v-tグラフを更新（共通コンポーネント `ChartLine` を使用）
 * 理論直線と軸の最大値を現在の加速度から求め直す。
 */
export function updateGraph() {
  if (!state.graphVisible) return;

  const { accel } = state.cart!;
  const maxT = Math.sqrt((2 * SLOPE_LENGTH_M) / accel) + TIME_AXIS_MARGIN_S;
  theoreticalData.length = 0;
  for (let t = 0; t <= maxT; t += THEORETICAL_STEP_S) {
    theoreticalData.push({
      x: parseFloat(t.toFixed(3)),
      y: parseFloat((accel * t).toFixed(4))
    });
  }

  const timeMax = parseFloat(maxT.toFixed(2));
  const velocityMax = parseFloat(
    (accel * maxT * VELOCITY_AXIS_MARGIN_RATIO).toFixed(2)
  );
  timeAxis.max = timeMax;
  velocityAxis.max = velocityMax;
  chartLine.setAxisMax("x", timeMax);
  chartLine.setAxisMax("y", velocityMax);
  chartLine.update();
}
