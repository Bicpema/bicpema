import { state } from "./state.js";
import {
  mapIndexToX,
  mapWaveformValueToY,
  mapSpectrumValueToY,
} from "./physics.js";

const CANVAS_WIDTH = 1000;
const GRID_SIZE = 50;

export function updateAudioData() {
  if (!state.audioStarted || state.paused) return;

  if (state.displayMode === "waveform") {
    state.waveform = state.fft.waveform();
  } else {
    state.spectrum = state.fft.analyze();
  }
}

export function drawOscilloscope(p) {
  const scale = p.width / CANVAS_WIDTH;
  p.push();
  p.scale(scale);
  p.background(18, 154, 169);
  drawGrid(p);
  drawMessage(p);
  drawSignal(p);
  p.pop();
}

function drawGrid(p) {
  p.stroke(0, 55);
  p.strokeWeight(1.5);
  for (let x = 0; x <= CANVAS_WIDTH; x += GRID_SIZE) {
    p.line(x, 0, x, p.height / (p.width / CANVAS_WIDTH));
  }
  for (let y = 0; y <= p.height / (p.width / CANVAS_WIDTH); y += GRID_SIZE) {
    p.line(0, y, CANVAS_WIDTH, y);
  }
}

function drawMessage(p) {
  p.noStroke();
  p.fill(0);
  p.textAlign(p.LEFT, p.TOP);
  p.textSize(16);
  p.text(
    state.audioStarted
      ? "マイク入力を可視化しています"
      : "左下の「音の入力開始」をクリックしてください",
    24,
    20
  );
}

function drawSignal(p) {
  const values =
    state.displayMode === "waveform" ? state.waveform : state.spectrum;
  if (!values.length) return;

  const height = p.height / (p.width / CANVAS_WIDTH);
  p.noFill();
  p.stroke(163, 254, 245);
  p.strokeWeight(3);
  p.beginShape();
  values.forEach((value, index) => {
    const x = mapIndexToX(index, values.length, CANVAS_WIDTH);
    const y =
      state.displayMode === "waveform"
        ? mapWaveformValueToY(value, height)
        : mapSpectrumValueToY(value, height);
    p.vertex(x, y);
  });
  p.endShape();
}
