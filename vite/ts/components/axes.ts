import type p5 from "p5";
import { drawArrow } from "./arrow.js";
import type { CoordinateSystem, Point } from "./coordinate-system.js";

/** 軸の矢印先端のピクセル位置（省略した辺はキャンバスの端から`margin`内側） */
export interface AxesExtent {
  /** X軸の右端（正方向の矢印先端） */
  right?: number;
  /** X軸の左端（`bothDirections`が真のときのみ使う） */
  left?: number;
  /** Y軸の上端（画面上方向の矢印先端） */
  top?: number;
  /** Y軸の下端（`bothDirections`が真のときのみ使う） */
  bottom?: number;
}

/** drawAxesのオプション */
export interface AxesOptions {
  /** X軸のラベル（省略時は描画しない） */
  xLabel?: string;
  /** Y軸のラベル（省略時は描画しない） */
  yLabel?: string;
  /** 原点のラベル（省略時は描画しない） */
  originLabel?: string;
  /** 原点から負の方向（左・下）にも軸を伸ばすか（既定: false） */
  bothDirections?: boolean;
  /** X軸を描画するか（既定: true）。`tate-yoko-wave`のように横軸のみ使う場合にfalseにする */
  showXAxis?: boolean;
  /** Y軸を描画するか（既定: true） */
  showYAxis?: boolean;
  /** 矢印先端の位置。省略した辺は`p.width`/`p.height`から`margin`だけ内側 */
  extent?: AxesExtent;
  /** `extent`を省略した辺でキャンバスの端から空ける余白（既定: 10） */
  margin?: number;
  /** 軸の色（既定: 黒） */
  color?: p5.Color;
  /** 軸の線の太さ（既定: 2） */
  weight?: number;
  /** 矢印の頭の長さ（既定: 10） */
  headSize?: number;
  /** 矢印の頭の幅の割合の逆数（`drawArrow`の`headWidthDivisor`。既定: 2） */
  headWidthDivisor?: number;
  /** 軸ラベルの文字サイズ（既定: 18） */
  labelFontSize?: number;
  /** 原点ラベルの文字サイズ（既定: 16） */
  originLabelFontSize?: number;
  /** X軸ラベルの中心位置（既定: 右端の矢印先端の右下） */
  xLabelPosition?: Point;
  /** Y軸ラベルの中心位置（既定: 上端の矢印先端の左） */
  yLabelPosition?: Point;
  /** Y軸ラベルを1文字ずつ改行して縦書きにするか（既定: false） */
  yLabelVertical?: boolean;
}

/**
 * 座標系の原点を通るX軸・Y軸を矢印で描画する。
 * 軸の長さはピクセル位置（`extent`）で指定し、原点の位置は`CoordinateSystem`から取る。
 * `translate`済みの座標系で描画する場合は、その座標系の原点を渡す。
 * 描画状態（stroke/fill/textSize/textAlignなど）は`push()`/`pop()`で閉じており、呼び出し側へ副作用を残さない。
 * @param p - p5インスタンス
 * @param cs - 軸の原点を決める座標系
 * @param options - ラベル・軸の範囲・見た目のオプション
 */
export function drawAxes(
  p: p5,
  cs: CoordinateSystem,
  {
    xLabel,
    yLabel,
    originLabel,
    bothDirections = false,
    showXAxis = true,
    showYAxis = true,
    extent = {},
    margin = 10,
    color,
    weight = 2,
    headSize = 10,
    headWidthDivisor = 2,
    labelFontSize = 18,
    originLabelFontSize = 16,
    xLabelPosition,
    yLabelPosition,
    yLabelVertical = false
  }: AxesOptions = {}
): void {
  const { originX: ox, originY: oy } = cs;
  const right = extent.right ?? p.width - margin;
  const left = extent.left ?? margin;
  const top = extent.top ?? margin;
  const bottom = extent.bottom ?? p.height - margin;
  const style = { weight, headSize, headWidthDivisor };

  p.push();
  const axisColor = color ?? p.color(0);

  if (showXAxis) {
    drawArrow(p, ox, oy, right, oy, axisColor, style);
    if (bothDirections) drawArrow(p, ox, oy, left, oy, axisColor, style);
  }
  if (showYAxis) {
    drawArrow(p, ox, oy, ox, top, axisColor, style);
    if (bothDirections) drawArrow(p, ox, oy, ox, bottom, axisColor, style);
  }

  p.noStroke();
  p.fill(axisColor);
  p.textAlign(p.CENTER, p.CENTER);

  p.textSize(labelFontSize);
  if (xLabel) {
    const pos = xLabelPosition ?? { x: right + 2, y: oy + 20 };
    p.text(xLabel, pos.x, pos.y);
  }
  if (yLabel) {
    const pos = yLabelPosition ?? { x: ox - 20, y: top };
    if (yLabelVertical) p.textLeading(labelFontSize);
    p.text(yLabelVertical ? [...yLabel].join("\n") : yLabel, pos.x, pos.y);
  }

  if (originLabel) {
    p.textSize(originLabelFontSize);
    p.text(originLabel, ox - 14, oy + 14);
  }
  p.pop();
}
