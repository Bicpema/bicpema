import { state } from "./state.js";
import { bindToggleControls } from "../../../ts/bicpema-controls-controller.js";

/**
 * 波長・振幅・波数・角振動数・波の速さを設定する。
 * @param p - p5インスタンス
 */
export function settingInit(p: p5) {
  const wavelength = 200;
  state.A = wavelength / 4;
  state.k = p.TWO_PI / wavelength;
  state.omega = p.TWO_PI / 120;
  state.v = state.omega / state.k;
}

/**
 * スタート／ストップボタンとリセットボタンにイベントを登録する。
 * @param p - p5インスタンス
 */
export function elementSelectInit(p: p5) {
  const { toggleButton } = bindToggleControls(p, {
    toggleSelector: "#moveBtn",
    resetSelector: "#resetBtn",
    /** 再生状態を切り替える。 */
    onToggle: () => toggleMove(toggleButton?.elt),
    /** シミュレーションをリセットする。 */
    onReset: () => resetSim(toggleButton?.elt)
  });
}

/**
 * 反射壁の位置をキャンバス中央に設定し、自由端／固定端の切り替えボタンにイベントを登録する。
 * @param p - p5インスタンス
 */
export function elementPositionInit(p: p5) {
  state.reflectX = p.width / 2;

  const modeBtn = document.getElementById("modeBtn");
  if (modeBtn) {
    /** 自由端／固定端を切り替える。 */
    // oxlint-disable-next-line unicorn/prefer-add-event-listener -- 呼び出しのたびに再実行されるため、代入で単一ハンドラのみを保つ
    modeBtn.onclick = () => toggleMode(modeBtn);
  }
}

/**
 * 時間・波の先端位置・再生状態を初期化する。
 * @param p - p5インスタンス
 */
export function valueInit(p: p5) {
  state.t = 0;
  state.front = 0;
  state.running = false;
}

/**
 * 再生状態を切り替え、スタート／ストップボタンの表示とスタイルを更新する。
 * @param moveBtn - スタート／ストップボタンの要素
 */
function toggleMove(moveBtn: HTMLElement | null | undefined) {
  state.running = !state.running;
  if (!moveBtn) return;
  if (!state.running) {
    moveBtn.textContent = "スタート";
    moveBtn.classList.remove("bg-red-600", "hover:bg-red-500");
    moveBtn.classList.add("bg-blue-600", "hover:bg-blue-500");
  } else {
    moveBtn.textContent = "ストップ";
    moveBtn.classList.remove("bg-blue-600", "hover:bg-blue-500");
    moveBtn.classList.add("bg-red-600", "hover:bg-red-500");
  }
}

/**
 * 反射の条件を自由端と固定端で切り替え、切り替えボタンの表示とスタイルを更新する。
 * @param modeBtn - 自由端／固定端の切り替えボタンの要素
 */
function toggleMode(modeBtn: HTMLElement) {
  state.mode = state.mode === "free" ? "fixed" : "free";
  if (state.mode === "free") {
    modeBtn.textContent = "自由端";
    modeBtn.classList.remove(
      "bg-green-600",
      "hover:bg-green-500",
      "text-white"
    );
    modeBtn.classList.add(
      "bg-amber-500",
      "hover:bg-amber-400",
      "text-neutral-900"
    );
  } else {
    modeBtn.textContent = "固定端";
    modeBtn.classList.remove(
      "bg-amber-500",
      "hover:bg-amber-400",
      "text-neutral-900"
    );
    modeBtn.classList.add("bg-green-600", "hover:bg-green-500", "text-white");
  }
}

/**
 * 時間・波の先端位置・再生状態をリセットし、スタート／ストップボタンをスタート表示に戻す。
 * @param moveBtn - スタート／ストップボタンの要素
 */
function resetSim(moveBtn: HTMLElement | null | undefined) {
  state.t = 0;
  state.front = 0;
  state.running = false;
  if (!moveBtn) return;
  moveBtn.textContent = "スタート";
  moveBtn.classList.remove("bg-red-600", "hover:bg-red-500");
  moveBtn.classList.add("bg-blue-600", "hover:bg-blue-500");
}
