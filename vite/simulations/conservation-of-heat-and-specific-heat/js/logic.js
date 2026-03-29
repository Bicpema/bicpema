import { state } from './state.js';

function getContactState() {
  const el = document.querySelector('input[name="contact"]:checked');
  return el ? parseInt(el.value) : 1;
}

function getMaterialA() {
  const el = document.querySelector('input[name="materialA"]:checked');
  return el ? parseInt(el.value) : 0;
}

function getMassA() {
  const el = document.querySelector('input[name="massA"]:checked');
  return el ? parseInt(el.value) : 1;
}

function getMaterialGradient(p, x, y, r, type) {
  const ctx = p.drawingContext;
  const g = ctx.createRadialGradient(x - r * 0.3, y - r * 0.3, r * 0.1, x, y, r);
  if (type === 0) {
    g.addColorStop(0, 'rgb(245,245,245)');
    g.addColorStop(1, 'rgb(180,180,180)');
  } else if (type === 1) {
    g.addColorStop(0, 'rgb(200,200,200)');
    g.addColorStop(1, 'rgb(80,80,80)');
  } else if (type === 2) {
    g.addColorStop(0, 'rgb(255,180,120)');
    g.addColorStop(1, 'rgb(140,70,30)');
  } else if (type === 3) {
    g.addColorStop(0, 'rgb(255,255,255)');
    g.addColorStop(1, 'rgb(160,160,160)');
  } else {
    g.addColorStop(0, 'rgb(230,230,240)');
    g.addColorStop(1, 'rgb(120,120,150)');
  }
  return g;
}

function ballDraw(p) {
  const contactState = getContactState();
  const checkcolorA = getMaterialA();
  const checkMassA = getMassA();

  const rA = checkMassA === 0 ? 50 : 30;
  const yA = checkMassA === 0 ? 800 / 3.4 * 1.8 : 800 / 3.15 * 1.8;

  if (contactState === 1) {
    // 接触前: 棒を描画 (scale(1.7)空間内)
    p.strokeWeight(1);
    p.fill(181, 166, 66);
    p.rect(50, 70, 165, 20);
    p.line(215, 70, 215, 800 / 3.15 * 1.2 - 30);
    // scale(1.7)を解除して球を描く
    p.pop();

    const gradA = getMaterialGradient(p, 1600 / 5 * 1.14, yA, rA, checkcolorA);
    p.push();
    p.noStroke();
    p.drawingContext.fillStyle = gradA;
    p.ellipse(1600 / 5 * 1.14, yA, rA * 2, rA * 2);
    p.pop();
  } else {
    // 接触後: 棒を描画 (scale(1.7)空間内)
    p.strokeWeight(1);
    p.fill(181, 166, 66);
    p.rect(50 + 50, 70, 165, 20);
    p.line(215 + 50, 70, 215 + 50, 800 / 3.15 * 1.2 - 30);
    // scale(1.7)を解除して球を描く
    p.pop();

    const gradA = getMaterialGradient(p, 1600 / 5 * 1.4, yA, rA, checkcolorA);
    p.push();
    p.noStroke();
    p.drawingContext.fillStyle = gradA;
    p.ellipse(1600 / 5 * 1.4, yA, rA * 2, rA * 2);
    p.pop();
  }
}

function drawContainer(p) {
  const contactState = getContactState();
  p.push();
  p.scale(1.7);
  if (contactState === 1) {
    p.image(state.boxImg, 1600 / 4.1, 800 / 15);
    ballDraw(p); // ballDraw pops this push internally
  } else {
    p.image(state.boxImg, 1600 / 4.3 / 2, 800 / 15);
    ballDraw(p);
  }
}

function showPara(p) {
  p.push();
  p.textSize(32);
  p.stroke(0);
  p.text('◎金属球の比熱は？ 熱量の保存の関係から測定しよう', 1600 / 50, 800 / 15);
  p.pop();

  if (getContactState() === 1) {
    p.push();
    p.stroke(0);
    p.textSize(32);
    p.text('物質A(95℃)', 1600 / 16, 800 / 2 * 1.1);
    p.stroke(255, 0, 0);
    p.text('比熱 ?(J/(g・K))', 1600 / 16, 800 / 2 * 1.2);
    p.stroke(0);
    p.textSize(32);
    p.text('水(15℃), 150 g', 1600 / 3 * 0.9, 800 / 3.2 * 0.85);
    p.stroke(0, 0, 255);
    p.text('比熱 4.2(J/(g・K))', 1600 / 3 * 0.9, 800 / 3.2);
    p.pop();
  }
}

function drawButton(p) {
  p.push();
  p.noStroke();
  p.fill(185, 220, 255);
  const side = 1600 / 15;
  const inSide = 1600 / 10;
  p.stroke(0);
  p.rect(side, 800 * 3.05 / 4 * 1.1, 1600 / 1.5, 800 / 5 / 2);
  p.stroke(0);
  p.line(side + inSide, 800 * 3.05 / 4 * 1.1, side + inSide, 800 * 3.05 / 4 * 1.1 + 800 / 5 / 2);
  p.line(side + inSide * 3.9, 800 * 3.05 / 4 * 1.1, side + inSide * 3.9, 800 * 3.05 / 4 * 1.1 + 800 / 5 / 2);
  p.fill(255);
  p.textSize(32);
  p.text('物質A', side * 1.35, 800 * 8.25 / 10 * 1.1);
  p.pop();
}

