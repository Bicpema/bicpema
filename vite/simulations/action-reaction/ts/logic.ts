// logic.ts はシミュレーションの描画とアニメーション更新を定義するファイルです。力の計算は physics.ts にあります。

import type p5 from "p5";
import { drawArrow } from "../../../ts/components/arrow.js";
import { drawDashedLine } from "../../../ts/components/dashed-line.js";
import {
  ANIMATION_EPSILON,
  ANIMATION_TIME_CONSTANT,
  ARROW_HEAD_SIZE,
  ARROW_WEIGHT,
  ARROW_WEIGHT_HIGHLIGHT,
  BACKGROUND_GRAY,
  BOOK_HEIGHT,
  BOOK_WIDTH,
  DASH_GAP,
  DASH_LENGTH,
  DESK_LEG_HEIGHT,
  DESK_THICKNESS,
  DESK_TOP_Y,
  DESK_WIDTH,
  DESK_ZONE,
  LABEL_FONT_SIZE,
  LEGEND_FONT_SIZE,
  PALETTE,
  STACK_CENTER_X,
  TRASH,
  V_W
} from "./constants.js";
import { bookRect, forceSegment, labelAnchor } from "./geometry.js";
import { isForceVisible } from "./element-function.js";
import { MAX_BOOKS, forceName, formatNewton, type Force } from "./physics.js";
import { state } from "./state.js";

/** 本の表紙の色（冊数に応じて繰り返す） */
const BOOK_COLORS: readonly (readonly [number, number, number])[] = [
  [240, 228, 160],
  [190, 220, 200],
  [225, 195, 215],
  [200, 215, 240],
  [245, 210, 170]
];

/** ラベル位置の計算用の一時オブジェクト（毎フレームの生成物を避ける） */
const labelScratch = { x: 0, y: 0, side: "left" as "left" | "right" };

/**
 * 表示中の力の大きさと落下アニメーションを目標値へ近づける。
 * 停止中は即時に目標値へ揃える（アニメーションを止める）。
 * @param p - p5インスタンス
 * @returns 今回の更新で値が変化したら true（次のフレームも描画が必要）
 */
export function updateAnimation(p: p5): boolean {
  const ratio = state.isPlaying
    ? 1 - Math.exp(-Math.min(p.deltaTime, 100) / ANIMATION_TIME_CONSTANT)
    : 1;
  let changed = false;
  for (const f of state.forces) {
    const current = state.displayed.get(f.id) ?? 0;
    const diff = f.magnitude - current;
    const next =
      Math.abs(diff) < ANIMATION_EPSILON ? f.magnitude : current + diff * ratio;
    if (next !== current) {
      state.displayed.set(f.id, next);
      changed = true;
    }
  }
  if (state.drop.offset !== 0) {
    const next = state.drop.offset * (1 - ratio);
    state.drop.offset = Math.abs(next) < 0.5 ? 0 : next;
    changed = true;
  }
  return changed;
}

/**
 * 破線の矢印を描画する。矢印の頭は実線で描く。
 * @param p - p5インスタンス
 * @param x1 - 始点のX座標
 * @param y1 - 始点のY座標
 * @param x2 - 終点のX座標
 * @param y2 - 終点のY座標
 * @param col - 色
 * @param weight - 線の太さ
 */
function drawDashedArrow(
  p: p5,
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  col: p5.Color,
  weight: number
): void {
  const len = Math.hypot(x2 - x1, y2 - y1);
  const style = { weight, headSize: ARROW_HEAD_SIZE, headWidthDivisor: 2 };
  if (len <= ARROW_HEAD_SIZE) {
    drawArrow(p, x1, y1, x2, y2, col, style);
    return;
  }
  const ux = (x2 - x1) / len;
  const uy = (y2 - y1) / len;
  const baseX = x2 - ux * ARROW_HEAD_SIZE;
  const baseY = y2 - uy * ARROW_HEAD_SIZE;
  drawDashedLine(p, x1, y1, baseX, baseY, col, {
    weight,
    dashLength: DASH_LENGTH,
    gapLength: DASH_GAP
  });
  drawArrow(p, baseX, baseY, x2, y2, col, style);
}

