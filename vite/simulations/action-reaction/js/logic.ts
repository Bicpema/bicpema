// logic.ts はシミュレーションの描画ロジックを管理するファイルです。
// 物理計算はphysics.ts、ドラッグ操作やUIイベントはelement-function.tsに分離している。

import {
  state,
  V_W,
  V_H,
  BOOK_W,
  BOOK_H,
  STACK_X,
  DESK_TOP_Y,
  DESK_THICKNESS,
  DESK_HALF_WIDTH,
  DESK_LEG_BOTTOM_Y,
  LANE_OFFSET,
  PALETTE_RECT,
  TRASH_RECT,
  GRAVITY_COLOR,
  NORMAL_COLOR,
  EARTH_REACTION_COLOR,
  NORMAL_REACTION_COLOR,
  BOOK_COLOR,
  BOOK_SPINE_COLOR,
  BOOK_TOP_COLOR,
  DESK_COLOR,
  DESK_LEG_COLOR
} from "./state.js";
import type { BookEntity } from "./state.js";
import { computeBookForces, getMaxForceValue } from "./physics.js";
import type { BookForces } from "./physics.js";
import {
  MAX_BOOKS,
  DRAG_HIT_MARGIN,
  MAX_ARROW_LENGTH,
  MIN_ARROW_LENGTH,
  BASE_ARROW_SCALE,
  FORCE_LABEL_FONT_SIZE,
  DASH_ANIMATION_SPEED,
  DROP_ANIMATION_MS,
  LANE_FAN_STEP
} from "./constants.js";

type RGB = [number, number, number];

// ────────────────────────────────────────────
// ジオメトリ計算
// ────────────────────────────────────────────

/**
 * スタック内index番目（0が最下段）の本が収まるべき中心Y座標を返す。
 */
export function slotCenterY(index: number): number {
  return DESK_TOP_Y - index * BOOK_H - BOOK_H / 2;
}

/**
 * スタック内index番目の本の下端（接触面）のY座標を返す。
 * index === 0 のときは机の天板上面と一致する。
 */
export function slotBottomY(index: number): number {
  return DESK_TOP_Y - index * BOOK_H;
}

/**
 * 現在の本の並びから、各本の目標中心Y座標を再計算して反映する。
 * 本の追加・削除のたびに呼び出す。
 */
export function recalcTargets(): void {
  state.books.forEach((book, index) => {
    book.targetY = slotCenterY(index);
  });
}

/**
 * 仮想座標(vx, vy)が矩形の内側（ヒットマージンを含む）にあるかを判定する。
 */
export function isPointInRect(
  vx: number,
  vy: number,
  rect: { x: number; y: number; w: number; h: number },
  margin = 0
): boolean {
  return (
    vx >= rect.x - margin &&
    vx <= rect.x + rect.w + margin &&
    vy >= rect.y - margin &&
    vy <= rect.y + rect.h + margin
  );
}

/** スタック最上段の本の矩形（ドラッグ判定用）を返す。本が無ければnull */
export function getTopBookRect(): {
  x: number;
  y: number;
  w: number;
  h: number;
} | null {
  if (state.books.length === 0) return null;
  const topIndex = state.books.length - 1;
  const top = state.books[topIndex];
  return {
    x: STACK_X - BOOK_W / 2,
    y: top.currentY - BOOK_H / 2,
    w: BOOK_W,
    h: BOOK_H
  };
}

/**
 * 仮想座標が「机の上（本を追加・返却できる領域）」にあるかを判定する。
 * 机の天板の水平範囲内であれば、高さは問わず机の領域とみなす
 * （積み上げた本が高くなっても自然にドロップできるようにするため）。
 */
export function isOverDesk(vx: number, vy: number): boolean {
  return (
    vx >= STACK_X - DESK_HALF_WIDTH &&
    vx <= STACK_X + DESK_HALF_WIDTH &&
    vy <= DESK_LEG_BOTTOM_Y &&
    vy >= 0
  );
}

// ────────────────────────────────────────────
// 矢印描画ユーティリティ
// ────────────────────────────────────────────

/**
 * 矢印を描画する（軸 + 三角形の矢頭）。
 * dashedがtrueの場合、破線かつ再生中はアニメーションする
 * （「作用反作用の力＝見えている物体の裏側にはたらく力」を表す表現として使う）。
 */
