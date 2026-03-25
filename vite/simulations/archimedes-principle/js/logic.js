import { state } from "./state.js";
import { BASE_W, BASE_H, TANK_BOTTOM_Y, CYL_H } from "./init.js";

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

  p.background(255);

  if (state.tank) {
    state.tank.draw(p);
  }
  if (state.cylinder) {
    state.cylinder.draw(p);
  }

  drawInfoText(state.cylinder, 175);

  state.cylinder.update(175, TANK_BOTTOM_Y);

  if (state.cylinder.dragging) {
    state.cylinder.cy =
      p.mouseY / (p.height / BASE_H) + state.cylinder.dragOffsetY;
    state.cylinder.cy = p.constrain(state.cylinder.cy, 175, TANK_BOTTOM_Y - 50);
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
    p.loop();
  }
}
