// element-function.js はドラッグ操作と UI イベントハンドラーを管理するファイルです。

import {
  state,
  V_W,
  PANEL_DIVIDER_X,
  CEILING_Y,
  ANCHOR_RADIUS,
  RING_RADIUS,
  INIT_ANCHOR_A,
  INIT_ANCHOR_B,
  INIT_RING,
  INIT_WEIGHT,
} from "./state.js";

// ────────────────────────────────────────────
// ドラッグ操作
// ────────────────────────────────────────────

/**
 * マウス／タッチ開始時にドラッグ対象を決定する。
 * @param {number} vmx 仮想座標系の X（mouseX / width * V_W）
 * @param {number} vmy 仮想座標系の Y（mouseY / width * V_W）
 */
export function startDrag(vmx, vmy) {
  const { anchorA, anchorB, ring } = state;

  // リングを最優先にチェック（前面にある）
  if (Math.hypot(vmx - ring.x, vmy - ring.y) <= RING_RADIUS + 6) {
    state.dragging = "ring";
    state.dragOffsetX = ring.x - vmx;
    state.dragOffsetY = ring.y - vmy;
    return;
  }

  if (Math.hypot(vmx - anchorA.x, vmy - anchorA.y) <= ANCHOR_RADIUS + 6) {
    state.dragging = "anchorA";
    state.dragOffsetX = anchorA.x - vmx;
    state.dragOffsetY = anchorA.y - vmy;
    return;
  }

  if (Math.hypot(vmx - anchorB.x, vmy - anchorB.y) <= ANCHOR_RADIUS + 6) {
    state.dragging = "anchorB";
    state.dragOffsetX = anchorB.x - vmx;
    state.dragOffsetY = anchorB.y - vmy;
    return;
  }
}

/**
 * ドラッグ中の位置を更新する。
 * @param {number} vmx 仮想座標系の X
 * @param {number} vmy 仮想座標系の Y
 */
export function updateDrag(vmx, vmy) {
  const nx = vmx + state.dragOffsetX;
  const ny = vmy + state.dragOffsetY;

  if (state.dragging === "anchorA") {
    state.anchorA.x = Math.max(20, Math.min(PANEL_DIVIDER_X - 20, nx));
    state.anchorA.y = Math.max(CEILING_Y, Math.min(240, ny));
  } else if (state.dragging === "anchorB") {
    state.anchorB.x = Math.max(20, Math.min(PANEL_DIVIDER_X - 20, nx));
    state.anchorB.y = Math.max(CEILING_Y, Math.min(240, ny));
  } else if (state.dragging === "ring") {
    state.ring.x = Math.max(30, Math.min(PANEL_DIVIDER_X - 30, nx));
    state.ring.y = Math.max(180, Math.min(400, ny));
  }
}

/**
 * ドラッグを終了する。
 */
export function stopDrag() {
  state.dragging = null;
}

// ────────────────────────────────────────────
// UI イベントハンドラー
// ────────────────────────────────────────────

/**
 * 重さスライダーが変更されたときの処理。
 */
export function onWeightChange() {
  const w = parseInt(state.weightInput.value());
  state.weight = w;
  state.weightDisplay.html(`${w}`);
}

/**
 * リセットボタンが押されたときの処理。
 */
export function onReset() {
  state.anchorA = { ...INIT_ANCHOR_A };
  state.anchorB = { ...INIT_ANCHOR_B };
  state.ring = { ...INIT_RING };
  state.weight = INIT_WEIGHT;
  state.weightInput.value(INIT_WEIGHT);
  state.weightDisplay.html(`${INIT_WEIGHT}`);
  state.dragging = null;
}

/**
 * 設定モーダルを開閉する。
 */
export function onToggleModal() {
  const display = state.settingsModal.style("display");
  state.settingsModal.style("display", display === "none" ? "block" : "none");
}

/**
 * 設定モーダルを閉じる。
 */
export function onCloseModal() {
  state.settingsModal.style("display", "none");
}
