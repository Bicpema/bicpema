import { state } from "./state.js";
import {
  V_W,
  V_H,
  FORCE_SCALE,
  GRID_STEP,
  SLOPE_SCALE,
  ORIGIN_X,
  ORIGIN_Y,
  GRAVITY,
} from "./constants.js";

// ── 共通ユーティリティ ──────────────────────────────────────────────

/**
 * 矢印を描画する。
 * @param {p5} p
 * @param {number} x1 始点X
 * @param {number} y1 始点Y
 * @param {number} x2 終点X
 * @param {number} y2 終点Y
 * @param {p5.Color} col 色
 * @param {number} [sw=3] strokeWeight
 */
export function drawArrow(p, x1, y1, x2, y2, col, sw = 3) {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const len = p.sqrt(dx * dx + dy * dy);
  if (len < 2) return;

  const headSize = 12;
  const angle = p.atan2(dy, dx);

  p.stroke(col);
  p.strokeWeight(sw);
  p.fill(col);
  p.line(x1, y1, x2, y2);
  p.push();
  p.translate(x2, y2);
  p.rotate(angle);
  p.noStroke();
  p.triangle(0, 0, -headSize, headSize / 2.2, -headSize, -headSize / 2.2);
  p.pop();
}

/**
 * 点線を描画する。
 * @param {p5} p
 * @param {number} x1
 * @param {number} y1
 * @param {number} x2
 * @param {number} y2
 * @param {p5.Color} col
 */
function drawDashed(p, x1, y1, x2, y2, col) {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const len = p.sqrt(dx * dx + dy * dy);
  if (len < 1) return;
  const dashLen = 8;
  const gapLen = 6;
  const ux = dx / len;
  const uy = dy / len;
  let d = 0;
  let drawing = true;
  p.stroke(col);
  p.strokeWeight(1.5);
  while (d < len) {
    const segLen = p.min(drawing ? dashLen : gapLen, len - d);
    if (drawing) {
      p.line(
        x1 + ux * d,
        y1 + uy * d,
        x1 + ux * (d + segLen),
        y1 + uy * (d + segLen)
      );
    }
    d += segLen;
    drawing = !drawing;
  }
}

/**
 * ラベル付きテキストを半透明背景で描画する。
 * @param {p5} p
 * @param {string} text
 * @param {number} x
 * @param {number} y
 * @param {p5.Color} col テキスト色
 * @param {number} [sz=16] フォントサイズ
 */
function drawLabel(p, text, x, y, col, sz = 16) {
  p.textSize(sz);
  p.noStroke();
  p.fill(col);
  p.textAlign(p.CENTER, p.CENTER);
  p.text(text, x, y);
}

// ── XY分解モード ────────────────────────────────────────────────────

/**
 * XY分解モードのシーンを描画する。
 * @param {p5} p
 */
export function drawXYScene(p) {
  p.background(255, 255, 255);
  drawGrid(p);
  drawAxes(p, ORIGIN_X, ORIGIN_Y);

  const θ = (state.forceAngle * Math.PI) / 180;
  const F = state.forceMag * FORCE_SCALE;
  const Fx = F * Math.cos(θ);
  const Fy = -F * Math.sin(θ); // y軸反転（下が正）

  const tipX = ORIGIN_X + Fx;
  const tipY = ORIGIN_Y + Fy;

  // 補助破線（平行四辺形の辺）
  drawDashed(
    p,
    ORIGIN_X,
    ORIGIN_Y + Fy,
    tipX,
    tipY,
    p.color(100, 100, 100, 120)
  );
  drawDashed(
    p,
    ORIGIN_X + Fx,
    ORIGIN_Y,
    tipX,
    tipY,
    p.color(100, 100, 100, 120)
  );

  // 水平成分 Fx（赤）
  drawArrow(
    p,
    ORIGIN_X,
    ORIGIN_Y,
    ORIGIN_X + Fx,
    ORIGIN_Y,
    p.color(220, 50, 50)
  );
  // 垂直成分 Fy（青）
  drawArrow(
    p,
    ORIGIN_X,
    ORIGIN_Y,
    ORIGIN_X,
    ORIGIN_Y + Fy,
    p.color(50, 100, 220)
  );
  // 力 F（黒）
  drawArrow(p, ORIGIN_X, ORIGIN_Y, tipX, tipY, p.color(0), 4);

  // 角度弧
  drawAngleArc(p, ORIGIN_X, ORIGIN_Y, θ, 50);

  // ラベル
  drawXYLabels(p, Fx, Fy, tipX, tipY, θ);
  drawXYInfoPanel(p, Fx, Fy);
  drawInteractionHint(p, tipX, tipY);
}

