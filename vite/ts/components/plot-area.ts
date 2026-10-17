import type p5 from "p5";
import type { CoordinateSystem, Point } from "./coordinate-system.js";
import { drawGrid, type GridBounds } from "./grid.js";

/** 背景矩形のオプション */
export interface PlotBackgroundStyle {
  /** 塗りつぶしの色（既定: グレー250） */
  fill?: p5.Color;
  /** 枠線の色（既定: グレー180） */
  stroke?: p5.Color;
  /** 枠線の太さ（既定: 1.5） */
  weight?: number;
  /** 角丸の半径（既定: 8） */
  radius?: number;
}

/** 目盛りの値ラベルのオプション */
export interface PlotTicksStyle {
  /** X方向の目盛りの物理座標での間隔。省略時はX方向の値ラベルを描画しない */
  stepX?: number;
  /** Y方向の目盛りの物理座標での間隔。省略時はY方向の値ラベルを描画しない */
  stepY?: number;
  /** 値を文字列にする関数（既定: `String`） */
  format?: (value: number) => string;
  /** 文字サイズ（既定: 13） */
  fontSize?: number;
  /** 文字の色（既定: グレー80） */
  color?: p5.Color;
}

/** 軸線（原点を通る直線）のオプション */
export interface PlotAxisLineStyle {
  /** 線の色（既定: グレー100） */
  color?: p5.Color;
  /** 線の太さ（既定: 1.5） */
  weight?: number;
}

/** 軸タイトル・グラフタイトルのオプション */
export interface PlotLabelsStyle {
  /** X軸タイトル（枠の下に描画） */
  xTitle?: string;
  /** Y軸タイトル（枠の左に縦書きで描画） */
  yTitle?: string;
  /** グラフのタイトル（枠の上に描画） */
  title?: string;
  /** 軸タイトルの文字サイズ（既定: 14） */
  axisFontSize?: number;
  /** グラフタイトルの文字サイズ（既定: 16） */
  titleFontSize?: number;
  /** 文字の色（既定: グレー60） */
  color?: p5.Color;
}

/** 折れ線の1系列 */
export interface PlotSeries {
  /** 物理座標の点列 */
  points: readonly Point[];
  /** 線の色 */
  color: p5.Color;
  /** 線の太さ（既定: 2） */
  weight?: number;
  /** 凡例に表示する名前（省略時は凡例に載せない） */
  label?: string;
}

/** 凡例のオプション */
export interface PlotLegendStyle {
  /** 凡例の左上の位置（px。省略時は枠の左上から8px内側） */
  position?: Point;
  /** 文字サイズ（既定: 13） */
  fontSize?: number;
  /** 行の高さ（既定: 文字サイズ + 6） */
  lineHeight?: number;
}

/** drawPlotAreaのオプション */
export interface PlotAreaStyle {
  /** グラフ枠のピクセル範囲 */
  bounds: GridBounds;
  /** 背景矩形（省略時は既定の見た目で描画。`false`で描画しない） */
  background?: PlotBackgroundStyle | false;
  /** X方向（縦線）のグリッド間隔。省略時は縦線を描画しない */
  gridStepX?: number;
  /** Y方向（横線）のグリッド間隔。省略時は横線を描画しない */
  gridStepY?: number;
  /** グリッドの色（省略時は`drawGrid`の既定色） */
  gridColor?: p5.Color;
  /** 折れ線のデータ */
  series?: readonly PlotSeries[];
  /** 原点を通る軸線（省略時は描画しない） */
  axisLine?: PlotAxisLineStyle;
  /** 目盛りの値ラベル（省略時は描画しない） */
  ticks?: PlotTicksStyle;
  /** 軸タイトル・グラフタイトル（省略時は描画しない） */
  labels?: PlotLabelsStyle;
  /** 凡例（`series`の`label`を持つ系列を表示。省略時は描画しない） */
  legend?: PlotLegendStyle;
}

/**
 * 物理座標の点列を折れ線で描画する。点が2つ未満なら何も描かない。
 * 描画状態（stroke/strokeWeight/fill）は`push()`/`pop()`で閉じており、呼び出し側へ副作用を残さない。
 * @param p - p5インスタンス
 * @param cs - 物理座標をピクセルへ変換する座標系
 * @param points - 物理座標の点列
 * @param color - 線の色
 * @param weight - 線の太さ（省略時: 2）
 */
export function drawPolyline(
  p: p5,
  cs: CoordinateSystem,
  points: readonly Point[],
  color: p5.Color,
  weight = 2
): void {
  if (points.length < 2) return;
  p.push();
  p.stroke(color);
  p.strokeWeight(weight);
  p.noFill();
  for (let i = 1; i < points.length; i++) {
    const a = points[i - 1];
    const b = points[i];
    p.line(cs.toPxX(a.x), cs.toPxY(a.y), cs.toPxX(b.x), cs.toPxY(b.y));
  }
  p.pop();
}

/**
 * p5版グラフの共通部分を描画する。
 * 背景矩形 → グリッド → 折れ線 → 軸線 → 目盛りの値ラベル → 軸タイトル・グラフタイトル → 凡例の順に重ねる。
 * 座標変換は`CoordinateSystem`、グリッドは`drawGrid`を使う。矢印付きの軸は`drawAxes`を別に呼ぶ。
 * 状態を持たないため、データの更新は呼び出し側が毎フレーム行う。
 * 描画状態は`push()`/`pop()`で閉じており、呼び出し側へ副作用を残さない。
 * @param p - p5インスタンス
 * @param cs - 原点とスケールを持つ座標系
 * @param style - 描画範囲・データ・各要素のオプション
 */
