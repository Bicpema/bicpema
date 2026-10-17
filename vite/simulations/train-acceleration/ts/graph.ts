// graph.ts はグラフ描画専用のファイルです。

import { state } from "./state.js";
import {
  COLOR,
  CHART_X_MIN_MAX,
  CHART_Y_MIN_MAX,
  CHART_MAX_RATIO
} from "./constants.js";
import {
  ChartLine,
  type ChartLineAxis
} from "../../../ts/components/chart-line.js";

const timeAxis: ChartLineAxis = {
  id: "x",
  direction: "x",
  title: "経過時間 t [s]",
  max: CHART_X_MIN_MAX,
  minMax: CHART_X_MIN_MAX,
  maxRatio: CHART_MAX_RATIO,
  titleFontSize: 14,
  tickFontSize: 12
};

const velocityAxis: ChartLineAxis = {
  id: "y",
  direction: "y",
  title: "速さ v [m/s]",
  max: CHART_Y_MIN_MAX,
  minMax: CHART_Y_MIN_MAX,
  maxRatio: CHART_MAX_RATIO,
  titleFontSize: 14,
  tickFontSize: 12
};

const chartLine = new ChartLine({
  canvasId: "graphCanvas",
  type: "line",
  title: "v-tグラフ",
  titleFontSize: 16,
  showLegend: true,
  legendFontSize: 13,
  axes: [timeAxis, velocityAxis],
  datasets: [
    {
      label: "速さ v",
      color: COLOR.train,
      data: state.vtData,
      pointRadius: 0
    }
  ]
});

/** v-t図へ現在のデータを反映する（初回はChart.jsを読み込んでグラフを生成する）。 */
export const updateGraph = () => {
  chartLine.update();
};

/** v-t図のデータを原点のみに戻して再描画する。 */
export const resetGraph = () => {
  chartLine.reset();
  state.vtData.push({ x: 0, y: 0 });
  chartLine.update();
};
