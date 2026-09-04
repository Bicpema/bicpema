import { state } from "./state.js";
import { computePistonY, advanceStage } from "./physics.js";

export function drawChamber(p) {
  const gw = 250;
  const gh = 400;
  const gx = 375;
  const gy = 81;
  const cylinderCenterX = gx + gw / 2;

  const heatIconW = 120;
  const heatIconH = 55;
  const heatIconX = cylinderCenterX - heatIconW / 2;
  const heatIconY = gy + gh + 10;
  if (state.stage === 0 || state.stage === 1) {
    p.image(state.img_flame, heatIconX, heatIconY, heatIconW, heatIconH);
  } else {
    p.image(state.img_ice, heatIconX, heatIconY, heatIconW, heatIconH);
  }

  p.stroke(0);
  p.fill(190);
  const pw = gw;
  const ph = 30;
  const gapH = 150;
  const cx = gx + pw * 0.45;
  const cw = pw * 0.1;

  p.beginShape();
  p.vertex(gx, state.pistonY - 24);
  p.vertex(gx + pw, state.pistonY - 24);
  p.vertex(gx + pw, state.pistonY - 24 + ph);
  p.vertex(cx + cw, state.pistonY - 24 + ph);
  p.vertex(cx + cw, state.pistonY - 38 + gapH);
  p.vertex(gx + pw, state.pistonY - 38 + gapH);
  p.vertex(gx + pw, state.pistonY - 38 + gapH + ph);
  p.vertex(gx, state.pistonY - 38 + gapH + ph);
  p.vertex(gx, state.pistonY - 38 + gapH);
  p.vertex(cx, state.pistonY - 38 + gapH);
  p.vertex(cx, state.pistonY - 24 + ph);
  p.vertex(gx, state.pistonY - 24 + ph);
  p.endShape(p.CLOSE);

  p.stroke(190);
  p.strokeWeight(30);
  p.noFill();
  p.beginShape();
  p.vertex(gx + gw * 0.3, gy);
  p.vertex(gx, gy);
  p.vertex(gx, gy + gh);
  p.vertex(gx + gw, gy + gh);
  p.vertex(gx + gw, gy);
  p.vertex(gx + gw - gw * 0.3, gy);
  p.endShape();

  p.stroke(60);
  p.strokeWeight(3);
  p.beginShape();
  p.vertex(gx + gw * 0.3, gy - 14);
  p.vertex(gx - 13, gy - 14);
  p.vertex(gx - 13, gy + gh + 14);
  p.vertex(gx + 13 + gw, gy + gh + 14);
  p.vertex(gx + 13 + gw, gy - 14);
  p.vertex(gx + gw - gw * 0.3, gy - 14);
  p.endShape();

  p.beginShape();
  p.vertex(gx + gw * 0.3, gy + 14);
  p.vertex(gx + 14, gy + 14);
  p.vertex(gx + 14, gy + gh - 14);
  p.vertex(gx + gw - 14, gy + gh - 14);
  p.vertex(gx + gw - 14, gy + 14);
  p.vertex(gx + gw - gw * 0.3, gy + 14);
  p.endShape();

  if (state.weightOn) {
    const weightW = 64;
    const weightH = 76;
    p.image(
      state.img_weight,
      gx + pw * 0.37,
      state.pistonY - 97,
      weightW,
      weightH
    );
  }

  const gasTop = state.pistonY - 38 + gapH + ph;
  const gasBottom = gy + gh * 0.96;
  p.noStroke();
  if (state.stage === 1) p.fill(255, 200, 180, 220);
  else if (state.stage === 3) p.fill(200, 230, 255, 220);
  else p.fill(235, 235, 235, 200);
  p.rect(gx + 15, gasTop, gw - 30, gasBottom - gasTop, 4);

  p.fill(0);
  p.textSize(24);
  p.textAlign(p.LEFT, p.TOP);
  if (state.stage === 0)
    p.text("① 加熱しておもりを持ち上げる仕事をする", 20, 20);
  if (state.stage === 1) p.text("② おもりを取り除く", 20, 20);
  if (state.stage === 2) p.text("③ 残った熱を放出させて元の状態に戻す", 20, 20);
  if (state.stage === 3) p.text("④ ①に戻る（繰り返し）", 20, 20);
}

export function animateCycle(p) {
  if (!state.isPlaying) return;
  state.t++;
  const D = 160;
  if (state.t <= D) {
    state.pistonY = computePistonY(state.stage, state.t, D);
  } else {
    if (state.stage === 1) state.weightOn = false;
    if (state.stage === 3) state.weightOn = true;
    state.stage = advanceStage(state.stage);
    state.t = 0;
  }
  state.pistonY = p.constrain(state.pistonY, 100, 160);
}
