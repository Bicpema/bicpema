import { state } from "./state.js";
import { V_W, V_H, SLOPE_SCALE, GRAVITY } from "./constants.js";

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
 * ラベル付きテキストを描画する。
 */
function drawLabel(p, text, x, y, col, sz = 16) {
  p.textSize(sz);
  p.noStroke();
  p.fill(col);
  p.textAlign(p.CENTER, p.CENTER);
  p.text(text, x, y);
}

// ── 斜面分解モード ───────────────────────────────────────────────────

/**
 * 斜面分解のシーンを描画する。
 * @param {p5} p
 */
export function drawSlopeScene(p) {
  const θ = (state.slopeAngle * Math.PI) / 180;
  const mg = state.mass * GRAVITY;
  const sc = SLOPE_SCALE * 0.9;

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

  // 地面（斜面の下）― 画像を斜面座標系で中央に1枚描画
  p.push();
  p.translate(ox, oy);
  p.rotate(-θ);
  const bandH = 40;
  if (state.groundImg && state.groundImg.width > 0) {
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
  p.stroke(139, 90, 43); // 濃い茶色
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
 * 右下に数値パネルを描画する。
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
 * 左上に凡例を描画する。
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
