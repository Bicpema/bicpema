import { drawGrid } from "../../../ts/components/grid.js";
import { CoordinateSystem } from "../../../ts/components/coordinate-system.js";
import { state } from "./state.js";
import {
  mapIndexToX,
  mapWaveformValueToY,
  mapSpectrumValueToY
} from "./physics.js";

const CANVAS_WIDTH = 1000;
const GRID_SIZE = 50;

/**
 * 音声入力が有効な場合に、表示モードに応じて波形またはスペクトルのデータを更新します。
 */
export function updateAudioData() {
  if (!state.audioStarted || state.paused || !state.fft) return;

  if (state.displayMode === "waveform") {
    state.waveform = state.fft.waveform();
  } else {
    state.spectrum = state.fft.analyze();
  }
}

/**
 * オシロスコープの画面（背景・グリッド・メッセージ・信号）を描画します。
 * @param p - p5インスタンス
 */
export function drawOscilloscope(p: p5) {
  const scale = p.width / CANVAS_WIDTH;
  p.push();
  p.scale(scale);
  p.background(18, 154, 169);
  drawBackgroundGrid(p);
  drawMessage(p);
  drawSignal(p);
  p.pop();
}

/** グリッドの座標系（原点は画面左上、スケールは等倍でY軸は画面と同じ向き） */
const GRID_COORDINATE_SYSTEM = new CoordinateSystem({ flipY: false });

/**
 * 画面のグリッド線を描画します。
 * @param p - p5インスタンス
 */
function drawBackgroundGrid(p: p5) {
  drawGrid(p, GRID_COORDINATE_SYSTEM, {
    stepX: GRID_SIZE,
    stepY: GRID_SIZE,
    color: p.color(0, 55),
    weight: 1.5,
    bounds: {
      left: 0,
      top: 0,
      right: CANVAS_WIDTH,
      bottom: p.height / (p.width / CANVAS_WIDTH)
    }
  });
}

/**
 * 音声入力の状態に応じた案内メッセージを描画します。
 * @param p - p5インスタンス
 */
function drawMessage(p: p5) {
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

/**
 * 波形またはスペクトルの信号を折れ線で描画します。
 * @param p - p5インスタンス
 */
function drawSignal(p: p5) {
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
