import type p5 from "p5";

/**
 * 情報パネルの見た目の共通定数。サイズ・色・余白・角丸・影・行間はここで一元管理する。
 * 文字サイズはラベル・数値・単位の3段階に絞る。
 */
export const INFO_PANEL_STYLE = {
  /** ラベルの文字サイズ */
  labelSize: 13,
  /** 数値の文字サイズ */
  valueSize: 20,
  /** 単位の文字サイズ */
  unitSize: 13,
  /** 数値に使う等幅フォント（桁ずれ防止） */
  numberFont: "ui-monospace, Menlo, Consolas, monospace",
  /** パネル内側の余白（左右） */
  paddingX: 16,
  /** パネル内側の余白（上下） */
  paddingY: 10,
  /** 1行の高さ */
  rowHeight: 32,
  /** 角丸半径 */
  radius: 12,
  /** 画面端からの既定の余白 */
  margin: 14,
  /** 数値列の幅（等幅フォント8桁分） */
  valueWidth: 88,
  /** 単位列の幅 */
  unitWidth: 44,
  /** 数値と単位の間隔 */
  unitGap: 6,
  /** ラベル列の既定の幅 */
  labelWidth: 110,
  backgroundColor: "rgb(255, 255, 255)",
  borderColor: "rgb(209, 213, 219)",
  dividerColor: "rgb(229, 231, 235)",
  mutedColor: "rgb(107, 114, 128)",
  valueColor: "rgb(17, 24, 39)",
  shadowColor: "rgba(0, 0, 0, 0.18)",
  shadowBlur: 8,
  shadowOffsetY: 2
} as const;

/** 情報パネルの1行 */
export interface InfoPanelRow {
  /** 項目名（例: "速度 v"） */
  label: string;
  /** 数値の文字列（呼び出し側で桁数を整形して渡す） */
  value: string;
  /** 単位（例: "m/s"） */
  unit?: string;
  /** 同じ行の2つ目の数値（例: 大きさに対する角度）。指定した行がある場合、全行が2列分の幅を確保する */
  secondValue?: string;
  /** 2つ目の数値の単位 */
  secondUnit?: string;
  /** 数値の色（既定: 通常の文字色） */
  color?: string;
  /** trueの場合、この行の上に区切り線を引く（最初の行では無視する） */
  dividerAbove?: boolean;
}

/** 情報パネルの配置・見た目のオプション */
export interface InfoPanelOptions {
  /** 基準点のX座標（既定: INFO_PANEL_STYLE.margin） */
  x?: number;
  /** 基準点のY座標（既定: INFO_PANEL_STYLE.margin） */
  y?: number;
  /** x・yがパネルのどの辺か（既定: "left"。"right"ならx座標がパネルの右端） */
  anchorX?: "left" | "right";
  /** x・yがパネルのどの辺か（既定: "top"。"bottom"ならy座標がパネルの下端） */
  anchorY?: "top" | "bottom";
  /** ラベル列の幅（既定: INFO_PANEL_STYLE.labelWidth。長いラベルがあるときに広げる） */
  labelWidth?: number;
  /** ラベルと単位に使うフォント（既定: 現在のフォント） */
  font?: p5.Font | string;
}

/** 情報パネルの配置結果 */
export interface InfoPanelLayout {
  x: number;
  y: number;
  width: number;
  height: number;
  /** 各行の上端のY座標 */
  rowTops: number[];
  /** 列数（数値の列の数。1または2） */
  columns: number;
}

/**
 * 情報パネルの位置と大きさを計算する。描画せず、p5にも依存しない。
 * @param rows - 行のリスト
 * @param options - 配置のオプション
 * @returns 配置結果
 */
export function layoutInfoPanel(
  rows: InfoPanelRow[],
  { x, y, anchorX = "left", anchorY = "top", labelWidth }: InfoPanelOptions = {}
): InfoPanelLayout {
  const s = INFO_PANEL_STYLE;
  const columns = rows.some((r) => r.secondValue !== undefined) ? 2 : 1;
  const width =
    s.paddingX * 2 +
    (labelWidth ?? s.labelWidth) +
    (s.valueWidth + s.unitGap + s.unitWidth) * columns;
  const height = rows.length * s.rowHeight + s.paddingY * 2;
  const baseX = x ?? s.margin;
  const baseY = y ?? s.margin;
  const left = anchorX === "right" ? baseX - width : baseX;
  const top = anchorY === "bottom" ? baseY - height : baseY;
  const rowTops = rows.map((_, i) => top + s.paddingY + i * s.rowHeight);
  return { x: left, y: top, width, height, rowTops, columns };
}

