import { state } from './state.js';
import { resetState } from './init.js';

export function drawSimulation(p) {
  p.frameRate(20);
  p.background(255);

  const s = Math.min(p.width / 1600, p.height / 800);
  const offsetX = (p.width - 1600 * s) / 2;
  const offsetY = (p.height - 800 * s) / 2;
  p.push();
  p.translate(offsetX, offsetY);
  p.scale(s);

  updateTemperature();
  leftArea(p);
  rightArea(p);
  middleArrow(p);
  drawGraph(p);

  p.pop();
}

function updateTemperature() {
  let contactState = parseInt(
    document.querySelector('input[name="contact"]:checked')?.value ?? '1'
  );
  if (contactState === 0) {
    state.t++;
    state.Thot = state.Teq + (state.Thot0 - state.Teq) * Math.exp(-state.heatK * state.t);
    state.Tcold = state.Teq + (state.Tcold0 - state.Teq) * Math.exp(-state.heatK * state.t);
  } else {
    resetState();
  }
}

function leftArea(p) {
  drawBlock(p, state.bitx, state.bity, 1200 / 2 - 2 * state.bitx, 800 / 2 - 2 * state.bity, state.Thot0);
  drawBlock(p, state.bitx, 800 / 2 + state.bity, 1200 / 2 - 2 * state.bitx, 800 / 2 - 2 * state.bity, state.Tcold0);
}

function rightArea(p) {
  drawBlock(p, 1100 / 2 + state.bitx, 2 * state.bity, 1200 / 2 - 2 * state.bitx, 800 / 2 - 2 * state.bity, state.Thot);
  drawBlock(p, 1100 / 2 + state.bitx, 800 / 2, 1200 / 2 - 2 * state.bitx, 800 / 2 - 2 * state.bity, state.Tcold);
}

function drawBlock(p, x, y, w, h, T) {
  let coldCol = p.color(0, 120, 255, 120);
  let hotCol = p.color(255, 80, 0, 120);
  let tcol = p.constrain((T - state.Tmin) / (state.Tmax - state.Tmin), 0, 1);
  p.fill(p.lerpColor(coldCol, hotCol, tcol));
  p.stroke(0);
  p.rect(x, y, w, h);
  drawMolecules(p, x, y, w, h, T);
  p.fill(0);
  p.noStroke();
  p.textSize(16);
  p.text(`${T.toFixed(1)} K`, x + 10, y + 22);
}

function drawMolecules(p, x, y, w, h, T) {
  let dx = w / state.cols;
  let dy = h / state.rows;
  let amp = 0.4 * p.sqrt(p.max(T, 0));
  amp = p.constrain(amp, 0, 15);
  p.fill(255);
  p.stroke(0);
  for (let j = 0; j < state.rows; j++) {
    for (let i = 0; i < state.cols; i++) {
      let cx = x + (i + 0.5) * dx;
      let cy = y + (j + 0.5) * dy;
      p.ellipse(cx + p.random(-amp, amp), cy + p.random(-amp, amp), state.ballR * 2);
    }
  }
}

function middleArrow(p) {
  p.fill(255, 0, 0, 120);
  p.noStroke();
  p.rect((1100 / 2) * 0.8, (800 / 2) * 0.96, 1100 / 10, 800 / 25);
  p.triangle(
    (1100 / 2) * 1.1, 800 / 2,
    1100 / 2, (800 / 2) * 0.9,
    1100 / 2, (800 / 2) * 1.1
  );
}

function tx(t) { return p5map(t, 0, state.tMax, state.gx, state.gx + state.gw); }
function ty(T) { return p5map(T, state.Tmin, state.Tmax, state.gy + state.gh, state.gy); }
let p5map;

