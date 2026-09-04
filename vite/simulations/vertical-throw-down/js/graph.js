import Chart from "chart.js/auto";
import { state } from "./state.js";

/** 速度データの表示色 */
const VELOCITY_COLOR = "rgb(220, 60, 60)";
/** 変位データの表示色 */
const HEIGHT_COLOR = "rgb(60, 150, 255)";
/** グラフの初期表示時における時間軸の最大値 (秒) */
const INITIAL_MAX_TIME = 5;
/** 運動中における時間軸最大値の余白 (秒) */
const TIME_AXIS_MOVING_MARGIN = 0.5;
/** 停止後における時間軸最大値の余白倍率 */
const TIME_AXIS_STOPPED_MARGIN_RATIO = 1.05;
/** 縦軸最大値の余白倍率 */
const Y_AXIS_MAX_MARGIN_RATIO = 1.2;

/**
 * ボール運動のグラフ描画クラス
 * v-tグラフとy-tグラフをそれぞれ独立したcanvasに表示
 * チャートインスタンスを使い回してデータのみ更新する
 */
export class BallGraph {
  constructor() {
    this.vtChart = null;
    this.ytChart = null;
  }

  /**
   * チャートを初期化（まだ存在しない場合のみ生成）
   */
  _initVtChart() {
    const ctx = document.getElementById("vtCanvas");
    if (!ctx || this.vtChart) return;

    const maxVelocity = state.ball.initialVelocity + 10;
    const maxTime = INITIAL_MAX_TIME;

    this.vtChart = new Chart(ctx, {
      type: "scatter",
      data: {
        datasets: [
          {
            label: "速度 v (m/s)",
            data: [],
            showLine: true,
            pointRadius: 2,
            pointBackgroundColor: VELOCITY_COLOR,
            borderColor: VELOCITY_COLOR,
            borderWidth: 2,
            fill: false,
          },
        ],
      },
      options: {
        plugins: {
          title: {
            display: true,
            text: "v-t グラフ",
            font: { size: 14 },
          },
          legend: { display: false },
        },
        scales: {
          x: {
            type: "linear",
            min: 0,
            max: maxTime,
            title: {
              display: true,
              text: "時間 t [s]",
              font: { size: 12 },
            },
            ticks: { font: { size: 11 } },
          },
          y: {
            type: "linear",
            min: 0,
            max: maxVelocity,
            title: {
              display: true,
              text: "速度 v [m/s]",
              font: { size: 12 },
              color: VELOCITY_COLOR,
            },
            ticks: { font: { size: 11 } },
          },
        },
        animation: false,
        maintainAspectRatio: false,
      },
    });
  }

  _initYtChart() {
    const ctx = document.getElementById("ytCanvas");
    if (!ctx || this.ytChart) return;

    const maxHeight = state.ball.initialHeight;
    const maxTime = INITIAL_MAX_TIME;

    this.ytChart = new Chart(ctx, {
      type: "scatter",
      data: {
        datasets: [
          {
            label: "変位 y (m)",
            data: [],
            showLine: true,
            pointRadius: 2,
            pointBackgroundColor: HEIGHT_COLOR,
            borderColor: HEIGHT_COLOR,
            borderWidth: 2,
            fill: false,
          },
        ],
      },
      options: {
        plugins: {
          title: {
            display: true,
            text: "y-t グラフ（変位）",
            font: { size: 14 },
          },
          legend: { display: false },
        },
        scales: {
          x: {
            type: "linear",
            min: 0,
            max: maxTime,
            title: {
              display: true,
              text: "時間 t [s]",
              font: { size: 12 },
            },
            ticks: { font: { size: 11 } },
          },
          y: {
            type: "linear",
            min: 0,
            max: maxHeight,
            title: {
              display: true,
              text: "変位 y [m]",
              font: { size: 12 },
              color: HEIGHT_COLOR,
            },
            ticks: { font: { size: 11 } },
          },
        },
        animation: false,
        maintainAspectRatio: false,
      },
    });
  }

  /**
   * データを更新してグラフを再描画
   */
  updateGraph() {
    this._initVtChart();
    this._initYtChart();

    if (this.vtChart) {
      this.vtChart.data.datasets[0].data = state.vtData;
      if (state.ball.time > 0) {
        const tMax = state.ball.isMoving
          ? parseFloat((state.ball.time + TIME_AXIS_MOVING_MARGIN).toFixed(1))
          : parseFloat(
              (state.ball.time * TIME_AXIS_STOPPED_MARGIN_RATIO).toFixed(2)
            );
        this.vtChart.options.scales.x.max = tMax;
      }
      if (state.vtData.length > 0) {
        const maxV = Math.max(
          ...state.vtData.map((d) => d.y),
          state.ball.initialVelocity + 1
        );
        this.vtChart.options.scales.y.max = parseFloat(
          (maxV * Y_AXIS_MAX_MARGIN_RATIO).toFixed(1)
        );
      }
      this.vtChart.update("none");
    }

    if (this.ytChart) {
      this.ytChart.data.datasets[0].data = state.ytData;
      if (state.ball.time > 0) {
        const tMax = state.ball.isMoving
          ? parseFloat((state.ball.time + TIME_AXIS_MOVING_MARGIN).toFixed(1))
          : parseFloat(
              (state.ball.time * TIME_AXIS_STOPPED_MARGIN_RATIO).toFixed(2)
            );
        this.ytChart.options.scales.x.max = tMax;
      }
      const maxY =
        state.ytData.length > 0
          ? Math.max(...state.ytData.map((d) => d.y), 1)
          : state.ball.initialHeight;
      this.ytChart.options.scales.y.max = parseFloat(
        (maxY * Y_AXIS_MAX_MARGIN_RATIO).toFixed(1)
      );
      this.ytChart.update("none");
    }
  }

  /**
   * グラフをリセット（チャートを破棄して再初期化）
   */
  reset() {
    if (this.vtChart) {
      this.vtChart.destroy();
      this.vtChart = null;
    }
    if (this.ytChart) {
      this.ytChart.destroy();
      this.ytChart = null;
    }
    this.updateGraph();
  }
}
