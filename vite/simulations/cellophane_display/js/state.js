// state.js はシミュレーションの共有可変状態を管理するファイルです。

export const state = {
  // <preloadで読み込むデータ>
  /** 等色関数のデータテーブル */
  cmfTable: null,
  /** 偏光板を一枚通したときの波長毎の強度分布のデータテーブル */
  osTable: null,
  /** 光路差の分散特性(380nmで100に規格化)のデータテーブル(セロハンテープ用) */
  dTable: null,
  /** 光路差の分散特性(380nmで100に規格化)のデータテーブル(OPPフィルム用) */
  dTableOPP: null,
  /** 偏光板2枚目による強度補正分のデータテーブル */
  rTable: null,
  /** 貼り付け用の白画像 */
  img: null,

  // <DOM要素>
  /** 偏光板の配置方法のselect要素 */
  polarizerSelect: null,
  /** 光路差のinput要素 */
  opdInput: null,
  /** セロハン追加のbutton要素 */
  cellophaneAddButton: null,
  /** セロハン削除のbutton要素 */
  cellophaneRemoveButton: null,
  /** テープの幅を決定するslider要素 */
  slider: null,
  /** 補助線の表示可否を切り替えるradio要素 */
  lineradio: null,
  /** 光路差の分散特性(セロハンテープ/OPPフィルム)を切り替えるradio要素 */
  optRadio: null,

  // <テーブルから読み取ったデータ>
  /** 等色関数のデータ行数 */
  cmfRowNum: 0,
  /** 強度分布のデータ行数 */
  osRowNum: 0,
  /** 光路差のデータ行数 */
  dRowNum: 0,
  /** 波長の配列 */
  waveLengthArr: [],
  /** XYZ等色関数の配列 */
  xLambda: [],
  yLambda: [],
  zLambda: [],
  /** 強度データの配列(計算中に上書きされる)と、光源そのままの強度データの配列 */
  osArr: [],
  osArrOrigin: [],
  /** 光路差のデータの配列 */
  dArr: [],
  /** 偏光板2枚目による強度補正分のデータ */
  R_all: [],
  /** 補正データ(R_all)×光源強度(osArrOrigin)の中間配列 */
  R_os: [],

  // <偏光板透過後のXYZ刺激値計算に使う配列>
  /** 一枚目の偏光板を透過したときのxyz要素 */
  xArrBefore: [],
  yArrBefore: [],
  zArrBefore: [],
  /** 二枚目の偏光板を透過したときのxyz要素 */
  xArrAfter: [],
  yArrAfter: [],
  zArrAfter: [],
  /** 明るさ調節の為の光源の強さに相当する配列 */
  ls_xArrAfter: [],
  ls_yArrAfter: [],
  ls_zArrAfter: [],
  sum_ls_xArrAfter: 0,
  sum_ls_yArrAfter: 0,
  sum_ls_zArrAfter: 0,

  // <セロハンの組の管理>
  /** セロハンの枚数(総数) */
  cellophaneNum: 0,
  /** セロハンのデータ配列(Cellophane DOM要素の管理) */
  cellophaneArr: [],
  /** セロハンの組数 */
  colabNum: 0,
  /** セロハンの組数(前回値、直接は読み取られないが初期化時に保持する) */
  precolabNum: 0,

  // <色計算結果>
  /** 一枚目の偏光板を透過したときのrgb要素 */
  rBefore: 0,
  gBefore: 0,
  bBefore: 0,
  /** 二枚目の偏光板を透過したときのrgb要素 */
  rAfter: 0,
  gAfter: 0,
  bAfter: 0,
  /** 二枚目の偏光板を透過したときのrgb要素(セロハン1枚のみ) */
  rAfter1: 0,
  gAfter1: 0,
  bAfter1: 0,
  /** 二枚目の偏光板を透過したときのrgb要素(セロハン2枚以上) */
  rAfter2: 0,
  gAfter2: 0,
  bAfter2: 0,
  /** 組数2以上の場合の、生成しうる全ての色の配列 */
  rAftera: [],
  gAftera: [],
  bAftera: [],

  // <ジョーンズベクトル/角度の計算に使う変数>
  angle_1: 0,
  angle_2: 0,
  angle_3: 0,
  angle_4: 0,
  E_1: null,
  E_2: null,
  E_3: null,

  // <分離軸判定で使用する座標>
  /** 判定で用いる座標の中心点 */
  centerX: 0,
  centerY: 0,
  /** 判定するテープの4隅の点座標 */
  x1: 0,
  x2: 0,
  x3: 0,
  x4: 0,
  y1: 0,
  y2: 0,
  y3: 0,
  y4: 0,
  tape_angle: [],
  tape_angle_cal: [],
  tape_number_cal: [],
  tape_angle_get: 0,
  /** セロハンのサイズ(高さ) */
  radius: 0,

  // <分割描画の管理>
  count2: 0,
  lastValue: undefined,
  BisDead: false,
  CisDead: false,
  DrawisDead: false,
  Bcount: 0,
  Bsize: undefined,
  Bdraw: 0,
  drawT: 0,
  drawSize: 0,
  drawCount: 0,
  tape_array: [],
  tape_arraySum: [],
  zz: 0,
  /** program上の組数の制限(要素数15) */
  last_otherCellophaneNums: [14],
  last_targetAngles: [14],
  last_polarizer: null,
  /** 光路差(#opdInput、全組共通)の前回値 */
  last_opt1: null,
  rotateTime: 0,
  calculate: 0,

  // <強度を加味する為の変数>
  /** ダウンロードした光源における光強度値の合計(未使用箇所での計算のみで保持) */
  Intensity_all_now: 0,

  // <色空間変換の中間変数>
  K: 0,
  xSumBefore: 0,
  ySumBefore: 0,
  zSumBefore: 0,
  xSumAfter: 0,
  ySumAfter: 0,
  zSumAfter: 0,
  rgbBefore: null,
  tosRGB: null,
  sRGB: null,
  spey: 0,
  speyBox: [],

  // <複数の光路差-分散特性を考慮するためのボタン>
  currentValue: null,
  preValue: null,

  // <スライダー幅について>
  currentSlider: 0,
  lastSlider: 0,
};
