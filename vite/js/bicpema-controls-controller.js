/**
 * bicpema-controls-controller
 *
 * 再生・停止・リセットボタンのDOM要素へのバインディングを共通化するユーティリティ。
 * シミュレーションごとに再実装されがちだったaria-labelの付与とイベント登録を
 * 一箇所にまとめ、既存の見た目（Tailwindクラス）や状態管理（stateオブジェクト）は
 * 変更しないまま利用できるようにする。
 *
 * 対応する既存パターンは2種類:
 * - start/stopボタンが分かれているパターン（bindStartStopControls）
 * - 1つのボタンで開始/一時停止をトグルするパターン（bindToggleControls）
 */

const DEFAULT_ARIA_LABELS = {
  start: "再生",
  stop: "一時停止",
  toggle: "再生・一時停止",
  reset: "リセット",
};

/**
 * 要素にaria-labelが未設定の場合のみ既定値を設定する。
 * 既にaria-labelが指定されている要素（シミュレーション固有の文言）は上書きしない。
 * @param {*} element p.select()で取得したp5.Element（nullの場合は何もしない）
 * @param {string} label 既定のaria-label
 */
function ensureAriaLabel(element, label) {
  const node = element?.elt;
  if (!node || node.hasAttribute("aria-label")) return;
  node.setAttribute("aria-label", label);
}

/**
 * start/stopボタンが分かれているシミュレーション向けの共通バインディング。
 * @param {*} p p5インスタンス
 * @param {object} options
 * @param {string} options.startSelector 再生ボタンのCSSセレクタ
 * @param {string} options.stopSelector 停止ボタンのCSSセレクタ
 * @param {string} options.resetSelector リセットボタンのCSSセレクタ
 * @param {() => void} options.onStart 再生ボタン押下時の処理
 * @param {() => void} options.onStop 停止ボタン押下時の処理
 * @param {() => void} options.onReset リセットボタン押下時の処理
 * @param {string} [options.startAriaLabel] 再生ボタンのaria-label（未指定時は既定値）
 * @param {string} [options.stopAriaLabel] 停止ボタンのaria-label（未指定時は既定値）
 * @param {string} [options.resetAriaLabel] リセットボタンのaria-label（未指定時は既定値）
 * @returns {{startButton: *, stopButton: *, resetButton: *}} p.select()で取得した各ボタン要素
 */
export function bindStartStopControls(
  p,
  {
    startSelector,
    stopSelector,
    resetSelector,
    onStart,
    onStop,
    onReset,
    startAriaLabel,
    stopAriaLabel,
    resetAriaLabel,
  }
) {
  const startButton = p.select(startSelector);
  const stopButton = p.select(stopSelector);
  const resetButton = p.select(resetSelector);

  ensureAriaLabel(startButton, startAriaLabel ?? DEFAULT_ARIA_LABELS.start);
  ensureAriaLabel(stopButton, stopAriaLabel ?? DEFAULT_ARIA_LABELS.stop);
  ensureAriaLabel(resetButton, resetAriaLabel ?? DEFAULT_ARIA_LABELS.reset);

  startButton?.mousePressed(onStart);
  stopButton?.mousePressed(onStop);
  resetButton?.mousePressed(onReset);

  return { startButton, stopButton, resetButton };
}

/**
 * 1つのボタンで開始/一時停止をトグルするシミュレーション向けの共通バインディング。
 * @param {*} p p5インスタンス
 * @param {object} options
 * @param {string} options.toggleSelector 再生/一時停止トグルボタンのCSSセレクタ
 * @param {string} options.resetSelector リセットボタンのCSSセレクタ
 * @param {() => void} options.onToggle トグルボタン押下時の処理
 * @param {() => void} options.onReset リセットボタン押下時の処理
 * @param {string} [options.toggleAriaLabel] トグルボタンのaria-label（未指定時は既定値）
 * @param {string} [options.resetAriaLabel] リセットボタンのaria-label（未指定時は既定値）
 * @returns {{toggleButton: *, resetButton: *}} p.select()で取得した各ボタン要素
 */
export function bindToggleControls(
  p,
  {
    toggleSelector,
    resetSelector,
    onToggle,
    onReset,
    toggleAriaLabel,
    resetAriaLabel,
  }
) {
  const toggleButton = p.select(toggleSelector);
  const resetButton = p.select(resetSelector);

  ensureAriaLabel(toggleButton, toggleAriaLabel ?? DEFAULT_ARIA_LABELS.toggle);
  ensureAriaLabel(resetButton, resetAriaLabel ?? DEFAULT_ARIA_LABELS.reset);

  toggleButton?.mousePressed(onToggle);
  resetButton?.mousePressed(onReset);

  return { toggleButton, resetButton };
}
