import { state } from "./state.js";
import { V_W, V_H, SCALE, ORIGIN_X, ORIGIN_Y, GRAVITY } from "./constants.js";

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
  const tw = p.textWidth(text);
  const th = sz;
  const pad = 5;
  p.noStroke();
  p.fill(0, 0, 0, 180);
  p.rect(x - tw / 2 - pad, y - th / 2 - pad / 2, tw + pad * 2, th + pad, 4);
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
  p.background(25, 30, 40);
  drawGrid(p);
  drawAxes(p, ORIGIN_X, ORIGIN_Y);

  const θ = (state.forceAngle * Math.PI) / 180;
  const F = state.forceMag * SCALE;
  const Fx = F * Math.cos(θ);
  const Fy = -F * Math.sin(θ); // y軸反転（下が正）

  const tipX = ORIGIN_X + Fx;
  const tipY = ORIGIN_Y + Fy;

  // 補助破線（平行四辺形の辺）
  drawDashed(p, ORIGIN_X, ORIGIN_Y + Fy, tipX, tipY, p.color(180, 180, 180));
  drawDashed(p, ORIGIN_X + Fx, ORIGIN_Y, tipX, tipY, p.color(180, 180, 180));

  // 水平成分 Fx（赤）
  drawArrow(p, ORIGIN_X, ORIGIN_Y, ORIGIN_X + Fx, ORIGIN_Y, p.color(255, 80, 80));
  // 垂直成分 Fy（青）
  drawArrow(p, ORIGIN_X, ORIGIN_Y, ORIGIN_X, ORIGIN_Y + Fy, p.color(80, 150, 255));
  // 合力 F（黄色）
  drawArrow(p, ORIGIN_X, ORIGIN_Y, tipX, tipY, p.color(255, 215, 0), 4);

  // 角度弧
  drawAngleArc(p, ORIGIN_X, ORIGIN_Y, θ, 50);

  // ラベル
  drawXYLabels(p, Fx, Fy, tipX, tipY, θ);
  drawXYInfoPanel(p, Fx, Fy);
  drawXYLegend(p);
  drawInteractionHint(p, tipX, tipY);
}

/**
 * グリッドを描画する。
 * @param {p5} p
 */
function drawGrid(p) {
  p.stroke(50, 55, 65);
  p.strokeWeight(1);
  const step = 50;
  for (let x = 0; x <= V_W; x += step) p.line(x, 0, x, V_H);
  for (let y = 0; y <= V_H; y += step) p.line(0, y, V_W, y);
}

/**
 * X・Y軸を描画する。
 * @param {p5} p
 * @param {number} ox 原点X
 * @param {number} oy 原点Y
 */
