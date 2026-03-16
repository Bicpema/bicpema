// graph.js はグラフ描画専用のファイルです。

/** Chart.js インスタンス */
let graphChart = null;

/**
 * v-t グラフを初期化する。
 */
const initChart = () => {
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
 * x軸は末尾データのみ参照、y軸は maxObservedVelocity を使って効率的に更新する。
 */
const updateChart = () => {
  if (!graphChart) return;
  graphChart.data.datasets[0].data = vtData;

  // 末尾データのみ参照して x 上限を更新（配列全体の走査を避ける）
  const lastPoint = vtData[vtData.length - 1];
  const maxT = lastPoint ? lastPoint.x : 0;
  graphChart.options.scales.x.max = Math.max(10, Math.ceil(maxT / 10) * 10);

  // y軸上限は maxObservedVelocity を使用（減速中でも過去のピークを保持）
  graphChart.options.scales.y.max = Math.max(5, Math.ceil((maxObservedVelocity + 1) / 5) * 5);

  graphChart.update();
};
