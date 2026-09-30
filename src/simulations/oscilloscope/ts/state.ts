export const state = {
  audioStarted: false,
  paused: false,
  displayMode: "waveform",
  mic: null as p5.AudioIn | null,
  fft: null as p5.FFT | null,
  waveform: [] as number[],
  spectrum: [] as number[]
};
