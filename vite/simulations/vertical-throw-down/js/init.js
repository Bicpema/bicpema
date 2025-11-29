/**
 * 変数やオブジェクトの初期化を行う。
 */
const initValue = () => {
  // 入力値を取得
  const heightInput = select("#heightInput");
  const velocityInput = select("#velocityInput");

  if (heightInput) {
    buildingHeight = parseFloat(heightInput.value()) || 50;
  }
  if (velocityInput) {
    initialVelocity = parseFloat(velocityInput.value()) || 5;
  }

  // スケールの計算（ビルがキャンバス内に収まるように）
  const maxBuildingPixelHeight = CANVAS_HEIGHT - BUILDING_TOP_Y - 50;
  pixelsPerMeter = maxBuildingPixelHeight / buildingHeight;

  // ボールの初期位置（ビルの屋上）
  const ballX = BUILDING_X + BUILDING_WIDTH / 2;
  const ballY = 0; // メートル単位での初期位置（ビルの上端 = 0m）
  const ballRadius = 15;

  // ボールを作成（初速度はm/s単位）
  ball = new Ball(ballX, ballY, initialVelocity, ballRadius);

  // シミュレーション状態をリセット
  isRunning = false;
  hasLanded = false;
};
