import type p5 from "p5";
import type { CoordinateSystem } from "./coordinate-system.js";

/** グリッドを描画するピクセル範囲 */
export interface GridBounds {
  /** 左端のX座標（px） */
  left: number;
  /** 上端のY座標（px） */
  top: number;
  /** 右端のX座標（px） */
  right: number;
  /** 下端のY座標（px） */
  bottom: number;
}

/** グリッドの見た目に関するオプション */
export interface GridStyle {
  /** X方向（縦線）の物理座標での間隔。省略時は縦線を描画しない */
  stepX?: number;
  /** Y方向（横線）の物理座標での間隔。省略時は横線を描画しない */
  stepY?: number;
  /** 線の色（省略時は`p.color(168, 206, 221)`） */
  color?: p5.Color;
  /** 線の太さ（既定: 1） */
  weight?: number;
  /** 描画範囲（px。省略時はキャンバス全体） */
  bounds?: GridBounds;
}

/** 線の色を省略したときのRGB */
const DEFAULT_COLOR: [number, number, number] = [168, 206, 221];

/**
 * 座標系の原点を基準にした等間隔のグリッド線を描画する。
 * 原点を必ず通る位置から左右・上下へ線を引き、`bounds`の範囲内にだけ描画する。
 * 描画状態（stroke/strokeWeight）は`push()`/`pop()`で閉じており、呼び出し側へ副作用を残さない。
 * @param p - p5インスタンス
 * @param cs - 原点とスケールを持つ座標系
 * @param style - 間隔・色・太さ・描画範囲のオプション
 */
export function drawGrid(
  p: p5,
  cs: CoordinateSystem,
  { stepX, stepY, color, weight = 1, bounds }: GridStyle = {}
): void {
  const { left, top, right, bottom } = bounds ?? {
    left: 0,
    top: 0,
    right: p.width,
    bottom: p.height
  };

  p.push();
  p.stroke(color ?? p.color(...DEFAULT_COLOR));
  p.strokeWeight(weight);
  if (stepX !== undefined) {
    for (const x of cs.gridValuesX(left, right, stepX)) {
      const px = cs.toPxX(x);
      p.line(px, top, px, bottom);
    }
  }
  if (stepY !== undefined) {
    for (const y of cs.gridValuesY(top, bottom, stepY)) {
      const py = cs.toPxY(y);
      p.line(left, py, right, py);
    }
  }
  p.pop();
}
