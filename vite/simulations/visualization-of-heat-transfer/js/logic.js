import { state } from "./state.js";

// Virtual canvas dimensions (16:9)
const V_W = 1000;

// Block layout
const BLK_X1 = 25;
const BLK_X2 = 230;
const BLK_W = 185;
const BLK_HOT_Y = 25;
const BLK_HOT_H = 230;
const BLK_COLD_Y = 285;
const BLK_COLD_H = 240;

// Molecule grid
const COLS = 7;
const ROWS = 6;
const BALL_R = 8;

// Temperature scale
const T_MIN = 0;
const T_MAX = 400;

// Graph layout
const GX = 435;
const GY = 30;
const GW = 545;
const GH = 490;
const T_MAX_GRAPH = 300;

export function drawSimulation(p) {
  updateTemperature();
  drawColumnLabels(p);
  drawLeftColumn(p);
  drawRightColumn(p);
  drawArrow(p);
  drawGraph(p);
}

function updateTemperature() {
  if (!state.moveIs || !state.contactMode) return;
  state.t++;
  state.Thot =
    state.Teq + (state.Thot0 - state.Teq) * Math.exp(-state.k * state.t);
  state.Tcold =
    state.Teq + (state.Tcold0 - state.Teq) * Math.exp(-state.k * state.t);
}

function drawColumnLabels(p) {
  p.noStroke();
  p.fill(240);
  p.textSize(13);
  p.textAlign(p.CENTER, p.CENTER);
  p.text("接触前", BLK_X1 + BLK_W / 2, 13);
  p.text("接触後", BLK_X2 + BLK_W / 2, 13);
}

function drawLeftColumn(p) {
  drawBlock(p, BLK_X1, BLK_HOT_Y, BLK_W, BLK_HOT_H, state.Thot0, "高温側");
  drawBlock(p, BLK_X1, BLK_COLD_Y, BLK_W, BLK_COLD_H, state.Tcold0, "低温側");
}

function drawRightColumn(p) {
  drawBlock(p, BLK_X2, BLK_HOT_Y, BLK_W, BLK_HOT_H, state.Thot, "高温側");
  drawBlock(p, BLK_X2, BLK_COLD_Y, BLK_W, BLK_COLD_H, state.Tcold, "低温側");
}

function drawBlock(p, x, y, w, h, T, label) {
  const coldCol = p.color(0, 120, 255, 120);
  const hotCol = p.color(255, 80, 0, 120);
  const tcol = p.constrain((T - T_MIN) / (T_MAX - T_MIN), 0, 1);
  p.fill(p.lerpColor(coldCol, hotCol, tcol));
  p.stroke(100);
  p.strokeWeight(1);
  p.rect(x, y, w, h);

  drawMolecules(p, x, y, w, h, T);

  p.noStroke();
  p.fill(0);
  p.textSize(13);
  p.textAlign(p.LEFT, p.TOP);
  p.text(`${T.toFixed(1)} K`, x + 6, y + 5);

  p.textSize(11);
  p.fill(50);
  p.textAlign(p.RIGHT, p.BOTTOM);
  p.text(label, x + w - 4, y + h - 2);

  p.textAlign(p.CENTER, p.CENTER);
}

function drawMolecules(p, x, y, w, h, T) {
  const dx = w / COLS;
  const dy = h / ROWS;
  let amp = 0.4 * Math.sqrt(Math.max(T, 0));
  amp = p.constrain(amp, 0, 15);

  p.fill(255);
  p.stroke(0);
  p.strokeWeight(1);

  for (let j = 0; j < ROWS; j++) {
    for (let i = 0; i < COLS; i++) {
      const cx = x + (i + 0.5) * dx;
      const cy = y + (j + 0.5) * dy;
      p.ellipse(cx + p.random(-amp, amp), cy + p.random(-amp, amp), BALL_R * 2);
    }
  }
}

function drawArrow(p) {
  const ax = BLK_X1 + BLK_W + 3;
  const aw = BLK_X2 - ax - 3;
  const cy_hot = BLK_HOT_Y + BLK_HOT_H / 2;
  const cy_cold = BLK_COLD_Y + BLK_COLD_H / 2;
  const arrowHead = 12;

  p.noStroke();

  // Hot arrow (red, pointing right)
  p.fill(255, 80, 0, 160);
  p.rect(ax, cy_hot - 6, aw - arrowHead, 12);
  p.triangle(
    ax + aw - arrowHead, cy_hot - arrowHead,
    ax + aw - arrowHead, cy_hot + arrowHead,
    ax + aw, cy_hot
  );

  // Cold arrow (blue, pointing right)
  p.fill(0, 100, 255, 160);
  p.rect(ax, cy_cold - 6, aw - arrowHead, 12);
  p.triangle(
    ax + aw - arrowHead, cy_cold - arrowHead,
    ax + aw - arrowHead, cy_cold + arrowHead,
    ax + aw, cy_cold
  );
}

