// index.js はメインのメソッドを呼び出すためのファイルです。

let font;

/**
 * フォントをプリロードする。
 */
function preload() {
  font = loadFont(
    "https://firebasestorage.googleapis.com/v0/b/bicpema.firebasestorage.app/o/public%2Fassets%2Ffont%2FZenMaruGothic-Regular.ttf?alt=media&token=9b248da2-ed3a-46a3-b447-46a98775d580",
    () => {},
    () => {
      font = null;
    }
  );
}

/**
 * セットアップ関数（1回のみ呼び出し）。
 */
function setup() {
  settingInit();
  elementSelectInit();
  elementPositionInit();
  valueInit();
}

/**
 * メイン描画ループ。
 */
function draw() {
  scale(width / V_W);

  drawScene();

  const dt = 1 / FPS;

  // 水の粒子を更新・描画する
  for (const p of waterParticles) {
    p.update(dt);
    p.draw();
  }

  // 船を更新・描画する
  boat.update(dt);
  boat.draw();

  // 観測者を描画する
  person.draw();

  // 情報パネルを描画する
  drawInfoPanel();
}

/**
 * シーンの背景（川・岸・ラベル）を描画する。
 */
function drawScene() {
  // 川の水面（背景）
  background(30, 100, 170);

  // 対岸（遠岸）
  fill(160, 130, 75);
  noStroke();
  rect(0, 0, V_W, FAR_BANK_BOTTOM);

  // 対岸の草
  fill(80, 140, 60);
  noStroke();
  rect(0, 0, V_W, 12);

  // 手前の岸（原っぱ）
  fill(85, 160, 65);
  noStroke();
  rect(0, RIVER_BOTTOM, V_W, V_H - RIVER_BOTTOM);

  // 水面ライン
  stroke(120, 185, 230);
  strokeWeight(3);
  line(0, RIVER_BOTTOM, V_W, RIVER_BOTTOM);
  line(0, FAR_BANK_BOTTOM, V_W, FAR_BANK_BOTTOM);

  // 川の流れ方向ラベル
  noStroke();
  fill(255, 255, 255, 200);
  textSize(16);
  textAlign(LEFT, CENTER);
  text("川の流れ →", 30, FAR_BANK_BOTTOM / 2);

  // 原っぱラベル
  fill(255, 255, 200);
  textSize(20);
  textAlign(LEFT, CENTER);
  text("原っぱ", 30, RIVER_BOTTOM + 60);

  // 凡例を描画する
  drawLegend();
}

/**
 * 速度の凡例を描画する。
 */
function drawLegend() {
  const lx = 28;
  const ly = FAR_BANK_BOTTOM + 14;
  const lineH = 22;

  // 背景
  fill(0, 0, 0, 145);
  noStroke();
  rect(lx - 8, ly - 8, 210, 72, 6);

  textSize(13);
  textAlign(LEFT, CENTER);

  // 船の速度（緑）
  fill(30, 210, 30);
  text("← 船の速度 (v船)", lx, ly + lineH * 0);

  // 川の速度（赤）
  fill(220, 50, 50);
  text("→ 川の速度 (v川)", lx, ly + lineH * 1);

  // 合成速度（青）
  fill(50, 130, 255);
  text("↔ 合成速度 (v合)", lx, ly + lineH * 2);
}

/**
 * 現在の速度情報パネルを右下に描画する。
 */
function drawInfoPanel() {
  const px = V_W - 20;
  const py = V_H - 20;
  const panelW = 240;
  const panelH = 86;
  const lineH = 22;

  fill(0, 0, 0, 155);
  noStroke();
  rect(px - panelW, py - panelH, panelW, panelH, 6);

  textSize(13);
  textAlign(LEFT, CENTER);

  const compSpeed = boat.compositeSpeed;
  let dirLabel;
  if (Math.abs(compSpeed) < 0.05) {
    dirLabel = "（静止）";
  } else if (compSpeed > 0) {
    dirLabel = "→（右向き）";
  } else {
    dirLabel = "←（左向き）";
  }

  fill(30, 210, 30);
  text(`v船: ${boat.boatSpeed.toFixed(1)} m/s`, px - panelW + 10, py - panelH + lineH * 0.6);

  fill(220, 50, 50);
  text(`v川: ${boat.riverSpeed.toFixed(1)} m/s`, px - panelW + 10, py - panelH + lineH * 1.6);

  fill(50, 130, 255);
  text(
    `v合: ${Math.abs(compSpeed).toFixed(1)} m/s ${dirLabel}`,
    px - panelW + 10,
    py - panelH + lineH * 2.6
  );
}

/**
 * 画面リサイズ時の処理。
 */
function windowResized() {
  canvasController.resizeScreen();
  elementPositionInit();
}
