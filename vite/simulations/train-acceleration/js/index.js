// index.js はメインのメソッドを呼び出すためのファイルです。

/** 再生中かどうか */
let isPlaying;
/** 経過時間 (s) */
let elapsedTime;
/** 加速度 (m/s²) */
let acceleration;
/** 電車オブジェクト */
let train;
/** v-t グラフ用データ配列 */
let vtData;
/** グラフ更新カウンタ */
let lastGraphUpdate;
/** グラフ更新間隔 (s) */
const GRAPH_UPDATE_INTERVAL = 0.1;
/** v-t グラフで記録した速さの最大値（y軸上限計算用） */
let maxObservedVelocity = 0;

/**
 * セットアップ関数 — 1度だけ呼ばれる。
 */
function setup() {
  // フォントを非同期で読み込む（失敗してもシミュレーションは動作する）
  loadFont(
    "https://firebasestorage.googleapis.com/v0/b/bicpema.firebasestorage.app/o/public%2Fassets%2Ffont%2FZenMaruGothic-Regular.ttf?alt=media&token=9b248da2-ed3a-46a3-b447-46a98775d580",
    (f) => { font = f; },
    () => {}
  );
  settingInit();
  elementSelectInit();
  elementPositionInit();
  valueInit();
  initChart();
}

/**
 * ドロー関数 — 毎フレーム呼ばれる。
 */
function draw() {
  scale(width / V_W);

  /** 仮想キャンバス高さ */
  const VH = V_W * (height / width);
  /** 地面y座標（仮想ピクセル） */
  const GROUND_Y = VH * 0.72;

  if (isPlaying) {
    const dt = 1 / FPS;
    elapsedTime += dt;
    train.update(dt, acceleration, PX_PER_METER, V_W);

    // グラフデータを一定間隔で追記
    lastGraphUpdate += dt;
    if (lastGraphUpdate >= GRAPH_UPDATE_INTERVAL) {
      lastGraphUpdate = 0;
      const v = parseFloat(train.velocity.toFixed(3));
      if (v > maxObservedVelocity) maxObservedVelocity = v;
      vtData.push({
        x: parseFloat(elapsedTime.toFixed(2)),
        y: v,
      });
      updateChart();
    }
  }

  // 空背景
  background(135, 206, 235);

  // 地面
  fill(80, 130, 60);
  noStroke();
  rect(0, GROUND_Y + 28, V_W, VH - GROUND_Y - 28);

  // 線路
  drawTrack(GROUND_Y, train.trackOffset, V_W);

  // 電車
  drawTrain(train.x, GROUND_Y);

  // 情報パネル
  drawInfoPanel(train.velocity, elapsedTime, acceleration);
}

/**
 * ウィンドウリサイズ時の処理。
 */
function windowResized() {
  canvasController.resizeScreen();
}
