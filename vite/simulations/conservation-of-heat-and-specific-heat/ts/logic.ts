import { state } from "./state.js";
import {
  computeEquilibriumTemperature,
  computeTemperatureAtTime
} from "./physics.js";
import { getCheckedRadioValue } from "../../../ts/bicpema-dom.js";

/** 冷却の緩和係数の係数 G（k_eff = G / C_hot） */
const COOLING_RATE_CONSTANT = 1.8;
/** 高温側を表す色（凡例・曲線・現在点で共通） */
const HOT_COLOR: [number, number, number] = [255, 0, 0];
/** 低温側を表す色（凡例・曲線・現在点で共通） */
const COLD_COLOR: [number, number, number] = [0, 0, 255];
/** 見出しテキストのフォントサイズ */
const HEADER_FONT_SIZE = 32;
/** グラフの凡例・軸ラベルのフォントサイズ */
const GRAPH_FONT_SIZE = 30;
/** グラフ上の現在値ラベルのフォントサイズ */
const LABEL_FONT_SIZE = 24;
/** グラフ上の現在値ラベルの背景の高さ */
const LABEL_HEIGHT = 28;
/** 吊り下げ棒のY座標 */
const HOOK_Y = 70;
/** 吊り下げ棒の幅 */
const HOOK_WIDTH = 165;
/** 吊り下げ棒の高さ */
const HOOK_HEIGHT = 20;
/** 吊り下げ線の下端Y座標 */
const HOOK_LINE_BOTTOM_Y = 275;
/** 質量「重い」選択時の球の表示半径 */
const BALL_RADIUS_LARGE = 50;
/** 質量「軽い」選択時の球の表示半径 */
const BALL_RADIUS_SMALL = 30;
/** 質量「重い」選択時の球のY座標 */
const BALL_Y_LARGE = 424;
/** 質量「軽い」選択時の球のY座標 */
const BALL_Y_SMALL = 457;

/**
 * 接触状態のラジオボタンの選択値を取得する。
 * @returns 接触状態（1: 接触前、0: 接触後）。未選択時は1
 */
function getContactState() {
  const value = getCheckedRadioValue("contact");
  return value !== null ? parseInt(value, 10) : 1;
}

/**
 * 物質Aの材質のラジオボタンの選択値を取得する。
 * @returns 材質のインデックス。未選択時は0
 */
function getMaterialA() {
  const value = getCheckedRadioValue("materialA");
  return value !== null ? parseInt(value, 10) : 0;
}

/**
 * 物質Aの質量のラジオボタンの選択値を取得する。
 * @returns 質量のインデックス（0: 重い、1: 軽い）。未選択時は1
 */
function getMassA() {
  const value = getCheckedRadioValue("massA");
  return value !== null ? parseInt(value, 10) : 1;
}

/**
 * 材質に応じた球の放射状グラデーションを生成する。
 * @param p - p5インスタンス
 * @param x - 球の中心のx座標
 * @param y - 球の中心のy座標
 * @param r - 球の半径
 * @param type - 材質のインデックス
 * @returns 球の塗りに使う放射状グラデーション
 */
function getMaterialGradient(
  p: p5,
  x: number,
  y: number,
  r: number,
  type: number
) {
  const ctx = p.drawingContext;
  const g = ctx.createRadialGradient(
    x - r * 0.3,
    y - r * 0.3,
    r * 0.1,
    x,
    y,
    r
  );
  if (type === 0) {
    g.addColorStop(0, "rgb(245,245,245)");
    g.addColorStop(1, "rgb(180,180,180)");
  } else if (type === 1) {
    g.addColorStop(0, "rgb(200,200,200)");
    g.addColorStop(1, "rgb(80,80,80)");
  } else if (type === 2) {
    g.addColorStop(0, "rgb(255,180,120)");
    g.addColorStop(1, "rgb(140,70,30)");
  } else if (type === 3) {
    g.addColorStop(0, "rgb(255,255,255)");
    g.addColorStop(1, "rgb(160,160,160)");
  } else {
    g.addColorStop(0, "rgb(230,230,240)");
    g.addColorStop(1, "rgb(120,120,150)");
  }
  return g;
}

/**
 * 吊り下げ棒と物質Aの球を接触状態に応じた位置に描画する。
 * 呼び出し元の `drawContainer` で行った `push()` をこの関数内で `pop()` する。
 * @param p - p5インスタンス
 */
