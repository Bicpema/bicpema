import { state } from "./state.js";
import { SPECIFIC_HEAT, SPECIFIC_HEAT_LABELS, MASS_VALUES } from "./init.js";

/**
 * 仮想キャンバス幅（オリジナルcanvas幅と同一）
 * p.scale(p.width / VW) で実キャンバスへマッピングする。
 */
const VW = 1200;

/**
 * シミュレーション全体を描画する。
 * @param {*} p p5インスタンス
 */
export function drawSimulation(p) {
  const VH = VW * (p.height / p.width);

  p.push();
  p.scale(p.width / VW);

  p.background(255);

  drawBurner(p, VH);
  drawGraphBackground(p, VH);
  drawObjectLabels(p, VH);
  drawHooksAndBalls(p, VH);
  drawGraphLines(p, VH);
  drawSpecificHeatLabels(p, VH);

  p.pop();
}

/**
 * バーナー画像を描画する。
 * @param {*} p
 * @param {number} VH 仮想キャンバス高さ
 */
function drawBurner(p, VH) {
  if (!state.burnerImg) return;
  p.image(state.burnerImg, VW / 8, VH / 3);
  p.image(state.burnerImg, VW / 4.13, VH / 3);
}

/**
 * グラフ領域の背景（青枠 + 白内側）を描画する。
 * @param {*} p
 * @param {number} VH
 */
function drawGraphBackground(p, VH) {
  p.push();
  p.noStroke();
  p.fill(185, 220, 255);
  p.rect((VW / 2) * 0.98, VH / 12, VW / 2.1, VW / 2.4);
  p.fill(255);
  p.rect((VW / 2) * 1.05, VH / 9.5, VW / 2.35, VW / 2.75);
  p.pop();
}

/**
 * 「物質A」「物質B」のラベルテキストを描画する。
 * @param {*} p
 * @param {number} VH
 */
function drawObjectLabels(p, VH) {
  p.push();
  p.noStroke();
  p.fill(0);
  p.textSize(26);
  p.textAlign(p.LEFT, p.CENTER);
  p.text("物質A", (VW / 2) * 0.2, VW / 10);
  p.text("物質B", (VW / 2) * 0.63, VW / 10);
  p.pop();
}

/**
 * フックバー・吊り下げ線・物質球を描画する。
 * @param {*} p
 * @param {number} VH
 */
function drawHooksAndBalls(p, VH) {
  p.push();
  p.fill(181, 166, 66);
  p.stroke(181, 166, 66);
  p.strokeWeight(1);
  p.rect(50, 70, 165, 20);
  p.rect(354, 70, 165, 20);
  p.strokeWeight(3);
  p.line(215, 70, 215, VH / 3.15 - 30);
  p.line(354, 70, 354, VH / 3.15 - 30);
  p.pop();

  // 物質A
  const rA = state.massA === 0 ? 50 : 30;
  const yA = state.massA === 0 ? VH / 3.4 : VH / 3.15;
  drawMaterialBall(p, 215, yA, rA, state.materialA);

  // 物質B
  const rB = state.massB === 0 ? 50 : 30;
  const yB = state.massB === 0 ? VH / 3.4 : VH / 3.15;
  drawMaterialBall(p, 354, yB, rB, state.materialB);
}

/**
 * 放射状グラデーションで物質球を描画する。
 * @param {*} p
 * @param {number} x 中心x（仮想px）
 * @param {number} y 中心y（仮想px）
 * @param {number} r 半径（仮想px）
 * @param {number} type 物質タイプ（0-4）
 */
function drawMaterialBall(p, x, y, r, type) {
  const gradColors = [
    ["rgb(245,245,245)", "rgb(180,180,180)"], // アルミ
    ["rgb(200,200,200)", "rgb(80,80,80)"],     // 鉄
    ["rgb(255,180,120)", "rgb(140,70,30)"],    // 銅
    ["rgb(255,255,255)", "rgb(160,160,160)"],  // 銀
    ["rgb(230,230,240)", "rgb(120,120,150)"],  // 水銀
  ];
  const [c0, c1] = gradColors[type] ?? gradColors[0];
  const g = p.drawingContext.createRadialGradient(
    x - r * 0.3,
    y - r * 0.3,
    r * 0.1,
    x,
    y,
    r
  );
  g.addColorStop(0, c0);
  g.addColorStop(1, c1);

  p.push();
  p.noStroke();
  p.drawingContext.fillStyle = g;
  p.ellipse(x, y, r * 2, r * 2);
  p.pop();
}

