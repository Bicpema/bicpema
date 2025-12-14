let graphChart;

function drawGraph() {
  if (typeof graphChart !== "undefined" && graphChart) {
    graphChart.destroy();
  }
  
  const ctx = document.getElementById("graphCanvas").getContext("2d");
  
  // グラフの最大時間を計算（最低10秒、データの時間+2秒のどちらか大きい方）
  const maxTime = Math.max(10, train.time + 2);
  
  // グラフの最大速度を計算（最低5、現在の速度+2のどちらか大きい方）
  let maxVelocity = Math.max(5, train.velocity + 2);
  
  // 加速度が負の場合、過去の最大速度も考慮
  if (train.velocityData.length > 0) {
    const maxDataVelocity = Math.max(...train.velocityData.map(d => d.y));
    maxVelocity = Math.max(maxVelocity, maxDataVelocity + 2);
  }
  
  const data = {
    datasets: [
      {
        label: "速度 (m/s)",
        showLine: true,
        data: train.velocityData,
        pointRadius: 0,
        borderColor: "rgb(100, 150, 255)",
        backgroundColor: "rgba(100, 150, 255, 0.1)",
        borderWidth: 2,
        fill: true,
      },
    ],
  };
  
  const options = {
    plugins: {
      title: {
        display: true,
        text: "v-t グラフ（速度-時間グラフ）",
        font: {
          size: 18,
          weight: "bold",
        },
        color: "#333",
      },
      legend: {
        labels: {
          font: {
            size: 14,
          },
          color: "#333",
        },
      },
    },
    scales: {
      x: {
        type: "linear",
        min: 0,
        max: maxTime,
        ticks: {
          display: true,
          font: {
            size: 12,
          },
          color: "#333",
        },
        title: {
          display: true,
          text: "時間 t (s)",
          font: {
            size: 14,
            weight: "bold",
          },
          color: "#333",
        },
        grid: {
          color: "rgba(0, 0, 0, 0.1)",
        },
      },
      y: {
        min: 0,
        max: maxVelocity,
        ticks: {
          display: true,
          font: {
            size: 12,
          },
          color: "#333",
        },
        title: {
          display: true,
          text: "速さ v (m/s)",
          font: {
            size: 14,
            weight: "bold",
          },
          color: "#333",
        },
        grid: {
          color: "rgba(0, 0, 0, 0.1)",
        },
      },
    },
    animation: false,
    maintainAspectRatio: false,
  };
  
  graphChart = new Chart(ctx, {
    type: "scatter",
    data: data,
    options: options,
  });
}