function ballDraw(p: p5) {
  const contactState = getContactState();
  const checkcolorA = getMaterialA();
  const checkMassA = getMassA();

  const rA = checkMassA === 0 ? BALL_RADIUS_LARGE : BALL_RADIUS_SMALL;
  const yA = checkMassA === 0 ? BALL_Y_LARGE : BALL_Y_SMALL;

  if (contactState === 1) {
    // 接触前: 棒を描画 (scale(1.7)空間内)
    p.strokeWeight(1);
    p.fill(181, 166, 66);
    p.rect(50, HOOK_Y, HOOK_WIDTH, HOOK_HEIGHT);
    p.line(215, HOOK_Y, 215, HOOK_LINE_BOTTOM_Y);
    // scale(1.7)を解除して球を描く
    p.pop();

    const gradA = getMaterialGradient(p, 365, yA, rA, checkcolorA);
    p.push();
    p.noStroke();
    p.drawingContext.fillStyle = gradA;
    p.ellipse(365, yA, rA * 2, rA * 2);
    p.pop();
  } else {
    // 接触後: 棒を描画 (scale(1.7)空間内)
    p.strokeWeight(1);
    p.fill(181, 166, 66);
    p.rect(100, HOOK_Y, HOOK_WIDTH, HOOK_HEIGHT);
    p.line(265, HOOK_Y, 265, HOOK_LINE_BOTTOM_Y);
    // scale(1.7)を解除して球を描く
    p.pop();

    const gradA = getMaterialGradient(p, 448, yA, rA, checkcolorA);
    p.push();
    p.noStroke();
    p.drawingContext.fillStyle = gradA;
    p.ellipse(448, yA, rA * 2, rA * 2);
    p.pop();
  }
}

/**
 * 容器（水の入った箱）と物質Aの球を接触状態に応じた位置に描画する。
 * @param p - p5インスタンス
 */
function drawContainer(p: p5) {
  const contactState = getContactState();
  p.push();
  p.scale(1.7);
  if (contactState === 1) {
    p.image(state.boxImg!, 390, 53);
    ballDraw(p); // ballDraw pops this push internally
  } else {
    p.image(state.boxImg!, 186, 53);
    ballDraw(p);
  }
}

/**
 * 見出しと、接触前の場合は各物質の温度・比熱の説明文を描画する。
 * @param p - p5インスタンス
 */
function showPara(p: p5) {
  p.push();
  p.textSize(HEADER_FONT_SIZE);
  p.stroke(0);
  p.text("◎金属球の比熱は？ 熱量の保存の関係から測定しよう", 32, 0);
  p.pop();

  if (getContactState() === 1) {
    p.push();
    p.stroke(0);
    p.textSize(HEADER_FONT_SIZE);
    p.text("物質A(95℃)", 100, 440);
    p.stroke(...HOT_COLOR);
    p.text("比熱 ?(J/(g・K))", 100, 480);
    p.stroke(0);
    p.textSize(HEADER_FONT_SIZE);
    p.text("水(15℃), 150 g", 480, 175);
    p.stroke(...COLD_COLOR);
    p.text("比熱 4.2(J/(g・K))", 480, 215);
    p.pop();
  }
}

/**
 * 接触後は経過時間を進めて高温側・低温側の温度を更新し、接触前は時間と温度を初期値に戻す。
 * @param p - p5インスタンス
 */
function updateTemperature(p: p5) {
  const contactState = getContactState();

  if (contactState === 0) {
    state.m_now = getMassA() === 1 ? state.m_Light : state.m_Heavy;

    const matIdx = getMaterialA();
    if (matIdx === 0) state.c_now = state.c_Al;
    else if (matIdx === 1) state.c_now = state.c_Fe;
    else if (matIdx === 2) state.c_now = state.c_Cu;
    else if (matIdx === 3) state.c_now = state.c_Ag;

    state.C_hot = state.c_now * state.m_now;
    state.C_cold = state.c_w * state.m_Water;
    state.t++;
    state.Teq = computeEquilibriumTemperature(
      state.C_hot,
      state.C_cold,
      state.Thot0,
      state.Tcold0
    );
    const k_eff = COOLING_RATE_CONSTANT / state.C_hot;
    state.Thot = computeTemperatureAtTime(
      state.Teq,
      state.Thot0,
      k_eff,
      state.t
    );
    state.Tcold = computeTemperatureAtTime(
      state.Teq,
      state.Tcold0,
      k_eff,
      state.t
    );
  } else {
    state.t = 0;
    state.Thot = state.Thot0;
    state.Tcold = state.Tcold0;
  }
}

/**
 * 温度の時間変化のグラフ（軸・凡例・温度曲線・現在温度のラベル）を描画する。
 * @param p - p5インスタンス
 */
