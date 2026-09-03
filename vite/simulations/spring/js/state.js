// state.js はシミュレーションの共有可変状態を管理するファイルです。

/** フレームレート */
export const FPS = 60;

export const state = {
  /** ばねの画像 */
  springImage: null,
  /** おもりの画像 */
  ballImage: null,
  /** 上のばねのばね定数の入力DOM要素 */
  konstantInput1: null,
  /** 上のばねの組み合わせの入力DOM要素 */
  combiInput1: null,
  /** 上のばねの質量の入力DOM要素 */
  weightInput1: null,
  /** 上のばねの振幅の入力DOM要素 */
  amplitudeInput1: null,
  /** 下のばねのばね定数の入力DOM要素 */
  konstantInput2: null,
  /** 下のばねの組み合わせの入力DOM要素 */
  combiInput2: null,
  /** 下のばねの質量の入力DOM要素 */
  weightInput2: null,
  /** 下のばねの振幅の入力DOM要素 */
  amplitudeInput2: null,
  /** シミュレーションが再生中かどうか */
  clickedCount: false,
  /** 経過フレーム数（累積カウンタ） */
  count: 0,
  /** グラフの時間軸データ（秒） */
  countData: [],
  /** 上のばねの変位データ（グラフ用） */
  data1: [],
  /** 下のばねの変位データ（グラフ用） */
  data2: [],
  /** 上のばね */
  spring1: null,
  /** 下のばね */
  spring2: null,
  /** 上のばねのグラフ用DOM要素 */
  graph1: null,
  /** 下のばねのグラフ用DOM要素 */
  graph2: null,
  /** 上のばねのグラフcanvas要素 */
  graphCanvas1: null,
  /** 下のばねのグラフcanvas要素 */
  graphCanvas2: null,
  /** 上のばねのChart.jsインスタンス */
  chart1: null,
  /** 下のばねのChart.jsインスタンス */
  chart2: null,
};
