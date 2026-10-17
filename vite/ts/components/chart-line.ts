import type p5 from "p5";
import type { Chart, ChartConfiguration, ChartType } from "chart.js";
import { createLazyImporter } from "../bicpema-lazy-import.js";
import { getCanvasElement } from "../bicpema-dom.js";
import type { SimComponent } from "./sim-component.js";

const loadChart = createLazyImporter(() =>
  import("chart.js/auto").then((module) => module.default)
);

/** データ点（散布図・折れ線の座標） */
export interface ChartPoint {
  x: number;
  y: number;
}

/** 軸の設定 */
export interface ChartLineAxis {
  /** 軸ID（`x` / `y` / `y1` など。`scales` のキーになる） */
  id: string;
  /** 軸の方向。`x` は点の `x`、`y` は点の `y` から最大値を求める */
  direction: "x" | "y";
  /** 軸タイトル */
  title: string;
  /** 軸タイトルの色（省略時: Chart.jsの既定） */
  color?: string;
  /** 軸の最小値（省略時: 0） */
  min?: number;
  /** 初期の最大値 */
  max: number;
  /** 軸の位置（省略時: Chart.jsの既定） */
  position?: "left" | "right" | "top" | "bottom";
  /**
   * 実データの最大値に掛ける倍率。指定すると `update()` のたびに
   * 軸の最大値を「実データの最大値 × 倍率」へ更新する（省略時: 自動調整しない）
   */
  maxRatio?: number;
  /** 自動調整する最大値の下限（省略時: 初期の最大値） */
  minMax?: number;
}

/** データセットの設定 */
export interface ChartLineDataset {
  /** 凡例などに使うラベル */
  label: string;
  /** 線・点の色 */
  color: string;
  /** データ配列。参照を保持し、`update()` のたびにChart.jsへ再設定する */
  data: ChartPoint[];
  /** 対応するY軸のID（省略時: `y`） */
  yAxisID?: string;
}

/** ChartLineの設定 */
export interface ChartLineOptions {
  /** canvas要素のID */
  canvasId: string;
  /** グラフの種類（省略時: `scatter`） */
  type?: Extract<ChartType, "scatter" | "line">;
  /** グラフのタイトル（省略時: 表示しない） */
  title?: string;
  /** 軸の設定（複数軸可） */
  axes: ChartLineAxis[];
  /** データセットの設定 */
  datasets: ChartLineDataset[];
  /** 凡例を表示するか（省略時: false） */
  showLegend?: boolean;
}

/**
 * Chart.jsの折れ線・散布図を扱う部品。
 * `update()` は `destroy()` せず、`data` と `scales.*.max` のみ更新して `chart.update("none")` を呼ぶ。
 * Chart.jsは遅延読み込みし、読み込み完了までの `update()` は読み込み待ちになる。
 * Chart.js自身が描画するため `draw(p)` は何もしない。
 */
export class ChartLine implements SimComponent {
  private chart: Chart | null = null;
  private loading = false;
  // 読み込み失敗後に毎フレーム再試行してネットワークに負荷をかけないよう、一度失敗したら諦める。
  private loadFailed = false;
  private disposed = false;

  /**
   * @param options - 設定。`canvasId` / `type` / `title` / `axes` / `datasets` / `showLegend`
   */
  constructor(private readonly options: ChartLineOptions) {}

  /** データと軸の最大値をChart.jsへ反映して再描画する（初回はChart.jsを読み込んでから生成する） */
  update(): void {
    if (this.disposed) return;
    if (!this.chart) {
      this.loadAndCreate();
      return;
    }
    const chart = this.chart;
    this.options.datasets.forEach((d, i) => {
      chart.data.datasets[i].data = d.data;
    });
    for (const axis of this.options.axes) {
      const scale = chart.options.scales?.[axis.id];
      if (scale && axis.maxRatio !== undefined) {
        scale.max = this.computeMax(axis);
      }
    }
    chart.update("none");
  }