function drawGraph(p: p5) {
  p.push();
  p.scale(0.65);
  p.translate(900, 200);

  state.gx = 840;
  state.gy = 84;
  state.gw = 681;
  state.gh = 582;

  p.noStroke();
  p.fill(185, 220, 255);
  p.rect(784, 67, 762, 667);
  p.fill(255);
  p.rect(state.gx, state.gy, state.gw, state.gh);

  // 凡例
  p.fill(0);
  p.stroke(...HOT_COLOR);
  p.line(1360, 122, 1456, 122);
  p.textSize(GRAPH_FONT_SIZE);
  p.text("物質(高温)", 1208, 122);
  p.stroke(...COLD_COLOR);
  p.line(1360, 175, 1456, 175);
  p.textSize(GRAPH_FONT_SIZE);
  p.text("物質(低温)", 1208, 175);

  // 軸ラベル
  p.stroke(0);
  p.fill(0);
  p.textSize(GRAPH_FONT_SIZE);
  p.text("接触してからの経過時間(Q))", 1160, 712);
  p.textSize(GRAPH_FONT_SIZE);
  p.text("温", 792, 109);
  p.text("度", 792, 143);
  p.text("(K)", 788, 177);

  // 軸
  p.stroke(0);
  p.strokeWeight(2);
  p.line(state.gx, state.gy, state.gx, state.gy + state.gh);
  p.line(
    state.gx,
    state.gy + state.gh,
    state.gx + state.gw,
    state.gy + state.gh
  );
  p.fill(0);
  p.triangle(832, 100, 840, 84, 848, 100);
  p.triangle(1521, 666, 1500, 659, 1500, 673);

  if (getContactState() === 1) {
    p.push();
    p.strokeWeight(10);
    p.stroke(...HOT_COLOR, 120);
    p.point(tx(p, 0), ty(p, state.Thot0));
    p.stroke(...COLD_COLOR, 120);
    p.point(tx(p, 0), ty(p, state.Tcold0));
    p.pop();
  }

  p.strokeWeight(2);

  if (getContactState() === 0) {
    p.drawingContext.setLineDash([8, 6]);
    p.stroke(0);
    p.line(tx(p, 0), ty(p, state.Teq), tx(p, state.tMax), ty(p, state.Teq));
    p.drawingContext.setLineDash([]);

    p.noFill();
    p.strokeWeight(3);

    // 高温曲線
    p.stroke(...HOT_COLOR);
    p.beginShape();
    for (let tt = 0; tt <= state.tMax; tt++) {
      const k_eff = COOLING_RATE_CONSTANT / state.C_hot;
      const T = computeTemperatureAtTime(state.Teq, state.Thot0, k_eff, tt);
      p.vertex(tx(p, tt), ty(p, T));
    }
    p.endShape();

    // 低温曲線
    p.stroke(...COLD_COLOR);
    p.beginShape();
    for (let tt = 0; tt <= state.tMax; tt++) {
      const k_eff = COOLING_RATE_CONSTANT / state.C_hot;
      const T = computeTemperatureAtTime(state.Teq, state.Tcold0, k_eff, tt);
      p.vertex(tx(p, tt), ty(p, T));
    }
    p.endShape();

    // 現在温度点
    const t_now = p.min(state.t, state.tMax);

    // 物質A (高温)
    p.stroke(...HOT_COLOR);
    p.strokeWeight(8);
    p.point(tx(p, t_now), ty(p, state.Thot));
    p.push();
    const labelA = p.nf(state.Thot, 1, 2) + " K";
    p.textSize(LABEL_FONT_SIZE);
    const twA = p.textWidth(labelA);
    const thA = LABEL_HEIGHT;
    let lx = tx(p, t_now) + 12;
    let ly = ty(p, state.Thot) - 12;
    lx = p.constrain(lx, state.gx + 6, state.gx + state.gw - twA - 6);
    ly = p.constrain(ly, state.gy + thA + 6, state.gy + state.gh - 6);
    p.noStroke();
    p.fill(255, 220);
    p.rect(lx - 6, ly - thA, twA + 12, thA, 6);
    p.fill(180, 0, 0);
    p.text(labelA, lx, ly - 6);
    p.pop();

    // 物質B (低温)
    p.stroke(...COLD_COLOR);
    p.strokeWeight(8);
    p.point(tx(p, t_now), ty(p, state.Tcold));
    p.push();
    const labelB = p.nf(state.Tcold, 1, 2) + " K";
    p.textSize(LABEL_FONT_SIZE);
    const twB = p.textWidth(labelB);
    const thB = LABEL_HEIGHT;
    let lxb = tx(p, t_now) + 12;
    let lyb = ty(p, state.Tcold) + 38;
    lxb = p.constrain(lxb, state.gx + 6, state.gx + state.gw - twB - 6);
    lyb = p.constrain(lyb, state.gy + thB + 6, state.gy + state.gh - 6);
    p.noStroke();
    p.fill(255, 220);
    p.rect(lxb - 6, lyb - thB, twB + 12, thB, 6);
    p.fill(0, 0, 180);
    p.text(labelB, lxb, lyb - 6);
    p.pop();
  }

  p.pop();
}

/**
 * 時間をグラフ上のx座標に変換する。
 * @param p - p5インスタンス
 * @param t - 経過時間
 * @returns グラフ上のx座標
 */
function tx(p: p5, t: number) {
  return p.map(t, 0, state.tMax, state.gx, state.gx + state.gw);
}

/**
 * 温度をグラフ上のy座標に変換する。
 * @param p - p5インスタンス
 * @param T - 温度（K）
 * @returns グラフ上のy座標
 */
function ty(p: p5, T: number) {
  return p.map(T, state.Tmin, state.Tmax, state.gy + state.gh, state.gy);
}

/**
 * 容器・球・説明文・グラフの描画と温度の更新を行う。
 * @param p - p5インスタンス
 */
export function drawSimulation(p: p5) {
  drawContainer(p);
  updateTemperature(p);
  // drawButton(p);
  showPara(p);
  drawGraph(p);
}