function drawArrow(
  p: p5,
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  col: RGB,
  options: { dashed?: boolean; sw?: number; hs?: number } = {}
): void {
  const { dashed = false, sw = 3, hs = 9 } = options;
  const dx = x2 - x1;
  const dy = y2 - y1;
  const len = Math.hypot(dx, dy);
  if (len < MIN_ARROW_LENGTH) return;

  const ux = dx / len;
  const uy = dy / len;
  const ctx = p.drawingContext as CanvasRenderingContext2D;

  p.push();
  p.stroke(col[0], col[1], col[2]);
  p.strokeWeight(sw);
  if (dashed) {
    ctx.setLineDash([7, 6]);
    ctx.lineDashOffset = -state.dashOffset;
  }
  p.line(x1, y1, x2 - ux * hs, y2 - uy * hs);
  ctx.setLineDash([]);
  p.pop();

  p.push();
  p.fill(col[0], col[1], col[2]);
  p.noStroke();
  p.triangle(
    x2,
    y2,
    x2 - ux * hs - uy * hs * 0.5,
    y2 - uy * hs + ux * hs * 0.5,
    x2 - ux * hs + uy * hs * 0.5,
    y2 - uy * hs - ux * hs * 0.5
  );
  p.pop();
}

/**
 * 力の数値ラベルを1行で描画する。
 * 本を複数積み重ねても隣接するラベルと重なりにくいよう、
 * 説明文は含めず数値（と受け手を表す短い記号）のみの1行に絞っている。
 * @param align "top"ならテキストの下端をy、"bottom"なら上端をyに合わせる
 *   （矢印の先端の外側にテキストがはみ出るようにする）
 */
function drawCompactLabel(
  p: p5,
  x: number,
  y: number,
  text: string,
  col: RGB,
  align: "top" | "bottom"
): void {
  p.push();
  p.noStroke();
  p.fill(col[0], col[1], col[2]);
  p.textSize(FORCE_LABEL_FONT_SIZE);
  p.textAlign(p.CENTER, align === "top" ? p.BOTTOM : p.TOP);
  p.text(text, x, y);
  p.pop();
}

/**
 * 力の矢印の共通スケール（px/N）を求める。
 * 本の冊数が増えて合力が大きくなっても、最大長がMAX_ARROW_LENGTHを超えないようにする。
 */
export function computeArrowScale(forces: BookForces[]): number {
  const maxForce = getMaxForceValue(forces);
  if (maxForce <= 0) return BASE_ARROW_SCALE;
  return Math.min(BASE_ARROW_SCALE, MAX_ARROW_LENGTH / maxForce);
}

// ────────────────────────────────────────────
// 背景・机・パレット・トレイ
// ────────────────────────────────────────────

function drawHeader(p: p5): void {
  p.push();
  p.noStroke();
  p.fill(235, 235, 240);
  p.textAlign(p.CENTER, p.TOP);
  p.textSize(16);
  p.text(
    "本のアイコンを机の上にドラッグ＆ドロップして積み重ねよう",
    V_W / 2,
    2
  );
  p.pop();
}

function drawDesk(p: p5): void {
  p.push();
  p.noStroke();
  p.fill(DESK_LEG_COLOR[0], DESK_LEG_COLOR[1], DESK_LEG_COLOR[2]);
  const legW = 18;
  p.rect(
    STACK_X - DESK_HALF_WIDTH + 20,
    DESK_TOP_Y + DESK_THICKNESS,
    legW,
    DESK_LEG_BOTTOM_Y - (DESK_TOP_Y + DESK_THICKNESS)
  );
  p.rect(
    STACK_X + DESK_HALF_WIDTH - 20 - legW,
    DESK_TOP_Y + DESK_THICKNESS,
    legW,
    DESK_LEG_BOTTOM_Y - (DESK_TOP_Y + DESK_THICKNESS)
  );

  p.fill(DESK_COLOR[0], DESK_COLOR[1], DESK_COLOR[2]);
  p.stroke(70, 46, 26);
  p.strokeWeight(2);
  p.rect(
    STACK_X - DESK_HALF_WIDTH,
    DESK_TOP_Y,
    DESK_HALF_WIDTH * 2,
    DESK_THICKNESS,
    3
  );
  p.pop();
}

