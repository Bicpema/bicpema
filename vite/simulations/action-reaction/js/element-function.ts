// element-function.ts はドラッグ操作（本の追加・削除）とUIコントロールの
// イベントハンドラーを管理するファイルです。

import { state, PALETTE_RECT, DEFAULT_GRAVITY, DEFAULT_MASS } from "./state.js";
import {
  isPointInRect,
  isOverDesk,
  getTopBookRect,
  recalcTargets,
  slotCenterY
} from "./logic.js";
import { MAX_BOOKS, DRAG_HIT_MARGIN, NOTICE_DURATION_MS } from "./constants.js";

/**
 * 画面上部に一時的な案内メッセージを表示する。
 */
function showNotice(text: string): void {
  state.notice = { text, until: performance.now() + NOTICE_DURATION_MS };
}

// ────────────────────────────────────────────
// ドラッグ操作（本の追加・削除）
// ────────────────────────────────────────────

/**
 * マウス／タッチ開始時にドラッグ対象を決定する。
 * パレット上であれば新規追加のドラッグ、スタック最上段の本の上であれば
 * その本を取り除くためのドラッグを開始する（スタック構造のため、
 * 取り除けるのは常に最上段の本のみ）。
 * @param vmx 仮想座標系のX（mouseX / width * V_W）
 * @param vmy 仮想座標系のY（mouseY / width * V_W）
 */
export function startDrag(vmx: number, vmy: number): void {
  const topRect = getTopBookRect();
  if (topRect && isPointInRect(vmx, vmy, topRect, DRAG_HIT_MARGIN)) {
    state.dragging = "top";
    state.dragX = vmx;
    state.dragY = vmy;
    return;
  }

  if (isPointInRect(vmx, vmy, PALETTE_RECT, DRAG_HIT_MARGIN)) {
    if (state.books.length >= MAX_BOOKS) {
      showNotice(`本は${MAX_BOOKS}冊までしか積み上げられません`);
      return;
    }
    state.dragging = "new";
    state.dragX = vmx;
    state.dragY = vmy;
  }
}

/**
 * ドラッグ中の位置を更新する。
 */
export function updateDrag(vmx: number, vmy: number): void {
  if (!state.dragging) return;
  state.dragX = vmx;
  state.dragY = vmy;
}

/**
 * ドラッグを終了し、ドロップ位置に応じて本の追加・削除・キャンセルを行う。
 */
export function stopDrag(): void {
  const kind = state.dragging;
  if (kind === "new") {
    if (
      isOverDesk(state.dragX, state.dragY) &&
      state.books.length < MAX_BOOKS
    ) {
      addBook(state.dragX, state.dragY);
    }
  } else if (kind === "top") {
    if (!isOverDesk(state.dragX, state.dragY)) {
      removeTopBook();
    }
    // 机の上に戻された場合は何もしない（スタックの位置へ自動的に収まる）
  }
  state.dragging = null;
}

/**
 * スタックの一番上に新しい本を1冊追加する。
 * ドロップした位置から目標位置へアニメーションで落ちるよう、
 * currentYはドロップ位置から開始する。
 */
function addBook(dropX: number, dropY: number): void {
  const index = state.books.length;
  state.books.push({
    id: state.nextBookId,
    currentY: dropY,
    targetY: slotCenterY(index)
  });
  state.nextBookId += 1;
  recalcTargets();
}

/**
 * スタックの一番上の本を1冊取り除く。
 */
function removeTopBook(): void {
  if (state.books.length === 0) return;
  state.books.pop();
  recalcTargets();
}

// ────────────────────────────────────────────
// UIイベントハンドラー
// ────────────────────────────────────────────

/** 重力加速度の入力値を有効範囲にクランプする */
export function clampGravity(value: number): number {
  if (Number.isNaN(value)) return DEFAULT_GRAVITY;
  return Math.min(20, Math.max(1, value));
}

/** 質量の入力値を有効範囲にクランプする */
export function clampMass(value: number): number {
  if (Number.isNaN(value)) return DEFAULT_MASS;
  return Math.min(3, Math.max(0.2, value));
}

export function onGravityChange(): void {
  if (!state.gravityInput || !state.gravityDisplay) return;
  const value = clampGravity(parseFloat(state.gravityInput.value() as string));
  state.gravity = value;
  state.gravityDisplay.html(value.toFixed(1));
}

export function onMassChange(): void {
  if (!state.massInput || !state.massDisplay) return;
  const value = clampMass(parseFloat(state.massInput.value() as string));
  state.mass = value;
  state.massDisplay.html(value.toFixed(1));
}

export function onGravityToggle(): void {
  if (!state.gravityCheckBox) return;
  state.showGravity = Boolean(state.gravityCheckBox.elt.checked);
}

export function onNormalToggle(): void {
  if (!state.normalCheckBox) return;
  state.showNormal = Boolean(state.normalCheckBox.elt.checked);
}

export function onEarthReactionToggle(): void {
  if (!state.earthReactionCheckBox) return;
  state.showEarthReaction = Boolean(state.earthReactionCheckBox.elt.checked);
}

export function onNormalReactionToggle(): void {
  if (!state.normalReactionCheckBox) return;
  state.showNormalReaction = Boolean(state.normalReactionCheckBox.elt.checked);
}

/** 「本をすべて取り除く」ボタン押下時の処理 */
export function onClearBooks(): void {
  state.books = [];
  state.dragging = null;
}

/** 再生・一時停止トグルボタン押下時の処理 */
export function onPlayPause(): void {
  state.isPlaying = !state.isPlaying;
  if (!state.playPauseButton) return;
  state.playPauseButton.html(state.isPlaying ? "⏸ 一時停止" : "▶ 再生");
}

/**
 * リセットボタン押下時の処理。
 * 積み上げた本をすべて取り除き、表示設定・パラメータ・再生状態を初期値に戻す。
 */
export function onReset(): void {
  state.books = [];
  state.dragging = null;
  state.notice = null;

  state.showGravity = true;
  state.showNormal = true;
  state.showEarthReaction = true;
  state.showNormalReaction = true;
  if (state.gravityCheckBox) state.gravityCheckBox.elt.checked = true;
  if (state.normalCheckBox) state.normalCheckBox.elt.checked = true;
  if (state.earthReactionCheckBox) {
    state.earthReactionCheckBox.elt.checked = true;
  }
  if (state.normalReactionCheckBox) {
    state.normalReactionCheckBox.elt.checked = true;
  }

  state.gravity = DEFAULT_GRAVITY;
  state.mass = DEFAULT_MASS;
  state.gravityInput?.value(DEFAULT_GRAVITY);
  state.massInput?.value(DEFAULT_MASS);
  state.gravityDisplay?.html(DEFAULT_GRAVITY.toFixed(1));
  state.massDisplay?.html(DEFAULT_MASS.toFixed(1));

  if (!state.isPlaying) {
    state.isPlaying = true;
    state.playPauseButton?.html("⏸ 一時停止");
  }
}
