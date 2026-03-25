import { state } from "./state.js";
import { updateStartButton } from "./element-function.js";
import {
  BASE_W,
  BASE_H,
  TANK_CX,
  TANK_BOTTOM_Y,
  TANK_W,
  TANK_H,
  TANK_D,
  CYL_H,
} from "./init.js";

/**
 * 水槽を等角投影法で描画する。
 * @param {*} p p5インスタンス。
 * @param {number} cx 水槽の中心X座標
 * @param {number} cy 水槽の底面Y座標
 * @param {number} tankW 水槽の幅
 * @param {number} tankH 水槽の高さ
 */
function drawTank(p, cx, cy, tankW, tankH) {
  const halfW = tankW / 2;
  const wallEdgeColor = p.color(150, 165, 180);

  const imgX = cx - halfW;
  const imgY = cy - tankH;

  p.push();
  p.imageMode(p.CORNER);
  p.image(state.tankImage, imgX, imgY, tankW, tankH);
  p.pop();
}

/**
 * 水を描画する。
 * @param {*} p p5インスタンス。
 * @param {number} cx 水槽の中心X座標
 * @param {number} waterSurfaceY 水面のY座標
 * @param {number} tankBottomY 水槽の底面Y座標
 * @param {number} tankW 水槽の幅
 * @param {number} tankD 水槽の奥行き
 */
function drawWater(p, cx, waterSurfaceY, tankBottomY, tankW, tankD) {
  const halfW = tankW / 2;
  const waterColor = p.color(70, 130, 200, 140);
  const waterSurfaceColor = p.color(100, 160, 230, 180);

  p.noStroke();

  // 水の本体（手前面）
  p.fill(waterColor);
  p.rect(cx - halfW, waterSurfaceY, tankW, tankBottomY - waterSurfaceY);

  // 水の奥面
  p.fill(p.color(50, 110, 180, 120));
  p.beginShape();
  p.vertex(cx - halfW + tankD, waterSurfaceY - tankD);
  p.vertex(cx - halfW + tankD, tankBottomY - tankD);
  p.vertex(cx + halfW + tankD, tankBottomY - tankD);
  p.vertex(cx + halfW + tankD, waterSurfaceY - tankD);
  p.endShape(p.CLOSE);

  // 水の右側面
  p.fill(p.color(60, 120, 190, 130));
  p.beginShape();
  p.vertex(cx + halfW, waterSurfaceY);
  p.vertex(cx + halfW, tankBottomY);
  p.vertex(cx + halfW + tankD, tankBottomY - tankD);
  p.vertex(cx + halfW + tankD, waterSurfaceY - tankD);
  p.endShape(p.CLOSE);

  // 水面（上面）
  p.fill(waterSurfaceColor);
  p.beginShape();
  p.vertex(cx - halfW, waterSurfaceY);
  p.vertex(cx + halfW, waterSurfaceY);
  p.vertex(cx + halfW + tankD, waterSurfaceY - tankD);
  p.vertex(cx - halfW + tankD, waterSurfaceY - tankD);
  p.endShape(p.CLOSE);
}

/**
 * 等角投影法で円柱を描画する。
 * @param {*} p p5インスタンス。
 * @param {import("./cylinder.js").Cylinder} cylinder 円柱オブジェクト
 * @param {number} waterSurfaceY 水面のY座標
 * @param {number} tankW 水槽の幅
 * @param {number} tankD 水槽の奥行き
 * @param {number} cx 水槽の中心X座標
 */
function drawCylinder(p, cylinder, waterSurfaceY, tankW, tankD, cx) {
  const r = cylinder.r;
  const h = cylinder.h;
  const cylCx = cylinder.cx;
  const cylBottomY = cylinder.cy;
  const cylTopY = cylBottomY - h;

  const ellipseRatio = 0.35;
  const ew = r * 2;
  const eh = ew * ellipseRatio;

  // 沈む物体の画像を描画
  p.push();
  p.imageMode(p.CORNER);
  p.image(state.cylinderImage, cylCx - r, cylTopY, ew, h);
  p.pop();
}

/**
 * 情報テキストをDOM要素に反映する。
 * @param {import("./cylinder.js").Cylinder} cylinder 円柱オブジェクト
 * @param {number} waterSurfaceY 水面のY座標
 */
function drawInfoText(cylinder, waterSurfaceY) {
  const subFrac = cylinder.getSubmergedFraction(waterSurfaceY);
  const pct = Math.round(subFrac * 100);
  const label = document.getElementById("submergedRatioLabel");
  if (label) {
    label.textContent = `水中体積比: ${pct}%`;
  }
}

/**
 * シミュレーション全体の描画と物理更新を行う関数。
 * @param {*} p p5インスタンス。
 */
export function drawSimulation(p) {
  p.scale(p.width / BASE_W);

  p.background(30);

  drawTank(p, TANK_CX, TANK_BOTTOM_Y, TANK_W, TANK_H, TANK_D);
  drawWater(p, TANK_CX, state.waterSurfaceY, TANK_BOTTOM_Y, TANK_W, TANK_D);
  drawCylinder(p, state.cylinder, state.waterSurfaceY, TANK_W, TANK_D, TANK_CX);

  drawInfoText(state.cylinder, state.waterSurfaceY);

  state.cylinder.update(state.waterSurfaceY, TANK_BOTTOM_Y, state.running);

  if (state.cylinder.dragging) {
    state.cylinder.cy =
      p.mouseY / (p.height / BASE_H) + state.cylinder.dragOffsetY;
    state.cylinder.cy = p.constrain(
      state.cylinder.cy,
      state.waterSurfaceY - CYL_H,
      TANK_BOTTOM_Y
    );
  }
}

/**
 * マウス押下時の処理。
 * @param {*} p p5インスタンス。
 */
export function handleMousePressed(p) {
  const scaleX = BASE_W / p.width;
  const scaleY = BASE_H / p.height;
  const mx = p.mouseX * scaleX;
  const my = p.mouseY * scaleY;

  if (state.cylinder && state.cylinder.isOver(mx, my)) {
    state.cylinder.dragging = true;
    state.cylinder.dragOffsetY = state.cylinder.cy - my;
    state.cylinder.vy = 0;
    if (!state.running) {
      p.loop();
    }
  }
}

/**
 * マウスリリース時の処理。
 * @param {*} p p5インスタンス。
 */
export function handleMouseReleased(p) {
  if (state.cylinder && state.cylinder.dragging) {
    state.cylinder.dragging = false;
    state.cylinder.vy = 0;
    if (!state.running) {
      state.running = true;
      updateStartButton(state.running);
      p.loop();
    }
  }
}