/**
 * グリッドを描画する。
 * @param {p5} p
 */
function drawGrid(p) {
  p.strokeWeight(1);
  p.stroke(168, 206, 221);
  for (let x = ORIGIN_X; x <= V_W; x += GRID_STEP) p.line(x, 0, x, V_H);
  for (let x = ORIGIN_X - GRID_STEP; x >= 0; x -= GRID_STEP)
    p.line(x, 0, x, V_H);
  for (let y = ORIGIN_Y; y <= V_H; y += GRID_STEP) p.line(0, y, V_W, y);
  for (let y = ORIGIN_Y - GRID_STEP; y >= 0; y -= GRID_STEP)
    p.line(0, y, V_W, y);
}

/**
 * X・Y軸を描画する。
 * @param {p5} p
 * @param {number} ox 原点X
 * @param {number} oy 原点Y
 */
function drawAxes(p, ox, oy) {
  const axisColor = p.color(0);
  const axisWeight = 2;
  const axisHeadSize = 10;
  drawArrow(p, ox, oy, V_W - 10, oy, axisColor, axisWeight);
  drawArrow(p, ox, oy, 10, oy, axisColor, axisWeight);
  drawArrow(p, ox, oy, ox, 10, axisColor, axisWeight);
  drawArrow(p, ox, oy, ox, V_H - 10, axisColor, axisWeight);

  // 軸ラベル
  p.noStroke();
  p.fill(0);
  p.textSize(18);
  p.textAlign(p.CENTER, p.CENTER);
  p.text("x", V_W - 8, oy + 20);
  p.text("y", ox - 20, 10);

  // 原点ラベル『O』
  p.textSize(16);
  p.text("O", ox - 14, oy + 14);
}

/**
 * 角度弧を描画する。
 * @param {p5} p
 * @param {number} ox
 * @param {number} oy
 * @param {number} θ ラジアン
 * @param {number} r 半径
 */
function drawAngleArc(p, ox, oy, θ, r) {
  if (Math.abs(θ) < 0.02) return;
  p.noFill();
  p.stroke(80, 80, 80, 200);
  p.strokeWeight(1.5);
  // p5の arc は時計回り正。物理角（反時計回り正）→ p5では -θ
  p.arc(ox, oy, r * 2, r * 2, -θ, 0);

  // θラベル
  const midAngle = -θ / 2;
  const lx = ox + (r + 14) * Math.cos(midAngle);
  const ly = oy + (r + 14) * Math.sin(midAngle);
  drawLabel(p, "θ", lx, ly, p.color(60, 60, 60), 14);
}

/**
 * 各ベクトルのラベルを描画する。
 * @param {p5} p
 * @param {number} Fx 水平成分（仮想px）
 * @param {number} Fy 垂直成分（仮想px, 下正）
 * @param {number} tipX 合力先端X
 * @param {number} tipY 合力先端Y
 * @param {number} θ ラジアン
 */