export function drawPlotArea(
  p: p5,
  cs: CoordinateSystem,
  style: PlotAreaStyle
): void {
  const { left, top, right, bottom } = style.bounds;

  p.push();
  if (style.background !== false) {
    const bg = style.background ?? {};
    p.fill(bg.fill ?? p.color(250));
    p.stroke(bg.stroke ?? p.color(180));
    p.strokeWeight(bg.weight ?? 1.5);
    p.rect(left, top, right - left, bottom - top, bg.radius ?? 8);
  }

  if (style.gridStepX !== undefined || style.gridStepY !== undefined) {
    drawGrid(p, cs, {
      stepX: style.gridStepX,
      stepY: style.gridStepY,
      color: style.gridColor,
      bounds: style.bounds
    });
  }

  for (const s of style.series ?? []) {
    drawPolyline(p, cs, s.points, s.color, s.weight);
  }

  if (style.axisLine) {
    p.stroke(style.axisLine.color ?? p.color(100));
    p.strokeWeight(style.axisLine.weight ?? 1.5);
    p.line(left, cs.originY, right, cs.originY);
    p.line(cs.originX, top, cs.originX, bottom);
  }

  if (style.ticks) drawTickLabels(p, cs, style.bounds, style.ticks);
  if (style.labels) drawPlotLabels(p, style.bounds, style.labels);
  if (style.legend) {
    drawLegend(p, style.bounds, style.series ?? [], style.legend);
  }
  p.pop();
}

/**
 * 目盛りの値ラベルを描画する（値0は軸と重なるため描かない）。
 * X方向は原点の下、Y方向は原点の左に置く。
 * @param p - p5インスタンス
 * @param cs - 座標系
 * @param bounds - グラフ枠
 * @param ticks - 目盛りのオプション
 */
function drawTickLabels(
  p: p5,
  cs: CoordinateSystem,
  bounds: GridBounds,
  ticks: PlotTicksStyle
): void {
  const { format = String, fontSize = 13, color } = ticks;
  p.noStroke();
  p.fill(color ?? p.color(80));
  p.textSize(fontSize);
  if (ticks.stepX !== undefined) {
    p.textAlign(p.CENTER, p.TOP);
    for (const x of cs.gridValuesX(bounds.left, bounds.right, ticks.stepX)) {
      if (x !== 0) p.text(format(x), cs.toPxX(x), cs.originY + 6);
    }
  }
  if (ticks.stepY !== undefined) {
    p.textAlign(p.RIGHT, p.CENTER);
    for (const y of cs.gridValuesY(bounds.top, bounds.bottom, ticks.stepY)) {
      if (y !== 0) p.text(format(y), cs.originX - 6, cs.toPxY(y));
    }
  }
}

/**
 * 軸タイトルとグラフタイトルを枠の中央を基準に描画する。
 * @param p - p5インスタンス
 * @param bounds - グラフ枠
 * @param labels - ラベルのオプション
 */
function drawPlotLabels(
  p: p5,
  bounds: GridBounds,
  labels: PlotLabelsStyle
): void {
  const { axisFontSize = 14, titleFontSize = 16, color } = labels;
  const midX = (bounds.left + bounds.right) / 2;
  const midY = (bounds.top + bounds.bottom) / 2;
  p.noStroke();
  p.fill(color ?? p.color(60));

  if (labels.xTitle) {
    p.textSize(axisFontSize);
    p.textAlign(p.CENTER, p.BOTTOM);
    p.text(labels.xTitle, midX, bounds.bottom + 30);
  }
  if (labels.yTitle) {
    p.push();
    p.translate(bounds.left - 40, midY);
    p.rotate(-p.HALF_PI);
    p.textSize(axisFontSize);
    p.textAlign(p.CENTER, p.CENTER);
    p.text(labels.yTitle, 0, 0);
    p.pop();
  }
  if (labels.title) {
    p.textSize(titleFontSize);
    p.textAlign(p.CENTER, p.TOP);
    p.text(labels.title, midX, bounds.top - 28);
  }
}

/**
 * `label`を持つ系列の凡例（色の短い線 + 名前）を縦に並べて描画する。
 * @param p - p5インスタンス
 * @param bounds - グラフ枠
 * @param series - 系列
 * @param legend - 凡例のオプション
 */
function drawLegend(
  p: p5,
  bounds: GridBounds,
  series: readonly PlotSeries[],
  legend: PlotLegendStyle
): void {
  const { fontSize = 13, lineHeight = fontSize + 6 } = legend;
  const origin = legend.position ?? { x: bounds.left + 8, y: bounds.top + 8 };
  p.textSize(fontSize);
  p.textAlign(p.LEFT, p.CENTER);
  series
    .filter((s) => s.label)
    .forEach((s, row) => {
      const y = origin.y + row * lineHeight + lineHeight / 2;
      p.stroke(s.color);
      p.strokeWeight(s.weight ?? 2);
      p.line(origin.x, y, origin.x + 20, y);
      p.noStroke();
      p.fill(s.color);
      p.text(s.label as string, origin.x + 26, y);
    });
}