function drawPalette(p: p5, isSourceActive: boolean): void {
  const r = PALETTE_RECT;
  p.push();
  p.noFill();
  p.stroke(isSourceActive ? 255 : 200, isSourceActive ? 220 : 200, 120);
  p.strokeWeight(2);
  p.drawingContext.setLineDash([6, 5]);
  p.rect(r.x, r.y, r.w, r.h, 8);
  p.drawingContext.setLineDash([]);

  // ミニチュアの本のアイコン
  const bw = 70;
  const bh = 20;
  const bx = r.x + r.w / 2 - bw / 2;
  const by = r.y + 34;
  drawBookShape(p, bx, by, bw, bh);

  p.noStroke();
  p.fill(230, 230, 235);
  p.textAlign(p.CENTER, p.TOP);
  p.textSize(12);
  p.text("ドラッグして", r.x + r.w / 2, by + bh + 14);
  p.text("机に追加", r.x + r.w / 2, by + bh + 30);
  const atMax = state.books.length >= MAX_BOOKS;
  if (atMax) {
    p.fill(255, 150, 120);
    p.textSize(11);
    p.text("(上限です)", r.x + r.w / 2, by + bh + 46);
  }
  p.pop();
}

function drawTrash(p: p5, isHighlighted: boolean): void {
  const r = TRASH_RECT;
  p.push();
  p.noFill();
  p.stroke(isHighlighted ? 255 : 190, isHighlighted ? 110 : 190, 110);
  p.strokeWeight(isHighlighted ? 3 : 2);
  p.drawingContext.setLineDash([6, 5]);
  p.rect(r.x, r.y, r.w, r.h, 8);
  p.drawingContext.setLineDash([]);

  // ゴミ箱アイコン（簡易）
  const cx = r.x + r.w / 2;
  const topY = r.y + 30;
  p.fill(isHighlighted ? 255 : 210, 140, 100);
  p.noStroke();
  p.rect(cx - 20, topY, 40, 34, 3);
  p.rect(cx - 25, topY - 8, 50, 8, 2);
  p.stroke(80, 50, 30);
  p.strokeWeight(2);
  for (const dx of [-10, 0, 10]) {
    p.line(cx + dx, topY + 6, cx + dx, topY + 28);
  }

  p.noStroke();
  p.fill(230, 230, 235);
  p.textAlign(p.CENTER, p.TOP);
  p.textSize(12);
  p.text("ここにドラッグして", cx, topY + 40);
  p.text("本を取り除く", cx, topY + 56);
  p.pop();
}

// ────────────────────────────────────────────
// 本の描画
// ────────────────────────────────────────────

/**
 * 本の形状のみを描画する（パレットのミニアイコンにも使い回す）。
 */
function drawBookShape(
  p: p5,
  x: number,
  y: number,
  w: number,
  h: number,
  label?: string
): void {
  p.push();
  p.rectMode(p.CORNER);
  p.stroke(60, 40, 24);
  p.strokeWeight(1.5);
  p.fill(BOOK_COLOR[0], BOOK_COLOR[1], BOOK_COLOR[2]);
  p.rect(x, y, w, h, 3);

  // 表紙のハイライト
  p.noStroke();
  p.fill(BOOK_TOP_COLOR[0], BOOK_TOP_COLOR[1], BOOK_TOP_COLOR[2]);
  p.rect(x + 3, y + 2, w - 6, Math.max(2, h * 0.3));

  // 背表紙のライン
  p.stroke(BOOK_SPINE_COLOR[0], BOOK_SPINE_COLOR[1], BOOK_SPINE_COLOR[2]);
  p.strokeWeight(2);
  p.line(x + 10, y + 3, x + 10, y + h - 3);

  if (label) {
    p.noStroke();
    p.fill(255);
    p.textAlign(p.CENTER, p.CENTER);
    p.textSize(13);
    p.text(label, x + w / 2 + 6, y + h / 2);
  }
  p.pop();
}

function drawBook(p: p5, book: BookEntity, index: number): void {
  const x = STACK_X - BOOK_W / 2;
  const y = book.currentY - BOOK_H / 2;
  drawBookShape(p, x, y, BOOK_W, BOOK_H, `${index + 1}`);
}

/**
 * ドラッグ中の本（ゴーストのアイコン）を描画する。
 */
function drawDraggedGhost(p: p5): void {
  if (!state.dragging) return;
  p.push();
  p.drawingContext.globalAlpha = 0.85;
  drawBookShape(
    p,
    state.dragX - BOOK_W / 2,
    state.dragY - BOOK_H / 2,
    BOOK_W,
    BOOK_H
  );
  p.pop();
}

