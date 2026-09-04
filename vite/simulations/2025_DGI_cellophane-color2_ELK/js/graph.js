// graph.jsはグラフ描画専用のファイルです。

import Chart from "chart.js/auto";
import { state } from "./state.js";

/**
 * １枚目の偏光板を透過した後とシミュレーションのスペクトルの比較グラフを描画する。
 */
export function drawGraph() {
  if (state.mainChartObj) {
    state.mainChartObj.destroy();
  }

  // データ
  const mainData = {
    labels: state.waveLengthArr,
    datasets: [
      {
        label: "シミュレーションのスペクトル", //options.legend で凡例の表示・非表示を設定できる
        data: state.osArr,
        backgroundColor:
          "rgba(" +
          state.rAfter +
          "," +
          state.gAfter +
          "," +
          state.bAfter +
          ",0.5)", //点の色
        borderColor:
          "rgba(" +
          state.rAfter +
          "," +
          state.gAfter +
          "," +
          state.bAfter +
          ",1)",
        pointRadius: 0,
        fill: "start",
        showLine: true,
      },
      {
        label: "１枚目の偏光板を透過した時のスペクトル", //options.legend で凡例の表示・非表示を設定できる
        data: state.osArrOrigin,
        backgroundColor:
          "rgba(" +
          state.rBefore +
          "," +
          state.gBefore +
          "," +
          state.bBefore +
          ",0.5)", //点の色
        borderColor:
          "rgba(" +
          state.rBefore +
          "," +
          state.gBefore +
          "," +
          state.bBefore +
          ",1)",
        pointRadius: 0,
        fill: "start",
        showLine: true,
      },
    ],
  };

  // グラフの表示設定
  const mainOptions = {
    plugins: {
      legend: {
        labels: {
          font: {
            size: 16,
          },
        },
      },
      title: {
        display: true,
        text: "１枚目の偏光板を透過した後とシミュレーションのスペクトルの比較",
        font: {
          size: 20,
        },
      },
    },
    responsive: true,
    maintainAspectRatio: false,
    animation: false,
    scales: {
      x: {
        display: true,
        title: {
          display: true,
          text: "波長(nm)",
          font: {
            size: 16,
          },
        },
        max: 750,
        min: 380,
        ticks: {
          font: {
            size: 14,
          },
        },
      },
      y: {
        display: true,
        title: {
          display: true,
          text: "強度(a.u.)",
          font: {
            size: 16,
          },
        },
        max: 1,
        min: 0,
        ticks: {
          font: {
            size: 14,
          },
        },
      },
    },
  };

  const mainChartsetup = {
    type: "scatter",
    data: mainData,
    options: mainOptions,
  };

  // canvasにグラフを描画
  // Chart.Scatter() で散布図になる
  const mainCtx = document.getElementById("mainSpectrumGraph");
  state.mainChartObj = new Chart(mainCtx, mainChartsetup);
}
