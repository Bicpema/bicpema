// geometry.ts はレイアウトと当たり判定の純関数群です（p5.js・DOMに依存しません）。

import {
  BOOK_HEIGHT,
  BOOK_WIDTH,
  STACK_CENTER_X,
  DESK_TOP_Y,
  LANE_OFFSET_FIRST,
  LANE_SPACING,
  GRAVITY_LANE_DX,
  type Rect
} from "./constants.js";
import type { Force } from "./physics.js";

/** 線分の座標 */
export interface Segment {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

/**
 * 点が矩形の内側にあるかを判定する（境界を含む）。
 * @param x - 点のX座標
 * @param y - 点のY座標
 * @param rect - 矩形
 * @returns 内側なら true
 */
export function pointInRect(x: number, y: number, rect: Rect): boolean {
  return (
    x >= rect.x && x <= rect.x + rect.w && y >= rect.y && y <= rect.y + rect.h
  );
}

/**
 * 点と線分の最短距離を求める。
 * @param px - 点のX座標
 * @param py - 点のY座標
 * @param seg - 線分
 * @returns 最短距離
 */
export function distanceToSegment(
  px: number,
  py: number,
  seg: Segment
): number {
  const dx = seg.x2 - seg.x1;
  const dy = seg.y2 - seg.y1;
  const lenSq = dx * dx + dy * dy;
  if (lenSq === 0) return Math.hypot(px - seg.x1, py - seg.y1);
  const t = Math.max(
    0,
    Math.min(1, ((px - seg.x1) * dx + (py - seg.y1) * dy) / lenSq)
  );
  return Math.hypot(px - (seg.x1 + t * dx), py - (seg.y1 + t * dy));
}

/**
 * 本 k の下端（接触面）のY座標を返す。
 * @param bookIndex - 本の番号（机側が1）
 * @returns Y座標[px]
 */
export function bookBottomY(bookIndex: number): number {
  return DESK_TOP_Y - (bookIndex - 1) * BOOK_HEIGHT;
}

/**
 * 本 k の矩形を返す。
 * @param bookIndex - 本の番号（机側が1）
 * @returns 矩形
 */
export function bookRect(bookIndex: number): Rect {
  return {
    x: STACK_CENTER_X - BOOK_WIDTH / 2,
    y: bookBottomY(bookIndex) - BOOK_HEIGHT,
    w: BOOK_WIDTH,
    h: BOOK_HEIGHT
  };
}

/**
 * 力の矢印の線分を求める。矢印の始点が作用点、終点が矢印の先端。
 * - 重力: 本の中心から下向き（中心より少し左）
 * - 本が地球を引く力: 本の下端から上向き（中心より少し右）
 * - 垂直抗力: 本の下端（接触面）から上向き（左側のレーン。本ごとに位置をずらす）
 * - 本が下の面を押す力: 本の下端（接触面）から下向き（右側のレーン。本ごとに位置をずらす）
 * @param force - 力
 * @param length - 矢印の長さ[px]
 * @param out - 結果を書き込む線分（毎フレームの生成物を避けるため呼び出し側が用意する）
 * @returns out
 */
export function forceSegment(
  force: Force,
  length: number,
  out: Segment
): Segment {
  const k = force.bookIndex;
  const bottom = bookBottomY(k);
  const laneDx = LANE_OFFSET_FIRST + LANE_SPACING * (k - 1);
  const sign = force.direction === "up" ? -1 : 1;
  let x: number;
  let y: number;
  if (force.id.startsWith("gravity")) {
    x = STACK_CENTER_X - GRAVITY_LANE_DX;
    y = bottom - BOOK_HEIGHT / 2;
  } else if (force.id.startsWith("earth")) {
    x = STACK_CENTER_X + GRAVITY_LANE_DX;
    y = bottom;
  } else if (force.kind === "normal") {
    x = STACK_CENTER_X - laneDx;
    y = bottom;
  } else {
    x = STACK_CENTER_X + laneDx;
    y = bottom;
  }
  out.x1 = x;
  out.y1 = y;
  out.x2 = x;
  out.y2 = y + sign * length;
  return out;
}

/**
 * 力の数値ラベルを置く位置を返す（左側の力は右揃え、右側の力は左揃え）。
 * 同じ本に対する2つのラベルが縦に重ならないよう、本の中心付近と下端付近に分ける。
 * @param force - 力
 * @param out - 結果を書き込む座標
 * @returns out（side は "left" なら右揃えで描く）
 */
export function labelAnchor(
  force: Force,
  out: { x: number; y: number; side: "left" | "right" }
): { x: number; y: number; side: "left" | "right" } {
  const bottom = bookBottomY(force.bookIndex);
  const isLeft = force.kind === "gravity" || force.kind === "normal";
  const isUpperRow =
    force.id.startsWith("gravity") || force.id.startsWith("earth");
  out.side = isLeft ? "left" : "right";
  out.x = STACK_CENTER_X + (isLeft ? -1 : 1) * (BOOK_WIDTH / 2 + 10);
  out.y = isUpperRow ? bottom - BOOK_HEIGHT + 14 : bottom - 12;
  return out;
}
