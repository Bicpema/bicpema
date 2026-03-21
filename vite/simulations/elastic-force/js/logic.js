// logic.js はシミュレーションの描画ロジック専用のファイルです。

import {
  state,
  V_W,
  V_H,
  WALL_X,
  WALL_W,
  WALL_TOP,
  WALL_BOTTOM,
} from "./state.js";

/**
 * 壁を描画する
 * @param {*} p - p5 インスタンス。
 */
function drawWall(p) {
  p.fill(235);
  p.stroke(0);
  p.strokeWeight(2);
  p.rect(WALL_X, WALL_TOP, WALL_W, WALL_BOTTOM - WALL_TOP);

  p.fill(0);
  p.noStroke();
  p.textAlign(p.CENTER, p.CENTER);
  p.textSize(22);
  p.text("壁", WALL_X - 24, (WALL_TOP + WALL_BOTTOM) / 2);
}

/**
 * シミュレーション全体を描画する。
 * @param {*} p - p5 インスタンス。
 */
export function drawSimulation(p) {
  p.background(255);
  p.scale(p.width / V_W);

  const vmx = (p.mouseX / p.width) * V_W;
  const vmy = (p.mouseY / p.width) * V_H;

  for (const spring of state.springs) {
    if (spring.isDragging) {
      spring.drag(p, vmx);
    }
  }

  drawWall(p);

  for (const spring of state.springs) {
    const hovered = !spring.isDragging && spring.isOverHandle(vmx, vmy);
    spring.display(p, hovered);
  }

  const anyInteracting =
    state.springs.some((s) => s.isOverHandle(vmx, vmy)) ||
    state.springs.some((s) => s.isDragging);
  p.cursor(anyInteracting ? "grab" : "default");
}
