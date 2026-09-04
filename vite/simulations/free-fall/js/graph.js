import { state } from "./state.js";
import { createLazyImporter } from "../../../js/bicpema-lazy-import.js";

const loadChart = createLazyImporter(() =>
  import("chart.js/auto").then((module) => module.default)
);
/** @type {typeof import("chart.js").Chart | null} */
let Chart = null;

/** 速度データの表示色 */
const VELOCITY_COLOR = "rgb(220, 60, 60)";
/** 高さデータの表示色 */
const HEIGHT_COLOR = "rgb(60, 150, 255)";
/** グラフ軸の最大値を実データの最大値からどれだけ余裕を持たせるかの倍率 */
const AXIS_MAX_MARGIN_RATIO = 1.1;

/**
 * ボール運動のグラフ描画クラス
 * v-tグラフとy-tグラフを同時に表示
 */
export class BallGraph {
  constructor() {
    this.chart = null;
  }

  /**
   * グラフを更新
   * Chart.jsが未読み込みの場合は動的importを行い、完了後に再度呼び出す。
   */
  updateGraph() {
    if (!state.graphVisible) return;

    if (!Chart) {
      loadChart().then((ChartCtor) => {
        Chart = ChartCtor;
        this.updateGraph();
      });
      return;
    }

    const ctx = /** @type {HTMLCanvasElement | null} */ (
      document.getElementById("graphCanvas")
    );
    if (!ctx) return;

    // 既存グラフを破棄
    if (this.chart) {
      this.chart.destroy();
      this.chart = null;
    }

    const maxTime = state.ball.time > 0 ? state.ball.time : 1;
    const maxVelocity = Math.max(...state.vtData.map((d) => d.y), 1);
    const maxHeight = state.ball.initialHeight;

    const data = {
      datasets: [
        {
          label: "速度 v (m/s)",
          data: state.vtData,
          showLine: true,
          pointRadius: 3,
          pointBackgroundColor: VELOCITY_COLOR,
          borderColor: VELOCITY_COLOR,
          borderWidth: 2,
          yAxisID: "y",
          fill: false,
        },
        {
          label: "高さ y (m)",
          data: state.ytData,
          showLine: true,
          pointRadius: 3,
          pointBackgroundColor: HEIGHT_COLOR,
          borderColor: HEIGHT_COLOR,
          borderWidth: 2,
          yAxisID: "y1",
          fill: false,
        },
      ],
    };

    /** @type {import("chart.js").ChartOptions<"scatter">} */
    const options = {
      plugins: {
        title: {
          display: true,
          text: "v-tグラフとy-tグラフ",
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
          max: parseFloat((maxTime * AXIS_MAX_MARGIN_RATIO).toFixed(2)),
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
          max: parseFloat((maxVelocity * AXIS_MAX_MARGIN_RATIO).toFixed(2)),
          title: {
            display: true,
            text: "速度 v [m/s]",
            font: { size: 14 },
            color: VELOCITY_COLOR,
          },
          ticks: { font: { size: 12 } },
        },
        y1: {
          type: "linear",
          position: "right",
          min: 0,
          max: parseFloat((maxHeight * AXIS_MAX_MARGIN_RATIO).toFixed(2)),
          title: {
            display: true,
            text: "高さ y [m]",
            font: { size: 14 },
            color: HEIGHT_COLOR,
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
   * グラフをリセット
   */
  reset() {
    if (this.chart) {
      this.chart.destroy();
      this.chart = null;
    }
  }
}