function drawGraph(p) {
  p5map = (v, a, b, c, d) => p.map(v, a, b, c, d);

  p.push();
  p.scale(0.65);
  p.translate(900, 200);

  const logicalWidth = 1600;
  const logicalHeight = 800;
  const ysize = logicalWidth / 3;

  state.gx = (logicalWidth / 2) * 1.05;
  state.gy = logicalHeight / 9.5;
  state.gw = logicalWidth / 2.35;
  state.gh = logicalWidth / 2.75;

  p.noStroke();
  p.fill(185, 220, 255);
  p.rect((logicalWidth / 2) * 0.98, logicalHeight / 12, logicalWidth / 2.1, logicalWidth / 2.4);
  p.fill(255);
  p.rect(state.gx, state.gy, state.gw, state.gh);

  p.textSize(26);
  p.fill(0);
  p.stroke(255, 0, 0);
  p.line((logicalWidth / 2) * 1.7, logicalHeight / 9.5 + (ysize * 0.5) / 7, (logicalWidth / 2) * 1.82, logicalHeight / 9.5 + (ysize * 0.5) / 7);
  p.textSize(30);
  p.text("物質(高温)", (logicalWidth / 2) * 1.51, logicalHeight / 9.5 + (ysize * 0.6) / 7);
  p.stroke(0, 0, 255);
  p.line((logicalWidth / 2) * 1.7, logicalHeight / 9.5 + (ysize * 1.2) / 7, (logicalWidth / 2) * 1.82, logicalHeight / 9.5 + (ysize * 1.2) / 7);
  p.textSize(30);
  p.text("物質(低温)", (logicalWidth / 2) * 1.51, logicalHeight / 9.5 + (ysize * 1.35) / 7);

  p.stroke(0);
  p.fill(0);
  p.textSize(30);
  p.text("接触してからの経過時間(s))", (logicalWidth / 2) * 1.45, logicalWidth / 2.55 + logicalHeight / 9.5);
  p.textSize(30);
  p.text("温", (logicalWidth / 2) * 0.99, (logicalHeight / 9.5) * 1.3);
  p.text("度", (logicalWidth / 2) * 0.99, (logicalHeight / 9.5) * 1.7);
  p.text("(K)", (logicalWidth / 2) * 0.985, (logicalHeight / 9.5) * 2.1);

  p.stroke(0);
  p.strokeWeight(2);
  p.line(state.gx, state.gy, state.gx, state.gy + state.gh);
  p.line(state.gx, state.gy + state.gh, state.gx + state.gw, state.gy + state.gh);
  p.fill(0);
  p.triangle(
    (logicalWidth / 2) * 1.04, logicalHeight / 8,
    (logicalWidth / 2) * 1.05, logicalHeight / 9.5,
    (logicalWidth / 2) * 1.06, logicalHeight / 8
  );
  p.triangle(
    (logicalWidth / 2) * 1.05 + logicalWidth / 2.35, logicalWidth / 2.75 + logicalHeight / 9.5,
    ((logicalWidth / 2) * 1.05 + logicalWidth / 2.35) * 0.986, (logicalWidth / 2.75 + logicalHeight / 9.5) * 0.99,
    ((logicalWidth / 2) * 1.05 + logicalWidth / 2.35) * 0.986, (logicalWidth / 2.75 + logicalHeight / 9.5) * 1.01
  );

  const contactVal = document.querySelector('input[name="contact"]:checked')?.value ?? '1';

  if (contactVal === '1') {
    p.push();
    p.strokeWeight(10);
    p.stroke(255, 0, 0, 120);
    p.point(tx(0), ty(state.Thot0));
    p.stroke(0, 0, 255, 120);
    p.point(tx(0), ty(state.Tcold0));
    p.pop();
  }

  p.strokeWeight(2);

  if (contactVal === '0') {
    p.drawingContext.setLineDash([8, 6]);
    p.stroke(0);
    p.line(tx(0), ty(state.Teq), tx(state.tMax), ty(state.Teq));
    p.drawingContext.setLineDash([]);

    p.noFill();
    p.strokeWeight(3);
    p.stroke(255, 0, 0);
    p.beginShape();
    for (let tt = 0; tt <= state.tMax; tt++) {
      let T = state.Teq + (state.Thot0 - state.Teq) * Math.exp(-state.heatK * tt);
      p.vertex(tx(tt), ty(T));
    }
    p.endShape();

    p.stroke(0, 0, 255);
    p.beginShape();
    for (let tt = 0; tt <= state.tMax; tt++) {
      let T = state.Teq + (state.Tcold0 - state.Teq) * Math.exp(-state.heatK * tt);
      p.vertex(tx(tt), ty(T));
    }
    p.endShape();

    let t_now = p.min(state.t, state.tMax);

    p.stroke(255, 0, 0);
    p.strokeWeight(8);
    p.point(tx(t_now), ty(state.Thot));
    p.push();
    let labelA = p.nf(state.Thot, 1, 2) + " K";
    p.textSize(24);
    let tw = p.textWidth(labelA);
    let th = 28;
    let lx = tx(t_now) + 12;
    let ly = ty(state.Thot) - 12;
    lx = p.constrain(lx, state.gx + 6, state.gx + state.gw - tw - 6);
    ly = p.constrain(ly, state.gy + th + 6, state.gy + state.gh - 6);
    p.noStroke();
    p.fill(255, 220);
    p.rect(lx - 6, ly - th, tw + 12, th, 6);
    p.fill(180, 0, 0);
    p.text(labelA, lx, ly - 6);
    p.pop();

    p.stroke(0, 0, 255);
    p.strokeWeight(8);
    p.point(tx(t_now), ty(state.Tcold));
    p.push();
    let labelB = p.nf(state.Tcold, 1, 2) + " K";
    p.textSize(24);
    let twb = p.textWidth(labelB);
    let thb = 28;
    let lxb = tx(t_now) + 12;
    let lyb = ty(state.Tcold) + 38;
    lx = p.constrain(lxb, state.gx + 6, state.gx + state.gw - twb - 6);
    ly = p.constrain(lyb, state.gy + thb + 6, state.gy + state.gh - 6);
    p.noStroke();
    p.fill(255, 220);
    p.rect(lx - 6, ly - thb, twb + 12, thb, 6);
    p.fill(0, 0, 180);
    p.text(labelB, lx, ly - 6);
    p.pop();
  }

  p.pop();
}
