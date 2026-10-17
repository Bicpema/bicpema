// element-function.ts は仮想DOMのイベントハンドラーとポインター（マウス・タッチ）操作を管理するファイルです。

import type p5 from "p5";
import {
  ARROW_BASE_SCALE,
  ARROW_HIT_RADIUS,
  ARROW_MAX_LENGTH,
  ARROW_MAX_WEIGHT_LENGTH,
  DESK_ZONE,
  DROP_START_OFFSET,
  PALETTE,
  TRASH
} from "./constants.js";
import {
  bookRect,
  distanceToSegment,
  forceSegment,
  pointInRect
} from "./geometry.js";
import {
  DEFAULT_GRAVITY,
  MAX_BOOKS,
  clampBookCount,
  computeArrowScale,
  computeForces,
  type Force
} from "./physics.js";
import { state } from "./state.js";

/**
 * 力の種類が表示対象かを返す。
 * @param force - 力
 * @returns 表示対象なら true
 */
export function isForceVisible(force: Force): boolean {
  if (force.kind === "gravity") return state.showGravity;
  if (force.kind === "normal") return state.showNormal;
  return state.showReaction;
}

/**
 * 冊数・質量・gから力と縮尺を再計算する。変更があったときだけ呼ぶ。
 * 存在しなくなった力の表示値はここで破棄する。
 */
export function recomputeForces(): void {
  state.forces = computeForces(state.bookCount, state.mass, state.gravity);
  state.scale = computeArrowScale(
    state.bookCount,
    state.mass * state.gravity,
    ARROW_BASE_SCALE,
    ARROW_MAX_LENGTH,
    ARROW_MAX_WEIGHT_LENGTH
  );
  const ids = new Set(state.forces.map((f) => f.id));
  for (const key of state.displayed.keys()) {
    if (!ids.has(key)) state.displayed.delete(key);
  }
  if (state.hoverId && !ids.has(state.hoverId)) state.hoverId = null;
  state.dirty = true;
}

/**
 * 本を1冊追加する。上限なら何もしない。
 * @returns 追加できたら true
 */
export function addBook(): boolean {
  if (state.bookCount >= MAX_BOOKS) return false;
  state.bookCount = clampBookCount(state.bookCount + 1);
  // 停止中は落下アニメーションを行わず即時に配置する
  state.drop.index = state.bookCount;
  state.drop.offset = state.isPlaying ? DROP_START_OFFSET : 0;
  recomputeForces();
  return true;
}

/**
 * 本を1冊取り除く。0冊なら何もしない。
 * @returns 取り除けたら true
 */
export function removeBook(): boolean {
  if (state.bookCount <= 0) return false;
  state.bookCount -= 1;
  state.drop.offset = 0;
  recomputeForces();
  return true;
}

/**
 * 仮想座標の点に最も近い（当たり判定内の）表示中の力の id を返す。
 * @param vx - 仮想座標のX
 * @param vy - 仮想座標のY
 * @returns 力の id（なければ null）
 */
export function findForceAt(vx: number, vy: number): string | null {
  let bestId: string | null = null;
  let bestDist = ARROW_HIT_RADIUS;
  for (const f of state.forces) {
    const length = (state.displayed.get(f.id) ?? 0) * state.scale;
    if (isForceVisible(f) && length >= 2) {
      const dist = distanceToSegment(
        vx,
        vy,
        forceSegment(f, length, state.scratchSegment)
      );
      if (dist < bestDist) {
        bestDist = dist;
        bestId = f.id;
      }
    }
  }
  return bestId;
}

/**
 * 仮想座標の点にある本の番号（机側が1）を返す。重なりがなければ 0。
 * @param vx - 仮想座標のX
 * @param vy - 仮想座標のY
 * @returns 本の番号
 */
function findBookAt(vx: number, vy: number): number {
  for (let k = state.bookCount; k >= 1; k--) {
    if (pointInRect(vx, vy, bookRect(k))) return k;
  }
  return 0;
}

/**
 * ポインターの位置に応じて矢印の強調表示とカーソルを更新する。
 * @param p - p5インスタンス
 * @param vx - 仮想座標のX
 * @param vy - 仮想座標のY
 */
export function updateHover(p: p5, vx: number, vy: number): void {
  const id = state.drag ? null : findForceAt(vx, vy);
  if (id !== state.hoverId) {
    state.hoverId = id;
    state.dirty = true;
  }
  if (state.drag) {
    p.cursor("grabbing");
  } else if (id) {
    p.cursor("pointer");
  } else if (
    (state.bookCount < MAX_BOOKS && pointInRect(vx, vy, PALETTE)) ||
    findBookAt(vx, vy) > 0
  ) {
    p.cursor("grab");
  } else {
    p.cursor("default");
  }
}

