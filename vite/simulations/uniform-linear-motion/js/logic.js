import Chart from "chart.js/auto";
import { state } from "./state.js";

/**
 * スケールの表示をする。
 *
 * @param {p5} p p5インスタンス
 * @param {number} x スケールのx座標
 * @param {number} y スケールのy座標
 * @param {number} w スケールの幅
 * @param {number} h スケールの高さ
 */
export function drawScale(p, x, y, w, h) {
  p.fill(255);
  p.rect(x, y - h, w, h);
  p.fill(0);
  p.stroke(0);
  p.strokeWeight(1);
  for (let i = 0; i <= w; i += 5) {
    if (i % 50 == 0) {
      p.line(i, y - h, i, y - 30);
      p.text(i / 50, i, y - 10);
    } else {
      p.line(i, y - h, i, y - 40);
    }
  }
}

/**
 * グラフを描画する。
 * @param {p5} p p5インスタンス
 */
export function graphDraw(p) {
  let yellowCarData, redCarData;
  let title, verticalAxisLabel, yMax;

  const yellowInput = p.select("#yellowCarSpeedInput");
  const redInput = p.select("#redCarSpeedInput");
  if (!yellowInput || !redInput) return;

  const YELLOW_CAR_SPEED = parseFloat(yellowInput.value());
  const RED_CAR_SPEED = parseFloat(redInput.value());

  yMax = Math.max(YELLOW_CAR_SPEED, RED_CAR_SPEED);

  if (state.graphData) {
    yellowCarData = state.YELLOW_CAR.xarr;
    redCarData = state.RED_CAR.xarr;
    title = "x-tグラフ";
    verticalAxisLabel = "移動距離 x [cm]";
    yMax *= 10;
  } else {
    yellowCarData = state.YELLOW_CAR.varr;
    redCarData = state.RED_CAR.varr;
    title = "v-tグラフ";
    verticalAxisLabel = "速度 v [cm/s]";
  }

  if (state.graphChart) {
    state.graphChart.destroy();
  }

  const ctx = document.getElementById("graphCanvas").getContext("2d");
  const data = {
    datasets: [
      {
        label: "黄色い車のデータ",
        showLine: true,
        data: yellowCarData,
        pointRadius: 0,
        fill: true,
        borderColor: "rgb(200, 200, 50)",
      },
      {
        label: "赤い車のデータ",
        data: redCarData,
        showLine: true,
        pointRadius: 0,
        fill: true,
        borderColor: "rgb(255, 0, 0)",
      },
    ],
  };
  const options = {
    plugins: {
      title: {
        display: true,
        text: title,
        font: { size: 20 },
      },
      legend: {
        labels: { font: { size: 16 } },
      },
    },
    scales: {
      x: {
        min: 0,
        max: 10,
        ticks: { display: true, font: { size: 14 } },
        title: {
          display: true,
          text: "経過時間 t [s]",
          font: { size: 16 },
        },
      },
      y: {
        min: 0,
        max: yMax,
        ticks: { display: true, font: { size: 14 } },
        title: {
          display: true,
          text: verticalAxisLabel,
          font: { size: 16 },
        },
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
