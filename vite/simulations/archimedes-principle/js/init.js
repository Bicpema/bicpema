import { Cylinder } from "./cylinder.js";
import { state } from "./state.js";
import { updateDensityLabel } from "./element-function.js";

export const FPS = 60;

// 基準座標系
export const BASE_W = 1000;
export const BASE_H = 562.5;

// 水槽パラメータ（基準座標系）
export const TANK_CX = 500;
export const TANK_BOTTOM_Y = 460;
export const TANK_W = 520;
export const TANK_H = 340;
export const TANK_D = 80;
export const WATER_FILL_RATIO = 0.9;

// 円柱パラメータ（基準座標系）
export const CYL_R = 60;
export const CYL_H = 100;

/**
 * シミュレーションの初期値を設定する関数。
 * @param {*} p p5インスタンス。
 */
export function initValue(p) {
  state.waterSurfaceY = TANK_BOTTOM_Y - TANK_H * WATER_FILL_RATIO;

  const densitySlider = document.getElementById("densitySlider");
  const density = densitySlider ? parseFloat(densitySlider.value) : 1.0;

  let initBottomY;
  if (density <= 1.0) {
    initBottomY = state.waterSurfaceY + CYL_H * density;
  } else {
    initBottomY = TANK_BOTTOM_Y;
  }

  state.cylinder = new Cylinder(TANK_CX, initBottomY, CYL_R, CYL_H, density);
  updateDensityLabel(density);
}

/**
 * UI要素のイベントリスナーを設定する関数。
 * @param {*} p p5インスタンス。
 */
export function elCreate(p) {
  const resetBtn = document.getElementById("resetButton");
  if (resetBtn) {
    resetBtn.addEventListener("click", () => {
      initValue(p);
    });
  }

  const densitySlider = document.getElementById("densitySlider");
  if (densitySlider) {
    densitySlider.addEventListener("input", () => {
      const density = parseFloat(densitySlider.value);
      updateDensityLabel(density);
      if (state.cylinder) {
        state.cylinder.density = density;
        state.cylinder.vy = 0;
        if (density <= 1.0) {
          state.cylinder.cy = state.waterSurfaceY + CYL_H * density;
        } else {
          state.cylinder.cy = TANK_BOTTOM_Y;
        }
      }
    });
  }
}
