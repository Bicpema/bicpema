import p5 from "p5";
import { state } from "./state.js";
import { bindStartStopControls } from "../../../lib/simulation/bicpema-controls-controller.js";

export const FPS = 30;

/**
 * フレームレートとフォントを設定する。
 * @param p - p5インスタンス
 */
export function settingInit(p: p5) {
  p.frameRate(FPS);
  p.textFont("sans-serif");
}

/**
 * 表示モードの選択要素を取得する。
 * @returns 表示モードの選択要素を含むオブジェクト
 */
export function elementSelectInit() {
  return {
    modeSelect: document.querySelector("#modeSelect")
  };
}

/**
 * DOM要素の位置を初期化する（再配置が必要な要素はないため処理は行わない）。
 */
export function elementPositionInit() {}

/**
 * 音声入力の状態・一時停止状態・表示モード・波形とスペクトルのデータを初期化する。
 */
export function valueInit() {
  state.audioStarted = false;
  state.paused = false;
  state.displayMode = "waveform";
  state.waveform = [];
  state.spectrum = [];
}

/**
 * 開始・停止・再開ボタンと表示モードの選択要素にイベントを登録する。
 * 開始時にはマイク入力とFFTを初期化する。
 * @param p - p5インスタンス
 * @param elements - `elementSelectInit` で取得したDOM要素
 */
export function setupControls(
  p: p5,
  elements: ReturnType<typeof elementSelectInit>
) {
  bindStartStopControls(p, {
    startSelector: "#startButton",
    stopSelector: "#stopButton",
    resetSelector: "#restartButton",
    /** 音声入力を開始し、初回はマイク入力とFFTを生成する。 */
    onStart: () => {
      p.userStartAudio();
      if (!state.mic) {
        state.mic = new p5.AudioIn();
        state.mic.start(() => {
          state.audioStarted = true;
        });
        state.fft = new p5.FFT();
        state.fft.setInput(state.mic);
      }
    },
    /** 表示を一時停止する。 */
    onStop: () => {
      state.paused = true;
    },
    /** 一時停止を解除する。 */
    onReset: () => {
      state.paused = false;
    },
    startAriaLabel: "音の入力開始",
    resetAriaLabel: "再開"
  });
  elements.modeSelect!.addEventListener("change", (event: Event) => {
    state.displayMode = (event.target as HTMLSelectElement).value;
  });
}
