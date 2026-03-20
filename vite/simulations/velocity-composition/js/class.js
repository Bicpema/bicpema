// class.js はクラス管理専用のファイルです。
import { drawArrowWithLabel } from './function.js';

/** 仮想キャンバス幅 */
const V_W = 1000;
/** 仮想キャンバス高さ */
const V_H = 562;
/** 川の下端Y座標（手前の岸の上端） */
const RIVER_BOTTOM = 320;
/** 船のY座標（川の中央付近） */
const BOAT_Y = 160;

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
 * WaterParticleクラス
 *
 * 川の流れを視覚的に表現する水の粒子。
 * 川は左向きに流れる（イメージの矢印 ← に対応）。
 */
export class WaterParticle {
  /**
   * @constructor
   * @param {number} x 初期X座標
   * @param {number} y 初期Y座標
   */
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.waveWidth = random(14, 34);
    this.alpha = random(70, 155);
    this.speed = random(48, 90); // 仮想ピクセル/秒（左向き固定）
  }

  /**
   * 座標を更新する（左方向へ移動）。
   * @param {number} dt 時間刻み（秒）
   */
  update(dt) {
    this.x -= this.speed * dt;
    if (this.x < -60) {
      this.x = 1060;
      this.y = random(20, RIVER_BOTTOM - 20);
    }
  }

  /**
   * 水の波紋を描画する。
   */
  draw() {
    noFill();
    stroke(150, 210, 255, this.alpha);
    strokeWeight(1.8);
    arc(this.x, this.y, this.waveWidth, 9, 0, PI);
  }
}

/**
 * Boatクラス
 *
 * 川を進む船を表現する。
 *
 * 速度の定義（左向き正）:
 *   v_川: 川の流速（常に左向き、≥0）
 *   v_船: 船の速度（水に対して。+＝下流左向き、−＝上流右向き）
 *   v_合: 岸から見た合成速度 ＝ v_川 ＋ v_船
 */
export class Boat {
  /**
   * @constructor
   * @param {number} boatSpeed 船の速度（水に対して、左向き正）
   * @param {number} riverSpeed 川の速度（左向き、≥0）
   */
  constructor(boatSpeed, riverSpeed) {
    this.boatSpeed = boatSpeed;
    this.riverSpeed = riverSpeed;
    this.x = V_W * 0.55;
    this.isMoving = false;
  }

  /**
   * 岸から観測した合成速度（左向き正）を返す。
   */
  get compositeSpeed() {
    return this.riverSpeed + this.boatSpeed;
  }

  /**
   * 座標を更新する。
   * 左向き正なので、compositeSpeed > 0 のとき x は減少（左移動）。
   * @param {number} dt 時間刻み（秒）
   */
  update(dt) {
    if (!this.isMoving) return;
    const PX_PER_MPS = 20; // 1 m/s = 20 仮想ピクセル/秒
    this.x -= this.compositeSpeed * PX_PER_MPS * dt;
    if (this.x > 1100) this.x = -100;
    if (this.x < -100) this.x = 1100;
  }

  /**
   * 船と速度ベクトルを描画する。
   */
  draw() {
    push();
    translate(this.x, BOAT_Y);
    this._drawBody();
    this._drawArrows();
    pop();
  }

  /**
   * 船体を描画する。
   */
  _drawBody() {
    // 船体（台形）
    fill(139, 90, 43);
    stroke(100, 60, 20);
    strokeWeight(2);
    beginShape();
    vertex(-52, -10);
    vertex(52, -10);
    vertex(36, 16);
    vertex(-36, 16);
    endShape(CLOSE);

    // キャビン
    fill(225, 225, 235);
    stroke(170, 170, 180);
    strokeWeight(1);
    rect(-21, -30, 42, 22, 3);

    // マスト
    stroke(80, 80, 80);
    strokeWeight(2);
    line(6, -30, 6, -58);

    // 旗
    fill(200, 50, 50);
    noStroke();
    triangle(6, -58, 6, -44, 28, -51);
  }

  /**
   * 3本の速度矢印を描画する。
   * dx < 0 = 左方向、dx > 0 = 右方向（スクリーン座標）
   */
  _drawArrows() {
    const S = 10; // 1 m/s → 10 仮想ピクセル（矢印長さスケール）
    const y1 = -78; // v_川 の行
    const y2 = -106; // v_船 の行
    const y3 = -134; // v_合 の行

    // v_川（赤、常に左向き）
    const rdx = -(this.riverSpeed * S);
    drawArrowWithLabel(0, y1, rdx, y1, color(230, 60, 60), `v川 ${this.riverSpeed.toFixed(1)} m/s`);

    // v_船（緑、+ = 左、− = 右）
    const bdx = -(this.boatSpeed * S);
    const boatLabel =
      Math.abs(this.boatSpeed) < 0.05
        ? "v船 0 m/s"
        : `v船 ${Math.abs(this.boatSpeed).toFixed(1)} m/s`;
    drawArrowWithLabel(0, y2, bdx, y2, color(30, 210, 60), boatLabel);

    // v_合（青、+ = 左、− = 右）
    const cs = this.compositeSpeed;
    const cdx = -(cs * S);
    const compLabel =
      Math.abs(cs) < 0.05
        ? "v合 0 m/s（静止）"
        : `v合 ${Math.abs(cs).toFixed(1)} m/s`;
    drawArrowWithLabel(0, y3, cdx, y3, color(60, 130, 255), compLabel);
  }

  /**
   * 船をリセットする。
   * @param {number} boatSpeed 新しい船の速度
   * @param {number} riverSpeed 新しい川の速度
   */
  reset(boatSpeed, riverSpeed) {
    this.boatSpeed = boatSpeed;
    this.riverSpeed = riverSpeed;
    this.x = V_W * 0.55;
    this.isMoving = false;
  }
}

/**
 * Personクラス
 *
 * 河岸に立って船を観察する人を表現する。
 */
export class Person {
  /**
   * @constructor
   * @param {number} x X座標
   * @param {number} y Y座標（足元）
   */
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  /**
   * 人（スティックフィギュア）を描画する。
   */
  draw() {
    push();
    translate(this.x, this.y);

    // 頭
    fill(255, 220, 180);
    stroke(80, 50, 30);
    strokeWeight(2);
    circle(0, -42, 28);

    // 胴体
    stroke(50, 80, 190);
    strokeWeight(3);
    line(0, -28, 0, 5);

    // 腕（左方向＝川を見ている）
    stroke(50, 80, 190);
    strokeWeight(2.5);
    line(0, -20, -22, -8);
    line(0, -20, 16, -32);

    // 足
    stroke(30, 30, 70);
    strokeWeight(2.5);
    line(0, 5, -12, 28);
    line(0, 5, 12, 28);

    // ラベル
    noStroke();
    fill(255, 255, 200);
    textSize(14);
    textAlign(CENTER, CENTER);
    text("観測者", 0, 44);

    pop();
  }
}
