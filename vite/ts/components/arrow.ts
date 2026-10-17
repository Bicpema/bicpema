import type p5 from "p5";
import type { SimComponent } from "./sim-component.js";

/** 矢印の見た目に関するオプション */
export interface ArrowStyle {
  /** 線の太さ（既定: 3） */
  weight?: number;
  /** 矢印の頭の長さ（既定: 12） */
  headSize?: number;
  /** 矢印の頭の長さに対する半幅の割合の逆数（既定: 2.2。大きいほど細い頭になる） */
  headWidthDivisor?: number;
}

/** 長さがこの値未満の矢印は描画しない（px） */
const MIN_ARROW_LENGTH = 2;

/**
 * 矢印（線分 + 三角形の頭）を描画する。長さが極端に短い場合は何も描画しない。
 * 描画後のstroke/strokeWeight/fillは変更されたまま残る（既存の各シミュレーションの挙動を踏襲）。
 * @param p - p5インスタンス
 * @param fromX - 始点のX座標
 * @param fromY - 始点のY座標
 * @param toX - 終点のX座標
 * @param toY - 終点のY座標
 * @param col - 矢印の色
 * @param style - 見た目のオプション
 */
export function drawArrow(
  p: p5,
  fromX: number,
  fromY: number,
  toX: number,
  toY: number,
  col: p5.Color,
  { weight = 3, headSize = 12, headWidthDivisor = 2.2 }: ArrowStyle = {}
): void {
  const dx = toX - fromX;
  const dy = toY - fromY;
  if (Math.hypot(dx, dy) < MIN_ARROW_LENGTH) return;

  p.stroke(col);
  p.strokeWeight(weight);
  p.fill(col);
  p.line(fromX, fromY, toX, toY);

  p.push();
  p.translate(toX, toY);
  p.rotate(Math.atan2(dy, dx));
  p.noStroke();
  const halfWidth = headSize / headWidthDivisor;
  p.triangle(0, 0, -headSize, halfWidth, -headSize, -halfWidth);
  p.pop();
}

/** ラベル付き矢印のラベルに関するオプション（ArrowStyleも指定できる） */
export interface ArrowLabelStyle extends ArrowStyle {
  /** ラベルの文字サイズ（既定: 16） */
  labelFontSize?: number;
  /** 矢印の中点から法線方向へのラベルのずれ（既定: 18） */
  labelOffset?: number;
}

/**
 * 矢印とラベルをまとめて描画する。ラベルは矢印の中点から法線方向にずらして矢印と同じ色で表示する。
 * 矢印が極端に短い場合はラベルも描画しない。
 * @param p - p5インスタンス
 * @param fromX - 始点のX座標
 * @param fromY - 始点のY座標
 * @param toX - 終点のX座標
 * @param toY - 終点のY座標
 * @param col - 矢印とラベルの色
 * @param label - 表示するテキスト
 * @param style - 見た目のオプション
 */
export function drawArrowWithLabel(
  p: p5,
  fromX: number,
  fromY: number,
  toX: number,
  toY: number,
  col: p5.Color,
  label: string,
  { labelFontSize = 16, labelOffset = 18, ...arrowStyle }: ArrowLabelStyle = {}
): void {
  const dx = toX - fromX;
  const dy = toY - fromY;
  const len = Math.hypot(dx, dy);
  if (len < MIN_ARROW_LENGTH) return;

  drawArrow(p, fromX, fromY, toX, toY, col, arrowStyle);

  p.noStroke();
  p.textSize(labelFontSize);
  p.textAlign(p.CENTER, p.CENTER);
  p.fill(col);
  p.text(
    label,
    (fromX + toX) / 2 + (-dy / len) * labelOffset,
    (fromY + toY) / 2 + (dx / len) * labelOffset
  );
}

/**
 * 始点・終点を保持して描画する矢印コンポーネント。
 * 座標を毎フレーム書き換える使い方（ドラッグ操作など）を想定している。
 */
export class Arrow implements SimComponent {
  private readonly initial: {
    fromX: number;
    fromY: number;
    toX: number;
    toY: number;
  };

  /**
   * @param fromX - 始点のX座標
   * @param fromY - 始点のY座標
   * @param toX - 終点のX座標
   * @param toY - 終点のY座標
   * @param color - 矢印の色（未設定の間は描画しない）
   * @param style - 見た目のオプション
   */
  constructor(
    public fromX = 0,
    public fromY = 0,
    public toX = 0,
    public toY = 0,
    public color: p5.Color | null = null,
    public style: ArrowStyle = {}
  ) {
    this.initial = { fromX, fromY, toX, toY };
  }

  /** 始点と終点を設定する */
  set(fromX: number, fromY: number, toX: number, toY: number): void {
    this.fromX = fromX;
    this.fromY = fromY;
    this.toX = toX;
    this.toY = toY;
  }

  /** 矢印は自発的に状態を変えないため何もしない（SimComponentの要件を満たすためのメソッド） */
  // oxlint-disable-next-line class-methods-use-this
  update(): void {}

  /** 始点と終点をコンストラクターで指定した値に戻す（色と見た目は変更しない） */
  reset(): void {
    const { fromX, fromY, toX, toY } = this.initial;
    this.set(fromX, fromY, toX, toY);
  }

  /** 色の参照を手放す。以降は色を再設定するまで描画しない */
  dispose(): void {
    this.color = null;
  }

  /**
   * 矢印を描画する。
   * @param p - p5インスタンス
   */
  draw(p: p5): void {
    if (!this.color) return;
    drawArrow(
      p,
      this.fromX,
      this.fromY,
      this.toX,
      this.toY,
      this.color,
      this.style
    );
  }
}
