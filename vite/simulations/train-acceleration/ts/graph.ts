// graph.js はグラフ描画専用のファイルです。

import { state } from "./state.js";
import {
  TRAIN_BODY_COLOR_RGB,
  CHART_TITLE_FONT_SIZE,
  CHART_AXIS_LABEL_FONT_SIZE,
  CHART_TICK_FONT_SIZE,
  CHART_X_AXIS_MIN_MAX,
  CHART_X_AXIS_ROUND_UNIT,
  CHART_Y_AXIS_MIN_MAX,
  CHART_Y_AXIS_ROUND_UNIT,
  CHART_Y_AXIS_VELOCITY_MARGIN
} from "./constants.js";
import {
  ChartLine,
  type ChartLineAxis
} from "../../../ts/components/chart-line.js";

const TRAIN_BODY_COLOR_CSS = `rgb(${TRAIN_BODY_COLOR_RGB.join(", ")})`;
const TRAIN_BODY_FILL_COLOR_CSS = `rgba(${TRAIN_BODY_COLOR_RGB.join(", ")}, 0.15)`;
/** 線の曲がり具合 */
const LINE_TENSION = 0.2;

const timeAxis: ChartLineAxis = {
  id: "x",
  direction: "x",
  title: "経過時間 t [s]",
  max: CHART_X_AXIS_MIN_MAX,
  titleFontSize: CHART_AXIS_LABEL_FONT_SIZE,
  tickFontSize: CHART_TICK_FONT_SIZE
};

const velocityAxis: ChartLineAxis = {
  id: "y",
  direction: "y",
  title: "速さ v [m/s]",
  max: CHART_Y_AXIS_MIN_MAX,
  titleFontSize: CHART_AXIS_LABEL_FONT_SIZE,
  tickFontSize: CHART_TICK_FONT_SIZE
};

const chartLine = new ChartLine({
  canvasId: "graphCanvas",
  title: "v-t グラフ",
  titleFontSize: CHART_TITLE_FONT_SIZE,
  legendFontSize: CHART_AXIS_LABEL_FONT_SIZE,
  showLegend: true,
  axes: [timeAxis, velocityAxis],
  datasets: [
    {
      label: "速さ v",
      color: TRAIN_BODY_COLOR_CSS,
      data: state.vtData,
      pointRadius: 0,
      fillColor: TRAIN_BODY_FILL_COLOR_CSS,
      tension: LINE_TENSION
    }
  ]
});

/**
 * v-t グラフを初期化する（共通コンポーネント `ChartLine` がChart.jsを読み込んで生成する）。
 */
export const initChart = () => {
  updateChart();
};

/**
 * v-t グラフのデータと軸範囲を更新する。
 * x軸は末尾データのみ参照、y軸は maxObservedVelocity を使って効率的に更新する。
 */
export const updateChart = () => {
  // 末尾データのみ参照して x 上限を更新（配列全体の走査を避ける）
  const lastPoint = state.vtData[state.vtData.length - 1];
  const maxT = lastPoint ? lastPoint.x : 0;
  timeAxis.max = Math.max(
    CHART_X_AXIS_MIN_MAX,
    Math.ceil(maxT / CHART_X_AXIS_ROUND_UNIT) * CHART_X_AXIS_ROUND_UNIT
  );

  // y軸上限は maxObservedVelocity を使用（減速中でも過去のピークを保持）
  velocityAxis.max = Math.max(
    CHART_Y_AXIS_MIN_MAX,
    Math.ceil(
      (state.maxObservedVelocity + CHART_Y_AXIS_VELOCITY_MARGIN) /
        CHART_Y_AXIS_ROUND_UNIT
    ) * CHART_Y_AXIS_ROUND_UNIT
  );
  chartLine.setAxisMax("x", timeAxis.max);
  chartLine.setAxisMax("y", velocityAxis.max);
  chartLine.update();
};