/**
 * 机を描画する。
 * @param p - p5インスタンス
 */
function drawDesk(p: p5): void {
  const left = STACK_CENTER_X - DESK_WIDTH / 2;
  p.push();
  p.noStroke();
  p.fill(150, 105, 70);
  p.rect(left + 14, DESK_TOP_Y + DESK_THICKNESS, 22, DESK_LEG_HEIGHT);
  p.rect(
    left + DESK_WIDTH - 36,
    DESK_TOP_Y + DESK_THICKNESS,
    22,
    DESK_LEG_HEIGHT
  );
  p.fill(185, 135, 90);
  p.stroke(110, 75, 45);
  p.strokeWeight(2);
  p.rect(left, DESK_TOP_Y, DESK_WIDTH, DESK_THICKNESS, 4);
  p.pop();
}

/**
 * 本を1冊描画する。
 * @param p - p5インスタンス
 * @param x - 左上のX座標
 * @param y - 左上のY座標
 * @param colorIndex - 表紙の色の番号
 * @param label - 本に書く文字（空なら書かない）
 * @param alpha - 不透明度（0〜255）
 */
function drawBook(
  p: p5,
  x: number,
  y: number,
  colorIndex: number,
  label: string,
  alpha: number
): void {
  const [r, g, b] = BOOK_COLORS[colorIndex % BOOK_COLORS.length];
  p.push();
  p.fill(r, g, b, alpha);
  p.stroke(70, 60, 50, alpha);
  p.strokeWeight(2);
  p.rect(x, y, BOOK_WIDTH, BOOK_HEIGHT, 3);
  p.line(x + 8, y + 1, x + 8, y + BOOK_HEIGHT - 1);
  if (label) {
    p.noStroke();
    p.fill(60, 50, 40, alpha);
    p.textSize(LABEL_FONT_SIZE);
    p.textAlign(p.CENTER, p.CENTER);
    p.text(label, x + BOOK_WIDTH / 2, y + BOOK_HEIGHT / 2);
  }
  p.pop();
}

/**
 * スタックの本をすべて描画する。新しく置いた本は上から落ちてくる。
 * @param p - p5インスタンス
 */
function drawBooks(p: p5): void {
  for (let k = 1; k <= state.bookCount; k++) {
    const rect = bookRect(k);
    const offset = k === state.drop.index ? state.drop.offset : 0;
    drawBook(p, rect.x, rect.y - offset, k - 1, `本${k}`, 255);
  }
}

/**
 * 力の矢印・作用点・ラベルを1本分描画する。
 * @param p - p5インスタンス
 * @param force - 力
 * @param highlighted - 強調表示するか
 * @param dimmed - 他の力を強調している間の薄い表示にするか
 */
function drawForce(
  p: p5,
  force: Force,
  highlighted: boolean,
  dimmed: boolean
): void {
  const colors = state.colors;
  if (!colors) return;
  const length = (state.displayed.get(force.id) ?? 0) * state.scale;
  if (length < 2) return;

  const isReaction = force.kind === "reaction";
  let col = isReaction ? colors.reaction : colors.balance;
  if (dimmed) col = isReaction ? colors.reactionDim : colors.balanceDim;
  const weight = highlighted ? ARROW_WEIGHT_HIGHLIGHT : ARROW_WEIGHT;
  const seg = forceSegment(force, length, state.scratchSegment);

  if (isReaction) {
    drawDashedArrow(p, seg.x1, seg.y1, seg.x2, seg.y2, col, weight);
  } else {
    drawArrow(p, seg.x1, seg.y1, seg.x2, seg.y2, col, {
      weight,
      headSize: ARROW_HEAD_SIZE,
      headWidthDivisor: 2
    });
  }

  p.push();
  p.noStroke();
  p.fill(col);
  p.circle(seg.x1, seg.y1, highlighted ? 9 : 6);

  const anchor = labelAnchor(force, labelScratch);
  const text = state.showNumbers
    ? `${forceName(force)} ${formatNewton(force.magnitude)}`
    : forceName(force);
  p.textSize(LABEL_FONT_SIZE);
  p.textStyle(highlighted ? p.BOLD : p.NORMAL);
  p.textAlign(anchor.side === "left" ? p.RIGHT : p.LEFT, p.CENTER);
  p.text(text, anchor.x, anchor.y);
  p.pop();
}

