// graph.js はグラフ描画専用のファイルです。

/** Chart.js インスタンス */
export let graphChart = null;

/**
 * v-t グラフを初期化する。
 * @param {Array} vtData 初期データ配列
 */
export const initChart = (vtData) => {
  if (graphChart) {
    graphChart.destroy();
  }
  const ctx = document.getElementById("graphCanvas").getContext("2d");
  graphChart = new Chart(ctx, {
    type: "scatter",
    data: {
      datasets: [
        {
          label: "速さ v",
          showLine: true,
          data: vtData,
          pointRadius: 0,
          borderColor: "rgb(30, 100, 200)",
          borderWidth: 2,
          fill: true,
          backgroundColor: "rgba(30, 100, 200, 0.15)",
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
          font: { size: 18 },
        },
        legend: {
          labels: { font: { size: 14 } },
        },
      },
      scales: {
        x: {
          type: "linear",
          min: 0,
          title: {
            display: true,
            text: "経過時間 t [s]",
            font: { size: 14 },
          },
          ticks: { font: { size: 12 } },
        },
        y: {
          min: 0,
          title: {
            display: true,
            text: "速さ v [m/s]",
            font: { size: 14 },
          },
          ticks: { font: { size: 12 } },
        },
      },
    },
  });
};

/**
 * v-t グラフのデータと軸範囲を更新する。
 * @param {Array} vtData データ配列
 * @param {number} maxObservedVelocity 観測した最大速度
 */
export const updateChart = (vtData, maxObservedVelocity) => {
  if (!graphChart) return;
  graphChart.data.datasets[0].data = vtData;

  const lastPoint = vtData[vtData.length - 1];
  const maxT = lastPoint ? lastPoint.x : 0;
  graphChart.options.scales.x.max = Math.max(10, Math.ceil(maxT / 10) * 10);
  graphChart.options.scales.y.max = Math.max(5, Math.ceil((maxObservedVelocity + 1) / 5) * 5);

  graphChart.update();
};