/**
 * ポインター押下時の処理。矢印 → パレット → スタックの本の順に判定する。
 * @param vx - 仮想座標のX
 * @param vy - 仮想座標のY
 */
export function startDrag(vx: number, vy: number): void {
  const forceId = findForceAt(vx, vy);
  if (forceId) {
    // 矢印をタップ／クリックしたときはペアを強調表示する（タッチにはホバーがないため）
    state.hoverId = forceId;
    state.dirty = true;
    return;
  }
  if (state.bookCount < MAX_BOOKS && pointInRect(vx, vy, PALETTE)) {
    state.drag = {
      source: "palette",
      x: vx,
      y: vy,
      overDesk: false,
      overTrash: false
    };
    state.hoverId = null;
    return;
  }
  if (findBookAt(vx, vy) > 0) {
    // スタックから取り出した時点で上の本は詰める。無効な位置へのドロップでは元に戻す。
    removeBook();
    state.drag = {
      source: "stack",
      x: vx,
      y: vy,
      overDesk: false,
      overTrash: false
    };
    state.hoverId = null;
    return;
  }
  state.hoverId = null;
  state.dirty = true;
}

/**
 * ポインター移動時にドラッグ中の本の位置とドロップ先を更新する。
 * @param vx - 仮想座標のX
 * @param vy - 仮想座標のY
 */
export function moveDrag(vx: number, vy: number): void {
  const drag = state.drag;
  if (!drag) return;
  drag.x = vx;
  drag.y = vy;
  drag.overDesk = pointInRect(vx, vy, DESK_ZONE);
  drag.overTrash = pointInRect(vx, vy, TRASH);
}

/**
 * ポインター解放時にドロップを確定する。
 * パレットの本は机の上なら追加、スタックの本はゴミ箱の上なら削除（取り出し済み）、
 * それ以外の無効な位置では元に戻す。
 */
export function endDrag(): void {
  const drag = state.drag;
  if (!drag) return;
  state.drag = null;
  if (drag.source === "palette") {
    if (drag.overDesk) addBook();
  } else if (!drag.overTrash) {
    state.bookCount = clampBookCount(state.bookCount + 1);
    state.drop.offset = 0;
    recomputeForces();
  }
  state.dirty = true;
}

/** 再生・停止を切り替える。停止すると進行中のアニメーションは即時に完了する。 */
export function onPlayPause(): void {
  state.isPlaying = !state.isPlaying;
  state.playPauseButton?.html(state.isPlaying ? "⏸ 一時停止" : "▶ 再生");
  if (!state.isPlaying) state.drop.offset = 0;
  state.dirty = true;
}

/** 重力加速度の入力を反映する。 */
export function onGravityChange(): void {
  const value = Number(state.gravityInput?.value());
  state.gravity = Number.isFinite(value) ? value : DEFAULT_GRAVITY;
  state.gravityDisplay?.html(state.gravity.toFixed(1));
  recomputeForces();
}

/**
 * チェックボックスの状態を返す。
 * @param el - チェックボックス要素
 * @param fallback - 要素がないときの値
 * @returns チェックされていれば true
 */
function isChecked(el: p5.Element | null, fallback: boolean): boolean {
  return el ? (el.elt as HTMLInputElement).checked : fallback;
}

/** 表示切り替えのチェックボックスを反映する。 */
export function onDisplayChange(): void {
  state.showGravity = isChecked(state.showGravityCheckBox, true);
  state.showNormal = isChecked(state.showNormalCheckBox, true);
  state.showReaction = isChecked(state.showReactionCheckBox, true);
  state.showNumbers = isChecked(state.showNumbersCheckBox, true);
  const hovered = state.forces.find((f) => f.id === state.hoverId);
  if (hovered && !isForceVisible(hovered)) state.hoverId = null;
  state.dirty = true;
}

/** 本を1冊・g=9.8に戻す（表示設定は変更しない）。 */
export function onReset(): void {
  state.drag = null;
  state.bookCount = 1;
  state.gravity = DEFAULT_GRAVITY;
  state.hoverId = null;
  state.drop.offset = 0;
  state.displayed.clear();
  state.gravityInput?.value(String(DEFAULT_GRAVITY));
  state.gravityDisplay?.html(DEFAULT_GRAVITY.toFixed(1));
  recomputeForces();
}
