// graph.jsはChart.jsを使ったグラフの初期化・更新を行うファイルです。

import { state } from "./state.js";
import { createLazyImporter } from "../../../js/bicpema-lazy-import.js";

// Chart.jsの動的importをモジュール読み込み時に開始する。p5のpreload()による
// CSVの取得と並行して読み込まれるため、setup()到達時には解決済みになる想定。
const loadChart = createLazyImporter(() =>
  import("chart.js/auto").then((module) => module.default)
);

/**
 * スペクトルのグラフを初期化する。
 * Chart.jsを動的importしてから生成する。読み込みに失敗した場合は初期化を中断する。
 */
export async function initGraph() {
  let Chart;
  try {
    Chart = await loadChart();
  } catch (error) {
    console.error(
      "Chart.jsの読み込みに失敗したため、グラフを初期化できませんでした。",
      error
    );
    return;
  }
  const ctx = document.getElementById("graphChart").getContext("2d");

  state.graphChart = new Chart(ctx, {
    type: "line",
    data: {
      labels: state.waveLength,
      datasets: [
        {
          label: "入射光",
          data: state.lightSourceIntensity,
          borderColor: "rgba(0, 0, 0 ,1)",
          lineTension: 0.3,
        },
        {
          label: "出射光",
          data: state.intensity[0],
          fill: true,
          backgroundColor: "rgba(0,0,0,0.5)",
          borderColor: "rgba(0,0,0,1)",
          lineTension: 0.3,
        },
      ],
    },
    options: {
      scales: {
        x: {
          display: true,
          title: { display: true, text: "波長(nm)" },
        },
        y: {
          display: true,
          title: { display: true, text: "強度(a.u.)" },
          min: 0,
        },
      },
      plugins: {
        title: { display: true, text: "スペクトル" },
      },
      animation: false,
      maintainAspectRatio: false,
    },
  });

  // Chart.jsの動的import完了を待つ間にスライダーが操作されている可能性があるため、
  // 生成直後に現在のセロハン枚数へ同期する。
  updateGraph();
}

/**
 * セロハンの枚数に応じてスペクトルのグラフを更新する。
 */
export function updateGraph() {
  if (!state.graphChart) return;
  const index = state.cellophaneCountSlider.value() - 1;

  state.graphChart.data.datasets[1].label =
    "出射光（セロハンテープが" + (index + 1) + "枚の時）";

  state.graphChart.data.datasets[1].data = state.intensity[index];

  state.graphChart.data.datasets[1].backgroundColor = `rgba(${state.rgb[index][0]},${state.rgb[index][1]},${state.rgb[index][2]},0.5)`;

  state.graphChart.data.datasets[1].borderColor = `rgba(${state.rgb[index][0]},${state.rgb[index][1]},${state.rgb[index][2]},1)`;

  state.graphChart.update();
}

/**
 * 測色標準観測者の等色関数のグラフを初期化する。
 * Chart.jsを動的importしてから生成する。読み込みに失敗した場合は初期化を中断する。
 */
export async function initCmfGraph() {
  let Chart;
  try {
    Chart = await loadChart();
  } catch (error) {
    console.error(
      "Chart.jsの読み込みに失敗したため、グラフを初期化できませんでした。",
      error
    );
    return;
  }
  const ctx = document.getElementById("cmfGraphChart").getContext("2d");

  state.cmfGraphChart = new Chart(ctx, {
    type: "line",
    data: {
      labels: state.waveLength,
      datasets: [
        { label: "x(λ)", data: state.cmfr, borderColor: "rgba(255,0,0,1)" },
        { label: "y(λ)", data: state.cmfg, borderColor: "rgba(0,255,0,1)" },
        { label: "z(λ)", data: state.cmfb, borderColor: "rgba(0,0,255,1)" },
      ],
    },
    options: {
      scales: {
        x: {
          display: true,
          title: { display: true, text: "波長(nm)" },
        },
        y: {
          display: true,
          title: { display: true, text: "強度(a.u.)" },
          min: 0,
        },
      },
      plugins: {
        title: { display: true, text: "測色標準観測者の等色関数" },
      },
      animation: false,
      maintainAspectRatio: false,
    },
  });
}
