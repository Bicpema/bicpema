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

  if (!boat || !person) return;

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

  // 速度情報パネルを描画する
  drawInfoPanel();
}

/**
 * シーンの背景（川・岸・ラベル）を描画する。
 */
function drawScene() {
  // 川（水面）の背景
  background(28, 98, 165);

  // 対岸（遠岸）の帯
  fill(155, 125, 70);
  noStroke();
  rect(0, 0, V_W, 20);
  fill(70, 130, 50);
  noStroke();
  rect(0, 0, V_W, 9);

  // 手前の岸（原っぱ）
  fill(82, 155, 62);
  noStroke();
  rect(0, RIVER_BOTTOM, V_W, V_H - RIVER_BOTTOM);

  // 水面ライン
  stroke(110, 180, 225);
  strokeWeight(3);
  line(0, RIVER_BOTTOM, V_W, RIVER_BOTTOM);
  line(0, 20, V_W, 20);

  // 川の流れ方向ラベル（← 左向き）
  noStroke();
  fill(255, 255, 255, 210);
  textSize(18);
  textAlign(LEFT, CENTER);
  text("← 川の流れ", 28, 38);

  // 原っぱラベル
  fill(255, 255, 200);
  textSize(20);
  textAlign(LEFT, CENTER);
  text("原っぱ", 28, RIVER_BOTTOM + 52);

  // 凡例
  drawLegend();
}

/**
 * 速度矢印の色凡例を描画する。
 */
function drawLegend() {
  const lx = 28;
  const ly = RIVER_BOTTOM - 108;
  const lineH = 24;

  // 背景
  fill(0, 0, 0, 150);
  noStroke();
  rect(lx - 8, ly - 10, 250, 80, 6);

  textSize(13);
  textAlign(LEFT, CENTER);

  fill(230, 60, 60);
  text("━━ v川: 川の速度（常に左向き）", lx, ly + lineH * 0);

  fill(30, 210, 60);
  text("━━ v船: 船の速度（水に対して）", lx, ly + lineH * 1);

  fill(60, 130, 255);
  text("━━ v合: 岸から観測した合成速度", lx, ly + lineH * 2);
}

/**
 * 右下に速度情報パネルを描画する。
 * v_合 = v_川 + v_船 の関係を視覚的に確認できる。
 */
function drawInfoPanel() {
  if (!boat) return;

  const px = V_W - 16;
  const py = V_H - 16;
  const panelW = 260;
  const panelH = 100;
  const lineH = 24;

  fill(0, 0, 0, 160);
  noStroke();
  rect(px - panelW, py - panelH, panelW, panelH, 6);

  textSize(13);
  textAlign(LEFT, CENTER);

  // 速度の符号から方向文字を返す（左向き正）
  const dirChar = (v) => {
    if (Math.abs(v) < 0.05) return "（静止）";
    return v > 0 ? "←" : "→";
  };

  const cs = boat.compositeSpeed;

  fill(230, 60, 60);
  text(
    `v川: ${boat.riverSpeed.toFixed(1)} m/s ←`,
    px - panelW + 10,
    py - panelH + lineH * 0.6
  );

  fill(30, 210, 60);
  const boatDir = dirChar(boat.boatSpeed);
  const boatAbs = Math.abs(boat.boatSpeed).toFixed(1);
  text(
    `v船: ${boatAbs} m/s ${boatDir}`,
    px - panelW + 10,
    py - panelH + lineH * 1.7
  );

  fill(60, 130, 255);
  text(
    `v合: ${Math.abs(cs).toFixed(1)} m/s ${dirChar(cs)}`,
    px - panelW + 10,
    py - panelH + lineH * 2.8
  );
}

/**
 * 画面リサイズ時の処理。
 */
function windowResized() {
  canvasController.resizeScreen();
}

