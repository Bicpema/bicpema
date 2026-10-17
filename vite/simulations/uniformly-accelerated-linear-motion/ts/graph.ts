import { state } from "./state.js";
import { MAX_TIME } from "./constants.js";
import {
  ChartLine,
  type ChartLineAxis
} from "../../../ts/components/chart-line.js";

/** 位置データの表示色 */
const POSITION_COLOR = "rgb(60, 150, 255)";
/** 速度データの表示色 */
const VELOCITY_COLOR = "rgb(220, 60, 60)";
/** グラフ軸の最大値を実データの最大値からどれだけ余裕を持たせるかの倍率 */
const AXIS_MAX_MARGIN_RATIO = 1.1;
/** 軸の最大値を求める際の実データの最大値の下限 */
const AXIS_DATA_MAX_FLOOR = 1;
/** 軸の初期の最大値 */
const INITIAL_AXIS_MAX = AXIS_DATA_MAX_FLOOR * AXIS_MAX_MARGIN_RATIO;

/**
 * x-tグラフとv-tグラフを描画するクラス（共通コンポーネント `ChartLine` を利用）
 */
export class MotionGraph {
  private readonly timeAxis: ChartLineAxis = {
    id: "x",
    direction: "x",
    title: "時間 t [s]",
    max: INITIAL_AXIS_MAX,
    titleFontSize: 14,
    tickFontSize: 12
  };

  private readonly velocityAxis: ChartLineAxis = {
    id: "y1",
    direction: "y",
    title: "速度 v [m/s]",
    color: VELOCITY_COLOR,
    max: INITIAL_AXIS_MAX,
    titleFontSize: 14,
    tickFontSize: 12,
    position: "right",
    hideGrid: true
  };

  private readonly chartLine = new ChartLine({
    canvasId: "graphCanvas",
    title: "x-tグラフ・v-tグラフ",
    titleFontSize: 16,
    legendFontSize: 13,
    showLegend: true,
    axes: [
      this.timeAxis,
      {
        id: "y",
        direction: "y",
        title: "位置 x [m]",
        color: POSITION_COLOR,
        max: INITIAL_AXIS_MAX,
        minMax: AXIS_DATA_MAX_FLOOR,
        maxRatio: AXIS_MAX_MARGIN_RATIO,
        titleFontSize: 14,
        tickFontSize: 12,
        position: "left"
      },
      this.velocityAxis
    ],
    datasets: [
      {
        label: "位置 x (m)",
        color: POSITION_COLOR,
        data: state.xtData,
        yAxisID: "y"
      },
      {
        label: "速度 v (m/s)",
        color: VELOCITY_COLOR,
        data: state.vtData,
        yAxisID: "y1"
      }
    ]
  });

  /**
   * グラフを更新する
   * 時間軸（上限 `MAX_TIME`）と速度軸（初速度を下限とする）の最大値はここで求め、位置軸は `ChartLine` が自動調整する。
   */
  updateGraph() {
    if (!state.graphVisible) return;
    const { car } = state;
    if (!car) return;

    const maxTime = car.time > 0 ? car.time : 1;
    const timeMax = parseFloat(
      Math.min(maxTime * AXIS_MAX_MARGIN_RATIO, MAX_TIME).toFixed(2)
    );
    const maxV = Math.max(
      ...state.vtData.map((d) => d.y),
      car.initialVelocity,
      AXIS_DATA_MAX_FLOOR
    );
    const velocityMax = parseFloat((maxV * AXIS_MAX_MARGIN_RATIO).toFixed(2));
    this.timeAxis.max = timeMax;
    this.velocityAxis.max = velocityMax;
    this.chartLine.setAxisMax("x", timeMax);
    this.chartLine.setAxisMax("y1", velocityMax);
    this.chartLine.update();
  }

  /**
   * グラフをリセットする（データを空にして軸の最大値を初期値へ戻す）
   */
  reset() {
    this.timeAxis.max = INITIAL_AXIS_MAX;
    this.velocityAxis.max = INITIAL_AXIS_MAX;
    this.chartLine.reset();
  }
}
