import { state } from "./state.js";
import {
  ChartLine,
  type ChartLineAxis
} from "../../../ts/components/chart-line.js";

/** 速度データの表示色 */
const VELOCITY_COLOR = "rgb(220, 60, 60)";
/** 高さデータの表示色 */
const HEIGHT_COLOR = "rgb(60, 150, 255)";
/** グラフ軸の最大値を実データの最大値からどれだけ余裕を持たせるかの倍率 */
const AXIS_MAX_MARGIN_RATIO = 1.1;
/** 軸の最大値を求める際の実データの最大値の下限（データが少ないときの見た目を保つ） */
const AXIS_DATA_MAX_FLOOR = 1;

/**
 * ボール運動のグラフ描画クラス
 * v-tグラフとy-tグラフを同時に表示（共通コンポーネント `ChartLine` を利用）
 */
export class BallGraph {
  private readonly heightAxis: ChartLineAxis = {
    id: "y1",
    direction: "y",
    title: "高さ y [m]",
    color: HEIGHT_COLOR,
    max: AXIS_DATA_MAX_FLOOR * AXIS_MAX_MARGIN_RATIO,
    titleFontSize: 14,
    tickFontSize: 12,
    position: "right",
    hideGrid: true
  };

  private readonly chartLine = new ChartLine({
    canvasId: "graphCanvas",
    title: "v-tグラフとy-tグラフ",
    titleFontSize: 16,
    legendFontSize: 13,
    showLegend: true,
    axes: [
      {
        id: "x",
        direction: "x",
        title: "時間 t [s]",
        max: AXIS_DATA_MAX_FLOOR * AXIS_MAX_MARGIN_RATIO,
        minMax: AXIS_DATA_MAX_FLOOR,
        maxRatio: AXIS_MAX_MARGIN_RATIO,
        titleFontSize: 14,
        tickFontSize: 12
      },
      {
        id: "y",
        direction: "y",
        title: "速度 v [m/s]",
        color: VELOCITY_COLOR,
        max: AXIS_DATA_MAX_FLOOR * AXIS_MAX_MARGIN_RATIO,
        minMax: AXIS_DATA_MAX_FLOOR,
        maxRatio: AXIS_MAX_MARGIN_RATIO,
        titleFontSize: 14,
        tickFontSize: 12,
        position: "left"
      },
      this.heightAxis
    ],
    datasets: [
      {
        label: "速度 v (m/s)",
        color: VELOCITY_COLOR,
        data: state.vtData,
        pointRadius: 3,
        yAxisID: "y"
      },
      {
        label: "高さ y (m)",
        color: HEIGHT_COLOR,
        data: state.ytData,
        pointRadius: 3,
        yAxisID: "y1"
      }
    ]
  });

  /**
   * グラフを更新
   * 高さ軸の最大値は初期高さから決め、時間軸・速度軸は実データから `ChartLine` が自動調整する。
   */
  updateGraph() {
    if (!state.graphVisible) return;
    const ball = state.ball;
    if (!ball) return;
    const heightMax = parseFloat(
      (ball.initialHeight * AXIS_MAX_MARGIN_RATIO).toFixed(2)
    );
    this.heightAxis.max = heightMax;
    this.chartLine.setAxisMax("y1", heightMax);
    this.chartLine.update();
  }

  /**
   * グラフをリセット（データを空にして軸の最大値を初期値へ戻す）
   */
  reset() {
    const ball = state.ball;
    if (ball) {
      this.heightAxis.max = parseFloat(
        (ball.initialHeight * AXIS_MAX_MARGIN_RATIO).toFixed(2)
      );
    }
    this.chartLine.reset();
  }
}
