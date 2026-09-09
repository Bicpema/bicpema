// state.jsはシミュレーション全体で共有する状態をまとめたファイルです。

export const state = {
  // CSVから読み込む生データ（p.loadTableの戻り値）
  spectrumSheet: null,
  // セロハンの枚数毎のRGB値
  rgbSheet: null,
  // 等色関数の強度分布
  cmfSheet: null,
  // 光源の強度分布
  lightSourceSpectrumSheet: null,

  // csvファイル内のデータを格納する配列
  waveLength: [],
  intensity: [],
  rgb: [],
  cmfr: [],
  cmfg: [],
  cmfb: [],
  lightSourceIntensity: [],

  // DOM要素の参照
  waveRepresentationButton: null,
  cellophaneCountSlider: null,
  cellophaneCountValue: null,
  rButton: null,
  gButton: null,
  bButton: null,
  playPauseButton: null,
  incidentColor: null,
  transmittedColor: null,

  // グラフのインスタンス
  graphChart: null,
  cmfGraphChart: null,

  // 光線のインスタンス（R/G/B各色ごと）
  rRays: [],
  gRays: [],
  bRays: [],

  // 光の波の表現方法（"line" | "sphere"）
  waveRepresentation: "sphere",
  // アニメーションが再生中かどうか
  isRunning: true,
  // 赤・緑・青の光線をそれぞれ表示するかどうか
  rIs: true,
  gIs: true,
  bIs: true
};
