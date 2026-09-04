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
  CHART_Y_AXIS_VELOCITY_MARGIN,
} from "./constants.js";
import { createLazyImporter } from "../../../js/bicpema-lazy-import.js";

const loadChart = createLazyImporter(() =>
  import("chart.js/auto").then((module) => module.default)
);

const TRAIN_BODY_COLOR_CSS = `rgb(${TRAIN_BODY_COLOR_RGB.join(", ")})`;
const TRAIN_BODY_FILL_COLOR_CSS = `rgba(${TRAIN_BODY_COLOR_RGB.join(", ")}, 0.15)`;

/**
 * v-t グラフを初期化する。
 * Chart.jsを動的importしてから生成する（完了までは既存グラフを保持する）。
 * 読み込みに失敗した場合はグラフの初期化を中断する。
 */
export const initChart = async () => {
  let Chart;
  try {
    Chart = await loadChart();
  } catch (error) {
    console.error(
      "Chart.jsの読み込みに失敗したため、グラフを初期化できませんでした。",
      error
    );
    return;
  }
  if (state.graphChart) {
    state.graphChart.destroy();
  }
  const ctx = document.getElementById("graphCanvas").getContext("2d");
  state.graphChart = new Chart(ctx, {
    type: "scatter",
    data: {
      datasets: [
        {
          label: "速さ v",
          showLine: true,
          data: state.vtData,
          pointRadius: 0,
          borderColor: TRAIN_BODY_COLOR_CSS,
          borderWidth: 2,
          fill: true,
          backgroundColor: TRAIN_BODY_FILL_COLOR_CSS,
          tension: 0.2,
        },
      ],
    },
    options: {
      animation: false,
      maintainAspectRatio: false,
      plugins: {
        title: {
          display: true,
          text: "v-t グラフ",
          font: { size: CHART_TITLE_FONT_SIZE },
        },
        legend: {
          labels: { font: { size: CHART_AXIS_LABEL_FONT_SIZE } },
        },
      },
      scales: {
        x: {
          type: "linear",
          min: 0,
          title: {
            display: true,
            text: "経過時間 t [s]",
            font: { size: CHART_AXIS_LABEL_FONT_SIZE },
          },
          ticks: { font: { size: CHART_TICK_FONT_SIZE } },
        },
        y: {
          min: 0,
          title: {
            display: true,
            text: "速さ v [m/s]",
            font: { size: CHART_AXIS_LABEL_FONT_SIZE },
          },
          ticks: { font: { size: CHART_TICK_FONT_SIZE } },
        },
      },
    },
  });
};

/**
 * v-t グラフのデータと軸範囲を更新する。
 * x軸は末尾データのみ参照、y軸は maxObservedVelocity を使って効率的に更新する。
 */
export const updateChart = () => {
  if (!state.graphChart) return;
  state.graphChart.data.datasets[0].data = state.vtData;

  // 末尾データのみ参照して x 上限を更新（配列全体の走査を避ける）
  const lastPoint = state.vtData[state.vtData.length - 1];
  const maxT = lastPoint ? lastPoint.x : 0;
  state.graphChart.options.scales.x.max = Math.max(
    CHART_X_AXIS_MIN_MAX,
    Math.ceil(maxT / CHART_X_AXIS_ROUND_UNIT) * CHART_X_AXIS_ROUND_UNIT
  );

  // y軸上限は maxObservedVelocity を使用（減速中でも過去のピークを保持）
  state.graphChart.options.scales.y.max = Math.max(
    CHART_Y_AXIS_MIN_MAX,
    Math.ceil(
      (state.maxObservedVelocity + CHART_Y_AXIS_VELOCITY_MARGIN) /
        CHART_Y_AXIS_ROUND_UNIT
    ) * CHART_Y_AXIS_ROUND_UNIT
  );

  state.graphChart.update();
};
