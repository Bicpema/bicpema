import { state } from "./state.js";
import { V_W, V_H, RIVER_BOTTOM } from "./constants.js";

/**
 * 矢印を描画する。
 * @param {p5} p p5インスタンス
 * @param {number} fromX 始点のX座標
 * @param {number} fromY 始点のY座標
 * @param {number} toX 終点のX座標
 * @param {number} toY 終点のY座標
 * @param {p5.Color} col 矢印の色
 */
export function drawArrow(p, fromX, fromY, toX, toY, col) {
  const headSize = 11;
  const dx = toX - fromX;
  const dy = toY - fromY;
  const len = p.sqrt(dx * dx + dy * dy);
  if (len < 2) return;

  p.stroke(col);
  p.strokeWeight(3);
  p.fill(col);
  p.line(fromX, fromY, toX, toY);

  const angle = p.atan2(dy, dx);
  p.push();
  p.translate(toX, toY);
  p.rotate(angle);
  p.triangle(0, 0, -headSize, headSize / 2, -headSize, -headSize / 2);
  p.pop();
}

/**
 * 矢印とラベルをまとめて描画する。
 * 矢印がゼロ長のときはラベルのみを始点の右に表示する。
 * @param {p5} p p5インスタンス
 * @param {number} fromX 始点のX座標
 * @param {number} fromY 始点のY座標
 * @param {number} toX 終点のX座標
 * @param {number} toY 終点のY座標
 * @param {p5.Color} col 矢印とラベルの色
 * @param {string} label 表示するテキスト
 */
export function drawArrowWithLabel(p, fromX, fromY, toX, toY, col, label) {
  drawArrow(p, fromX, fromY, toX, toY, col);
  p.noStroke();
  p.textSize(15);
  let tx, ty, hAlign;
  if (Math.abs(toX - fromX) < 2) {
    hAlign = p.LEFT;
    tx = fromX + 5;
    ty = fromY;
  } else if (toX < fromX) {
    hAlign = p.RIGHT;
    tx = toX - 5;
    ty = fromY;
  } else {
    hAlign = p.LEFT;
    tx = toX + 5;
    ty = fromY;
  }
  p.textAlign(hAlign, p.CENTER);

  // テキスト背景（半透明の黒い角丸矩形）
  const tw = p.textWidth(label);
  const th = 18;
  const pad = 4;
  const bgX = hAlign === p.RIGHT ? tx - tw - pad : tx - pad;
  p.fill(0, 0, 0, 175);
  p.rect(bgX, ty - th / 2 - pad / 2, tw + pad * 2, th + pad, 3);

  // 本体テキスト（白で縁取り風に描画してから色付きで上書き）
  p.fill(255, 255, 255, 220);
  p.text(label, tx + 1, ty + 1);
  p.fill(col);
  p.text(label, tx, ty);
}

/**
 * シーンの背景（川・岸・ラベル）を描画する。
 * @param {p5} p p5インスタンス
 */
export function drawScene(p) {
  p.background(28, 98, 165);

  p.fill(155, 125, 70);
  p.noStroke();
  p.rect(0, 0, V_W, 20);
  p.fill(70, 130, 50);
  p.noStroke();
  p.rect(0, 0, V_W, 9);

  p.fill(82, 155, 62);
  p.noStroke();
  p.rect(0, RIVER_BOTTOM, V_W, V_H - RIVER_BOTTOM);

  p.stroke(110, 180, 225);
  p.strokeWeight(3);
  p.line(0, RIVER_BOTTOM, V_W, RIVER_BOTTOM);
  p.line(0, 20, V_W, 20);

  p.noStroke();
  p.fill(255, 255, 255, 210);
  p.textSize(18);
  p.textAlign(p.LEFT, p.CENTER);
  p.text("← 川の流れ", 28, 38);

  p.fill(255, 255, 200);
  p.textSize(20);
  p.textAlign(p.LEFT, p.CENTER);
  p.text("原っぱ", 28, RIVER_BOTTOM + 52);

  drawLegend(p);
}

/**
 * 速度矢印の色凡例を描画する。
 * @param {p5} p p5インスタンス
 */
export function drawLegend(p) {
  const lx = 28;
  const ly = RIVER_BOTTOM - 108;
  const lineH = 24;

  p.fill(0, 0, 0, 190);
  p.noStroke();
  p.rect(lx - 8, ly - 10, 268, 84, 6);

  p.textSize(14);
  p.textAlign(p.LEFT, p.CENTER);

  p.fill(255, 100, 100);
  p.text("━━ v川: 川の速度（常に左向き）", lx, ly + lineH * 0);

  p.fill(80, 240, 100);
  p.text("━━ v船: 船の速度（水に対して）", lx, ly + lineH * 1);

  p.fill(110, 170, 255);
  p.text("━━ v合: 岸から観測した合成速度", lx, ly + lineH * 2);
}

/**
 * 右下に速度情報パネルを描画する。
 * v_合 = v_川 + v_船 の関係を視覚的に確認できる。
 * @param {p5} p p5インスタンス
 */
export function drawInfoPanel(p) {
  if (!state.boat) return;

  const px = V_W - 16;
  const py = V_H - 16;
  const panelW = 260;
  const panelH = 100;
  const lineH = 24;

  p.fill(0, 0, 0, 200);
  p.noStroke();
  p.rect(px - panelW, py - panelH, panelW, panelH, 6);

  p.textSize(14);
  p.textAlign(p.LEFT, p.CENTER);

  const dirChar = (v) => {
    if (Math.abs(v) < 0.05) return "（静止）";
    return v > 0 ? "←" : "→";
  };

  const cs = state.boat.compositeSpeed;

  p.fill(255, 100, 100);
  p.text(
    `v川: ${state.boat.riverSpeed.toFixed(1)} m/s ←`,
    px - panelW + 10,
    py - panelH + lineH * 0.6
  );

  p.fill(80, 240, 100);
  const boatDir = dirChar(state.boat.boatSpeed);
  const boatAbs = Math.abs(state.boat.boatSpeed).toFixed(1);
  p.text(
    `v船: ${boatAbs} m/s ${boatDir}`,
    px - panelW + 10,
    py - panelH + lineH * 1.7
  );

  p.fill(110, 170, 255);
  p.text(
    `v合: ${Math.abs(cs).toFixed(1)} m/s ${dirChar(cs)}`,
    px - panelW + 10,
    py - panelH + lineH * 2.8
  );
}
