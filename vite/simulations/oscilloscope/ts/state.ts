// p5.sound(v2)はp5.js本体とは別パッケージのため型定義が提供されておらず、
// 実際に利用するAPIの形だけをここで最小限定義する。
export interface P5AudioIn {
  start(successCallback?: () => void): void;
}

export interface P5FFT {
  setInput(source: P5AudioIn): void;
  waveform(): number[];
  analyze(): number[];
}

export const state = {
  audioStarted: false,
  paused: false,
  displayMode: "waveform",
  mic: null as P5AudioIn | null,
  fft: null as P5FFT | null,
  waveform: [] as number[],
  spectrum: [] as number[]
};
