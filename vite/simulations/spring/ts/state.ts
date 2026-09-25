// state.ts はシミュレーションの共有可変状態を管理するファイルです。

import type p5 from "p5";
import type { Spring } from "./class.js";

/** フレームレート */
export const FPS = 60;

export const state: {
  /** ばねの画像 */
  springImage: p5.Image | null;
  /** おもりの画像 */
  ballImage: p5.Image | null;
  /** 上のばねのばね定数の入力DOM要素 */
  konstantInput1: p5.Element | null;
  /** 上のばねの組み合わせの入力DOM要素 */
  combiInput1: p5.Element | null;
  /** 上のばねの質量の入力DOM要素 */
  weightInput1: p5.Element | null;
  /** 上のばねの振幅の入力DOM要素 */
  amplitudeInput1: p5.Element | null;
  /** 下のばねのばね定数の入力DOM要素 */
  konstantInput2: p5.Element | null;
  /** 下のばねの組み合わせの入力DOM要素 */
  combiInput2: p5.Element | null;
  /** 下のばねの質量の入力DOM要素 */
  weightInput2: p5.Element | null;
  /** 下のばねの振幅の入力DOM要素 */
  amplitudeInput2: p5.Element | null;
  /** シミュレーションが再生中かどうか */
  clickedCount: boolean;
  /** 経過フレーム数（累積カウンタ） */
  count: number;
  /** グラフの時間軸データ（秒） */
  countData: number[];
  /** 上のばねの変位データ（グラフ用） */
  data1: number[];
  /** 下のばねの変位データ（グラフ用） */
  data2: number[];
  /** 上のばね */
  spring1: Spring | null;
  /** 下のばね */
  spring2: Spring | null;
  /** 上のばねのグラフ用DOM要素 */
  graph1: p5.Element | null;
  /** 下のばねのグラフ用DOM要素 */
  graph2: p5.Element | null;
  /** 上のばねのグラフcanvas要素 */
  graphCanvas1: p5.Element | null;
  /** 下のばねのグラフcanvas要素 */
  graphCanvas2: p5.Element | null;
  /** 上のばねのChart.jsインスタンス */
  chart1: any;
  /** 下のばねのChart.jsインスタンス */
  chart2: any;
} = {
  springImage: null,
  ballImage: null,
  konstantInput1: null,
  combiInput1: null,
  weightInput1: null,
  amplitudeInput1: null,
  konstantInput2: null,
  combiInput2: null,
  weightInput2: null,
  amplitudeInput2: null,
  clickedCount: false,
  count: 0,
  countData: [],
  data1: [],
  data2: [],
  spring1: null,
  spring2: null,
  graph1: null,
  graph2: null,
  graphCanvas1: null,
  graphCanvas2: null,
  chart1: null,
  chart2: null
};