function drawGraph(p) {
  function map_t(t) {
    return GX + (t / T_MAX_GRAPH) * GW;
  }
  function map_T(T) {
    return GY + GH - ((T - T_MIN) / (T_MAX - T_MIN)) * GH;
  }

  // Background panel
  p.noStroke();
  p.fill(220, 235, 255);
  p.rect(GX - 18, GY - 8, GW + 36, GH + 28, 6);

  // Graph area
  p.fill(255);
  p.rect(GX, GY, GW, GH);

  // Axes
  p.stroke(0);
  p.strokeWeight(2);
  p.line(GX, GY, GX, GY + GH);
  p.line(GX, GY + GH, GX + GW, GY + GH);

  // Axis arrowheads
  p.fill(0);
  p.noStroke();
  p.triangle(GX - 5, GY + 8, GX + 5, GY + 8, GX, GY);
  p.triangle(
    GX + GW - 8, GY + GH - 5,
    GX + GW - 8, GY + GH + 5,
    GX + GW, GY + GH
  );

  // Axis labels
  p.fill(0);
  p.textSize(11);
  p.textAlign(p.CENTER, p.CENTER);
  p.text("経過時間 (s)", GX + GW / 2, GY + GH + 18);
  p.push();
  p.translate(GX - 26, GY + GH / 2);
  p.rotate(-p.HALF_PI);
  p.text("温度 (K)", 0, 0);
  p.pop();

  // Time axis ticks
  for (let t = 0; t <= T_MAX_GRAPH; t += 60) {
    const x = map_t(t);
    p.stroke(200);
    p.strokeWeight(1);
    p.line(x, GY + GH, x, GY + GH + 5);
    p.noStroke();
    p.fill(80);
    p.textSize(10);
    p.textAlign(p.CENTER, p.TOP);
    p.text(t, x, GY + GH + 6);
  }

  // Temperature axis ticks
  for (let T = 0; T <= T_MAX; T += 100) {
    const y = map_T(T);
    p.stroke(200);
    p.strokeWeight(1);
    p.line(GX - 5, y, GX, y);
    p.noStroke();
    p.fill(80);
    p.textSize(10);
    p.textAlign(p.RIGHT, p.CENTER);
    p.text(T, GX - 7, y);
  }

  // Legend
  p.strokeWeight(2);
  p.stroke(255, 0, 0);
  p.line(GX + GW - 110, GY + 14, GX + GW - 92, GY + 14);
  p.noStroke();
  p.fill(180, 0, 0);
  p.textSize(11);
  p.textAlign(p.LEFT, p.CENTER);
  p.text("高温側", GX + GW - 90, GY + 14);

  p.strokeWeight(2);
  p.stroke(0, 0, 255);
  p.line(GX + GW - 110, GY + 30, GX + GW - 92, GY + 30);
  p.noStroke();
  p.fill(0, 0, 180);
  p.text("低温側", GX + GW - 90, GY + 30);

  if (state.contactMode) {
    // Equilibrium temperature dashed line
    p.stroke(80);
    p.strokeWeight(1);
    p.drawingContext.setLineDash([8, 6]);
    p.line(GX, map_T(state.Teq), GX + GW, map_T(state.Teq));
    p.drawingContext.setLineDash([]);

    // Temperature curves
    p.noFill();
    p.strokeWeight(2);

    p.stroke(255, 0, 0);
    p.beginShape();
    for (let tt = 0; tt <= T_MAX_GRAPH; tt++) {
      p.vertex(
        map_t(tt),
        map_T(state.Teq + (state.Thot0 - state.Teq) * Math.exp(-state.k * tt))
      );
    }
    p.endShape();

    p.stroke(0, 0, 255);
    p.beginShape();
    for (let tt = 0; tt <= T_MAX_GRAPH; tt++) {
      p.vertex(
        map_t(tt),
        map_T(state.Teq + (state.Tcold0 - state.Teq) * Math.exp(-state.k * tt))
      );
    }
    p.endShape();

    // Current position dots
    const t_now = Math.min(state.t, T_MAX_GRAPH);
    p.strokeWeight(6);
    p.stroke(255, 0, 0);
    p.point(map_t(t_now), map_T(state.Thot));
    p.stroke(0, 0, 255);
    p.point(map_t(t_now), map_T(state.Tcold));
  } else {
    // No contact: show initial temperature points only
    p.strokeWeight(8);
    p.stroke(255, 0, 0, 180);
    p.point(map_t(0), map_T(state.Thot0));
    p.stroke(0, 0, 255, 180);
    p.point(map_t(0), map_T(state.Tcold0));
  }
}