/**
 * すべての力を描画する。ホバー中の力とそのペアは強調し、他は薄くする。
 * @param p - p5インスタンス
 */
function drawForces(p: p5): void {
  const hover = state.forces.find((f) => f.id === state.hoverId);
  const hoverPairId = hover?.pairId;
  for (const f of state.forces) {
    if (isForceVisible(f)) {
      const highlighted =
        hover !== undefined && (f.id === hover.id || f.id === hoverPairId);
      drawForce(p, f, highlighted, hover !== undefined && !highlighted);
    }
  }
}

/**
 * 角丸の枠とタイトルを持つ領域（パレット・ゴミ箱）を描画する。
 * @param p - p5インスタンス
 * @param rect - 領域
 * @param title - 見出し
 * @param active - 強調表示するか
 * @param strong - さらに強く強調するか（ポインターが重なっているとき）
 * @param disabled - 無効表示にするか
 */
function drawPanelFrame(
  p: p5,
  rect: { x: number; y: number; w: number; h: number },
  title: string,
  active: boolean,
  strong: boolean,
  disabled: boolean
): void {
  p.push();
  if (disabled) {
    p.fill(215);
    p.stroke(170);
  } else if (strong) {
    p.fill(0, 158, 115, 90);
    p.stroke(0, 158, 115);
  } else if (active) {
    p.fill(0, 158, 115, 35);
    p.stroke(0, 158, 115);
  } else {
    p.fill(250);
    p.stroke(120);
  }
  p.strokeWeight(active ? 3 : 2);
  p.rect(rect.x, rect.y, rect.w, rect.h, 8);
  p.noStroke();
  p.fill(disabled ? 150 : 50);
  p.textSize(LEGEND_FONT_SIZE);
  p.textAlign(p.CENTER, p.CENTER);
  p.text(title, rect.x + rect.w / 2, rect.y + 16);
  p.pop();
}

/**
 * 本のパレット（追加元）を描画する。上限に達したら無効表示にする。
 * @param p - p5インスタンス
 */
function drawPalette(p: p5): void {
  const full = state.bookCount >= MAX_BOOKS;
  drawPanelFrame(
    p,
    PALETTE,
    full ? "上限（5冊）" : "本を追加",
    false,
    false,
    full
  );
  const iconW = BOOK_WIDTH * 0.45;
  const iconH = BOOK_HEIGHT * 0.6;
  drawBookIcon(
    p,
    PALETTE.x + (PALETTE.w - iconW) / 2,
    PALETTE.y + 44,
    iconW,
    iconH,
    full
  );
  p.push();
  p.noStroke();
  p.fill(full ? 150 : 80);
  p.textSize(LABEL_FONT_SIZE);
  p.textAlign(p.CENTER, p.CENTER);
  p.text(
    `${state.bookCount} / ${MAX_BOOKS} 冊`,
    PALETTE.x + PALETTE.w / 2,
    PALETTE.y + PALETTE.h - 14
  );
  p.pop();
}

/**
 * パレット用の小さな本のアイコンを描画する。
 * @param p - p5インスタンス
 * @param x - 左上のX座標
 * @param y - 左上のY座標
 * @param w - 幅
 * @param h - 高さ
 * @param disabled - 無効表示にするか
 */
function drawBookIcon(
  p: p5,
  x: number,
  y: number,
  w: number,
  h: number,
  disabled: boolean
): void {
  p.push();
  p.strokeWeight(2);
  if (disabled) {
    p.fill(200);
    p.stroke(160);
  } else {
    p.fill(240, 228, 160);
    p.stroke(70, 60, 50);
  }
  p.rect(x, y, w, h, 3);
  p.line(x + 6, y + 1, x + 6, y + h - 1);
  p.pop();
}

