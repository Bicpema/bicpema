import type p5 from "p5";

/** 点線の見た目に関するオプション */
export interface DashedLineStyle {
  /** 線の太さ（既定: 1.5） */
  weight?: number;
  /** 線分1本の長さ（既定: 8） */
  dashLength?: number;
  /** 線分どうしの間隔（既定: 6） */
  gapLength?: number;
}

/** 長さがこの値未満の点線は描画しない（px） */
const MIN_DASHED_LENGTH = 1;

/**
 * 始点から終点まで点線を描画する。長さが極端に短い場合は何も描画しない。
 * 描画状態（stroke/strokeWeight）は`push()`/`pop()`で閉じており、呼び出し側へ副作用を残さない。
 * @param p - p5インスタンス
 * @param x1 - 始点のX座標
 * @param y1 - 始点のY座標
 * @param x2 - 終点のX座標
 * @param y2 - 終点のY座標
 * @param col - 線の色
 * @param style - 見た目のオプション
 */
export function drawDashedLine(
  p: p5,
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  col: p5.Color,
  { weight = 1.5, dashLength = 8, gapLength = 6 }: DashedLineStyle = {}
): void {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const len = Math.hypot(dx, dy);
  if (len < MIN_DASHED_LENGTH) return;

  const ux = dx / len;
  const uy = dy / len;
  let d = 0;
  let drawing = true;
  p.push();
  p.stroke(col);
  p.strokeWeight(weight);
  while (d < len) {
    const segLen = Math.min(drawing ? dashLength : gapLength, len - d);
    if (drawing) {
      p.line(
        x1 + ux * d,
        y1 + uy * d,
        x1 + ux * (d + segLen),
        y1 + uy * (d + segLen)
      );
    }
    d += segLen;
    drawing = !drawing;
  }
  p.pop();
}
