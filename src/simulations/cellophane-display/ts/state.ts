// state.js はシミュレーションの共有可変状態を管理するファイルです。

import type p5 from "p5";
import type { Cellophane } from "./class.js";

export const state: {
  // <preloadで読み込むデータ>
  /** 等色関数のデータテーブル */
  cmfTable: p5.Table | null;
  /** 偏光板を一枚通したときの波長毎の強度分布のデータテーブル */
  osTable: p5.Table | null;
  /** 光路差の分散特性(380nmで100に規格化)のデータテーブル(セロハンテープ用) */
  dTable: p5.Table | null;
  /** 光路差の分散特性(380nmで100に規格化)のデータテーブル(OPPフィルム用) */
  dTableOPP: p5.Table | null;
  /** 偏光板2枚目による強度補正分のデータテーブル */
  rTable: p5.Table | null;
  /** 貼り付け用の白画像 */
  img: p5.Image | null;

  // <DOM要素>
  /** 偏光板の配置方法のselect要素 */
  polarizerSelect: p5.Element | null;
  /** 光路差のinput要素 */
  opdInput: p5.Element | null;
  /** セロハン追加のbutton要素 */
  cellophaneAddButton: p5.Element | null;
  /** セロハン削除のbutton要素 */
  cellophaneRemoveButton: p5.Element | null;
  /** テープの幅を決定するslider要素 */
  slider: p5.Element | null;
  /** 補助線の表示可否を切り替えるradio要素 */
  lineradio: p5.Element | null;
  /** 光路差の分散特性(セロハンテープ/OPPフィルム)を切り替えるradio要素 */
  optRadio: p5.Element | null;

  // <テーブルから読み取ったデータ>
  /** 等色関数のデータ行数 */
  cmfRowNum: number;
  /** 強度分布のデータ行数 */
  osRowNum: number;
  /** 光路差のデータ行数 */
  dRowNum: number;
  /** 波長の配列 */
  waveLengthArr: number[];
  /** XYZ等色関数の配列 */
  xLambda: number[];
  yLambda: number[];
  zLambda: number[];
  /** 強度データの配列(計算中に上書きされる)と、光源そのままの強度データの配列 */
  osArr: number[];
  osArrOrigin: number[];
  /** 光路差のデータの配列 */
  dArr: number[];
  /** 偏光板2枚目による強度補正分のデータ */
  R_all: number[];
  /** 補正データ(R_all)×光源強度(osArrOrigin)の中間配列 */
  R_os: number[];

  // <偏光板透過後のXYZ刺激値計算に使う配列>
  /** 一枚目の偏光板を透過したときのxyz要素 */
  xArrBefore: number[];
  yArrBefore: number[];
  zArrBefore: number[];
  /** 二枚目の偏光板を透過したときのxyz要素 */
  xArrAfter: number[];
  yArrAfter: number[];
  zArrAfter: number[];
  /** 明るさ調節の為の光源の強さに相当する配列 */
  ls_xArrAfter: number[];
  ls_yArrAfter: number[];
  ls_zArrAfter: number[];
  sum_ls_xArrAfter: number;
  sum_ls_yArrAfter: number;
  sum_ls_zArrAfter: number;

  // <セロハンの組の管理>
  /** セロハンの枚数(総数) */
  cellophaneNum: number;
  /** セロハンのデータ配列(Cellophane DOM要素の管理) */
  cellophaneArr: Cellophane[];
  /** セロハンの組数 */
  colabNum: number;
  /** セロハンの組数(前回値、直接は読み取られないが初期化時に保持する) */
  precolabNum: number;

  // <色計算結果>
  /** 一枚目の偏光板を透過したときのrgb要素 */
  rBefore: number;
  gBefore: number;
  bBefore: number;
  /** 二枚目の偏光板を透過したときのrgb要素 */
  rAfter: number;
  gAfter: number;
  bAfter: number;
  /** 二枚目の偏光板を透過したときのrgb要素(セロハン1枚のみ) */
  rAfter1: number;
  gAfter1: number;
  bAfter1: number;
  /** 二枚目の偏光板を透過したときのrgb要素(セロハン2枚以上) */
  rAfter2: number;
  gAfter2: number;
  bAfter2: number;
  /** 組数2以上の場合の、生成しうる全ての色の配列 */
  rAftera: number[];
  gAftera: number[];
  bAftera: number[];

  // <ジョーンズベクトル/角度の計算に使う変数>
  angle_1: number;
  angle_2: number;
  angle_3: number;
  angle_4: number;
  /** ジョーンズベクトル計算の中間値。mathjsによる複素数行列演算の結果を保持する */
  // oxlint-disable-next-line no-explicit-any -- mathjsの複素数行列演算の戻り値を型を問わず保持するため
  E_1: any;
  // oxlint-disable-next-line no-explicit-any -- 同上
  E_2: any;
  // oxlint-disable-next-line no-explicit-any -- 同上
  E_3: any;

  // <分離軸判定で使用する座標>
  /** 判定で用いる座標の中心点 */
  centerX: number;
  centerY: number;
  /** 判定するテープの4隅の点座標 */
  x1: number;
  x2: number;
  x3: number;
  x4: number;
  y1: number;
  y2: number;
  y3: number;
  y4: number;
  tape_angle: number[];
  tape_angle_cal: number[];
  tape_number_cal: number[];
  tape_angle_get: number;
  /** セロハンのサイズ(高さ) */
  radius: number;

  // <分割描画の管理>
  count2: number;
  lastValue: number | undefined;
  BisDead: boolean;
  CisDead: boolean;
  DrawisDead: boolean;
  Bcount: number;
  Bsize: number | undefined;
  Bdraw: number;
  drawT: number;
  drawSize: number;
  drawCount: number;
  tape_array: string[];
  tape_arraySum: string[];
  zz: number;
  /** program上の組数の制限(要素数15) */
  last_otherCellophaneNums: number[];
  last_targetAngles: number[];
  last_polarizer: string | number | null;
  /** 光路差(#opdInput、全組共通)の前回値 */
  last_opt1: string | number | null;
  rotateTime: number;
  calculate: number;

  // <強度を加味する為の変数>
  /** ダウンロードした光源における光強度値の合計(未使用箇所での計算のみで保持) */
  Intensity_all_now: number;

  // <色空間変換の中間変数>
  K: number;
  xSumBefore: number;
  ySumBefore: number;
  zSumBefore: number;
  xSumAfter: number;
  ySumAfter: number;
  zSumAfter: number;
  // oxlint-disable-next-line no-explicit-any -- mathjsの行列演算の戻り値を型を問わず保持するため
  rgbBefore: any;
  // oxlint-disable-next-line no-explicit-any -- 同上
  tosRGB: any;
  // oxlint-disable-next-line no-explicit-any -- 同上
  sRGB: any;
  spey: number;
  speyBox: number[];

  // <複数の光路差-分散特性を考慮するためのボタン>
  currentValue: string | number | null;
  preValue: string | number | null;

  // <スライダー幅について>
  currentSlider: number;
  lastSlider: number;
} = {
  cmfTable: null,
  osTable: null,
  dTable: null,
  dTableOPP: null,
  rTable: null,
  img: null,

  polarizerSelect: null,
  opdInput: null,
  cellophaneAddButton: null,
  cellophaneRemoveButton: null,
  slider: null,
  lineradio: null,
  optRadio: null,

  cmfRowNum: 0,
  osRowNum: 0,
  dRowNum: 0,
  waveLengthArr: [],
  xLambda: [],
  yLambda: [],
  zLambda: [],
  osArr: [],
  osArrOrigin: [],
  dArr: [],
  R_all: [],
  R_os: [],

  xArrBefore: [],
  yArrBefore: [],
  zArrBefore: [],
  xArrAfter: [],
  yArrAfter: [],
  zArrAfter: [],
  ls_xArrAfter: [],
  ls_yArrAfter: [],
  ls_zArrAfter: [],
  sum_ls_xArrAfter: 0,
  sum_ls_yArrAfter: 0,
  sum_ls_zArrAfter: 0,

  cellophaneNum: 0,
  cellophaneArr: [],
  colabNum: 0,
  precolabNum: 0,

  rBefore: 0,
  gBefore: 0,
  bBefore: 0,
  rAfter: 0,
  gAfter: 0,
  bAfter: 0,
  rAfter1: 0,
  gAfter1: 0,
  bAfter1: 0,
  rAfter2: 0,
  gAfter2: 0,
  bAfter2: 0,
  rAftera: [],
  gAftera: [],
  bAftera: [],

  angle_1: 0,
  angle_2: 0,
  angle_3: 0,
  angle_4: 0,
  E_1: null,
  E_2: null,
  E_3: null,

  centerX: 0,
  centerY: 0,
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
  radius: 0,

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
  last_otherCellophaneNums: new Array(15).fill(1),
  last_targetAngles: new Array(15).fill(1),
  last_polarizer: null,
  last_opt1: null,
  rotateTime: 0,
  calculate: 0,

  Intensity_all_now: 0,

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

  currentValue: null,
  preValue: null,

  currentSlider: 0,
  lastSlider: 0
};