function drawXYLabels(p, Fx, Fy, tipX, tipY, θ) {
  // F ラベル（力の中点より少し外側）
  const midX = ORIGIN_X + Fx / 2 + 16 * Math.sin(θ);
  const midY = ORIGIN_Y + Fy / 2 - 16 * Math.cos(θ);
  drawLabel(p, "F", midX, midY, p.color(0), 18);

  // Fx ラベル
  if (Math.abs(Fx) > 8) {
    drawLabel(
      p,
      "Fx",
      ORIGIN_X + Fx / 2,
      ORIGIN_Y + (Fy >= 0 ? 18 : -18),
      p.color(220, 50, 50),
      15
    );
  }

  // Fy ラベル
  if (Math.abs(Fy) > 8) {
    drawLabel(
      p,
      "Fy",
      ORIGIN_X + (Fx >= 0 ? -22 : 22),
      ORIGIN_Y + Fy / 2,
      p.color(50, 100, 220),
      15
    );
  }
}

/**
 * 右下に数値パネルを描画する。
 * @param {p5} p
 * @param {number} Fx 仮想px
 * @param {number} Fy 仮想px（下正）
 */
function drawXYInfoPanel(p, Fx, Fy) {
  const fxN = Fx / FORCE_SCALE;
  const fyN = -Fy / FORCE_SCALE; // 物理のy（上正）
  const fN = state.forceMag;
  const θStr = `${state.forceAngle.toFixed(1)}°`;

  const panelW = 248;
  const panelH = 118;
  const panelX = V_W - panelW - 10;
  const panelY = V_H - panelH - 10;

  p.fill(255);
  p.stroke(0);
  p.strokeWeight(1.5);
  p.rect(panelX, panelY, panelW, panelH, 8);

  const colLabel = panelX + 16;
  const colMag = panelX + panelW - 86;
  const colAngle = panelX + panelW - 14;
  const cy1 = panelY + 24; // F
  const divY = panelY + 44; // 区切り線（F と Fx の間）
  const cy2 = panelY + 68; // Fx
  const cy3 = panelY + 96; // Fy

  // 区切り線（F と Fx の間）— テキストより先に描いて文字が前面に
  p.stroke(0, 60);
  p.strokeWeight(1);
  p.line(colLabel, divY, panelX + panelW - 16, divY);
  p.noStroke();

  p.textSize(14);

  // F
  p.fill(0);
  p.textAlign(p.LEFT, p.CENTER);
  p.text("F", colLabel, cy1);
  p.textAlign(p.RIGHT, p.CENTER);
  p.text(`${fN.toFixed(1)} N`, colMag, cy1);
  p.text(θStr, colAngle, cy1);

  // Fx
  p.fill(220, 50, 50);
  p.textAlign(p.LEFT, p.CENTER);
  p.text("Fx", colLabel, cy2);
  p.textAlign(p.RIGHT, p.CENTER);
  p.text(`${fxN.toFixed(1)} N`, colMag, cy2);

  // Fy
  p.fill(50, 100, 220);
  p.textAlign(p.LEFT, p.CENTER);
  p.text("Fy", colLabel, cy3);
  p.textAlign(p.RIGHT, p.CENTER);
  p.text(`${fyN.toFixed(1)} N`, colMag, cy3);

  p.textAlign(p.CENTER, p.CENTER);
}

function drawInteractionHint(p, tipX, tipY) {
  // 先端の円
  p.noFill();
  p.stroke(0, 0, 0, state.isDragging ? 180 : 80);
  p.strokeWeight(2);
  p.circle(tipX, tipY, 20);
}

// ── 斜面分解モード ───────────────────────────────────────────────────

/**
 * 斜面分解モードのシーンを描画する。
 * @param {p5} p
 */
export function drawSlopeScene(p) {
  const θ = (state.slopeAngle * Math.PI) / 180;
  const mg = state.mass * GRAVITY;
  const sc = SLOPE_SCALE * 0.9; // 斜面モードのスケール係数

  // 斜面の基準点（オブジェクト位置）
  const ox = 440;
  const oy = 300;

  p.background(255, 255, 255);
  drawSlopeSurface(p, ox, oy, θ);
  drawSlopeVectors(p, ox, oy, θ, mg, sc);
  drawSlopeInfoPanel(p, θ, mg);
  drawSlopeLegend(p);
}

