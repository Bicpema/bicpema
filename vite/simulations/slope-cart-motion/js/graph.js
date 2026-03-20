// graph.js - v-tグラフ描画専用のファイルです。

/** Chart.js インスタンス */
export let graphChart = null;

/**
 * v-tグラフを更新（Chart.jsを使用）
 * @param {object} cart 台車オブジェクト
 * @param {Array} vtData v-tグラフデータ
 * @param {boolean} graphVisible グラフ表示フラグ
 * @param {number} slopeLengthM 斜面の長さ (m)
 */
export function updateGraph(cart, vtData, graphVisible, slopeLengthM) {
  if (!graphVisible) return;

  const ctx = document.getElementById("graphCanvas");
  if (!ctx) return;

  if (graphChart) {
    graphChart.destroy();
    graphChart = null;
  }

  const maxT = Math.sqrt(2 * slopeLengthM / cart.accel) + 0.1;
  const theoreticalData = [];
  for (let t = 0; t <= maxT; t += 0.05) {
    theoreticalData.push({ x: parseFloat(t.toFixed(3)), y: parseFloat((cart.accel * t).toFixed(4)) });
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
        data: vtData,
        showLine: true,
        pointRadius: 5,
        pointBackgroundColor: "rgb(220, 60, 60)",
        borderColor: "rgb(220, 60, 60)",
        borderWidth: 2,
        fill: false,
      },
    ],
  };

  const vMax = cart.accel * maxT * 1.1;

  graphChart = new Chart(ctx, {
    type: "scatter",
    data: data,
    options: {
      plugins: {
        title: { display: true, text: "v-tグラフ（速度-時間グラフ）", font: { size: 16 } },
        legend: { labels: { font: { size: 13 } } },
      },
      scales: {
        x: {
          type: "linear", min: 0, max: parseFloat(maxT.toFixed(2)),
          title: { display: true, text: "時間 t [s]", font: { size: 14 } },
          ticks: { font: { size: 12 } },
        },
        y: {
          min: 0, max: parseFloat(vMax.toFixed(2)),
          title: { display: true, text: "速度 v [m/s]", font: { size: 14 } },
          ticks: { font: { size: 12 } },
        },
      },
      animation: false,
      maintainAspectRatio: false,
    },
  });
}
