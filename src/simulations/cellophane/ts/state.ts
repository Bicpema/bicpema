// state.jsはシミュレーション全体で共有する状態をまとめたファイルです。

import type p5 from "p5";
import type { Chart } from "chart.js";
import type { Ray } from "./class.js";

export const state: {
  // CSVから読み込む生データ（p.loadTableの戻り値）
  spectrumSheet: p5.Table | null;
  // セロハンの枚数毎のRGB値
  rgbSheet: p5.Table | null;
  // 等色関数の強度分布
  cmfSheet: p5.Table | null;
  // 光源の強度分布
  lightSourceSpectrumSheet: p5.Table | null;

  // csvファイル内のデータを格納する配列
  waveLength: number[];
  intensity: number[][];
  rgb: number[][];
  cmfr: number[];
  cmfg: number[];
  cmfb: number[];
  lightSourceIntensity: number[];

  // DOM要素の参照
  waveRepresentationButton: p5.Element | null;
  cellophaneCountSlider: p5.Element | null;
  cellophaneCountValue: p5.Element | null;
  rButton: p5.Element | null;
  gButton: p5.Element | null;
  bButton: p5.Element | null;
  playPauseButton: p5.Element | null;
  incidentColor: p5.Element | null;
  transmittedColor: p5.Element | null;

  // グラフのインスタンス
  graphChart: Chart | null;
  cmfGraphChart: Chart | null;

  // 光線のインスタンス（R/G/B各色ごと）
  rRays: Ray[];
  gRays: Ray[];
  bRays: Ray[];

  // 光の波の表現方法（"line" | "sphere"）
  waveRepresentation: "line" | "sphere";
  // アニメーションが再生中かどうか
  isRunning: boolean;
  // 赤・緑・青の光線をそれぞれ表示するかどうか
  rIs: boolean;
  gIs: boolean;
  bIs: boolean;
} = {
  spectrumSheet: null,
  rgbSheet: null,
  cmfSheet: null,
  lightSourceSpectrumSheet: null,

  waveLength: [],
  intensity: [],
  rgb: [],
  cmfr: [],
  cmfg: [],
  cmfb: [],
  lightSourceIntensity: [],

  waveRepresentationButton: null,
  cellophaneCountSlider: null,
  cellophaneCountValue: null,
  rButton: null,
  gButton: null,
  bButton: null,
  playPauseButton: null,
  incidentColor: null,
  transmittedColor: null,

  graphChart: null,
  cmfGraphChart: null,

  rRays: [],
  gRays: [],
  bRays: [],

  waveRepresentation: "sphere",
  isRunning: true,
  rIs: true,
  gIs: true,
  bIs: true
};
