import Chart from "chart.js/auto";
import { state } from "./state.js";

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
   */
  updateGraph() {
    if (!state.graphVisible) return;

    const ctx = document.getElementById("graphCanvas");
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
          pointBackgroundColor: "rgb(220, 60, 60)",
          borderColor: "rgb(220, 60, 60)",
          borderWidth: 2,
          yAxisID: "y",
          fill: false,
        },
        {
          label: "高さ y (m)",
          data: state.ytData,
          showLine: true,
          pointRadius: 3,
          pointBackgroundColor: "rgb(60, 150, 255)",
          borderColor: "rgb(60, 150, 255)",
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
          max: parseFloat((maxTime * 1.1).toFixed(2)),
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
          max: parseFloat((maxVelocity * 1.1).toFixed(2)),
          title: {
            display: true,
            text: "速度 v [m/s]",
            font: { size: 14 },
            color: "rgb(220, 60, 60)",
          },
          ticks: { font: { size: 12 } },
        },
        y1: {
          type: "linear",
          position: "right",
          min: 0,
          max: parseFloat((maxHeight * 1.1).toFixed(2)),
          title: {
            display: true,
            text: "高さ y [m]",
            font: { size: 14 },
            color: "rgb(60, 150, 255)",
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