function drawAxes(p, ox, oy) {
  const axisColor = p.color(120, 140, 160);
  p.stroke(axisColor);
  p.strokeWeight(1.5);
  p.line(ox - 300, oy, ox + 350, oy); // X軸
  p.line(ox, oy - 240, ox, oy + 240); // Y軸

  // 軸ラベル
  p.noStroke();
  p.fill(axisColor);
  p.textSize(18);
  p.textAlign(p.LEFT, p.CENTER);
  p.text("x", ox + 345, oy - 12);
  p.textAlign(p.CENTER, p.BOTTOM);
  p.text("y", ox + 12, oy - 240);

  // 原点マーカー
  p.fill(200, 200, 200);
  p.noStroke();
  p.circle(ox, oy, 8);
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
  p.stroke(255, 200, 100, 200);
  p.strokeWeight(1.5);
  // p5の arc は時計回り正。物理角（反時計回り正）→ p5では -θ
  p.arc(ox, oy, r * 2, r * 2, -θ, 0);

  // θラベル
  const midAngle = -θ / 2;
  const lx = ox + (r + 14) * Math.cos(midAngle);
  const ly = oy + (r + 14) * Math.sin(midAngle);
  drawLabel(p, "θ", lx, ly, p.color(255, 200, 100), 14);
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
  // F ラベル（合力の中点より少し外側）
  const midX = ORIGIN_X + Fx / 2 + 16 * Math.sin(θ);
  const midY = ORIGIN_Y + Fy / 2 - 16 * Math.cos(θ);
  drawLabel(p, "F", midX, midY, p.color(255, 215, 0), 18);

  // Fx ラベル
  if (Math.abs(Fx) > 8) {
    drawLabel(
      p,
      "Fx",
      ORIGIN_X + Fx / 2,
      ORIGIN_Y + (Fy >= 0 ? 18 : -18),
      p.color(255, 120, 120),
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
      p.color(120, 180, 255),
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
  const panelW = 270;
  const panelH = 116;
  const px = V_W - 16;
  const py = V_H - 16;
  const lineH = 26;

  p.noStroke();
  p.fill(0, 0, 0, 200);
  p.rect(px - panelW, py - panelH, panelW, panelH, 8);

  const fxN = (Fx / SCALE).toFixed(1);
  const fyN = ((-Fy) / SCALE).toFixed(1); // 物理のy（上正）
  const θStr = `${state.forceAngle.toFixed(1)}°`;
  const fN = state.forceMag.toFixed(1);

  p.textSize(14);
  p.textAlign(p.LEFT, p.CENTER);

  p.fill(255, 215, 0);
  p.text(`F  = ${fN} N`, px - panelW + 12, py - panelH + lineH * 0.6);
  p.fill(255, 120, 120);
  p.text(`Fx = ${fxN} N`, px - panelW + 12, py - panelH + lineH * 1.7);
  p.fill(120, 180, 255);
  p.text(`Fy = ${fyN} N`, px - panelW + 12, py - panelH + lineH * 2.8);
  p.fill(255, 200, 100);
  p.text(`θ  = ${θStr}`, px - panelW + 12, py - panelH + lineH * 3.9);
}

/**
 * 左上に凡例を描画する。
 * @param {p5} p
 */
function drawXYLegend(p) {
  const lx = 16;
  const ly = 16;
  const panelW = 220;
  const panelH = 80;
  const lineH = 22;

  p.noStroke();
  p.fill(0, 0, 0, 190);
  p.rect(lx, ly, panelW, panelH, 6);

  p.textSize(13);
  p.textAlign(p.LEFT, p.CENTER);
  p.fill(255, 215, 0);
  p.text("━━ F: 合力", lx + 10, ly + lineH * 0.6);
  p.fill(255, 120, 120);
  p.text("━━ Fx: 水平成分（x方向）", lx + 10, ly + lineH * 1.7);
  p.fill(120, 180, 255);
  p.text("━━ Fy: 垂直成分（y方向）", lx + 10, ly + lineH * 2.8);
}

/**
 * ドラッグ可能を示すヒントを描画する。
 * @param {p5} p
 * @param {number} tipX
 * @param {number} tipY
 */
function drawInteractionHint(p, tipX, tipY) {
  // 先端の円
  p.noFill();
  p.stroke(255, 215, 0, state.isDragging ? 200 : 100);
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
  const sc = SCALE * 0.9; // 斜面モードのスケール係数

  // 斜面の基準点（オブジェクト位置）
  const ox = 440;
  const oy = 300;

  p.background(20, 30, 25);
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

  // 地面（斜面の下）
  p.noStroke();
  p.fill(50, 80, 50);
  p.beginShape();
  p.vertex(sx1, sy1);
  p.vertex(sx2, sy2);
  p.vertex(sx2 + 20, sy2 + 20);
  p.vertex(sx1 + 20, sy1 + 20);
  p.endShape(p.CLOSE);

  // 斜面線
  p.stroke(160, 200, 140);
  p.strokeWeight(3);
  p.line(sx1, sy1, sx2, sy2);

  // 斜面角度弧と角度ラベル
  const arcR = 60;
  p.noFill();
  p.stroke(220, 200, 100, 200);
  p.strokeWeight(1.5);
  // 斜面の下端（右下側）での角度表示
  const bx = ox + 280 * cosT;
  const by = oy - 280 * sinT;
  p.arc(bx, by, arcR * 2, arcR * 2, -Math.PI, -θ);
  drawLabel(p, `θ=${state.slopeAngle}°`, bx - arcR - 24, by + 14, p.color(220, 200, 100), 14);

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
  const cosT = Math.cos(θ);
  const sinT = Math.sin(θ);
  const bw = 52;
  const bh = 36;
  p.push();
  p.translate(ox, oy);
  p.rotate(-θ);
  p.fill(100, 160, 220);
  p.stroke(150, 200, 255);
  p.strokeWeight(1.5);
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

  // ベクトルの基点をブロック上面中央に
  const baseX = ox - bh * sinT;
  const baseY = oy - bh * cosT;

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
  drawDashed(p, tipPerpX, tipPerpY, tipGravX, tipGravY, p.color(180, 180, 180));
  drawDashed(p, tipParX, tipParY, tipGravX, tipGravY, p.color(180, 180, 180));

  // F_perp（緑）
  drawArrow(p, baseX, baseY, tipPerpX, tipPerpY, p.color(60, 220, 130), 3);
  // F_parallel（オレンジ）
  drawArrow(p, baseX, baseY, tipParX, tipParY, p.color(255, 140, 40), 3);
  // 重力 mg（黄）
  drawArrow(p, baseX, baseY, tipGravX, tipGravY, p.color(255, 215, 0), 4);

  // ラベル
  drawLabel(p, "mg", baseX + 16, baseY + gravLen / 2, p.color(255, 215, 0), 16);
  if (fpLen > 8) {
    const lx = baseX + fpLen * cosT / 2 + 18 * sinT;
    const ly = baseY + fpLen * sinT / 2 - 18 * cosT;
    drawLabel(p, "mg sinθ", lx, ly, p.color(255, 160, 60), 14);
  }
  if (fnLen > 8) {
    const lx = baseX - fnLen * sinT / 2 - 22 * cosT;
    const ly = baseY + fnLen * cosT / 2 - 22 * sinT;
    drawLabel(p, "mg cosθ", lx, ly, p.color(60, 230, 140), 14);
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
  p.stroke(200, 200, 200, 150);
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
  const px = V_W - 16;
  const py = V_H - 16;
  const lineH = 26;

  p.noStroke();
  p.fill(0, 0, 0, 200);
  p.rect(px - panelW, py - panelH, panelW, panelH, 8);

  const mgStr = mg.toFixed(1);
  const fpStr = (mg * Math.sin(θ)).toFixed(1);
  const fnStr = (mg * Math.cos(θ)).toFixed(1);
  const θStr = `${state.slopeAngle.toFixed(1)}°`;

  p.textSize(14);
  p.textAlign(p.LEFT, p.CENTER);

  p.fill(255, 215, 0);
  p.text(`mg        = ${mgStr} N`, px - panelW + 12, py - panelH + lineH * 0.6);
  p.fill(255, 160, 60);
  p.text(
    `mg sinθ  = ${fpStr} N（斜面方向）`,
    px - panelW + 12,
    py - panelH + lineH * 1.7
  );
  p.fill(60, 230, 140);
  p.text(
    `mg cosθ = ${fnStr} N（垂直方向）`,
    px - panelW + 12,
    py - panelH + lineH * 2.8
  );
  p.fill(220, 200, 100);
  p.text(
    `θ（斜面角）= ${θStr}`,
    px - panelW + 12,
    py - panelH + lineH * 3.9
  );
}

/**
 * 左上に斜面モードの凡例を描画する。
 * @param {p5} p
 */
function drawSlopeLegend(p) {
  const lx = 16;
  const ly = 16;
  const panelW = 230;
  const panelH = 80;
  const lineH = 22;

  p.noStroke();
  p.fill(0, 0, 0, 190);
  p.rect(lx, ly, panelW, panelH, 6);

  p.textSize(13);
  p.textAlign(p.LEFT, p.CENTER);
  p.fill(255, 215, 0);
  p.text("━━ mg: 重力", lx + 10, ly + lineH * 0.6);
  p.fill(255, 160, 60);
  p.text("━━ mg sinθ: 斜面方向成分", lx + 10, ly + lineH * 1.7);
  p.fill(60, 230, 140);
  p.text("━━ mg cosθ: 斜面垂直方向成分", lx + 10, ly + lineH * 2.8);
}

// ── ドラッグ操作（XYモード） ────────────────────────────────────────

/**
 * マウス/タッチ押下時の処理。
 * @param {p5} p
 */
export function handlePress(p) {
  if (state.mode !== "xy") return;
  const vx = p.mouseX * V_W / p.width;
  const vy = p.mouseY * V_W / p.width;
  const θ = (state.forceAngle * Math.PI) / 180;
  const F = state.forceMag * SCALE;
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
  const vx = p.mouseX * V_W / p.width;
  const vy = p.mouseY * V_W / p.width;
  const dx = vx - ORIGIN_X;
  const dy = vy - ORIGIN_Y;
  const len = Math.hypot(dx, dy);
  if (len < 2) return;
  // 物理角度（x右向き正、y上向き正）
  const angleRad = Math.atan2(-dy, dx);
  let angleDeg = (angleRad * 180) / Math.PI;
  if (angleDeg < 0) angleDeg += 360;
  state.forceAngle = angleDeg;
  state.forceMag = Math.min(len / SCALE, MAX_FORCE);

  // UIスライダー更新
  if (state.magnitudeInput) state.magnitudeInput.value(state.forceMag);
  if (state.magnitudeValue)
    state.magnitudeValue.html(`${state.forceMag.toFixed(0)} N`);
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
