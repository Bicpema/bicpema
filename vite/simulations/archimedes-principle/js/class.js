// class.jsはクラス管理専用のファイルです。

/**
 * BicpemaCanvasControllerクラス
 *
 * Bicpemaの動的なキャンバスサイズをコントロールする。
 */
export class BicpemaCanvasController {
  /**
   * @constructor
   * @param {boolean} f 回転時に比率を固定化するか
   * @param {boolean} i 3Dかどうか
   * @param {number} w_r 幅の比率（0.0~1.0）
   * @param {number} h_r 高さの比率（0.0~1.0）
   */
  constructor(f = true, i = false, w_r = 1.0, h_r = 1.0) {
    this.fixed = f;
    this.is3D = i;
    this.widthRatio = w_r;
    this.heightRatio = h_r;
  }

  /**
   * HTML要素で生成している#p5Canvasと#navBarを元にcanvasを生成する。
   */
  fullScreen() {
    const P5_CANVAS = select("#p5Canvas");
    const NAV_BAR = select("#navBar");
    let canvas, w, h;
    if (this.fixed) {
      const RATIO = 9 / 16;
      w = windowWidth;
      h = w * RATIO;
      if (h > windowHeight - NAV_BAR.height) {
        h = windowHeight - NAV_BAR.height;
        w = h / RATIO;
      }
    } else {
      w = windowWidth;
      h = windowHeight - NAV_BAR.height;
    }
    if (this.is3D) {
      canvas = createCanvas(w * this.widthRatio, h * this.heightRatio, WEBGL);
    } else {
      canvas = createCanvas(w * this.widthRatio, h * this.heightRatio);
    }
    canvas.parent(P5_CANVAS).class("rounded border border-1");
  }

  /**
   * HTML要素で生成している#p5Canvasと#navBarを元にcanvasをリサイズする。
   */
  resizeScreen() {
    const NAV_BAR = select("#navBar");
    let w = 0;
    let h = 0;
    if (this.fixed) {
      const RATIO = 9 / 16;
      w = windowWidth;
      h = w * RATIO;
      if (h > windowHeight - NAV_BAR.height) {
        h = windowHeight - NAV_BAR.height;
        w = h / RATIO;
      }
    } else {
      w = windowWidth;
      h = windowHeight - NAV_BAR.height;
    }
    resizeCanvas(w * this.widthRatio, h * this.heightRatio);
  }
}

/**
 * Cylinderクラス
 *
 * アルキメデスの原理シミュレーションで使用する円柱を表すクラス。
 * 等角投影法（isometric projection）で描画する。
 */
export class Cylinder {
  /**
   * @constructor
   * @param {number} cx 円柱の中心X座標（キャンバス座標）
   * @param {number} cy 円柱の底面Y座標（キャンバス座標）
   * @param {number} r 円柱の半径（キャンバス単位）
   * @param {number} h 円柱の高さ（キャンバス単位）
   * @param {number} density 円柱の密度（g/cm³）
   */
  constructor(cx, cy, r, h, density) {
    this.cx = cx;
    this.cy = cy;
    this.r = r;
    this.h = h;
    this.density = density;

    // 物理シミュレーション用変数
    this.vy = 0;
    this.ay = 0;
    this.dragging = false;
    this.dragOffsetY = 0;
  }

  /**
   * アルキメデスの原理に基づいて円柱の位置を更新する。
   * @param {number} waterSurfaceY 水面のY座標（キャンバス座標）
   * @param {number} tankBottomY 水槽底面のY座標（キャンバス座標）
   * @param {boolean} running シミュレーション実行中かどうか
   */
  update(waterSurfaceY, tankBottomY, running) {
    if (this.dragging || !running) return;

    const WATER_DENSITY = 1.0;
    const G = 0.5;
    const DAMPING = 0.92;

    // 円柱の上端・下端のY座標
    const topY = this.cy - this.h;
    const bottomY = this.cy;

    // 水面より下にある部分の割合を計算
    let submergedFraction = 0;
    if (bottomY <= waterSurfaceY) {
      // 完全に水面より上
      submergedFraction = 0;
    } else if (topY >= waterSurfaceY) {
      // 完全に水中
      submergedFraction = 1;
    } else {
      // 部分的に水中
      submergedFraction = (bottomY - waterSurfaceY) / this.h;
    }

    // 重力加速度（下向き正）
    const gravity = G * this.density;
    // 浮力（上向き負）
    const buoyancy = G * WATER_DENSITY * submergedFraction;
    // 合力
    this.ay = gravity - buoyancy;
    this.vy += this.ay;
    this.vy *= DAMPING;
    this.cy += this.vy;

    // 水槽底面での衝突
    if (this.cy > tankBottomY) {
      this.cy = tankBottomY;
      this.vy = -this.vy * 0.3;
    }

    // 水面より完全に上に出ないように制限
    if (this.cy - this.h < waterSurfaceY - this.h * 2) {
      this.cy = waterSurfaceY - this.h * 2 + this.h;
      this.vy = -this.vy * 0.3;
    }
  }

  /**
   * 円柱の水中体積比を返す。
   * @param {number} waterSurfaceY 水面のY座標
   * @returns {number} 水中体積比（0〜1）
   */
  getSubmergedFraction(waterSurfaceY) {
    const topY = this.cy - this.h;
    const bottomY = this.cy;
    if (bottomY <= waterSurfaceY) return 0;
    if (topY >= waterSurfaceY) return 1;
    return (bottomY - waterSurfaceY) / this.h;
  }

  /**
   * ドラッグ判定（マウス座標が円柱上にあるか）。
   * @param {number} mx マウスX座標
   * @param {number} my マウスY座標
   * @returns {boolean}
   */
  isOver(mx, my) {
    return (
      mx >= this.cx - this.r &&
      mx <= this.cx + this.r &&
      my >= this.cy - this.h &&
      my <= this.cy
    );
  }
}
