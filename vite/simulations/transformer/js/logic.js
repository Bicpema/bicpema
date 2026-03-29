import { state } from "./state.js";

/**
 * シミュレーション全体を描画する関数。
 * UIの状態をstateに反映したのち、各パーツを描画する。
 * @param {*} p p5インスタンス。
 */
export function drawSimulation(p) {
  // 設定パネルのラジオボタンからstate（位相・速度）を更新
  const phaseRadio = document.querySelector('input[name="phase"]:checked');
  if (phaseRadio) state.phase = phaseRadio.value === "true";

  const speedRadio = document.querySelector('input[name="speed"]:checked');
  if (speedRadio) state.omega = parseFloat(speedRadio.value);

  p.background(255);

  // 変圧器本体の下に巻数テキストを表示
  p.textSize(16);
  p.textAlign(p.CENTER, p.TOP);
  p.text("一次コイル", 380, 450);
  p.text("巻数：" + (state.count1 + 1), 380, 475);
  p.text("二次コイル", 630, 450);
  p.text("巻数：" + (state.count2 + 1), 630, 475);

  // 変圧器本体（コア画像・磁力線・一次/二次コイル）
  p.push();
  p.translate(308, 0);
  p.image(state.img1, 0, 50, 396, 376);
  magline(p);
  coil1(p);
  coil2(p);
  p.pop();

  // 左側：一次電圧オシロスコープ
  p.push();
  p.translate(25, 150);
  oscillo1(p);
  p.pop();

  // 右側：二次電圧オシロスコープ
  p.push();
  p.translate(775, 150);
  oscillo2(p);
  p.pop();

  // フレームカウントを進める
  state.t++;
}

/**
 * コア内の磁力線ループと向きを示す矢印を描画する。
 * 電流の符号に応じて矢印の向きを反転させる。
 * @param {*} p p5インスタンス。
 */
function magline(p) {
  // 磁力線の楕円ループ（コア断面を模した丸角矩形）
  p.rectMode(p.CENTER);
  p.noFill();
  p.stroke(0, 50, 200);
  p.strokeWeight(5);
  p.rect(177, 252, 250, 250, 20);
  // 電流が正の半サイクル：矢印を時計回り方向に描画
  if (p.sin(-state.omega * state.t) >= 0) {
    p.triangle(
      177 - 5,
      252 + 125 + 5,
      177 - 5,
      252 + 125 - 5,
      177 + 5,
      252 + 125
    );
    p.triangle(
      177 + 5,
      252 - 125 + 5,
      177 + 5,
      252 - 125 - 5,
      177 - 5,
      252 - 125
    );
  }
  // 電流が負の半サイクル：矢印を反時計回り方向に描画
  if (p.sin(-state.omega * state.t) < 0) {
    p.triangle(
      177 + 5,
      252 + 125 + 5,
      177 + 5,
      252 + 125 - 5,
      177 - 5,
      252 + 125
    );
    p.triangle(
      177 - 5,
      252 - 125 + 5,
      177 - 5,
      252 - 125 - 5,
      177 + 5,
      252 - 125
    );
  }
  p.noStroke();
  p.fill(0, 50, 200);
  p.textSize(16);
  p.textAlign(p.CENTER, p.BOTTOM);
  p.text("磁力線", 177, 110);
}

/**
 * 一次コイルの巻き線・端線・電流矢印を描画する。
 * state.count1 の値に応じて巻き線の本数が変化する。
 * @param {*} p p5インスタンス。
 */