  /**
   * 軸の最大値を明示的に設定する（次の `update()` で反映される）。
   * `maxRatio` による自動調整より優先したいときは、自動調整を指定せずこちらを使う。
   * @param axisId - 軸ID
   * @param max - 最大値
   */
  setAxisMax(axisId: string, max: number): void {
    const scale = this.chart?.options.scales?.[axisId];
    if (scale) scale.max = max;
  }

  /** `draw(p)` は何もしない（Chart.js自身が描画するため） */
  // oxlint-disable-next-line class-methods-use-this -- SimComponentの実装として必要
  draw(_p: p5): void {}

  /** データ配列を空にし、軸の最大値を初期値へ戻して再描画する */
  reset(): void {
    for (const d of this.options.datasets) d.data.length = 0;
    const chart = this.chart;
    if (!chart) return;
    this.options.datasets.forEach((d, i) => {
      chart.data.datasets[i].data = d.data;
    });
    for (const axis of this.options.axes) {
      const scale = chart.options.scales?.[axis.id];
      if (scale) scale.max = axis.max;
    }
    chart.update("none");
  }

  /** Chart.jsのインスタンスを破棄する。呼んだ後は再利用しない */
  dispose(): void {
    this.disposed = true;
    this.chart?.destroy();
    this.chart = null;
  }

  /** Chart.jsを読み込み、完了後にチャートを生成して初回の更新を行う */
  private loadAndCreate(): void {
    if (this.loading || this.loadFailed) return;
    this.loading = true;
    loadChart()
      .then((ChartCtor) => {
        this.loading = false;
        if (this.disposed || this.chart) return;
        const canvas = getCanvasElement(this.options.canvasId);
        if (!canvas) return;
        this.chart = new ChartCtor(canvas, this.buildConfig());
        this.update();
      })
      .catch((error) => {
        this.loading = false;
        this.loadFailed = true;
        // 失敗をユーザーへ通知するUIがないため、原因調査用にログのみ出力する。
        // oxlint-disable-next-line no-console -- 上記コメントの理由により意図的な出力
        console.error("Chart.jsの読み込みに失敗しました。", error);
      });
  }

  /**
   * 実データの最大値から軸の最大値を求める。
   * @param axis - 軸設定
   * @returns 実データの最大値 × 倍率（下限は `minMax`、小数1桁に丸める）
   */
  private computeMax(axis: ChartLineAxis): number {
    let max = -Infinity;
    for (const d of this.options.datasets) {
      const onAxis = axis.direction === "x" || (d.yAxisID ?? "y") === axis.id;
      if (onAxis) {
        for (const point of d.data) max = Math.max(max, point[axis.direction]);
      }
    }
    const floor = axis.minMax ?? axis.max;
    return parseFloat((Math.max(max, floor) * (axis.maxRatio ?? 1)).toFixed(1));
  }

  /** @returns Chart.jsの生成時に渡す設定 */
  private buildConfig(): ChartConfiguration {
    const { axes, datasets, title, showLegend, type } = this.options;
    const scales: Record<string, object> = {};
    for (const axis of axes) {
      scales[axis.id] = {
        type: "linear",
        min: axis.min ?? 0,
        max: axis.max,
        ...(axis.position ? { position: axis.position } : {}),
        title: {
          display: true,
          text: axis.title,
          font: { size: 12 },
          ...(axis.color ? { color: axis.color } : {})
        },
        ticks: { font: { size: 11 } }
      };
    }
    return {
      type: type ?? "scatter",
      data: {
        datasets: datasets.map((d) => ({
          label: d.label,
          data: d.data,
          showLine: true,
          pointRadius: 2,
          pointBackgroundColor: d.color,
          borderColor: d.color,
          borderWidth: 2,
          fill: false,
          ...(d.yAxisID ? { yAxisID: d.yAxisID } : {})
        }))
      },
      options: {
        plugins: {
          title: { display: !!title, text: title ?? "", font: { size: 14 } },
          legend: { display: !!showLegend }
        },
        scales,
        animation: false,
        maintainAspectRatio: false
      }
    } as unknown as ChartConfiguration;
  }
}
