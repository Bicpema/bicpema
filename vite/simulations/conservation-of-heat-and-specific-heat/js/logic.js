// logic.js はシミュレーションの中心的なロジックを定義するファイルです。

import { state } from './state.js';

/** 仮想キャンバス幅（オリジナル座標系） */
const W = 1600;
/** 仮想キャンバス高さ（オリジナル座標系） */
const H = 800;

/**
 * シミュレーション全体を描画する。
 * @param {*} p - p5 インスタンス。
 */
export function drawSimulation(p) {
  p.background(255);

  p.push();
  p.scale(p.width / W);

  updateTemperature(p);
  drawScene(p);
  drawGraph(p);
  showPara(p);

  p.pop();
}

/**
 * 温度を更新する。
 * @param {*} p - p5 インスタンス。
 */
function updateTemperature(p) {
  if (state.contactState !== '0') {
    return;
  }

  state.m_now =
    state.selectedMass === '1' ? state.m_Light : state.m_Heavy;

  switch (state.selectedMaterial) {
    case '0': state.c_now = state.c_Al; break;
    case '1': state.c_now = state.c_Fe; break;
    case '2': state.c_now = state.c_Cu; break;
    case '3': state.c_now = state.c_Ag; break;
    default:  state.c_now = state.c_Al;
  }

  state.C_hot = state.c_now * state.m_now;
  state.C_cold = state.c_w * state.m_Water;
  state.t++;

  state.Teq =
    (state.C_hot * state.Thot0 + state.C_cold * state.Tcold0) /
    (state.C_hot + state.C_cold);

  const G = 1.8;
  const k_eff = G / state.C_hot;
  state.Thot = state.Teq + (state.Thot0 - state.Teq) * Math.exp(-k_eff * state.t);
  state.Tcold = state.Teq + (state.Tcold0 - state.Teq) * Math.exp(-k_eff * state.t);
}

/**
 * 容器と金属球を描画する。
 * @param {*} p - p5 インスタンス。
 */
function drawScene(p) {
  p.push();
  p.scale(1.7);

  if (state.contactState === '1') {
    p.image(state.boxImg, W / 4.1, H / 15);
  } else {
    p.image(state.boxImg, W / 4.3 / 2, H / 15);
  }

  ballDraw(p);

  p.pop();
}

/**
 * 金属球を描画する（drawScene の scale(1.7) コンテキスト内で呼ぶ）。
 * @param {*} p - p5 インスタンス。
 */
function ballDraw(p) {
  const checkcolorA = parseInt(state.selectedMaterial);
  const checkMassA = parseInt(state.selectedMass);

  const rA = checkMassA === 0 ? 50 : 30;
  const yA =
    checkMassA === 0 ? (H / 3.4) * 1.8 : (H / 3.15) * 1.8;

  p.strokeWeight(1);
  p.fill(181, 166, 66);

  if (state.contactState === '1') {
    p.rect(50, 70, 165, 20);
    p.line(215, 70, 215, (H / 3.15) * 1.2 - 30);

    const gradA = getMaterialGradient(
      p,
      (W / 5) * 1.14,
      yA,
      rA,
      checkcolorA
    );
    p.push();
    p.noStroke();
    p.drawingContext.fillStyle = gradA;
    p.ellipse((W / 5) * 1.14, yA, rA * 2, rA * 2);
    p.pop();
  } else {
    p.rect(50 + 50, 70, 165, 20);
    p.line(215 + 50, 70, 215 + 50, (H / 3.15) * 1.2 - 30);

    const gradA = getMaterialGradient(
      p,
      (W / 5) * 1.4,
      yA,
      rA,
      checkcolorA
    );
    p.push();
    p.noStroke();
    p.drawingContext.fillStyle = gradA;
    p.ellipse((W / 5) * 1.4, yA, rA * 2, rA * 2);
    p.pop();
  }
}

/**
 * 素材に応じたラジアルグラデーションを生成する。
 * @param {*} p - p5 インスタンス。
 * @param {number} x - 中心 x 座標。
 * @param {number} y - 中心 y 座標。
 * @param {number} r - 半径。
 * @param {number} type - 素材タイプ (0:Al, 1:Fe, 2:Cu, 3:Ag)。
 * @returns {CanvasGradient} グラデーションオブジェクト。
 */