function coil1(p) {
  const x = 0; // コイル左端のX座標
  const w = 91; // 横巻き線（img2）の幅
  const h = 5; // 巻き線1本の高さ
  const x2 = x + w - 2; // 曲がり部（img3）の開始X
  const w2 = 45; // 曲がり部（img3）の幅
  // コイル全体を中央揃えするためのY起点
  const y = 250 - (state.count1 * h) / 2;
  // 巻き線の角度による上端の変位量
  const d = p.sin(-state.angle) * w2;

  // 最上端と最下端の接続端線を描画
  p.image(state.img2, x - 77, y - h - d, 78, h);
  p.image(state.img2, x - 77, y + state.count1 * h, w + 77, h);

  // 最下端の曲がり部を描画
  p.push();
  p.translate(x2, y + state.count1 * h);
  p.rotate(state.angle);
  p.image(state.img3, 0, 0, w2, h);
  p.pop();

  // 各巻き線（横線＋曲がり部）をループで描画
  for (let i = 0; i < state.count1; i++) {
    state.topY1 = y + i * h;
    p.image(state.img2, x, state.topY1, w, h);
    p.push();
    p.translate(x2, state.topY1);
    p.rotate(state.angle);
    p.image(state.img3, 0, 0, w2, h);
    p.pop();
  }

  // 一次電流矢印とラベルを描画
  p.push();
  p.translate(-40, y + state.count1 * h);
  current1(p);
  p.noStroke();
  p.fill(255, 0, 0);
  p.textSize(16);
  p.textAlign(p.CENTER, p.TOP);
  p.text("一次電流", 0, 20);
  p.pop();
}

/**
 * 二次コイルの巻き線・端線・電流矢印を描画する。
 * state.phase（同位相/逆位相）によって端線の接続方向が変化する。
 * @param {*} p p5インスタンス。
 */
function coil2(p) {
  const x = 260; // コイル左端のX座標
  const w = 87; // 横巻き線（img2）の幅
  const h = 5; // 巻き線1本の高さ
  const x2 = x + w - 2; // 曲がり部（img3）の開始X
  const w2 = 53; // 曲がり部（img3）の幅
  // コイル全体を中央揃えするためのY起点
  const y = 250 - (state.count2 * h) / 2;
  // 巻き線の角度による上端の変位量
  const d = p.sin(-state.angle) * w2;

  // 各巻き線（横線＋曲がり部）をループで描画
  for (let i = 0; i < state.count2; i++) {
    state.topY2 = y + i * h;
    p.image(state.img2, x, state.topY2, w, h);
    p.push();
    p.translate(x2, state.topY2);
    p.rotate(state.angle);
    p.image(state.img3, 0, 0, w2, h);
    p.pop();
  }

  // 同位相：端線を最下端から引き出して上端に接続
  if (state.phase) {
    p.image(state.img2, x, y + state.count2 * h, w, h);
    p.push();
    p.translate(x2, y + state.count2 * h);
    p.rotate(state.angle);
    p.image(state.img3, 0, 0, w2, h);
    p.pop();
    p.image(state.img3, x + w, y + state.count2 * h, w + 30, h);
    p.image(state.img3, x + 135, y - h - d, w * 2 - 135 + 30, h);
    // 二次電流矢印とラベルを最上端に描画
    p.push();
    p.translate(x2 + 82, y - h - d);
    current2(p);
    p.noStroke();
    p.fill(255, 0, 0);
    p.textSize(16);
    p.textAlign(p.CENTER, p.BOTTOM);
    p.text("二次電流", 5, -10);
    p.pop();
  }

  // 逆位相：端線を最上端から引き出して下端に接続
  if (!state.phase) {
    p.image(state.img2, x, y - h, w, h);
    p.push();
    p.translate(x2, y - h);
    p.rotate(state.angle);
    p.image(state.img3, 0, 0, w2, h);
    p.pop();
    p.image(state.img3, x + 135, y + state.count2 * h, w * 2 - 135 + 30, h);
    p.image(state.img3, x + w, y - h, w + 30, h);
    // 二次電流矢印とラベルを最上端に描画
    p.push();
    p.translate(x2 + 82, y - h);
    current2(p);
    p.noStroke();
    p.fill(255, 0, 0);
    p.textSize(16);
    p.textAlign(p.CENTER, p.BOTTOM);
    p.text("二次電流", 5, -10);
    p.pop();
  }
}

/**
 * 一次電圧のオシロスコープ波形を描画する。
 * 振幅は固定（V1）で、一次電圧の基準波形を表す。
 * @param {*} p p5インスタンス。
 */
