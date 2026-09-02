import { state } from "./state.js";
import { resetState } from "./init.js";
import { computeTemperatureAtTime } from "./physics.js";

// 仮想キャンバス寸法: p.scale(p.width / 1000) 適用後の 1000×562 論理ピクセル空間
// 左側ブロック (接触前)
const L_BLK_X = 63;
const L_BLK_TOP_Y = 42;
const L_BLK_BOT_Y = 323;
const BLK_W = 250;
const BLK_H = 197;

// 右側ブロック (接触後)
const R_BLK_X = 406;
const R_BLK_TOP_Y = 84;
const R_BLK_BOT_Y = 281;

// グラフ背景矩形
const G_BG_X = 684;
const G_BG_Y = 122;
const G_BG_W = 310;
const G_BG_H = 305;

// グラフ内部（プロット領域）
const GX = 707;
const GY = 130;
const GW = 277;
const GH = 266;

export function drawSimulation(p) {
  p.frameRate(20);
  p.background(255);

  updateTemperature();
  leftArea(p);
  rightArea(p);
  middleArrow(p);
  drawGraph(p);
}

function updateTemperature() {
  let contactState = parseInt(
    document.querySelector('input[name="contact"]:checked')?.value ?? "1"
  );
  if (contactState === 0) {
    state.t++;
    state.Thot = computeTemperatureAtTime(
      state.Teq,
      state.Thot0,
      state.heatK,
      state.t
    );
    state.Tcold = computeTemperatureAtTime(
      state.Teq,
      state.Tcold0,
      state.heatK,
      state.t
    );
  } else {
    resetState();
  }
}

function leftArea(p) {
  drawBlock(p, L_BLK_X, L_BLK_TOP_Y, BLK_W, BLK_H, state.Thot0);
  drawBlock(p, L_BLK_X, L_BLK_BOT_Y, BLK_W, BLK_H, state.Tcold0);
}

function rightArea(p) {
  drawBlock(p, R_BLK_X, R_BLK_TOP_Y, BLK_W, BLK_H, state.Thot);
  drawBlock(p, R_BLK_X, R_BLK_BOT_Y, BLK_W, BLK_H, state.Tcold);
}

function drawBlock(p, x, y, w, h, T) {
  let coldCol = p.color(0, 120, 255, 120);
  let hotCol = p.color(255, 80, 0, 120);
  let tcol = p.constrain((T - state.Tmin) / (state.Tmax - state.Tmin), 0, 1);
  p.fill(p.lerpColor(coldCol, hotCol, tcol));
  p.stroke(0);
  p.rect(x, y, w, h);
  drawMolecules(p, x, y, w, h, T);
  p.fill(0);
  p.noStroke();
  p.textSize(12);
  p.text(`${T.toFixed(1)} K`, x + 6, y + 14);
}

function drawMolecules(p, x, y, w, h, T) {
  let dx = w / state.cols;
  let dy = h / state.rows;
  let amp = 0.3 * p.sqrt(p.max(T, 0));
  amp = p.constrain(amp, 0, 11);
  p.fill(255);
  p.stroke(0);
  for (let j = 0; j < state.rows; j++) {
    for (let i = 0; i < state.cols; i++) {
      let cx = x + (i + 0.5) * dx;
      let cy = y + (j + 0.5) * dy;
      p.ellipse(
        cx + p.random(-amp, amp),
        cy + p.random(-amp, amp),
        state.ballR * 2
      );
    }
  }
}

function middleArrow(p) {
  p.fill(255, 0, 0, 120);
  p.noStroke();
  p.rect(275, 270, 69, 22);
  p.triangle(378, 281, 344, 253, 344, 309);
}

