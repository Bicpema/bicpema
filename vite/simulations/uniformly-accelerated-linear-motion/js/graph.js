import Chart from "chart.js/auto";
import { state } from "./state.js";
import { MAX_TIME } from "./constants.js";

/**
 * x-tグラフとv-tグラフを描画するクラス
 */
export class MotionGraph {
  constructor() {
    this.chart = null;
  }

  /**
   * グラフを更新する
   */
  updateGraph() {
    if (!state.graphVisible) return;

    const ctx = document.getElementById("graphCanvas");
    if (!ctx) return;

    if (this.chart) {
      this.chart.destroy();
      this.chart = null;
    }

    const maxTime = state.car.time > 0 ? state.car.time : 1;
    const maxX = state.xtData.length > 0
      ? Math.max(...state.xtData.map((d) => d.y), 1)
      : 1;
    const maxV = state.vtData.length > 0
      ? Math.max(...state.vtData.map((d) => d.y), state.car.initialVelocity, 1)
      : Math.max(state.car.initialVelocity, 1);

    const data = {
      datasets: [
        {
          label: "位置 x (m)",
          data: state.xtData,
          showLine: true,
          pointRadius: 2,
          pointBackgroundColor: "rgb(60, 150, 255)",
          borderColor: "rgb(60, 150, 255)",
          borderWidth: 2,
          yAxisID: "y",
          fill: false,
        },
        {
          label: "速度 v (m/s)",
          data: state.vtData,
          showLine: true,
          pointRadius: 2,
          pointBackgroundColor: "rgb(220, 60, 60)",
          borderColor: "rgb(220, 60, 60)",
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
          max: parseFloat((Math.min(maxTime * 1.1, MAX_TIME)).toFixed(2)),
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
          max: parseFloat((maxX * 1.1).toFixed(2)),
          title: {
            display: true,
            text: "位置 x [m]",
            font: { size: 14 },
            color: "rgb(60, 150, 255)",
          },
          ticks: { font: { size: 12 } },
        },
        y1: {
          type: "linear",
          position: "right",
          min: 0,
          max: parseFloat((maxV * 1.1).toFixed(2)),
          title: {
            display: true,
            text: "速度 v [m/s]",
            font: { size: 14 },
            color: "rgb(220, 60, 60)",
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