function oscillo1(p) {
  const w = 200; // 描画領域の幅
  const h = 200; // 描画領域の高さ
  const V1 = h / 10; // グリッド幅 = 最大振幅
  p.textSize(16);
  p.textAlign(p.CENTER, p.BOTTOM);
  p.text("一次電圧", 100, -10);
  // 背景
  p.fill(75, 127, 127, 220);
  p.noStroke();
  p.rect(0, 0, w, h);
  // グリッド線
  p.stroke(200);
  for (let i = 0; i <= w; i += V1) {
    p.line(0, i, w, i);
    p.line(i, 0, i, h);
  }
  // 波形: y = 中心 + V1 * sin(kx - ωt)
  p.noFill();
  p.stroke(0, 255, 255);
  p.strokeWeight(2);
  p.beginShape();
  for (let x = 0; x <= w; x++) {
    let y = h / 2 + V1 * p.sin(state.waveK * x - state.omega * state.t);
    p.vertex(x, y);
  }
  p.endShape();
}

/**
 * 二次電圧のオシロスコープ波形を描画する。
 * 振幅は変圧比 (N2/N1) × V1 で決まり、逆位相のときは符号を反転する。
 * @param {*} p p5インスタンス。
 */
function oscillo2(p) {
  const w = 200; // 描画領域の幅
  const h = 200; // 描画領域の高さ
  const V1 = h / 10; // グリッド幅 = 一次電圧の最大振幅
  // 変圧比による二次電圧の振幅 V2 = V1 × (N2 / N1)
  let V2 = (V1 * (state.count2 + 1)) / (state.count1 + 1);
  p.textSize(16);
  p.textAlign(p.CENTER, p.BOTTOM);
  p.text("二次電圧", 100, -10);
  // 背景
  p.fill(75, 127, 127, 220);
  p.noStroke();
  p.rect(0, 0, w, h);
  // グリッド線
  p.stroke(200);
  for (let i = 0; i <= w; i += V1) {
    p.line(0, i, w, i);
    p.line(i, 0, i, h);
  }
  // 波形: 同位相は +V2、逆位相は −V2
  p.noFill();
  p.stroke(0, 255, 255);
  p.strokeWeight(2);
  p.beginShape();
  for (let x = 0; x <= w; x++) {
    let y;
    if (state.phase) {
      y = h / 2 + V2 * p.sin(state.waveK * x - state.omega * state.t);
    } else {
      y = h / 2 - V2 * p.sin(state.waveK * x - state.omega * state.t);
    }
    p.vertex(x, y);
  }
  p.endShape();
}

/**
 * 一次電流の大きさと向きを示す矢印を描画する。
 * Iの符号（正負）が矢印の向きを決める。
 * @param {*} p p5インスタンス。
 */
function current1(p) {
  p.push();
  p.noStroke();
  p.fill(255, 0, 0);
  // I: 電流の大きさ（正負で向き変化）
  const I = 15 * p.sin(state.omega * state.t);
  // x: 矢じりの突出量
  const x = 10 * p.sin(state.omega * state.t);
  // 電流の胴体（細い四角形）
  p.quad(0, 0, 0 + I, 0, 0 + I, 0 + 5, 0, 0 + 5);
  // 電流の矢じり（三角形）
  p.triangle(I, 10, I, -5, I + x, 2.5);
  p.pop();
}

/**
 * 二次電流の大きさと向きを示す矢印を描画する。
 * 大きさは変圧比 (N1/N2) × 一次電流の最大値で決まる。
 * 逆位相のときは電流の向きが反転する。
 * @param {*} p p5インスタンス。
 */
function current2(p) {
  p.push();
  p.noStroke();
  p.fill(255, 0, 0);
  let I, x;
  // 同位相：二次電流は一次と同向き（変圧比で振幅を拡大）
  if (state.phase) {
    I =
      ((15 * (state.count1 + 1)) / (state.count2 + 1)) *
      p.sin(state.omega * state.t);
    x = 10 * p.sin(state.omega * state.t);
  } else {
    // 逆位相：二次電流は一次と逆向き
    I =
      ((-15 * (state.count1 + 1)) / (state.count2 + 1)) *
      p.sin(state.omega * state.t);
    x = -10 * p.sin(state.omega * state.t);
  }
  // 電流の胴体（細い四角形）
  p.quad(0, 0, 0 + I, 0, 0 + I, 0 + 5, 0, 0 + 5);
  // 電流の矢じり（三角形）
  p.triangle(I, 10, I, -5, I + x, 2.5);
  p.pop();
}
