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
  reset: "リセット"
};

/**
 * 要素にaria-labelが未設定の場合のみ既定値を設定する。
 * 既にaria-labelが指定されている要素（シミュレーション固有の文言）は上書きしない。
 * @param element p.select()で取得したp5.Element（nullの場合は何もしない）
 * @param label 既定のaria-label
 */
function ensureAriaLabel(element: any, label: string): void {
  const node = element?.elt;
  if (!node || node.hasAttribute("aria-label")) return;
  node.setAttribute("aria-label", label);
}

/**
 * 要素の"click"イベントにハンドラを登録する。
 * p5.Element.mousePressed()は内部的に"mousedown"のみをバインドし、
 * キーボード操作（Tab移動 → Enter/Space）で発火する"click"イベントには
 * 反応しないため、あえて素のaddEventListenerを使用してキーボード操作にも対応する。
 * @param element p.select()で取得したp5.Element（nullの場合は何もしない）
 * @param handler クリック時の処理
 */
function bindClick(element: any, handler: () => void): void {
  element?.elt?.addEventListener("click", handler);
}

interface StartStopControlsOptions {
  /** 再生ボタンのCSSセレクタ */
  startSelector: string;
  /** 停止ボタンのCSSセレクタ */
  stopSelector: string;
  /** リセットボタンのCSSセレクタ */
  resetSelector: string;
  /** 再生ボタン押下時の処理 */
  onStart: () => void;
  /** 停止ボタン押下時の処理 */
  onStop: () => void;
  /** リセットボタン押下時の処理 */
  onReset: () => void;
  /** 再生ボタンのaria-label（未指定時は既定値） */
  startAriaLabel?: string;
  /** 停止ボタンのaria-label（未指定時は既定値） */
  stopAriaLabel?: string;
  /** リセットボタンのaria-label（未指定時は既定値） */
  resetAriaLabel?: string;
}

/**
 * start/stopボタンが分かれているシミュレーション向けの共通バインディング。
 * @param p p5インスタンス
 * @returns p.select()で取得した各ボタン要素
 */
export function bindStartStopControls(
  p: any,
  {
    startSelector,
    stopSelector,
    resetSelector,
    onStart,
    onStop,
    onReset,
    startAriaLabel,
    stopAriaLabel,
    resetAriaLabel
  }: StartStopControlsOptions
): { startButton: any; stopButton: any; resetButton: any } {
  const startButton = p.select(startSelector);
  const stopButton = p.select(stopSelector);
  const resetButton = p.select(resetSelector);

  ensureAriaLabel(startButton, startAriaLabel ?? DEFAULT_ARIA_LABELS.start);
  ensureAriaLabel(stopButton, stopAriaLabel ?? DEFAULT_ARIA_LABELS.stop);
  ensureAriaLabel(resetButton, resetAriaLabel ?? DEFAULT_ARIA_LABELS.reset);

  bindClick(startButton, onStart);
  bindClick(stopButton, onStop);
  bindClick(resetButton, onReset);

  return { startButton, stopButton, resetButton };
}

interface ToggleControlsOptions {
  /** 再生/一時停止トグルボタンのCSSセレクタ */
  toggleSelector: string;
  /** リセットボタンのCSSセレクタ */
  resetSelector: string;
  /** トグルボタン押下時の処理 */
  onToggle: () => void;
  /** リセットボタン押下時の処理 */
  onReset: () => void;
  /**
   * トグルボタンのaria-label。
   * トグルボタンは開始/一時停止/再開などクリックのたびに表示テキストが変わり、
   * それ自体がaccessible nameとして機能するため既定値は設定しない。
   * アイコンのみでテキストが変化しない等、明示的に固定のaria-labelが必要な
   * 場合にのみ指定すること。
   */
  toggleAriaLabel?: string;
  /** リセットボタンのaria-label（未指定時は既定値） */
  resetAriaLabel?: string;
}

/**
 * 1つのボタンで開始/一時停止をトグルするシミュレーション向けの共通バインディング。
 * @param p p5インスタンス
 * @returns p.select()で取得した各ボタン要素
 */
export function bindToggleControls(
  p: any,
  {
    toggleSelector,
    resetSelector,
    onToggle,
    onReset,
    toggleAriaLabel,
    resetAriaLabel
  }: ToggleControlsOptions
): { toggleButton: any; resetButton: any } {
  const toggleButton = p.select(toggleSelector);
  const resetButton = p.select(resetSelector);

  if (toggleAriaLabel) ensureAriaLabel(toggleButton, toggleAriaLabel);
  ensureAriaLabel(resetButton, resetAriaLabel ?? DEFAULT_ARIA_LABELS.reset);

  bindClick(toggleButton, onToggle);
  bindClick(resetButton, onReset);

  return { toggleButton, resetButton };
}
