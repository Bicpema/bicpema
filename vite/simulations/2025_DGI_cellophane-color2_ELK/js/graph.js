// graph.jsはグラフ描画専用のファイルです。

import { state } from "./state.js";
import { createLazyImporter } from "../../../js/bicpema-lazy-import.js";

// Chart.jsの動的importをモジュール読み込み時に開始する。p5のpreload()による
// CSV/画像の取得と並行して読み込まれるため、setup()到達時には解決済みになる想定。
const loadChart = createLazyImporter(() =>
  import("chart.js/auto").then((module) => {
    const ChartCtor = module.default;
    // グラフの背景が暗い配色(body: bg-neutral-900)の上に透明で表示されるため、
    // Chart.jsの既定の文字色(#666、白背景向け)のままだとコントラスト不足で見えづらい。
    // 暗い背景でも視認できる明るい色に変更する。
    ChartCtor.defaults.color = "#e5e5e5";
    return ChartCtor;
  })
);
/** @type {typeof import("chart.js").Chart | null} */
let Chart = null;
loadChart()
  .then((ChartCtor) => {
    Chart = ChartCtor;
  })
  .catch((error) => {
    // 失敗時はdrawGraphの`if (!Chart) return;`ガードによりグラフ描画のみが
    // スキップされ続けるため、ここではログ出力のみ行いunhandled rejectionを防ぐ。
    console.error("Chart.jsの読み込みに失敗しました。", error);
  });

/**
 * １枚目の偏光板を透過した後とシミュレーションのスペクトルの比較グラフを描画する。
 * Chart.jsの読み込みが完了するまでは描画をスキップする。
 */
export function drawGraph() {
  if (!Chart) return;
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