/**
 * T-Qグラフの軸・グラフ線・凡例を描画する。
 * @param {*} p
 * @param {number} VH
 */
function drawGraphLines(p, VH) {
  const ysize = VW / 2.75;   // グラフ内側高さ（px）
  const xsize = VW / 2.35;   // グラフ内側幅（px）
  const gx0 = (VW / 2) * 1.05; // グラフ内側左端x
  const gy0 = VH / 9.5;        // グラフ内側上端y
  const axBottom = gy0 + ysize; // グラフ下端y（X軸位置）
  const axRight = gx0 + xsize;  // グラフ右端x

  // --- Y軸 ---
  p.push();
  p.stroke(0);
  p.strokeWeight(2);
  p.fill(0);
  p.line(gx0, gy0, gx0, axBottom);
  p.noStroke();
  p.triangle((VW / 2) * 1.04, VH / 8, gx0, gy0, (VW / 2) * 1.06, VH / 8);
  p.pop();

  // --- X軸 ---
  p.push();
  p.stroke(0);
  p.strokeWeight(2);
  p.fill(0);
  p.line(axRight, axBottom, gx0, axBottom);
  p.noStroke();
  p.triangle(
    axRight,
    axBottom,
    axRight * 0.986,
    axBottom * 0.99,
    axRight * 0.986,
    axBottom * 1.01
  );
  p.pop();

  // --- 軸ラベル ---
  p.push();
  p.noStroke();
  p.fill(0);
  p.textSize(26);
  p.textAlign(p.CENTER, p.CENTER);
  p.text("加熱時間(加えた熱量(Q))", (VW / 2) * 1.42, VW / 2.55 + VH / 9.5);
  p.text("温", (VW / 2) * 0.99, (VH / 9.5) * 1.3);
  p.text("度", (VW / 2) * 0.99, (VH / 9.5) * 1.6);
  p.text("(K)", (VW / 2) * 0.985, (VH / 9.5) * 1.91);
  p.pop();

  // ΔT = Q / (m × c)  →  lineOriginY から deltaY ピクセル上がる
  const lineOriginY = gy0 + (ysize * 6) / 7;

  // --- 物質A グラフ線（赤）---
  const massA = MASS_VALUES[state.massA];
  const cA = SPECIFIC_HEAT[state.materialA];
  const deltaYA = 5000 / (massA * cA);

  p.push();
  p.stroke(255, 0, 0);
  p.strokeWeight(1);
  p.line(gx0, lineOriginY, axRight, lineOriginY - deltaYA);
  // 凡例
  const legAy = gy0 + (ysize * 0.5) / 7;
  p.line((VW / 2) * 1.1, legAy, (VW / 2) * 1.2, legAy);
  p.fill(255, 0, 0);
  p.noStroke();
  p.textSize(26);
  p.textAlign(p.LEFT, p.CENTER);
  p.text("物質A", (VW / 2) * 1.21, gy0 + (ysize * 0.6) / 7);
  p.pop();

  // --- 物質B グラフ線（青）---
  const massB = MASS_VALUES[state.massB];
  const cB = SPECIFIC_HEAT[state.materialB];
  const deltaYB = 5000 / (massB * cB);

  p.push();
  p.stroke(0, 0, 255, 150);
  p.strokeWeight(1);
  p.line(gx0, lineOriginY, axRight, lineOriginY - deltaYB);
  // 凡例
  const legBy = gy0 + (ysize * 1.2) / 7;
  p.line((VW / 2) * 1.1, legBy, (VW / 2) * 1.2, legBy);
  p.fill(0, 0, 255, 150);
  p.noStroke();
  p.textSize(26);
  p.textAlign(p.LEFT, p.CENTER);
  p.text("物質B", (VW / 2) * 1.21, gy0 + (ysize * 1.35) / 7);
  p.pop();
}

/**
 * 各物質の比熱値をテキストで表示する。
 * @param {*} p
 * @param {number} VH
 */
function drawSpecificHeatLabels(p, VH) {
  p.push();
  p.noStroke();
  p.fill(0);
  p.textSize(26);
  p.textAlign(p.LEFT, p.CENTER);
  p.text(
    SPECIFIC_HEAT_LABELS[state.materialA] + "(J/(ｇ・K))",
    VW / 100,
    VH / 4.5
  );
  p.text(
    SPECIFIC_HEAT_LABELS[state.materialB] + "(J/(ｇ・K))",
    VW / 3.3,
    VH / 4.5
  );
  p.pop();
}
