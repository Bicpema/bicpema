// state.js はシミュレーションの共有可変状態を管理するファイルです。

export const state = {
  // <変数の宣言>
  cmfTable: undefined,
  osTable: undefined,
  img: undefined,
  img2: undefined,
  /** 偏光板の配置方法のselect要素 */
  polarizerSelect: undefined,
  /** 光路差のinput要素 */
  opdInput: undefined,
  /** セロハン追加のbutton要素 */
  cellophaneAddButton: undefined,
  /** セロハン削除のbutton要素 */
  cellophaneRemoveButton: undefined,
  /** 等色関数のデータ行数 */
  cmfRowNum: undefined,
  /** 強度分布のデータ行数 */
  osRowNum: undefined,
  /** 光路差のデータ行数 */
  dRowNum: undefined,
  /** 波長の配列 */
  waveLengthArr: undefined,
  /** XYZ等色関数の配列 */
  xLambda: undefined,
  yLambda: undefined,
  zLambda: undefined,
  /** 強度データの配列 */
  osArr: undefined,
  osArrOrigin: undefined,
  /** 光路差のデータの配列 */
  dArr: undefined,
  /** 光路差のデータの配列OPP */
  dTableOPP: undefined,
  /** セロハンテープ用の光路差テーブル */
  dTable: undefined,
  /** 一枚目の偏光板を透過したときのxyz要素 */
  xArrAfter: [],
  yArrAfter: [],
  zArrAfter: [],
  /** 二枚目の偏光板を透過したときのxyz要素 */
  xArrBefore: [],
  yArrBefore: [],
  zArrBefore: [],
  /** 明るさ調節の為の光源の強さに相当 */
  ls_xArrAfter: [],
  ls_yArrAfter: [],
  ls_zArrAfter: [],
  sum_ls_xArrAfter: undefined,
  sum_ls_yArrAfter: undefined,
  sum_ls_zArrAfter: undefined,
  /** セロハンの枚数 */
  cellophaneNum: undefined,
  /** セロハンのデータ配列 */
  cellophaneArr: [],
  /** 一枚目の偏光板を透過したときのrgb要素 */
  rBefore: 0,
  gBefore: 0,
  bBefore: 0,
  /** 二枚目の偏光板を透過したときのrgb要素 */
  rAfter: 0,
  gAfter: 0,
  bAfter: 0,
  /** 二枚目の偏光板を透過したときのrgb要素(※ セロハン1枚のみ) */
  rAfter1: 0,
  gAfter1: 0,
  bAfter1: 0,
  /** 二枚目の偏光板を透過したときのrgb要素(※ セロハン2枚以上) */
  rAfter2: 0,
  gAfter2: 0,
  bAfter2: 0,

  //分離軸判定で使用した変数の追加 2024.6.14
  /** 判定で用いる座標の中心点 */
  centerX: undefined,
  centerY: undefined,
  /** 判定するテープの4隅の点座標 */
  x1: undefined,
  x2: undefined,
  x3: undefined,
  x4: undefined,
  y1: undefined,
  y2: undefined,
  y3: undefined,
  y4: undefined,
  tape_angle: undefined,
  tape_angle_cal: undefined,
  tape_number_cal: undefined,
  tape_angle_get: undefined,
  angle_1: undefined,
  angle_2: undefined,
  angle_3: undefined,
  angle_4: undefined,
  E_1: undefined,
  E_2: undefined,
  E_3: undefined,
  c: undefined,
  /** セロハンのサイズ(高さ) */
  radius: undefined,
  /** セロハン枚数管理変数 */
  colabNum: undefined,
  precolabNum: undefined,
  rAftera: undefined,
  gAftera: undefined,
  bAftera: undefined,
  slider: undefined,

  //分割描画で新たに必要となった変数
  count2: undefined,
  lastValue: undefined,
  BisDead: undefined,
  CisDead: undefined,
  DrawisDead: undefined,
  Bcount: undefined,
  Bsize: undefined,
  Bdraw: undefined,
  drawT: undefined,
  drawSize: undefined,
  drawCount: undefined,
  tape_array: undefined,
  tape_arraySum: undefined,
  zz: undefined,
  /** program上の組数の制限 */
  last_otherCellophaneNums: [14],
  last_targetAngles: [14],
  last_opt: [14],
  last_polarizer: undefined,
  last_opt1: undefined,
  rotateTime: 0,
  calculate: 0,

  //クラスター分類する際に新たに追加した変数
  clusters: 4,
  clusterColors: [],
  labels: [],
  edgePixels: [],
  n: 3,
  iterations: 3,
  dilationSize: 2,
  lastCluster: undefined,
  sliderCluster: undefined,
  /** imgをコピーした画像 */
  copyimg: undefined,
  inputCluster: undefined,
  cmd: undefined,
  radio: undefined,
  clusterCount: undefined,
  clusterCount1: undefined,
  rAfterak: undefined,
  gAfterak: undefined,
  bAfterak: undefined,
  rotateInputV: undefined,
  Cluster1isDead: undefined,
  changeisDead: undefined,

  // エッジ検出の際に, 検出の強度をコントロールする変数
  thresholds: undefined,
  lasthreshold: undefined,
  edgieSlider: undefined,

  // 補助線の作成を判定するbox
  lineradio: undefined,

  //HSV色空間での表示の為の変数
  hAfter1: undefined,
  sAfter1: undefined,
  vAfter1: undefined,
  hAfter2: undefined,
  sAfter2: undefined,
  vAfter2: undefined,
  hAfterak: undefined,
  sAfterak: undefined,
  vAfterak: undefined,
  //HSV色空間の為の位置情報の獲得
  x_1: undefined,
  y_1: undefined,
  xdata: [],
  ydata: [],
  //グラフの表示変更のためのid識別の変数
  graphParent: undefined,
  // 強度を加味する為の変数
  rTable: undefined,
  /** ダウンロードした光源における光強度値を受け取る変数 */
  Intensity_all: undefined,
  /** 光源の各波長の強度を受け取る配列 */
  Intensity_all_box: [],
  Intensity_all_now: undefined,
  Intensity_slider: undefined,
  /** 補正データを受け取る配列 */
  R_all: [],
  R_os: [],

  K: undefined,
  xSumBefore: undefined,
  ySumBefore: undefined,
  zSumBefore: undefined,
  xSumAfter: undefined,
  ySumAfter: undefined,
  zSumAfter: undefined,
  rgbBefore: undefined,
  rgbAfter: undefined,
  tosRGB: undefined,
  sRGB: undefined,
  spey: undefined,
  speyBox: [],
  //複数の光路差-分散特性を考慮するためのボタン
  optRadio: undefined,
  currentValue: undefined,
  preValue: undefined,
  //スライダー幅について
  currentSlider: undefined,
  lastSlider: undefined,

  // グラフ描画用のChart.jsインスタンス
  mainChartObj: undefined,
  subChartObj: undefined,
};
