import { state } from "./state.js";
import {
  PX_PER_DISTANCE_UNIT,
  SCALE_MINOR_TICK_INTERVAL,
  SCALE_MAJOR_TICK_LINE_END_OFFSET,
  SCALE_MINOR_TICK_LINE_END_OFFSET,
  SCALE_LABEL_OFFSET,
  DEFAULT_SIMULATION_DURATION,
  CHART_TITLE_FONT_SIZE,
  CHART_LABEL_FONT_SIZE,
  TICK_LABEL_FONT_SIZE,
  YELLOW_CAR_COLOR,
  RED_CAR_COLOR,
} from "./constants.js";
import { createLazyImporter } from "../../../js/bicpema-lazy-import.js";

const loadChart = createLazyImporter(() =>
  import("chart.js/auto").then((module) => module.default)
);
/** @type {typeof import("chart.js").Chart | null} */
let Chart = null;
loadChart()
  .then((ChartCtor) => {
    Chart = ChartCtor;
  })
  .catch((error) => {
    // 失敗時はgraphDrawの`if (!Chart) return;`ガードによりグラフ描画のみが
    // スキップされ続けるため、ここではログ出力のみ行いunhandled rejectionを防ぐ。
    console.error("Chart.jsの読み込みに失敗しました。", error);
  });

/**
 * スケールの表示をする。
 *
 * @param {p5} p p5インスタンス
 * @param {number} x スケールのx座標
 * @param {number} y スケールのy座標
 * @param {number} w スケールの幅
 * @param {number} h スケールの高さ
 */
export function drawScale(p, x, y, w, h) {
  p.fill(255);
  p.rect(x, y - h, w, h);
  p.fill(0);
  p.stroke(0);
  p.strokeWeight(1);
  for (let i = 0; i <= w; i += SCALE_MINOR_TICK_INTERVAL) {
    if (i % PX_PER_DISTANCE_UNIT == 0) {
      p.line(i, y - h, i, y - SCALE_MAJOR_TICK_LINE_END_OFFSET);
      p.text(i / PX_PER_DISTANCE_UNIT, i, y - SCALE_LABEL_OFFSET);
    } else {
      p.line(i, y - h, i, y - SCALE_MINOR_TICK_LINE_END_OFFSET);
    }
  }
}

/**
 * グラフを描画する。
 * Chart.jsの読み込みが完了するまでは描画をスキップする。
 * @param {p5} p p5インスタンス
 */
export function graphDraw(p) {
  if (!Chart) return;
  let yellowCarData, redCarData;
  let title, verticalAxisLabel, yMax;

  const yellowInput = p.select("#yellowCarSpeedInput");
  const redInput = p.select("#redCarSpeedInput");
  if (!yellowInput || !redInput) return;

  const YELLOW_CAR_SPEED = parseFloat(yellowInput.value());
  const RED_CAR_SPEED = parseFloat(redInput.value());

  yMax = Math.max(YELLOW_CAR_SPEED, RED_CAR_SPEED);

  if (state.graphData) {
    yellowCarData = state.YELLOW_CAR.xarr;
    redCarData = state.RED_CAR.xarr;
    title = "x-tグラフ";
    verticalAxisLabel = "移動距離 x [cm]";
    yMax *= DEFAULT_SIMULATION_DURATION;
  } else {
    yellowCarData = state.YELLOW_CAR.varr;
    redCarData = state.RED_CAR.varr;
    title = "v-tグラフ";
    verticalAxisLabel = "速度 v [cm/s]";
  }

  if (state.graphChart) {
    state.graphChart.destroy();
  }

  const ctx = document.getElementById("graphCanvas").getContext("2d");
  const data = {
    datasets: [
      {
        label: "黄色い車のデータ",
        showLine: true,
        data: yellowCarData,
        pointRadius: 0,
        fill: true,
        borderColor: YELLOW_CAR_COLOR,
      },
      {
        label: "赤い車のデータ",
        data: redCarData,
        showLine: true,
        pointRadius: 0,
        fill: true,
        borderColor: RED_CAR_COLOR,
      },
    ],
  };
  const options = {
    plugins: {
      title: {
        display: true,
        text: title,
        font: { size: CHART_TITLE_FONT_SIZE },
      },
      legend: {
        labels: { font: { size: CHART_LABEL_FONT_SIZE } },
      },
    },
    scales: {
      x: {
        min: 0,
        max: DEFAULT_SIMULATION_DURATION,
        ticks: { display: true, font: { size: TICK_LABEL_FONT_SIZE } },
        title: {
          display: true,
          text: "経過時間 t [s]",
          font: { size: CHART_LABEL_FONT_SIZE },
        },
      },
      y: {
        min: 0,
        max: yMax,
        ticks: { display: true, font: { size: TICK_LABEL_FONT_SIZE } },
        title: {
          display: true,
          text: verticalAxisLabel,
          font: { size: CHART_LABEL_FONT_SIZE },
        },
      },
    },
    animation: false,
    maintainAspectRatio: false,
  };

  state.graphChart = new Chart(ctx, {
    type: "scatter",
    data: data,
    options: options,
  });
}