/**
 * 斜面の表面を描画する。
 * @param {p5} p
 * @param {number} ox オブジェクト原点X
 * @param {number} oy オブジェクト原点Y
 * @param {number} θ 斜面角度（ラジアン）
 */
function drawSlopeSurface(p, ox, oy, θ) {
  const cosT = Math.cos(θ);
  const sinT = Math.sin(θ);
  const len = 500;

  // 斜面本体
  const sx1 = ox - len * cosT;
  const sy1 = oy + len * sinT;
  const sx2 = ox + len * cosT;
  const sy2 = oy - len * sinT;

  // 地面（斜面の下）― 画像を斜面座標系で中央に1枚か叫画画画
  p.push();
  p.translate(ox, oy);
  p.rotate(-θ);
  const bandH = 40;
  if (state.groundImg && state.groundImg.width > 0) {
    // 幅が len*2 になるようストレッチ・中央で一枚描画
    p.image(state.groundImg, -len, 0, len * 2, bandH);
  } else {
    p.noStroke();
    p.fill(200, 185, 155);
    p.rect(-len, 0, len * 2, bandH);
  }
  p.pop();

  // 角度弧―左下領域に配置（水平方向と斜面のなす角θ）
  const arcR = 55;
  const arcDist = 320;
  const arcCX = ox - arcDist * cosT;
  const arcCY = oy + arcDist * sinT;
  // 水平基準線
  p.stroke(80, 80, 80, 160);
  p.strokeWeight(1.5);
  p.line(arcCX, arcCY, arcCX + arcR + 24, arcCY);
  // 弧（斜面方向 = -θ から 水平 = 0 へ）
  p.noFill();
  p.stroke(60, 60, 60, 210);
  p.strokeWeight(1.5);
  p.arc(arcCX, arcCY, arcR * 2, arcR * 2, -θ, 0);
  drawLabel(
    p,
    `θ=${state.slopeAngle}°`,
    arcCX + arcR + 30,
    arcCY - 10,
    p.color(60, 60, 60),
    14
  );

  // オブジェクト（ブロック）
  drawBlock(p, ox, oy, θ);
}

/**
 * 斜面上のブロックを描画する。
 * @param {p5} p
 * @param {number} ox
 * @param {number} oy
 * @param {number} θ
 */
function drawBlock(p, ox, oy, θ) {
  const bw = 52;
  const bh = 36;
  p.push();
  p.translate(ox, oy);
  p.rotate(-θ);
  p.fill(222, 196, 165); // 薄い茶色
  p.stroke(139, 90, 43); // 濃い茶色枚
  p.strokeWeight(2);
  p.rect(-bw / 2, -bh, bw, bh, 3);
  p.pop();
}

/**
 * 斜面分解の力ベクトルを描画する。
 * @param {p5} p
 * @param {number} ox 原点X
 * @param {number} oy 原点Y
 * @param {number} θ 斜面角度（ラジアン）
 * @param {number} mg 重力の大きさ（N）
 * @param {number} sc スケール
 */
