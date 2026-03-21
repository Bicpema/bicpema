import { state } from "./state.js";

/** 仮想キャンバス幅 */
const VW = 1200;
/** 仮想キャンバス高さ */
const VH = 800;

/**
 * シミュレーション全体を描画する。
 * @param {*} p p5インスタンス
 */
export function drawSimulation(p) {
  p.push();
  p.scale(p.width / VW, p.height / VH);

  p.background(250);
  drawChamber(p);
  if (state.isPlaying) {
    animateCycle(p);
  }

  p.pop();
}

/**
 * チャンバー・ピストン・ガス・画像・テキストを描画する。
 * @param {*} p p5インスタンス
 */
function drawChamber(p) {
  const gw = 250;
  const gh = 400;

  const gx = VW / 2 - gw / 2;
  const gy = VH / 2 - gh / 2 + 60;

  // 加熱・冷却ビジュアル
  if (state.stage === 0 || state.stage === 1) {
    if (state.img_flame) p.image(state.img_flame, VW / 2 - 80, gy + gh + 20);
  } else {
    if (state.img_ice) p.image(state.img_ice, VW / 2 - 80, gy + gh + 20);
  }

  // ピストン（エ形）
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

  // U字ガイド
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

  // 枠線（外側）
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

  // 枠線（内側）
  p.beginShape();
  p.vertex(gx + gw * 0.3, gy + 14);
  p.vertex(gx + 14, gy + 14);
  p.vertex(gx + 14, gy + gh - 14);
  p.vertex(gx + gw - 14, gy + gh - 14);
  p.vertex(gx + gw - 14, gy + 14);
  p.vertex(gx + gw - gw * 0.3, gy + 14);
  p.endShape();

  // おもり
  if (state.weightOn) {
    if (state.img_weight) p.image(state.img_weight, gx + pw * 0.37, state.pistonY - 97);
  }

  // ガス
  const gasTop = state.pistonY + ph * 4.8;
  const gasBottom = gy + gh * 0.96;
  p.noStroke();
  if (state.stage === 1) p.fill(255, 200, 180, 220);
  else if (state.stage === 3) p.fill(200, 230, 255, 220);
  else p.fill(235, 235, 235, 200);
  p.rect(gx + 15, gasTop, gw - 30, gasBottom - gasTop, 4);

  // 説明テキスト
  p.fill(0);
  p.noStroke();
  p.textSize(24);
  p.textAlign(p.LEFT, p.TOP);
  if (state.font) p.textFont(state.font);
  if (state.stage === 0) p.text("① 加熱しておもりを持ち上げる仕事をする", 20, 20);
  if (state.stage === 1) p.text("② おもりを取り除く", 20, 20);
  if (state.stage === 2) p.text("③ 残った熱を放出させて元の状態に戻す", 20, 20);
  if (state.stage === 3) p.text("④ ①に戻る（繰り返し）", 20, 20);
}

/**
 * 4過程のアニメーションを進める。
 * @param {*} p p5インスタンス
 */
function animateCycle(p) {
  state.t++;
  const D = 80;

  if (state.stage === 0 && state.t <= D) state.pistonY = p.lerp(160, 130, state.t / D);
  else if (state.stage === 1 && state.t <= D) state.pistonY = p.lerp(130, 80, state.t / D);
  else if (state.stage === 2 && state.t <= D) state.pistonY = p.lerp(80, 130, state.t / D);
  else if (state.stage === 3 && state.t <= D) state.pistonY = p.lerp(130, 160, state.t / D);
  else {
    if (state.stage === 1) state.weightOn = false;
    if (state.stage === 3) state.weightOn = true;
    state.stage = (state.stage + 1) % 4;
    state.t = 0;
  }

  state.pistonY = p.constrain(state.pistonY, 60, VH - 300);
}
