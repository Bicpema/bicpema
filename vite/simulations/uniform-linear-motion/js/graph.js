/**
 * グラフを描画する。
 */
const graphDraw = () => {
  let yellowCarData, redCarData;
  let title, verticalAxisLabel, yMax;

  const YELLOW_CAR_SPEED = select('#yellowCarSpeedInput').value();
  const RED_CAR_SPEED = select('#redCarSpeedInput').value();

  yMax = max([YELLOW_CAR_SPEED, RED_CAR_SPEED]);

  if (graphData) {
    yellowCarData = YELLOW_CAR.xarr;
    redCarData = RED_CAR.xarr;
    title = 'x-tグラフ';
    verticalAxisLabel = '移動距離 x [cm]';
    yMax *= 10;
  } else {
    yellowCarData = YELLOW_CAR.varr;
    redCarData = RED_CAR.varr;
    title = 'v-tグラフ';
    verticalAxisLabel = '速度 v [cm/s]';
  }

  if (typeof graphChart !== 'undefined' && graphChart) {
    graphChart.destroy();
  }
  let ctx = document.getElementById('graphCanvas').getContext('2d');
  let data = {
    datasets: [
      {
        label: '黄色い車のデータ',
        showLine: true,
        data: yellowCarData,
        pointRadius: 0,
        fill: true,
        borderColor: 'rgb(200, 200, 50)',
      },
      {
        label: '赤い車のデータ',
        data: redCarData,
        showLine: true,
        pointRadius: 0,
        fill: true,
        borderColor: 'rgb(255, 0, 0)',
      },
    ],
  };
  let options = {
    plugins: {
      title: {
        display: true,
        text: title,
        font: {
          size: 20,
        },
      },
      legend: {
        labels: {
          font: {
            size: 16,
          },
        },
      },
    },
    scales: {
      x: {
        min: 0,
        max: 10,
        ticks: {
          display: true,
          font: {
            size: 14,
          },
        },
        title: {
          display: true,
          text: '経過時間 t [s]',
          font: {
            size: 16,
          },
        },
      },
      y: {
        min: 0,
        max: yMax,
        ticks: {
          display: true,
          font: {
            size: 14,
          },
        },
        title: {
          display: true,
          text: verticalAxisLabel,
          font: {
            size: 16,
          },
        },
      },
    },
    animation: false,
    maintainAspectRatio: false,
  };
  graphChart = new Chart(ctx, {
    type: 'scatter',
    data: data,
    options: options,
  });
};
