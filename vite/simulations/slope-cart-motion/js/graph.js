// graph.js - v-tグラフ描画専用のファイルです。

import Chart from "chart.js/auto";
import { state } from "./state.js";
import { SLOPE_LENGTH_M } from "./function.js";

/**
 * v-tグラフを更新（Chart.jsを使用）
 */
export function updateGraph() {
  if (!state.graphVisible) return;

  const ctx = document.getElementById("graphCanvas");
  if (!ctx) return;

  // 既存グラフを破棄
  if (state.graphChart) {
    state.graphChart.destroy();
    state.graphChart = null;
  }

  // 理論直線のデータ（v = a * t）
  const maxT = Math.sqrt((2 * SLOPE_LENGTH_M) / state.cart.accel) + 0.1;
  const theoreticalData = [];
  for (let t = 0; t <= maxT; t += 0.05) {
    theoreticalData.push({
      x: parseFloat(t.toFixed(3)),
      y: parseFloat((state.cart.accel * t).toFixed(4)),
    });
  }

  const data = {
    datasets: [
      {
        label: "理論値 v = at",
        data: theoreticalData,
        showLine: true,
        pointRadius: 0,
        borderColor: "rgba(100, 160, 255, 0.6)",
        borderWidth: 2,
        borderDash: [6, 4],
        fill: false,
      },
      {
        label: "記録テープのデータ",
        data: state.vtData,
        showLine: true,
        pointRadius: 5,
        pointBackgroundColor: "rgb(220, 60, 60)",
        borderColor: "rgb(220, 60, 60)",
        borderWidth: 2,
        fill: false,
      },
    ],
  };

  const vMax = state.cart.accel * maxT * 1.1;

  const options = {
    plugins: {
      title: {
        display: true,
        text: "v-tグラフ（速度-時間グラフ）",
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
        max: parseFloat(maxT.toFixed(2)),
        title: {
          display: true,
          text: "時間 t [s]",
          font: { size: 14 },
        },
        ticks: { font: { size: 12 } },
      },
      y: {
        min: 0,
        max: parseFloat(vMax.toFixed(2)),
        title: {
          display: true,
          text: "速度 v [m/s]",
          font: { size: 14 },
        },
        ticks: { font: { size: 12 } },
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
