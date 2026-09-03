// logic.jsはシミュレーションの描画処理と物理更新専用のファイルです。

import Chart from "chart.js/auto";
import { state, FPS } from "./state.js";

/**
 * シミュレーションの描画と物理更新を行う。
 * @param {*} p p5インスタンス
 */
export function drawSimulation(p) {
  p.background(255);
  state.spring1.draw(p);
  state.spring2.draw(p);
  if (state.clickedCount === true) {
    state.count++;
    if (state.count % 6 === 0) {
      state.countData.push(state.count / FPS);
      state.data1.push(p.height / 4 - state.spring1.posy);
      state.data2.push(p.height / 4 - state.spring2.posy);
      updateCharts();
    }
  }
  p.line(0, p.height / 2, p.width, p.height / 2);
}

/**
 * 上下2つのばねの変位グラフをChart.jsで初期化する（初回セットアップ・リセット時に呼び出す）。
 */
export function initCharts() {
  if (state.chart1) {
    state.chart1.destroy();
  }
  if (state.chart2) {
    state.chart2.destroy();
  }
  const ctx1 = document.getElementById("chart1").getContext("2d");
  state.chart1 = new Chart(ctx1, {
    type: "line",
    data: {
      labels: state.countData,
      datasets: [
        {
          label: "ばね１の位置の時間変化",
          data: state.data1,
          backgroundColor: "rgb(255,0,0)",
          borderColor: "rgb(255,0,0)",
        },
      ],
    },
    options: {
      animation: false,
    },
  });
  const ctx2 = document.getElementById("chart2").getContext("2d");
  state.chart2 = new Chart(ctx2, {
    type: "line",
    data: {
      labels: state.countData,
      datasets: [
        {
          label: "ばね２の位置の時間変化",
          data: state.data2,
          backgroundColor: "rgb(0,0,255)",
          borderColor: "rgb(0,0,255)",
        },
      ],
    },
    options: {
      animation: false,
    },
  });
}

/**
 * グラフの描画内容を最新のデータに更新する（destroy/再生成せずChart.jsのupdate()で反映する）。
 */
function updateCharts() {
  if (state.chart1) {
    state.chart1.update();
  }
  if (state.chart2) {
    state.chart2.update();
  }
}
