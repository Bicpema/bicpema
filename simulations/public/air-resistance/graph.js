//グラフを描画する手続き
function graphDraw() {
  if (typeof graphChart !== "undefined" && graphChart) {
    graphChart.destroy();
  }
  let ctx = document.getElementById("graphCanvas").getContext("2d");
  let data = {
    labels: countArray,
    datasets: [
      {
        label: "抵抗なし",
        data: fbtrajectry,
        borderColor: "rgba(255, 0, 0)",
        lineTension: 0.3,
      },
      {
        label: "粘性抵抗あり",
        data: vbtrajectory,
        borderColor: "rgba(0, 255, 0)",
        lineTension: 0.3,
      },
      {
        label: "慣性抵抗あり",
        data: ibtrajectory,
        borderColor: "rgba(0, 0, 255)",
        lineTension: 0.3,
      },
    ],
  };
  let options = {
    scales: {
      x: {
        display: true,
        title: {
          display: true,
          text: "経過時間[s]",
          font: {
            size: 14,
          },
        },
      },
      y: {
        display: true,
        title: {
          display: true,
          text: "位置[px]",
          font: {
            size: 14,
          },
        },

        min: 0,
      },
    },
    plugins: {
      legend: {
        labels: {
          font: {
            size: 12,
          },
        },
      },
      title: {
        display: true,
        text: "x-tグラフ",
        font: {
          size: 16,
        },
      },
    },
    animation: false,
    maintainAspectRatio: false,
  };
  graphChart = new Chart(ctx, {
    type: "line",
    data: data,
    options: options,
  });
}
