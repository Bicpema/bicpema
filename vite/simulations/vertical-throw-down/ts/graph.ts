import { state } from "./state.js";
import {
  ChartLine,
  type ChartLineAxis
} from "../../../ts/components/chart-line.js";

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
/** データが無いときの速度軸の最大値に加える初速度からの余白 (m/s) */
const INITIAL_VELOCITY_AXIS_MARGIN = 10;
/** 速度軸の最大値を求める際、初速度に加える下限の余白 (m/s) */
const VELOCITY_FLOOR_MARGIN = 1;
/** 変位軸の最大値を求める際の実データの最大値の下限 (m) */
const HEIGHT_DATA_MAX_FLOOR = 1;

/**
 * ボール運動のグラフ描画クラス
 * v-tグラフとy-tグラフをそれぞれ独立したcanvasに表示（共通コンポーネント `ChartLine` を2つ利用）
 */
export class BallGraph {
  private readonly vtTimeAxis: ChartLineAxis = {
    id: "x",
    direction: "x",
    title: "時間 t [s]",
    max: INITIAL_MAX_TIME
  };

  private readonly vtVelocityAxis: ChartLineAxis = {
    id: "y",
    direction: "y",
    title: "速度 v [m/s]",
    color: VELOCITY_COLOR,
    max: INITIAL_MAX_TIME
  };

  private readonly ytTimeAxis: ChartLineAxis = {
    id: "x",
    direction: "x",
    title: "時間 t [s]",
    max: INITIAL_MAX_TIME
  };

  private readonly ytHeightAxis: ChartLineAxis = {
    id: "y",
    direction: "y",
    title: "変位 y [m]",
    color: HEIGHT_COLOR,
    max: INITIAL_MAX_TIME
  };

  private readonly vtChart = new ChartLine({
    canvasId: "vtCanvas",
    title: "v-t グラフ",
    axes: [this.vtTimeAxis, this.vtVelocityAxis],
    datasets: [
      { label: "速度 v (m/s)", color: VELOCITY_COLOR, data: state.vtData }
    ]
  });

  private readonly ytChart = new ChartLine({
    canvasId: "ytCanvas",
    title: "y-t グラフ（変位）",
    axes: [this.ytTimeAxis, this.ytHeightAxis],
    datasets: [{ label: "変位 y (m)", color: HEIGHT_COLOR, data: state.ytData }]
  });

  /**
   * 時間軸の最大値を求める
   * @returns 運動中は経過時間に余白を足した値、停止後は倍率を掛けた値。経過時間が0のときは初期値
   */
  private static computeTimeMax(): number {
    const { ball } = state;
    if (!ball || ball.time <= 0) return INITIAL_MAX_TIME;
    return ball.isMoving
      ? parseFloat((ball.time + TIME_AXIS_MOVING_MARGIN).toFixed(1))
      : parseFloat((ball.time * TIME_AXIS_STOPPED_MARGIN_RATIO).toFixed(2));
  }

  /**
   * 軸の最大値を設定する（生成前は設定オブジェクト、生成後はChart.jsのスケールへ反映する）
   * @param chart - 対象のグラフ
   * @param axis - 軸設定
   * @param max - 最大値
   */
  private static applyAxisMax(
    chart: ChartLine,
    axis: ChartLineAxis,
    max: number
  ) {
    axis.max = max;
    chart.setAxisMax(axis.id, max);
  }

  /**
   * データと軸の最大値を更新してグラフを再描画する
   * Chart.jsの読み込みと生成は `ChartLine` が行う。
   */
  updateGraph() {
    const { ball } = state;
    if (!ball) return;

    const timeMax = BallGraph.computeTimeMax();
    BallGraph.applyAxisMax(this.vtChart, this.vtTimeAxis, timeMax);
    BallGraph.applyAxisMax(this.ytChart, this.ytTimeAxis, timeMax);

    const vMax =
      state.vtData.length > 0
        ? parseFloat(
            (
              Math.max(
                ...state.vtData.map((d) => d.y),
                ball.initialVelocity + VELOCITY_FLOOR_MARGIN
              ) * Y_AXIS_MAX_MARGIN_RATIO
            ).toFixed(1)
          )
        : ball.initialVelocity + INITIAL_VELOCITY_AXIS_MARGIN;
    BallGraph.applyAxisMax(this.vtChart, this.vtVelocityAxis, vMax);

    const yMax =
      state.ytData.length > 0
        ? parseFloat(
            (
              Math.max(...state.ytData.map((d) => d.y), HEIGHT_DATA_MAX_FLOOR) *
              Y_AXIS_MAX_MARGIN_RATIO
            ).toFixed(1)
          )
        : ball.initialHeight;
    BallGraph.applyAxisMax(this.ytChart, this.ytHeightAxis, yMax);

    this.vtChart.update();
    this.ytChart.update();
  }

  /**
   * グラフをリセット（データを空にし、軸の最大値を現在の初期条件に合わせて更新する）
   */
  reset() {
    this.vtChart.reset();
    this.ytChart.reset();
    this.updateGraph();
  }
}