function updateTemperature(p) {
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
    state.Teq = (state.C_hot * state.Thot0 + state.C_cold * state.Tcold0) / (state.C_hot + state.C_cold);
    const G = 1.8;
    const k_eff = G / state.C_hot;
    state.Thot = state.Teq + (state.Thot0 - state.Teq) * Math.exp(-k_eff * state.t);
    state.Tcold = state.Teq + (state.Tcold0 - state.Teq) * Math.exp(-k_eff * state.t);
  } else {
    state.t = 0;
    state.Thot = state.Thot0;
    state.Tcold = state.Tcold0;
  }
}

function drawGraph(p) {
  p.push();
  p.scale(0.65);
  p.translate(900, 200);

  const ysize = 1600 / 3;

  state.gx = 1600 / 2 * 1.05;
  state.gy = 800 / 9.5;
  state.gw = 1600 / 2.35;
  state.gh = 1600 / 2.75;

  p.noStroke();
  p.fill(185, 220, 255);
  p.rect(1600 / 2 * 0.98, 800 / 12, 1600 / 2.1, 1600 / 2.4);
  p.fill(255);
  p.rect(state.gx, state.gy, state.gw, state.gh);

  // 凡例
  p.fill(0);
  p.stroke(255, 0, 0);
  p.line(1600 / 2 * 1.7, 800 / 9.5 + ysize * 0.5 / 7, 1600 / 2 * 1.82, 800 / 9.5 + ysize * 0.5 / 7);
  p.textSize(30);
  p.text('物質(高温)', 1600 / 2 * 1.51, 800 / 9.5 + ysize * 0.6 / 7);
  p.stroke(0, 0, 255);
  p.line(1600 / 2 * 1.7, 800 / 9.5 + ysize * 1.2 / 7, 1600 / 2 * 1.82, 800 / 9.5 + ysize * 1.2 / 7);
  p.textSize(30);
  p.text('物質(低温)', 1600 / 2 * 1.51, 800 / 9.5 + ysize * 1.35 / 7);

  // 軸ラベル
  p.stroke(0);
  p.fill(0);
  p.textSize(30);
  p.text('接触してからの経過時間(Q))', 1600 / 2 * 1.45, 1600 / 2.55 + 800 / 9.5);
  p.textSize(30);
  p.text('温', 1600 / 2 * 0.99, 800 / 9.5 * 1.3);
  p.text('度', 1600 / 2 * 0.99, 800 / 9.5 * 1.7);
  p.text('(K)', 1600 / 2 * 0.985, 800 / 9.5 * 2.1);

  // 軸
  p.stroke(0);
  p.strokeWeight(2);
  p.line(state.gx, state.gy, state.gx, state.gy + state.gh);
  p.line(state.gx, state.gy + state.gh, state.gx + state.gw, state.gy + state.gh);
  p.fill(0);
  p.triangle(1600 / 2 * 1.04, 800 / 8, 1600 / 2 * 1.05, 800 / 9.5, 1600 / 2 * 1.06, 800 / 8);
  p.triangle(
    1600 / 2 * 1.05 + 1600 / 2.35, 1600 / 2.75 + 800 / 9.5,
    (1600 / 2 * 1.05 + 1600 / 2.35) * 0.986, (1600 / 2.75 + 800 / 9.5) * 0.99,
    (1600 / 2 * 1.05 + 1600 / 2.35) * 0.986, (1600 / 2.75 + 800 / 9.5) * 1.01
  );

  if (getContactState() === 1) {
    p.push();
    p.strokeWeight(10);
    p.stroke(255, 0, 0, 120);
    p.point(tx(p, 0), ty(p, state.Thot0));
    p.stroke(0, 0, 255, 120);
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
    p.stroke(255, 0, 0);
    p.beginShape();
    for (let tt = 0; tt <= state.tMax; tt++) {
      const G = 1.8;
      const k_eff = G / state.C_hot;
      const T = state.Teq + (state.Thot0 - state.Teq) * Math.exp(-k_eff * tt);
      p.vertex(tx(p, tt), ty(p, T));
    }
    p.endShape();

    // 低温曲線
    p.stroke(0, 0, 255);
    p.beginShape();
    for (let tt = 0; tt <= state.tMax; tt++) {
      const G = 1.8;
      const k_eff = G / state.C_hot;
      const T = state.Teq + (state.Tcold0 - state.Teq) * Math.exp(-k_eff * tt);
      p.vertex(tx(p, tt), ty(p, T));
    }
    p.endShape();

    // 現在温度点
    const t_now = p.min(state.t, state.tMax);

    // 物質A (高温)
    p.stroke(255, 0, 0);
    p.strokeWeight(8);
    p.point(tx(p, t_now), ty(p, state.Thot));
    p.push();
    const labelA = p.nf(state.Thot, 1, 2) + ' K';
    p.textSize(24);
    const twA = p.textWidth(labelA);
    const thA = 28;
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
    p.stroke(0, 0, 255);
    p.strokeWeight(8);
    p.point(tx(p, t_now), ty(p, state.Tcold));
    p.push();
    const labelB = p.nf(state.Tcold, 1, 2) + ' K';
    p.textSize(24);
    const twB = p.textWidth(labelB);
    const thB = 28;
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

function tx(p, t) {
  return p.map(t, 0, state.tMax, state.gx, state.gx + state.gw);
}

function ty(p, T) {
  return p.map(T, state.Tmin, state.Tmax, state.gy + state.gh, state.gy);
}

export function drawSimulation(p) {
  p.frameRate(20);
  p.background(255);

  const s = Math.min(p.width / 1600, p.height / 800);
  const offsetX = (p.width - 1600 * s) / 2;
  const offsetY = (p.height - 800 * s) / 2;
  p.push();
  p.translate(offsetX, offsetY);
  p.scale(s);

  drawContainer(p);
  updateTemperature(p);
  drawButton(p);
  showPara(p);
  drawGraph(p);

  p.pop();
}
