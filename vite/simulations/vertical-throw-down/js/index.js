const CANVAS_WIDTH = 1000;
const CANVAS_HEIGHT = (1000 * 9) / 16;

// 重力加速度（m/s^2）
const GRAVITY = 9.8;

// シミュレーション変数
let ball;
let canvasController;
let buildingHeight = 50; // デフォルトのビルの高さ（m）
let initialVelocity = 5; // デフォルトの初速度（m/s）
let isRunning = false;
let hasLanded = false;

// 描画用のスケール（1m = 何ピクセルか）
let pixelsPerMeter;

// ビルの描画位置
const BUILDING_X = 100;
const BUILDING_WIDTH = 150;
const BUILDING_TOP_Y = 50;

/**
 * setup関数
 * シミュレーションを実行する際に１度だけ呼び出される。
 */
function setup() {
  canvasController = new BicpemaCanvasController();
  canvasController.fullScreen();

  elInit();
  elSetting();
  initValue();

  // フォントを非同期で読み込む（読み込み失敗しても続行）
  loadFont(
    "https://firebasestorage.googleapis.com/v0/b/bicpema.firebasestorage.app/o/public%2Fassets%2Ffont%2FZenMaruGothic-Regular.ttf?alt=media&token=9b248da2-ed3a-46a3-b447-46a98775d580",
    (font) => {
      textFont(font);
    }
  );

  textSize(14);
  textAlign(CENTER);
  frameRate(60);
}

/**
 * draw関数
 * シミュレーションを実行した後、繰り返し呼び出され続ける
 */
function draw() {
  // レスポンシブ処理
  scale(width / CANVAS_WIDTH);

  // 背景（空）
  background(135, 206, 235);

  // 地面を描画
  const groundY = BUILDING_TOP_Y + buildingHeight * pixelsPerMeter;
  drawGround(groundY, CANVAS_WIDTH);

  // ビルを描画
  const buildingPixelHeight = buildingHeight * pixelsPerMeter;
  drawBuilding(BUILDING_X, BUILDING_TOP_Y, BUILDING_WIDTH, buildingPixelHeight);

  // スケールを描画（チェックボックスがチェックされている場合）
  const scaleCheckBox = select("#scaleCheckBox");
  if (scaleCheckBox && scaleCheckBox.checked()) {
    drawScale(BUILDING_X + BUILDING_WIDTH + 50, BUILDING_TOP_Y, groundY, buildingHeight);
  }

  // ボールの更新と描画
  if (isRunning && !hasLanded) {
    // deltaTimeはミリ秒なので、秒に変換する
    const dt = deltaTime / 1000;
    ball.update(dt, GRAVITY);

    // 地面に到達したか確認（ボールの位置がビルの高さを超えたら）
    if (ball.y >= buildingHeight) {
      ball.y = buildingHeight;
      hasLanded = true;
      isRunning = false;
    }
  }

  ball.draw(pixelsPerMeter, BUILDING_TOP_Y);

  // 情報パネルを描画（メートル単位の値を使用）
  drawInfoPanel(ball.time, ball.velocity, ball.y, CANVAS_WIDTH - 200, 20);

  // 操作説明を描画
  drawInstructions();
}

/**
 * 操作説明を描画する。
 */
function drawInstructions() {
  fill(255);
  textSize(16);
  textAlign(CENTER, CENTER);

  if (!isRunning && !hasLanded) {
    text("クリックでボールを投げ下ろす", CANVAS_WIDTH / 2, CANVAS_HEIGHT - 30);
  } else if (hasLanded) {
    text("クリックでリセット", CANVAS_WIDTH / 2, CANVAS_HEIGHT - 30);
  }
}

/**
 * マウスクリック時の処理
 */
function mousePressed() {
  if (hasLanded) {
    // リセット
    ball.reset();
    hasLanded = false;
    isRunning = false;
  } else if (!isRunning) {
    // シミュレーション開始
    isRunning = true;
  }
}

/**
 * windowResized関数
 * シミュレーションを利用しているデバイスの画面サイズが変わった際に呼び出される。
 */
function windowResized() {
  canvasController.resizeScreen();
  elSetting();
}