function getMaterialGradient(p, x, y, r, type) {
  const ctx = p.drawingContext;
  const g = ctx.createRadialGradient(
    x - r * 0.3,
    y - r * 0.3,
    r * 0.1,
    x,
    y,
    r
  );

  switch (type) {
    case 0: // アルミ
      g.addColorStop(0, 'rgb(245,245,245)');
      g.addColorStop(1, 'rgb(180,180,180)');
      break;
    case 1: // 鉄
      g.addColorStop(0, 'rgb(200,200,200)');
      g.addColorStop(1, 'rgb(80,80,80)');
      break;
    case 2: // 銅
      g.addColorStop(0, 'rgb(255,180,120)');
      g.addColorStop(1, 'rgb(140,70,30)');
      break;
    case 3: // 銀
      g.addColorStop(0, 'rgb(255,255,255)');
      g.addColorStop(1, 'rgb(160,160,160)');
      break;
    default:
      g.addColorStop(0, 'rgb(230,230,240)');
      g.addColorStop(1, 'rgb(120,120,150)');
  }
  return g;
}

/**
 * 温度-時間グラフを描画する。
 * @param {*} p - p5 インスタンス。
 */
function drawGraph(p) {
  p.push();
  p.scale(0.65);
  p.translate(900, 200);

  const gx = (W / 2) * 1.05;
  const gy = H / 9.5;
  const gw = W / 2.35;
  const gh = W / 2.75;

  state.gx = gx;
  state.gy = gy;
  state.gw = gw;
  state.gh = gh;

  const { tMax, Tmin, Tmax } = state;
  const tx = (t) => p.map(t, 0, tMax, gx, gx + gw);
  const ty = (T) => p.map(T, Tmin, Tmax, gy + gh, gy);

  // グラフ背景
  p.noStroke();
  p.fill(185, 220, 255);
  p.rect((W / 2) * 0.98, H / 12, W / 2.1, W / 2.4);
  p.fill(255);
  p.rect(gx, gy, gw, gh);

  // 凡例
  const ysize = W / 3;
  p.fill(0);
  p.stroke(255, 0, 0);
  p.line(
    (W / 2) * 1.7,
    H / 9.5 + (ysize * 0.5) / 7,
    (W / 2) * 1.82,
    H / 9.5 + (ysize * 0.5) / 7
  );
  p.textSize(30);
  p.text('物質(高温)', (W / 2) * 1.51, H / 9.5 + (ysize * 0.6) / 7);
  p.stroke(0, 0, 255);
  p.line(
    (W / 2) * 1.7,
    H / 9.5 + (ysize * 1.2) / 7,
    (W / 2) * 1.82,
    H / 9.5 + (ysize * 1.2) / 7
  );
  p.textSize(30);
  p.text('物質(低温)', (W / 2) * 1.51, H / 9.5 + (ysize * 1.35) / 7);

  // 軸ラベル
  p.stroke(0);
  p.fill(0);
  p.textSize(30);
  p.text(
    '接触してからの経過時間(Q)',
    (W / 2) * 1.45,
    W / 2.55 + H / 9.5
  );
  p.text('温', (W / 2) * 0.99, (H / 9.5) * 1.3);
  p.text('度', (W / 2) * 0.99, (H / 9.5) * 1.7);
  p.text('(K)', (W / 2) * 0.985, (H / 9.5) * 2.1);

  // 軸
  p.stroke(0);
  p.strokeWeight(2);
  p.line(gx, gy, gx, gy + gh);
  p.line(gx, gy + gh, gx + gw, gy + gh);
  p.fill(0);
  p.triangle(
    (W / 2) * 1.04, H / 8,
    (W / 2) * 1.05, H / 9.5,
    (W / 2) * 1.06, H / 8
  );
  p.triangle(
    (W / 2) * 1.05 + W / 2.35,
    W / 2.75 + H / 9.5,
    ((W / 2) * 1.05 + W / 2.35) * 0.986,
    (W / 2.75 + H / 9.5) * 0.99,
    ((W / 2) * 1.05 + W / 2.35) * 0.986,
    (W / 2.75 + H / 9.5) * 1.01
  );

  if (state.contactState === '1') {
    // 接触前：初期温度を点で表示
    p.push();
    p.strokeWeight(10);
    p.stroke(255, 0, 0, 120);
    p.point(tx(0), ty(state.Thot0));
    p.stroke(0, 0, 255, 120);
    p.point(tx(0), ty(state.Tcold0));
    p.pop();
  }

  if (state.contactState === '0') {
    // 平衡温度（破線）
    p.drawingContext.setLineDash([8, 6]);
    p.stroke(0);
    p.strokeWeight(2);
    p.line(tx(0), ty(state.Teq), tx(tMax), ty(state.Teq));
    p.drawingContext.setLineDash([]);

    // 温度変化曲線
    const G = 1.8;
    const k_eff = G / state.C_hot;

    p.noFill();
    p.strokeWeight(3);

    // 高温曲線（赤）
    p.stroke(255, 0, 0);
    p.beginShape();
    for (let tt = 0; tt <= tMax; tt++) {
      const T = state.Teq + (state.Thot0 - state.Teq) * Math.exp(-k_eff * tt);
      p.vertex(tx(tt), ty(T));
    }
    p.endShape();

    // 低温曲線（青）
    p.stroke(0, 0, 255);
    p.beginShape();
    for (let tt = 0; tt <= tMax; tt++) {
      const T = state.Teq + (state.Tcold0 - state.Teq) * Math.exp(-k_eff * tt);
      p.vertex(tx(tt), ty(T));
    }
    p.endShape();

    // 現在温度を表す移動点（高温）
    const t_now = Math.min(state.t, tMax);
    p.stroke(255, 0, 0);
    p.strokeWeight(8);
    p.point(tx(t_now), ty(state.Thot));

    p.push();
    const labelA = p.nf(state.Thot, 1, 2) + ' K';
    p.textSize(24);
    const twA = p.textWidth(labelA);
    const thA = 28;
    let lxA = p.constrain(tx(t_now) + 12, gx + 6, gx + gw - twA - 6);
    let lyA = p.constrain(ty(state.Thot) - 12, gy + thA + 6, gy + gh - 6);
    p.noStroke();
    p.fill(255, 220);
    p.rect(lxA - 6, lyA - thA, twA + 12, thA, 6);
    p.fill(180, 0, 0);
    p.text(labelA, lxA, lyA - 6);
    p.pop();

    // 現在温度を表す移動点（低温）
    p.stroke(0, 0, 255);
    p.strokeWeight(8);
    p.point(tx(t_now), ty(state.Tcold));

    p.push();
    const labelB = p.nf(state.Tcold, 1, 2) + ' K';
    p.textSize(24);
    const twB = p.textWidth(labelB);
    const thB = 28;
    let lxB = p.constrain(tx(t_now) + 12, gx + 6, gx + gw - twB - 6);
    let lyB = p.constrain(ty(state.Tcold) + 38, gy + thB + 6, gy + gh - 6);
    p.noStroke();
    p.fill(255, 220);
    p.rect(lxB - 6, lyB - thB, twB + 12, thB, 6);
    p.fill(0, 0, 180);
    p.text(labelB, lxB, lyB - 6);
    p.pop();
  }

  p.pop();
}

/**
 * 物質情報テキストを描画する。
 * @param {*} p - p5 インスタンス。
 */
function showPara(p) {
  p.push();
  p.textSize(32);
  p.stroke(0);
  p.text(
    '◎金属球の比熱は？ 熱量の保存の関係から測定しよう',
    W / 50,
    H / 15
  );
  p.pop();

  if (state.contactState === '1') {
    p.push();
    p.stroke(0);
    p.textSize(32);
    p.text('物質A(95℃)', W / 16, (H / 2) * 1.1);
    p.stroke(255, 0, 0);
    p.text('比熱 ?(J/(g・K))', W / 16, (H / 2) * 1.2);

    p.stroke(0);
    p.textSize(32);
    p.text('水(15℃), 150 g', (W / 3) * 0.9, (H / 3.2) * 0.85);
    p.stroke(0, 0, 255);
    p.text('比熱 4.2(J/(g・K))', (W / 3) * 0.9, H / 3.2);
    p.pop();
  }
}