// ────────────────────────────────────────────
// 力の矢印の描画
// ────────────────────────────────────────────

/**
 * 1冊分の力（重力・垂直抗力・それぞれの反作用）を描画する。
 * @param p p5インスタンス
 * @param book 対象の本
 * @param index スタック内でのインデックス（0が最下段）
 * @param forces その本にはたらく力（physics.tsの計算結果）
 * @param scale 矢印の共通スケール（px/N）
 */
function drawForcesForBook(
  p: p5,
  book: BookEntity,
  index: number,
  forces: BookForces,
  scale: number
): void {
  const centerY = book.currentY;
  const bottomY = centerY + BOOK_H / 2;
  // 本の冊数が増えても隣の本のラベルと重ならないよう、
  // インデックスに応じてレーンを少しずつ外側へ振り分ける（階段状に広げる）。
  const fan = index * LANE_FAN_STEP;
  const leftX = STACK_X - BOOK_W / 2 - LANE_OFFSET - fan;
  const rightX = STACK_X + BOOK_W / 2 + LANE_OFFSET + fan;

  // 重力（実線・赤）とその反作用「本が地球を引く力」（破線・赤）
  // 同じ点（本の中心）を起点に上下逆向きに描くことで、
  // 「作用反作用は同一作用線上・逆向き・別の物体にはたらく」ことを表現する。
  if (state.showGravity) {
    const len = forces.weight * scale;
    drawArrow(p, leftX, centerY, leftX, centerY + len, GRAVITY_COLOR, {
      sw: 3,
      hs: 9
    });
    drawCompactLabel(
      p,
      leftX,
      centerY + len + 2,
      `${forces.weight.toFixed(1)} N`,
      GRAVITY_COLOR,
      "top"
    );
  }
  if (state.showEarthReaction) {
    const len = forces.weight * scale;
    drawArrow(p, leftX, centerY, leftX, centerY - len, EARTH_REACTION_COLOR, {
      dashed: true,
      sw: 2.5,
      hs: 8
    });
    drawCompactLabel(
      p,
      leftX,
      centerY - len - 2,
      `🌍 ${forces.weight.toFixed(1)} N`,
      EARTH_REACTION_COLOR,
      "bottom"
    );
  }

  // 垂直抗力（実線・青）とその反作用「本が下面を押す力」（破線・青）
  // 同じ点（本の下端＝接触面）を起点に上下逆向きに描く。
  const belowLabel = index === 0 ? "机" : `${index}冊目`;
  if (state.showNormal) {
    const len = forces.normalFromBelow * scale;
    drawArrow(p, rightX, bottomY, rightX, bottomY - len, NORMAL_COLOR, {
      sw: 3,
      hs: 9
    });
    drawCompactLabel(
      p,
      rightX,
      bottomY - len - 2,
      `${forces.normalFromBelow.toFixed(1)} N`,
      NORMAL_COLOR,
      "bottom"
    );
  }
  if (state.showNormalReaction) {
    const len = forces.normalFromBelow * scale;
    drawArrow(
      p,
      rightX,
      bottomY,
      rightX,
      bottomY + len,
      NORMAL_REACTION_COLOR,
      { dashed: true, sw: 2.5, hs: 8 }
    );
    drawCompactLabel(
      p,
      rightX,
      bottomY + len + 2,
      `${forces.normalFromBelow.toFixed(1)} N →${belowLabel}`,
      NORMAL_REACTION_COLOR,
      "top"
    );
  }
}

// ────────────────────────────────────────────
// 案内メッセージ・凡例
// ────────────────────────────────────────────

function drawNotice(p: p5): void {
  if (!state.notice) return;
  if (performance.now() > state.notice.until) {
    state.notice = null;
    return;
  }
  p.push();
  p.noStroke();
  p.fill(255, 200, 90);
  p.textAlign(p.CENTER, p.TOP);
  p.textSize(14);
  p.text(state.notice.text, V_W / 2, 24);
  p.pop();
}