/**
 * ゴミ箱エリアを描画する。スタックの本をドラッグしている間は強調する。
 * @param p - p5インスタンス
 */
function drawTrash(p: p5): void {
  const drag = state.drag;
  const active = drag?.source === "stack";
  drawPanelFrame(p, TRASH, "ゴミ箱", active, active && drag.overTrash, false);
  p.push();
  p.noStroke();
  p.fill(90);
  p.textSize(LABEL_FONT_SIZE);
  p.textAlign(p.CENTER, p.CENTER);
  p.text(
    "本をここへ\nドロップして削除",
    TRASH.x + TRASH.w / 2,
    TRASH.y + TRASH.h / 2 + 12
  );
  p.pop();
}

/**
 * 本を机に置けるときの領域を強調する。パレットの本をドラッグしている間だけ表示する。
 * @param p - p5インスタンス
 */
function drawDeskZoneHighlight(p: p5): void {
  const drag = state.drag;
  if (drag?.source !== "palette") return;
  p.push();
  p.fill(0, 158, 115, drag.overDesk ? 70 : 28);
  p.stroke(0, 158, 115);
  p.strokeWeight(drag.overDesk ? 3 : 2);
  p.rect(DESK_ZONE.x, DESK_ZONE.y, DESK_ZONE.w, DESK_ZONE.h, 8);
  p.pop();
}

/**
 * ドラッグ中の本をポインターの位置に描画する。
 * @param p - p5インスタンス
 */
function drawDraggedBook(p: p5): void {
  const drag = state.drag;
  if (!drag) return;
  drawBook(
    p,
    drag.x - BOOK_WIDTH / 2,
    drag.y - BOOK_HEIGHT / 2,
    state.bookCount,
    "",
    200
  );
}

/**
 * 凡例を描画する。つり合いの2力（実線・青）と作用反作用の2力（破線・朱）を色と線種で示す。
 * @param p - p5インスタンス
 */
function drawLegend(p: p5): void {
  const colors = state.colors;
  if (!colors) return;
  const x = 14;
  const y = 12;
  p.push();
  p.fill(255, 255, 255, 225);
  p.stroke(160);
  p.strokeWeight(1);
  p.rect(x, y, 392, 92, 6);
  p.pop();

  drawArrow(p, x + 12, y + 20, x + 56, y + 20, colors.balance, {
    weight: ARROW_WEIGHT,
    headSize: ARROW_HEAD_SIZE,
    headWidthDivisor: 2
  });
  drawDashedArrow(
    p,
    x + 12,
    y + 46,
    x + 56,
    y + 46,
    colors.reaction,
    ARROW_WEIGHT
  );

  p.push();
  p.noStroke();
  p.textSize(LEGEND_FONT_SIZE);
  p.textAlign(p.LEFT, p.CENTER);
  p.fill(colors.balance);
  p.text("つり合いの2力（本にはたらく力）", x + 66, y + 20);
  p.fill(colors.reaction);
  p.text("作用反作用の2力（相手の物体にはたらく力）", x + 66, y + 46);
  p.fill(90);
  p.textSize(LABEL_FONT_SIZE);
  p.text(
    "矢印にマウスを重ねる（タップする）と、ペアの力を強調します",
    x + 12,
    y + 74
  );
  p.pop();
}

/**
 * アニメーションを更新し、必要なときだけシミュレーションを描画する。
 * 変化がなく、ドラッグもしていない間は再描画を省略する。
 * @param p - p5インスタンス
 */
export function drawSimulation(p: p5): void {
  const animating = updateAnimation(p);
  if (!state.dirty && !state.drag && !animating) return;
  state.dirty = false;

  p.background(BACKGROUND_GRAY);
  p.push();
  p.scale(p.width / V_W);
  drawDeskZoneHighlight(p);
  drawDesk(p);
  drawBooks(p);
  drawForces(p);
  drawPalette(p);
  drawTrash(p);
  drawLegend(p);
  drawDraggedBook(p);
  p.pop();
}