function drawSlopeVectors(p, ox, oy, θ, mg, sc) {
  const cosT = Math.cos(θ);
  const sinT = Math.sin(θ);
  const bh = 36; // ブロック高さ
  const bw = 52;

  // ベクトルの基点をブロック中央に
  const baseX = ox - (bh / 2) * sinT;
  const baseY = oy - (bh / 2) * cosT;

  // 重力ベクトル（直下）
  const gravLen = mg * sc;
  const tipGravX = baseX;
  const tipGravY = baseY + gravLen;

  // F_parallel（斜面下向き）
  const fpLen = mg * sinT * sc;
  const tipParX = baseX + fpLen * cosT;
  const tipParY = baseY + fpLen * sinT;

  // F_perp（斜面への法線方向、斜面に押し込む）
  const fnLen = mg * cosT * sc;
  const tipPerpX = baseX - fnLen * sinT;
  const tipPerpY = baseY + fnLen * cosT;

  // 補助破線（平行四辺形：各成分先端から重力先端へ）
  drawDashed(p, tipPerpX, tipPerpY, tipGravX, tipGravY, p.color(150, 150, 150));
  drawDashed(p, tipParX, tipParY, tipGravX, tipGravY, p.color(150, 150, 150));

  // F_perp（青）
  drawArrow(p, baseX, baseY, tipPerpX, tipPerpY, p.color(50, 100, 220), 3);
  // F_parallel（赤）
  drawArrow(p, baseX, baseY, tipParX, tipParY, p.color(220, 50, 50), 3);
  // 重力 mg（緑）
  drawArrow(p, baseX, baseY, tipGravX, tipGravY, p.color(40, 170, 70), 4);

  // ラベル
  drawLabel(p, "mg", baseX + 16, baseY + gravLen / 2, p.color(40, 170, 70), 16);
  if (fpLen > 8) {
    const lx = baseX + (fpLen * cosT) / 2 + 18 * sinT;
    const ly = baseY + (fpLen * sinT) / 2 - 18 * cosT;
    drawLabel(p, "mg sinθ", lx, ly, p.color(220, 50, 50), 14);
  }
  if (fnLen > 8) {
    const lx = baseX - (fnLen * sinT) / 2 - 22 * cosT;
    const ly = baseY + (fnLen * cosT) / 2 - 22 * sinT;
    drawLabel(p, "mg cosθ", lx, ly, p.color(50, 100, 220), 14);
  }

  // 直角マーク
  drawRightAngleMark(p, baseX, baseY, θ, 18);
}

/**
 * F_parallel と F_perp の直角マークを描画する。
 * @param {p5} p
 * @param {number} ox
 * @param {number} oy
 * @param {number} θ
 * @param {number} sz マークのサイズ
 */
function drawRightAngleMark(p, ox, oy, θ, sz) {
  const cosT = Math.cos(θ);
  const sinT = Math.sin(θ);
  const cx = ox + sz * cosT;
  const cy = oy + sz * sinT;
  const cx2 = cx - sz * sinT;
  const cy2 = cy + sz * cosT;
  const cx3 = ox - sz * sinT;
  const cy3 = oy + sz * cosT;
  p.noFill();
  p.stroke(100, 100, 100, 180);
  p.strokeWeight(1.2);
  p.beginShape();
  p.vertex(cx, cy);
  p.vertex(cx2, cy2);
  p.vertex(cx3, cy3);
  p.endShape();
}

/**
 * 右下に斜面モードの数値パネルを描画する。
 * @param {p5} p
 * @param {number} θ ラジアン
 * @param {number} mg N
 */
function drawSlopeInfoPanel(p, θ, mg) {
  const panelW = 290;
  const panelH = 130;
  const panelX = V_W - panelW - 10;
  const panelY = V_H - panelH - 10;
  const lineH = 26;

  p.fill(255);
  p.stroke(0);
  p.strokeWeight(1.5);
  p.rect(panelX, panelY, panelW, panelH, 8);
  p.noStroke();

  const mgStr = mg.toFixed(1);
  const fpStr = (mg * Math.sin(θ)).toFixed(1);
  const fnStr = (mg * Math.cos(θ)).toFixed(1);
  const θStr = `${state.slopeAngle.toFixed(1)}°`;

  p.textSize(14);
  p.textAlign(p.LEFT, p.CENTER);

  p.fill(40, 170, 70);
  p.text(`mg        = ${mgStr} N`, panelX + 16, panelY + lineH * 0.6);
  p.fill(220, 50, 50);
  p.text(
    `mg sinθ  = ${fpStr} N（斜面方向）`,
    panelX + 16,
    panelY + lineH * 1.7
  );
  p.fill(50, 100, 220);
  p.text(`mg cosθ = ${fnStr} N（垂直方向）`, panelX + 16, panelY + lineH * 2.8);
  p.fill(0);
  p.text(`θ（斜面角）= ${θStr}`, panelX + 16, panelY + lineH * 3.9);

  p.textAlign(p.CENTER, p.CENTER);
}