function drawLegend(p: p5): void {
  const items: { col: RGB; label: string; dashed: boolean }[] = [
    { col: GRAVITY_COLOR, label: "重力（つり合いの2力）", dashed: false },
    { col: NORMAL_COLOR, label: "垂直抗力（つり合いの2力）", dashed: false },
    {
      col: EARTH_REACTION_COLOR,
      label: "地球を引く力（作用反作用）",
      dashed: true
    },
    {
      col: NORMAL_REACTION_COLOR,
      label: "机・本を押す力（作用反作用）",
      dashed: true
    }
  ];

  p.push();
  const startX = V_W / 2 - 230;
  const y = V_H - 20;
  p.textSize(11);
  p.textAlign(p.LEFT, p.CENTER);
  let x = startX;
  for (const item of items) {
    const ctx = p.drawingContext as CanvasRenderingContext2D;
    p.stroke(item.col[0], item.col[1], item.col[2]);
    p.strokeWeight(3);
    if (item.dashed) ctx.setLineDash([5, 4]);
    p.line(x, y, x + 22, y);
    ctx.setLineDash([]);
    p.noStroke();
    p.fill(220, 220, 225);
    p.text(item.label, x + 28, y);
    x += 28 + p.textWidth(item.label) + 18;
  }
  p.pop();
}

/**
 * 「つり合いの2力」と「作用反作用の2力」の違いについての補足キャプションを描画する。
 * 本ごとの矢印にラベルを重ねると混み合うため、常に同じ位置に1行で表示する。
 */
function drawEquilibriumCaption(p: p5): void {
  if (state.books.length === 0) return;
  p.push();
  p.noStroke();
  p.fill(200, 200, 205);
  p.textAlign(p.CENTER, p.BOTTOM);
  p.textSize(12);
  p.text(
    "最上段の本だけは重力と垂直抗力の大きさがたまたま一致する（つり合いの2力／作用反作用ではない）",
    V_W / 2,
    V_H - 40
  );
  p.pop();
}

// ────────────────────────────────────────────
// アニメーション更新
// ────────────────────────────────────────────

/**
 * ドロップ演出（本が目標位置へ滑らかに近づく）と、
 * 破線矢印の「進む破線」演出を更新する。
 * 一時停止中は演出を止め、位置を即座に目標値へスナップさせる
 * （パフォーマンス方針: 一時停止中の余分な処理を避ける）。
 */
export function updateAnimations(p: p5): void {
  if (!state.isPlaying) {
    for (const book of state.books) {
      book.currentY = book.targetY;
    }
    return;
  }

  const t = Math.min(1, p.deltaTime / DROP_ANIMATION_MS);
  for (const book of state.books) {
    book.currentY += (book.targetY - book.currentY) * Math.min(1, t * 3);
    if (Math.abs(book.currentY - book.targetY) < 0.3) {
      book.currentY = book.targetY;
    }
  }

  state.dashOffset += DASH_ANIMATION_SPEED * (p.deltaTime / 16.6667);
  if (state.dashOffset > 10000) state.dashOffset = 0;
}

// ────────────────────────────────────────────
// カーソル
// ────────────────────────────────────────────

function updateCursor(p: p5, vmx: number, vmy: number): void {
  if (state.dragging) {
    p.cursor("grabbing");
    return;
  }
  const overPalette =
    isPointInRect(vmx, vmy, PALETTE_RECT, DRAG_HIT_MARGIN) &&
    state.books.length < MAX_BOOKS;
  const topRect = getTopBookRect();
  const overTop =
    topRect !== null && isPointInRect(vmx, vmy, topRect, DRAG_HIT_MARGIN);
  p.cursor(overPalette || overTop ? "grab" : "default");
}

// ────────────────────────────────────────────
// エントリーポイント
// ────────────────────────────────────────────

/**
 * シミュレーション全体を描画する。
 * @param p p5インスタンス
 */
export function drawSimulation(p: p5): void {
  p.background(30, 32, 38);
  p.scale(p.width / V_W);

  if (state.font) p.textFont(state.font);

  drawHeader(p);
  drawDesk(p);

  const isDraggingTop = state.dragging === "top";
  drawPalette(p, state.books.length < MAX_BOOKS);
  drawTrash(p, isDraggingTop);

  const forces = computeBookForces(
    state.books.length,
    state.mass,
    state.gravity
  );
  const scale = computeArrowScale(forces);

  state.books.forEach((book, index) => {
    if (state.dragging === "top" && index === state.books.length - 1) return;
    drawBook(p, book, index);
    drawForcesForBook(p, book, index, forces[index], scale);
  });

  drawDraggedGhost(p);
  drawEquilibriumCaption(p);
  drawLegend(p);
  drawNotice(p);

  const vmx = (p.mouseX / p.width) * V_W;
  const vmy = (p.mouseY / p.width) * V_W;
  updateCursor(p, vmx, vmy);
}
