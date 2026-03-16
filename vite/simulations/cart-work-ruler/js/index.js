// index.jsはメインのメソッドを呼び出すためのファイルです。

/** 本の画像 */
let bookImage;

// ------------------------------------------------------------
// preload関数
// setup関数よりも前に一度だけ呼び出される。
// ------------------------------------------------------------
function preload() {
  // ローディング画面を表示
  const loadingDiv = document.createElement("div");
  loadingDiv.id = "loading";
  loadingDiv.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(255, 255, 255, 0.95);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 20px;
    z-index: 9999;
    font-size: 24px;
    font-family: sans-serif;
  `;

  const spinner = document.createElement("div");
  spinner.style.cssText = `
    width: 50px;
    height: 50px;
    border: 5px solid #f3f3f3;
    border-top: 5px solid #3498db;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  `;

  const style = document.createElement("style");
  style.textContent = `
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  `;
  document.head.appendChild(style);

  const loadingText = document.createElement("div");
  loadingText.textContent = "読み込み中です...";

  loadingDiv.appendChild(spinner);
  loadingDiv.appendChild(loadingText);
  document.body.appendChild(loadingDiv);

  font = loadFont(
    "https://firebasestorage.googleapis.com/v0/b/bicpema.firebasestorage.app/o/public%2Fassets%2Ffont%2FZenMaruGothic-Regular.ttf?alt=media&token=9b248da2-ed3a-46a3-b447-46a98775d580"
  );
  bookImage = loadImage(
    "https://firebasestorage.googleapis.com/v0/b/bicpema.firebasestorage.app/o/book2.png?alt=media&token=5a1cd40b-af41-424e-90a3-7372fe30957b"
  );
}

// ------------------------------------------------------------
// setup関数
// シミュレーションを実行する際に１度だけ呼び出される。
// ------------------------------------------------------------
function setup() {
  const loadingDiv = document.getElementById("loading");
  if (loadingDiv) loadingDiv.remove();

  settingInit();
  elementSelectInit();
  elementPositionInit();
  valueInit();
}

// ------------------------------------------------------------
// draw関数
// シミュレーションを実行した後、繰り返し呼び出され続ける。
// ------------------------------------------------------------
function draw() {
  scale(width / V_W);
  background(252);

  if (isRunning) {
    update(1 / FPS);
  }

  drawScene();
}

// ------------------------------------------------------------
// update関数
// 物理状態を1フレーム分更新する。
// @param {number} dt タイムステップ (s)
// ------------------------------------------------------------
function update(dt) {
  if (phase === "approach") {
    approachX_px += v0_ms * PM * dt;
    if (approachX_px + CART_W >= RULER_INIT_LEFT) {
      approachX_px = CART_CONTACT_X;
      phase = "contact";
    }
  } else if (phase === "contact") {
    const decel = force_N / mass_kg;
    const dv = decel * dt;

    if (velocity_ms <= dv) {
      // このフレームで台車が停止する（台形積分で残り距離を計算）
      const tRem = velocity_ms / decel;
      penetration_m += 0.5 * velocity_ms * tRem;
      velocity_ms = 0;
      phase = "stopped";
      isRunning = false;
      playPauseButton.html("終了");
      playPauseButton.attribute("disabled", "");
    } else {
      // 台形積分（精度を上げるため）
      const vNew = velocity_ms - dv;
      penetration_m += 0.5 * (velocity_ms + vNew) * dt;
      velocity_ms = vNew;
    }

    // 定規の最大めり込み量（定規が完全に本の中に入り込まないよう上限を設ける）
    const maxPen = RULER_INIT_LENGTH / PM;
    if (penetration_m > maxPen) {
      penetration_m = maxPen;
      velocity_ms = 0;
      phase = "stopped";
      isRunning = false;
      playPauseButton.html("終了");
      playPauseButton.attribute("disabled", "");
    }
  }
}

// ------------------------------------------------------------
// drawScene関数
// 1フレーム分の描画を行う。
// ------------------------------------------------------------
function drawScene() {
  // 台車の左端x座標を算出
  let cartLeftX;
  if (phase === "idle") {
    cartLeftX = CART_START_X;
  } else if (phase === "approach") {
    cartLeftX = approachX_px;
  } else {
    // contact / stopped: CART_CONTACT_X + めり込みピクセル量
    cartLeftX = CART_CONTACT_X + penetration_m * PM;
  }

  const rulerLeftX = RULER_INIT_LEFT + penetration_m * PM;

  drawGround();
  drawBook();
  drawRuler(rulerLeftX);
  drawCart(cartLeftX);

  // 速度矢印（接近中・接触中）
  if (phase === "approach" || phase === "contact") {
    drawVelocityArrow(cartLeftX, velocity_ms);
  }

  // 抵抗力矢印（接触中のみ）
  if (phase === "contact") {
    drawForceArrow(cartLeftX);
  }

  // めり込み距離のディメンションライン
  if (phase === "contact" || phase === "stopped") {
    drawPenetrationLine(penetration_m);
  }

  drawInfoPanel();
}

// ------------------------------------------------------------
// windowResized関数
// 画面サイズが変わった際に呼び出される。
// ------------------------------------------------------------
function windowResized() {
  canvasController.resizeScreen();
  elementPositionInit();
}