/**
 * 左上に斜面モードの凡例を描画する。
 * @param {p5} p
 */
function drawSlopeLegend(p) {
  const lx = 16;
  const ly = 16;
  const panelW = 260;
  const panelH = 80;
  const lineH = 22;

  p.fill(255);
  p.stroke(0);
  p.strokeWeight(1.5);
  p.rect(lx, ly, panelW, panelH, 6);
  p.noStroke();

  p.textSize(13);
  p.textAlign(p.LEFT, p.CENTER);
  p.fill(40, 170, 70);
  p.text("━━ mg: 重力", lx + 10, ly + lineH * 0.6);
  p.fill(220, 50, 50);
  p.text("━━ mg sinθ: 斜面方向成分", lx + 10, ly + lineH * 1.7);
  p.fill(50, 100, 220);
  p.text("━━ mg cosθ: 斜面垂直方向成分", lx + 10, ly + lineH * 2.8);

  p.textAlign(p.CENTER, p.CENTER);
}

// ── ドラッグ操作（XYモード） ────────────────────────────────────────

/**
 * マウス/タッチ押下時の処理。
 * @param {p5} p
 */
export function handlePress(p) {
  if (state.mode !== "xy") return;
  const vx = (p.mouseX * V_W) / p.width;
  const vy = (p.mouseY * V_W) / p.width;
  const θ = (state.forceAngle * Math.PI) / 180;
  const F = state.forceMag * FORCE_SCALE;
  const tipX = ORIGIN_X + F * Math.cos(θ);
  const tipY = ORIGIN_Y - F * Math.sin(θ);
  const dist = Math.hypot(vx - tipX, vy - tipY);
  if (dist < 28) {
    state.isDragging = true;
  }
}

/**
 * マウス/タッチドラッグ時の処理。
 * @param {p5} p
 * @param {number} MAX_FORCE 力の最大値（N）
 */
export function handleDrag(p, MAX_FORCE) {
  if (state.mode !== "xy" || !state.isDragging) return;
  const vx = (p.mouseX * V_W) / p.width;
  const vy = (p.mouseY * V_W) / p.width;
  const dx = vx - ORIGIN_X;
  const dy = vy - ORIGIN_Y;
  // グリッドスナップ
  const sdx = Math.round(dx / GRID_STEP) * GRID_STEP;
  const sdy = Math.round(dy / GRID_STEP) * GRID_STEP;
  const len = Math.hypot(sdx, sdy);
  if (len < 1) return;
  // 物理角度（x右向き正、y上向き正）
  const angleRad = Math.atan2(-sdy, sdx);
  let angleDeg = (angleRad * 180) / Math.PI;
  if (angleDeg < 0) angleDeg += 360;
  state.forceAngle = angleDeg;
  state.forceMag = len / FORCE_SCALE;

  // UIスライダー更新
  if (state.magnitudeInput) state.magnitudeInput.value(state.forceMag);
  if (state.magnitudeValue)
    state.magnitudeValue.html(`${state.forceMag.toFixed(1)} N`);
  if (state.angleInput) state.angleInput.value(state.forceAngle);
  if (state.angleValue)
    state.angleValue.html(`${state.forceAngle.toFixed(0)}°`);
}

/**
 * マウス/タッチ離し時の処理。
 */
export function handleRelease() {
  state.isDragging = false;
}
