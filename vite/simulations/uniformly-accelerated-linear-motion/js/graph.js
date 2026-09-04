import { state } from "./state.js";
import { MAX_TIME } from "./constants.js";
import { createLazyImporter } from "../../../js/bicpema-lazy-import.js";

const loadChart = createLazyImporter(() =>
  import("chart.js/auto").then((module) => module.default)
);
/** @type {typeof import("chart.js").Chart | null} */
let Chart = null;
// 読み込み失敗後に毎フレーム再試行しないためのフラグ。
let chartLoadFailed = false;

/** 位置データの表示色 */
const POSITION_COLOR = "rgb(60, 150, 255)";
/** 速度データの表示色 */
const VELOCITY_COLOR = "rgb(220, 60, 60)";
/** グラフ軸の最大値を実データの最大値からどれだけ余裕を持たせるかの倍率 */
const AXIS_MAX_MARGIN_RATIO = 1.1;

/**
 * x-tグラフとv-tグラフを描画するクラス
 */
export class MotionGraph {
  constructor() {
    this.chart = null;
  }

  /**
   * グラフを更新する
   * Chart.jsが未読み込みの場合は動的importを行い、完了後に再度呼び出す。
   */
  updateGraph() {
    if (!state.graphVisible) return;

    if (!Chart) {
      if (chartLoadFailed) return;
      loadChart()
        .then((ChartCtor) => {
          Chart = ChartCtor;
          this.updateGraph();
        })
        .catch((error) => {
          chartLoadFailed = true;
          console.error("Chart.jsの読み込みに失敗しました。", error);
        });
      return;
    }

    const ctx = document.getElementById("graphCanvas");
    if (!ctx) return;

    if (this.chart) {
      this.chart.destroy();
      this.chart = null;
    }

    const maxTime = state.car.time > 0 ? state.car.time : 1;
    const maxX =
      state.xtData.length > 0
        ? Math.max(...state.xtData.map((d) => d.y), 1)
        : 1;
    const maxV =
      state.vtData.length > 0
        ? Math.max(
            ...state.vtData.map((d) => d.y),
            state.car.initialVelocity,
            1
          )
        : Math.max(state.car.initialVelocity, 1);

    const data = {
      datasets: [
        {
          label: "位置 x (m)",
          data: state.xtData,
          showLine: true,
          pointRadius: 2,
          pointBackgroundColor: POSITION_COLOR,
          borderColor: POSITION_COLOR,
          borderWidth: 2,
          yAxisID: "y",
          fill: false,
        },
        {
          label: "速度 v (m/s)",
          data: state.vtData,
          showLine: true,
          pointRadius: 2,
          pointBackgroundColor: VELOCITY_COLOR,
          borderColor: VELOCITY_COLOR,
          borderWidth: 2,
          yAxisID: "y1",
          fill: false,
        },
      ],
    };

    const options = {
      plugins: {
        title: {
          display: true,
          text: "x-tグラフ・v-tグラフ",
          font: { size: 16 },
        },
        legend: {
          labels: { font: { size: 13 } },
        },
      },
      scales: {
        x: {
          type: "linear",
          min: 0,
          max: parseFloat(
            Math.min(maxTime * AXIS_MAX_MARGIN_RATIO, MAX_TIME).toFixed(2)
          ),
          title: {
            display: true,
            text: "時間 t [s]",
            font: { size: 14 },
          },
          ticks: { font: { size: 12 } },
        },
        y: {
          type: "linear",
          position: "left",
          min: 0,
          max: parseFloat((maxX * AXIS_MAX_MARGIN_RATIO).toFixed(2)),
          title: {
            display: true,
            text: "位置 x [m]",
            font: { size: 14 },
            color: POSITION_COLOR,
          },
          ticks: { font: { size: 12 } },
        },
        y1: {
          type: "linear",
          position: "right",
          min: 0,
          max: parseFloat((maxV * AXIS_MAX_MARGIN_RATIO).toFixed(2)),
          title: {
            display: true,
            text: "速度 v [m/s]",
            font: { size: 14 },
            color: VELOCITY_COLOR,
          },
          ticks: { font: { size: 12 } },
          grid: {
            drawOnChartArea: false,
          },
        },
      },
      animation: false,
      maintainAspectRatio: false,
    };

    this.chart = new Chart(ctx, {
      type: "scatter",
      data: data,
      options: options,
    });
  }

  /**
   * グラフをリセットする
   */
  reset() {
    if (this.chart) {
      this.chart.destroy();
      this.chart = null;
    }
  }
}
