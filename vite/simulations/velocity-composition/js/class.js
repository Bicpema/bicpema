// class.js はクラス管理専用のファイルです。

/** 仮想キャンバス幅 */
const V_W = 1000;
/** 仮想キャンバス高さ */
const V_H = 562;
/** 対岸（遠岸）の下端Y座標 */
const FAR_BANK_BOTTOM = 65;
/** 川の下端Y座標 / 手前の岸の上端Y座標 */
const RIVER_BOTTOM = 330;
/** 船のY座標（川の中央） */
const BOAT_Y = (FAR_BANK_BOTTOM + RIVER_BOTTOM) / 2;

/**
 * BicpemaCanvasControllerクラス
 *
 * Bicpemaの動的なキャンバスサイズをコントロールする。
 */
class BicpemaCanvasController {
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
 * 川は右向きに流れる（v川の方向）。
 */
class WaterParticle {
  /**
   * @constructor
   * @param {number} x 初期X座標
   * @param {number} y 初期Y座標
   */
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.waveWidth = random(14, 32);
    this.alpha = random(70, 150);
    this.speed = random(45, 85); // 仮想ピクセル/秒（右向き固定）
  }

  /**
   * 座標を更新する。
   * @param {number} dt 時間刻み（秒）
   */
  update(dt) {
    this.x += this.speed * dt;
    if (this.x > 1060) {
      this.x = -60;
      this.y = random(FAR_BANK_BOTTOM + 10, RIVER_BOTTOM - 20);
    }
  }

  /**
   * 水の波紋を描画する。
   */
  draw() {
    noFill();
    stroke(180, 225, 255, this.alpha);
    strokeWeight(2);
    arc(this.x, this.y, this.waveWidth, 9, PI, TWO_PI);
  }
}

/**
 * Boatクラス
 *
 * 川を進む船を表現する。
 * 船は水面に対して左向き（v船）に進もうとする。
 * 川は右向き（v川）に流れる。
 * 岸から観測した合成速度 = v川 - v船（右向き正）。
 */
class Boat {
  /**
   * @constructor
   * @param {number} boatSpeed 船の速度（左向き、m/s）
   * @param {number} riverSpeed 川の速度（右向き、m/s）
   */
  constructor(boatSpeed, riverSpeed) {
    this.boatSpeed = boatSpeed;
    this.riverSpeed = riverSpeed;
    this.x = V_W / 2;
    this.isMoving = false;
  }

  /**
   * 合成速度（右向き正）を返す。
   */
  get compositeSpeed() {
    return this.riverSpeed - this.boatSpeed;
  }

  /**
   * 座標を更新する。
   * @param {number} dt 時間刻み（秒）
   */
  update(dt) {
    if (!this.isMoving) return;
    const SPEED_SCALE = 25; // 1 m/s = 25 仮想ピクセル/秒
    this.x += this.compositeSpeed * SPEED_SCALE * dt;
    // 画面外に出たら反対側から戻る
    if (this.x > 1100) this.x = -100;
    if (this.x < -100) this.x = 1100;
  }

  /**
   * 船と速度ベクトルを描画する。
   */
  draw() {
    push();
    translate(this.x, BOAT_Y);
    this.drawBody();
    this.drawVelocityArrows();
    pop();
  }

  /**
   * 船の船体を描画する。
   */
  drawBody() {
    // 船体（台形）
    fill(139, 90, 43);
    stroke(100, 60, 20);
    strokeWeight(2);
    beginShape();
    vertex(-45, -8);
    vertex(45, -8);
    vertex(30, 14);
    vertex(-30, 14);
    endShape(CLOSE);

    // キャビン
    fill(220, 220, 230);
    stroke(170, 170, 180);
    strokeWeight(1);
    rect(-18, -26, 36, 18, 3);

    // マスト
    stroke(80, 80, 80);
    strokeWeight(2);
    line(8, -26, 8, -52);

    // 旗
    fill(220, 50, 50);
    noStroke();
    triangle(8, -52, 8, -40, 26, -46);
  }

  /**
   * 速度ベクトル矢印を描画する。
   */
  drawVelocityArrows() {
    const ARROW_SCALE = 12; // 1 m/s = 12 仮想ピクセル
    const baseY = -68; // 最下段の矢印Y（船の中心からの相対座標）
    const rowGap = 26; // 矢印間の縦間隔

    // --- 船の速度矢印（緑、左向き） ---
    const boatEndX = -this.boatSpeed * ARROW_SCALE;
    drawArrow(0, baseY, boatEndX, baseY, color(30, 210, 30));
    noStroke();
    fill(30, 210, 30);
    textSize(13);
    if (this.boatSpeed > 0) {
      textAlign(RIGHT, CENTER);
      text(`v船=${this.boatSpeed.toFixed(1)}m/s`, boatEndX - 4, baseY);
    } else {
      textAlign(LEFT, CENTER);
      text(`v船=0m/s`, 5, baseY);
    }

    // --- 川の速度矢印（赤、右向き） ---
    const riverEndX = this.riverSpeed * ARROW_SCALE;
    drawArrow(0, baseY - rowGap, riverEndX, baseY - rowGap, color(220, 50, 50));
    noStroke();
    fill(220, 50, 50);
    textSize(13);
    if (this.riverSpeed > 0) {
      textAlign(LEFT, CENTER);
      text(
        `v川=${this.riverSpeed.toFixed(1)}m/s`,
        riverEndX + 4,
        baseY - rowGap
      );
    } else {
      textAlign(LEFT, CENTER);
      text(`v川=0m/s`, 5, baseY - rowGap);
    }

    // --- 合成速度矢印（青） ---
    const compEndX = this.compositeSpeed * ARROW_SCALE;
    drawArrow(
      0,
      baseY - rowGap * 2,
      compEndX,
      baseY - rowGap * 2,
      color(50, 130, 255)
    );
    noStroke();
    fill(50, 130, 255);
    textSize(13);
    const absComp = Math.abs(this.compositeSpeed);
    const compLabel = `v合=${absComp.toFixed(1)}m/s`;
    if (Math.abs(compEndX) < 2) {
      textAlign(LEFT, CENTER);
      text(`v合=0m/s (静止)`, 5, baseY - rowGap * 2);
    } else if (compEndX > 0) {
      textAlign(LEFT, CENTER);
      text(compLabel, compEndX + 4, baseY - rowGap * 2);
    } else {
      textAlign(RIGHT, CENTER);
      text(compLabel, compEndX - 4, baseY - rowGap * 2);
    }
  }

  /**
   * 船をリセットする。
   * @param {number} boatSpeed 新しい船の速度
   * @param {number} riverSpeed 新しい川の速度
   */
  reset(boatSpeed, riverSpeed) {
    this.boatSpeed = boatSpeed;
    this.riverSpeed = riverSpeed;
    this.x = V_W / 2;
    this.isMoving = false;
  }
}

/**
 * Personクラス
 *
 * 河岸に立って船を観察する人を表現する。
 */
class Person {
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
    stroke(50, 80, 180);
    strokeWeight(3);
    line(0, -28, 0, 5);

    // 腕（川の方向を見ている）
    stroke(50, 80, 180);
    strokeWeight(2.5);
    line(-18, -18, -36, -8);
    line(0, -18, 18, -28);

    // 足
    stroke(40, 40, 40);
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
