let graphChart = null;

/**
 * グラフを更新する
 */
function updateGraph() {
  if (!graphVisible) return;
  
  // 各バネのデータを収集
  const datasets = [];
  const colors = [
    { border: "rgb(255, 99, 132)", bg: "rgba(255, 99, 132, 0.2)" },
    { border: "rgb(54, 162, 235)", bg: "rgba(54, 162, 235, 0.2)" },
    { border: "rgb(75, 192, 192)", bg: "rgba(75, 192, 192, 0.2)" }
  ];
  
  springs.forEach((spring, index) => {
    const extension = spring.getExtension();
    const force = spring.getElasticForce();
    
    // フックの法則に基づく理論曲線を生成
    const theoreticalData = [];
    for (let x = 0; x <= 300; x += 10) {
      theoreticalData.push({
        x: x,
        y: spring.springConstant * x
      });
    }
    
    datasets.push({
      label: `バネ${index + 1} (k=${spring.springConstant} N/m)`,
      data: theoreticalData,
      borderColor: colors[index].border,
      backgroundColor: colors[index].bg,
      borderWidth: 2,
      pointRadius: 0,
      fill: false,
      showLine: true
    });
    
    // 現在の値をプロット
    if (extension > 0) {
      datasets.push({
        label: `バネ${index + 1} 現在値`,
        data: [{ x: extension, y: force }],
        borderColor: colors[index].border,
        backgroundColor: colors[index].border,
        pointRadius: 8,
        pointStyle: 'circle',
        showLine: false
      });
    }
  });
  
  if (graphChart) {
    graphChart.destroy();
  }
  
  const ctx = document.getElementById("graphCanvas").getContext("2d");
  
  graphChart = new Chart(ctx, {
    type: "scatter",
    data: {
      datasets: datasets
    },
    options: {
      animation: false,
      maintainAspectRatio: false,
      responsive: true,
      plugins: {
        title: {
          display: true,
          text: "弾性力とバネの伸びの関係（フックの法則）",
          font: {
            size: 14
          }
        },
        legend: {
          display: true,
          position: 'bottom',
          labels: {
            font: {
              size: 10
            },
            filter: function(item) {
              // "現在値"を含まないラベルのみ表示
              return !item.text.includes('現在値');
            }
          }
        }
      },
      scales: {
        x: {
          type: 'linear',
          position: 'bottom',
          min: 0,
          max: 300,
          title: {
            display: true,
            text: 'バネの伸び (x) [cm]',
            font: {
              size: 12
            }
          },
          ticks: {
            font: {
              size: 10
            }
          }
        },
        y: {
          min: 0,
          max: 150,
          title: {
            display: true,
            text: '弾性力 (F) [N]',
            font: {
              size: 12
            }
          },
          ticks: {
            font: {
              size: 10
            }
          }
        }
      }
    }
  });
}