function drawGraph(p) {
  const tx = (t) => p.map(t, 0, state.tMax, GX, GX + GW);
  const ty = (T) => p.map(T, state.Tmin, state.Tmax, GY + GH, GY);

  p.push();

  // 背景矩形
  p.noStroke();
  p.fill(185, 220, 255);
  p.rect(G_BG_X, G_BG_Y, G_BG_W, G_BG_H);
  p.fill(255);
  p.rect(GX, GY, GW, GH);

  // 凡例
  p.textSize(13);
  p.fill(0);
  p.stroke(255, 0, 0);
  p.line(918, 147, 957, 147);
  p.noStroke();
  p.text("物質(高温)", 856, 151);
  p.stroke(0, 0, 255);
  p.line(918, 172, 957, 172);
  p.noStroke();
  p.text("物質(低温)", 856, 177);

  // 軸ラベル
  p.stroke(0);
  p.fill(0);
  p.text("接触してからの経過時間(s)", 838, 416);
  p.text("温", 686, 141);
  p.text("度", 686, 157);
  p.text("(K)", 685, 172);

  // 軸線
  p.strokeWeight(1);
  p.line(GX, GY, GX, GY + GH);
  p.line(GX, GY + GH, GX + GW, GY + GH);

  // 矢印
  p.fill(0);
  p.noStroke();
  p.triangle(704, 137, 707, 130, 710, 137);
  p.triangle(984, 396, 975, 393, 975, 399);

  const contactVal =
    document.querySelector('input[name="contact"]:checked')?.value ?? "1";

  if (contactVal === "1") {
    p.push();
    p.strokeWeight(5);
    p.stroke(255, 0, 0, 120);
    p.point(tx(0), ty(state.Thot0));
    p.stroke(0, 0, 255, 120);
    p.point(tx(0), ty(state.Tcold0));
    p.pop();
  }

  if (contactVal === "0") {
    // 平衡温度の破線
    p.drawingContext.setLineDash([8, 6]);
    p.strokeWeight(1);
    p.stroke(0);
    p.line(tx(0), ty(state.Teq), tx(state.tMax), ty(state.Teq));
    p.drawingContext.setLineDash([]);

    // 温度変化曲線（高温）
    p.noFill();
    p.strokeWeight(2);
    p.stroke(255, 0, 0);
    p.beginShape();
    for (let tt = 0; tt <= state.tMax; tt++) {
      let T = computeTemperatureAtTime(state.Teq, state.Thot0, state.heatK, tt);
      p.vertex(tx(tt), ty(T));
    }
    p.endShape();

    // 温度変化曲線（低温）
    p.stroke(0, 0, 255);
    p.beginShape();
    for (let tt = 0; tt <= state.tMax; tt++) {
      let T = computeTemperatureAtTime(
        state.Teq,
        state.Tcold0,
        state.heatK,
        tt
      );
      p.vertex(tx(tt), ty(T));
    }
    p.endShape();

    const t_now = p.min(state.t, state.tMax);

    // 高温側の現在点 + ラベル
    p.stroke(255, 0, 0);
    p.strokeWeight(5);
    p.point(tx(t_now), ty(state.Thot));
    p.push();
    let labelA = p.nf(state.Thot, 1, 2) + " K";
    p.textSize(12);
    let twA = p.textWidth(labelA);
    let thA = 14;
    let lxA = p.constrain(tx(t_now) + 6, GX + 3, GX + GW - twA - 3);
    let lyA = p.constrain(ty(state.Thot) - 6, GY + thA + 3, GY + GH - 3);
    p.noStroke();
    p.fill(255, 220);
    p.rect(lxA - 3, lyA - thA, twA + 6, thA, 3);
    p.fill(180, 0, 0);
    p.text(labelA, lxA, lyA - 3);
    p.pop();

    // 低温側の現在点 + ラベル
    p.stroke(0, 0, 255);
    p.strokeWeight(5);
    p.point(tx(t_now), ty(state.Tcold));
    p.push();
    let labelB = p.nf(state.Tcold, 1, 2) + " K";
    p.textSize(12);
    let twB = p.textWidth(labelB);
    let thB = 14;
    let lxB = p.constrain(tx(t_now) + 6, GX + 3, GX + GW - twB - 3);
    let lyB = p.constrain(ty(state.Tcold) + 20, GY + thB + 3, GY + GH - 3);
    p.noStroke();
    p.fill(255, 220);
    p.rect(lxB - 3, lyB - thB, twB + 6, thB, 3);
    p.fill(0, 0, 180);
    p.text(labelB, lxB, lyB - 3);
    p.pop();
  }

  p.pop();
}
