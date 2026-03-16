// index.js - メインのメソッドを呼び出すためのファイルです。

/** フォント */
let font;

// preload関数
// setup関数よりも前に一度だけ呼び出される。
function preload() {
  font = loadFont(
    "https://firebasestorage.googleapis.com/v0/b/bicpema.firebasestorage.app/o/public%2Fassets%2Ffont%2FZenMaruGothic-Regular.ttf?alt=media&token=9b248da2-ed3a-46a3-b447-46a98775d580"
  );
}

// setup関数
// シミュレーションを実行する際に１度だけ呼び出される。
function setup() {
  settingInit();
  elementSelectInit();
  elementPositionInit();
  valueInit();
}

// draw関数
// シミュレーションを実行した後、繰り返し呼び出され続ける
function draw() {
  // レスポンシブスケーリング
  scale(width / V_W);

  background(245);

  // ── 物理更新 ────────────────────────────────────────────────
  if (isPlaying) {
    cart.update(1 / FPS);

    // 記録間隔ごとにテープにマークを追加
    while ((tapeMarks.length + 1) * recInterval <= cart.time) {
      const t = (tapeMarks.length + 1) * recInterval;
      const s = 0.5 * cart.accel * t * t;
      // 斜面の範囲を超える位置は記録しない
      if (s > cart.slopeLengthM) break;
      const v = cart.accel * t;
      tapeMarks.push(s);
      vtData.push({ x: t, y: v });
    }

    // 台車が下端に達したらボタン更新
    if (cart.isAtBottom) {
      isPlaying = false;
      playPauseButton.html("▶ 開始");
      if (graphVisible) updateGraph();
    }
  }

  // ── 描画 ─────────────────────────────────────────────────────
  // 斜面・支持台
  drawSlope(slopeDeg);

  // 台車
  drawCartOnSlope(cart, slopeDeg);

  // 記録テープ
  drawRecordingTape(tapeMarks, recInterval);

  // 情報パネル
  drawInfoPanel(cart);

  // v-tグラフをリアルタイム更新（再生中のみ）
  if (isPlaying && graphVisible) {
    updateGraph();
  }
}

// windowResized関数
// デバイスの画面サイズが変わった際に呼び出される。
function windowResized() {
  canvasController.resizeScreen();
  elementPositionInit();
}
