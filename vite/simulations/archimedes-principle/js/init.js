// init.jsは初期処理専用のファイルです。

const FPS = 60;
let canvasController;

// 水槽のレイアウト定数（1000×562.5 基準座標系）
const BASE_W = 1000;
const BASE_H = 562.5;

// 水槽パラメータ（基準座標系）
const TANK_CX = 500;
const TANK_BOTTOM_Y = 460;
const TANK_W = 520;
const TANK_H = 340;
const TANK_D = 80; // 等角投影の奥行き
const WATER_FILL_RATIO = 0.9;

// 水面Y座標（基準座標系）
let waterSurfaceY;

// 円柱パラメータ（基準座標系）
const CYL_R = 60;
const CYL_H = 100;

// 円柱オブジェクト
let cylinder;

// シミュレーション状態
let running = false;

/**
 * シミュレーション設定の初期化。
 */
function settingInit() {
  canvasController = new BicpemaCanvasController(true, false);
  canvasController.fullScreen();
  frameRate(FPS);
  textAlign(CENTER, CENTER);
  textSize(16);
  noLoop();
}

/**
 * DOM要素のイベントリスナー設定。
 */
function elementSelectInit() {
  const startBtn = document.getElementById("startButton");
  if (startBtn) {
    startBtn.addEventListener("click", () => {
      running = !running;
      updateStartButton(running);
      if (running) loop();
      else noLoop();
    });
  }

  const resetBtn = document.getElementById("resetButton");
  if (resetBtn) {
    resetBtn.addEventListener("click", () => {
      valueInit();
      if (!running) redraw();
    });
  }

  const densitySlider = document.getElementById("densitySlider");
  if (densitySlider) {
    densitySlider.addEventListener("input", () => {
      const density = parseFloat(densitySlider.value);
      updateDensityLabel(density);
      if (cylinder) {
        cylinder.density = density;
        cylinder.vy = 0;
        // 実行中でない場合は平衡位置に即座に更新する
        if (!running) {
          if (density <= 1.0) {
            cylinder.cy = waterSurfaceY + CYL_H * density;
          } else {
            cylinder.cy = TANK_BOTTOM_Y;
          }
        }
      }
      if (!running) redraw();
    });
  }
}

/**
 * 初期値の設定。
 */
function valueInit() {
  waterSurfaceY = TANK_BOTTOM_Y - TANK_H * WATER_FILL_RATIO;

  const densitySlider = document.getElementById("densitySlider");
  const density = densitySlider ? parseFloat(densitySlider.value) : 1.0;

  // 平衡位置を計算して初期位置を設定
  // 浮いている場合: ρ_obj/ρ_water = 水中割合
  // 円柱の底面Y座標 = 水面 + 沈む深さ
  let initBottomY;
  if (density <= 1.0) {
    // 浮く: 沈む割合 = density
    const submergedHeight = CYL_H * density;
    initBottomY = waterSurfaceY + submergedHeight;
  } else {
    // 沈む: 底面に着底
    initBottomY = TANK_BOTTOM_Y;
  }

  cylinder = new Cylinder(TANK_CX, initBottomY, CYL_R, CYL_H, density);
  updateDensityLabel(density);
}
