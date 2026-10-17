import { drawArrow } from "../../../ts/components/arrow.js";
import { state } from "./state.js";
import {
  V_W,
  V_H,
  RIVER_BOTTOM,
  RIVER_COLOR,
  BOAT_COLOR,
  COMPOSITE_COLOR,
  BACKGROUND_GRAY,
  WATER_COLOR,
  BANK_COLOR,
  BANK_EDGE_COLOR,
  TEXT_COLOR,
  TEXT_MUTED_COLOR,
  PANEL_FILL,
  PANEL_STROKE,
  LABEL_FONT_SIZE,
  PANEL_FONT_SIZE,
  SCENE_FONT_SIZE,
  ARROW_WEIGHT,
  ARROW_HEAD_SIZE
} from "./constants.js";

/** 凡例・速度パネルに並べる速度の種類 */
const VELOCITY_ROWS: readonly {
  color: readonly [number, number, number];
  name: string;
  description: string;
}[] = [
  { color: RIVER_COLOR, name: "v川", description: "川の速度（常に左向き）" },
  { color: BOAT_COLOR, name: "v船", description: "船の速度（水に対して）" },
  { color: COMPOSITE_COLOR, name: "v合", description: "岸から見た合成速度" }
];

/**
 * 矢印と、白い背景付きの速度ラベルをまとめて描画する。
 * 矢印がゼロ長のときはラベルのみを始点の右に表示する。
 * @param p - p5インスタンス
 * @param fromX - 始点のX座標
 * @param fromY - 始点のY座標
 * @param toX - 終点のX座標
 * @param toY - 終点のY座標
 * @param rgb - 矢印の色
 * @param label - 表示するテキスト
 */
export function drawVelocityArrow(
  p: p5,
  fromX: number,
  fromY: number,
  toX: number,
  toY: number,
  rgb: readonly [number, number, number],
  label: string
) {
  drawArrow(p, fromX, fromY, toX, toY, p.color(...rgb), {
    weight: ARROW_WEIGHT,
    headSize: ARROW_HEAD_SIZE
  });
  p.noStroke();
  p.textSize(LABEL_FONT_SIZE);
  const pointsLeft = toX < fromX && Math.abs(toX - fromX) >= 2;
  const hAlign = pointsLeft ? p.RIGHT : p.LEFT;
  const tx =
    Math.abs(toX - fromX) < 2 ? fromX + 6 : toX + (pointsLeft ? -6 : 6);
  p.textAlign(hAlign, p.CENTER);

  // テキスト背景（白い角丸矩形）
  const tw = p.textWidth(label);
  const th = LABEL_FONT_SIZE + 6;
  const pad = 5;
  const bgX = pointsLeft ? tx - tw - pad : tx - pad;
  p.fill(255, 255, 255, 225);
  p.rect(bgX, fromY - th / 2, tw + pad * 2, th, 5);

  p.fill(...rgb);
  p.text(label, tx, fromY);
}

/**
 * シーンの背景（川・岸・ラベル）を描画する。
 * @param p - p5インスタンス
 */
export function drawScene(p: p5) {
  p.background(BACKGROUND_GRAY);
  p.noStroke();

  // 奥の岸
  p.fill(...BANK_COLOR);
  p.rect(0, 0, V_W, 20);
  // 川
  p.fill(...WATER_COLOR);
  p.rect(0, 20, V_W, RIVER_BOTTOM - 20);
  // 手前の岸
  p.fill(...BANK_COLOR);
  p.rect(0, RIVER_BOTTOM, V_W, V_H - RIVER_BOTTOM);

  // 川と岸の境界
  p.stroke(...BANK_EDGE_COLOR);
  p.strokeWeight(2);
  p.line(0, RIVER_BOTTOM, V_W, RIVER_BOTTOM);
  p.line(0, 20, V_W, 20);

  p.noStroke();
  p.fill(...TEXT_MUTED_COLOR);
  p.textSize(SCENE_FONT_SIZE);
  p.textAlign(p.LEFT, p.CENTER);
  p.text("← 川の流れ", 28, 40);
  p.text("岸", 28, RIVER_BOTTOM + 36);

  drawLegend(p);
}

/**
 * 速度パネルの背景（白い角丸矩形）を描画する。
 * @param p - p5インスタンス
 * @param x - 左上のX座標
 * @param y - 左上のY座標
 * @param w - 幅
 * @param h - 高さ
 */
function drawPanelBackground(
  p: p5,
  x: number,
  y: number,
  w: number,
  h: number
) {
  p.fill(...PANEL_FILL);
  p.stroke(...PANEL_STROKE);
  p.strokeWeight(1);
  p.rect(x, y, w, h, 10);
  p.noStroke();
}

/**
 * 速度矢印の色凡例を描画する。色付きの線サンプルと説明文を並べる。
 * @param p - p5インスタンス
 */
export function drawLegend(p: p5) {
  const lineH = 26;
  const panelW = 270;
  const panelH = lineH * VELOCITY_ROWS.length + 16;
  const px = 20;
  const py = RIVER_BOTTOM - panelH - 16;

  drawPanelBackground(p, px, py, panelW, panelH);

  p.textSize(PANEL_FONT_SIZE);
  p.textAlign(p.LEFT, p.CENTER);
  VELOCITY_ROWS.forEach((row, i) => {
    const y = py + 8 + lineH * (i + 0.5);
    p.stroke(...row.color);
    p.strokeWeight(ARROW_WEIGHT);
    p.line(px + 14, y, px + 44, y);
    p.noStroke();
    p.fill(...row.color);
    p.text(row.name, px + 54, y);
    p.fill(...TEXT_COLOR);
    p.text(row.description, px + 92, y);
  });
}

/**
 * 速度の値から、向きを表す矢印文字を返す。
 * @param v - 速度
 * @returns 向きを表す文字列
 */
function dirChar(v: number) {
  if (Math.abs(v) < 0.05) return "静止";
  return v > 0 ? "←" : "→";
}

/**
 * 右下に速度情報パネルを描画する。
 * v_合 = v_川 + v_船 の関係を視覚的に確認できる。数値は右揃えにして桁ずれを防ぐ。
 * @param p - p5インスタンス
 */
export function drawInfoPanel(p: p5) {
  if (!state.boat) return;

  const lineH = 26;
  const panelW = 230;
  const panelH = lineH * VELOCITY_ROWS.length + 16;
  const px = V_W - 20 - panelW;
  const py = V_H - 20 - panelH;

  drawPanelBackground(p, px, py, panelW, panelH);

  const speeds = [
    state.boat.riverSpeed,
    state.boat.boatSpeed,
    state.boat.compositeSpeed
  ];

  p.textSize(PANEL_FONT_SIZE);
  VELOCITY_ROWS.forEach((row, i) => {
    const y = py + 8 + lineH * (i + 0.5);
    p.fill(...row.color);
    p.textAlign(p.LEFT, p.CENTER);
    p.text(row.name, px + 14, y);
    p.fill(...TEXT_COLOR);
    p.textAlign(p.RIGHT, p.CENTER);
    p.text(`${Math.abs(speeds[i]).toFixed(1)} m/s`, px + panelW - 56, y);
    p.fill(...TEXT_MUTED_COLOR);
    p.textAlign(p.LEFT, p.CENTER);
    p.text(i === 0 ? "←" : dirChar(speeds[i]), px + panelW - 44, y);
  });
}