/**
 * 数値と単位を1組、右端を揃えて描画する。
 * @param p - p5インスタンス
 * @param value - 数値の文字列
 * @param unit - 単位
 * @param unitRight - 単位列の右端のX座標
 * @param centerY - 行の中心のY座標
 * @param color - 数値の色
 * @param font - ラベル・単位のフォント
 */
function drawValueCell(
  p: p5,
  value: string,
  unit: string | undefined,
  unitRight: number,
  centerY: number,
  color: string,
  font: p5.Font | string | undefined
) {
  const s = INFO_PANEL_STYLE;
  const valueRight = unitRight - s.unitWidth - s.unitGap;
  p.push();
  p.noStroke();
  p.textAlign(p.RIGHT, p.CENTER);
  p.textFont(s.numberFont);
  p.textStyle(p.BOLD);
  p.textSize(s.valueSize);
  p.fill(color);
  p.text(value, valueRight, centerY);
  p.pop();

  if (!unit) return;
  p.push();
  p.noStroke();
  p.textAlign(p.LEFT, p.CENTER);
  if (font) p.textFont(font);
  p.textSize(s.unitSize);
  p.fill(s.mutedColor);
  p.text(unit, valueRight + s.unitGap, centerY);
  p.pop();
}

/**
 * 情報パネル（影つきの白いカードに「ラベル・数値・単位」の行を並べたもの）を描画する。
 * 数値は等幅フォントの太字で右揃えにし、値が変わっても桁がぶれないようにする。
 * 描画状態（fill/stroke/textSizeなど）は`push()`/`pop()`で閉じており、呼び出し側へ副作用を残さない。
 * @param p - p5インスタンス
 * @param rows - 行のリスト
 * @param options - 配置のオプション
 * @returns 配置結果（パネルが覆う範囲の確認などに使える）
 */
export function drawInfoPanel(
  p: p5,
  rows: InfoPanelRow[],
  options: InfoPanelOptions = {}
): InfoPanelLayout {
  const s = INFO_PANEL_STYLE;
  const layout = layoutInfoPanel(rows, options);
  const { x, y, width, height, rowTops, columns } = layout;
  const left = x + s.paddingX;
  const right = x + width - s.paddingX;
  const secondUnitRight = right;
  const firstUnitRight =
    columns === 2 ? right - (s.valueWidth + s.unitGap + s.unitWidth) : right;

  // 背景（影つきの白いカード）
  p.push();
  const ctx = p.drawingContext as CanvasRenderingContext2D;
  ctx.shadowColor = s.shadowColor;
  ctx.shadowBlur = s.shadowBlur;
  ctx.shadowOffsetY = s.shadowOffsetY;
  p.fill(s.backgroundColor);
  p.stroke(s.borderColor);
  p.strokeWeight(1);
  p.rect(x, y, width, height, s.radius);
  p.pop();

  rows.forEach((row, i) => {
    const top = rowTops[i];
    const centerY = top + s.rowHeight / 2;

    if (i > 0 && row.dividerAbove) {
      p.push();
      p.stroke(s.dividerColor);
      p.strokeWeight(1);
      p.line(left, top, right, top);
      p.pop();
    }

    p.push();
    p.noStroke();
    p.textAlign(p.LEFT, p.CENTER);
    if (options.font) p.textFont(options.font);
    p.textSize(s.labelSize);
    p.fill(s.mutedColor);
    p.text(row.label, left, centerY);
    p.pop();

    const color = row.color ?? s.valueColor;
    drawValueCell(
      p,
      row.value,
      row.unit,
      firstUnitRight,
      centerY,
      color,
      options.font
    );
    if (row.secondValue !== undefined) {
      drawValueCell(
        p,
        row.secondValue,
        row.secondUnit,
        secondUnitRight,
        centerY,
        color,
        options.font
      );
    }
  });

  return layout;
}
