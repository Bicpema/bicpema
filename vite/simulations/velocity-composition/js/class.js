/**
 * Boatクラス
 * 川の中で動く船を表現
 */
class Boat {
  /**
   * @constructor
   * @param {number} boatVelocity 船の速度 (m/s) - 左向きを正とする
   */
  constructor(boatVelocity = 3) {
    this.boatVelocity = boatVelocity;
    this.position = 0; // 船の位置（右端からの距離）
    this.time = 0;
    this.isMoving = false;
  }

  /**
   * 位置を更新
   * @param {number} dt 時間刻み (秒)
   * @param {number} riverVelocity 川の速度 (m/s)
   */
  update(dt, riverVelocity) {
    if (!this.isMoving) return;

    this.time += dt;
    // 合成速度 = 船の速度（左向き） - 川の速度（右向き）
    const compositeVelocity = this.boatVelocity - riverVelocity;
    // 位置の更新（右端を0とする）
    this.position = compositeVelocity * this.time;
  }

  /**
   * 船を描画
   * @param {number} canvasHeight キャンバスの高さ
   * @param {number} riverVelocity 川の速度
   */
  display(canvasHeight, riverVelocity) {
    const riverHeight = canvasHeight * 0.8; // 川の高さ（画面の4/5）
    const bankHeight = canvasHeight * 0.2; // 岸の高さ（画面の1/5）
    const riverY = 0; // 川は画面の上から開始
    const boatY = riverY + riverHeight / 2;

    // 船の位置をスケーリング（画面幅の80%を使用）
    const maxDistance = 800; // 最大距離（ピクセル）
    const rightEdge = 900; // 船の初期位置
    const boatX = rightEdge - (this.position / 20) * maxDistance; // 20mを最大距離とする

    // 川を描画（青い矩形）
    fill(100, 150, 255);
    noStroke();
    rect(0, riverY, 1000, riverHeight);

    // 川の流れを表す白い線を描画（途切れずに流れる）
    stroke(255, 255, 255, 200);
    strokeWeight(3);
    const flowSpeed = riverVelocity * 3; // 流れの速度に応じてアニメーション
    const offset = (frameCount * flowSpeed) % 80; // 線の間隔を80pxとする
    for (let i = 0; i < 8; i++) {
      const lineY = riverY + (riverHeight * (i + 1)) / 9;
      for (let x = -80 + offset; x < 1000 + 80; x += 80) {
        line(x, lineY, x + 40, lineY);
      }
    }

    // 手前の岸（下の岸）を描画（緑色）
    fill(34, 139, 34); // 緑色
    noStroke();
    rect(0, canvasHeight - bankHeight, 1000, bankHeight);

    // 手前の岸に人を描画
    this.drawPerson(100, canvasHeight - bankHeight);

    // 船を描画（より船らしく）
    push();
    translate(boatX, boatY);

    // 船体（下部）
    fill(139, 69, 19);
    stroke(0);
    strokeWeight(2);
    beginShape();
    vertex(-40, 15);
    vertex(40, 15);
    vertex(35, 0);
    vertex(-35, 0);
    endShape(CLOSE);

    // 船体（上部）
    fill(160, 82, 45);
    beginShape();
    vertex(-30, 0);
    vertex(30, 0);
    vertex(25, -15);
    vertex(-25, -15);
    endShape(CLOSE);

    // 船の先端（船首）
    fill(120, 60, 20);
    triangle(-40, 15, -50, 7, -40, 0);
    triangle(-40, 0, -50, 7, -35, -5);

    // 船尾
    fill(120, 60, 20);
    quad(35, 0, 40, 15, 45, 12, 40, -3);

    // 窓
    fill(200, 220, 255);
    noStroke();
    ellipse(-15, -7, 10, 10);
    ellipse(0, -7, 10, 10);
    ellipse(15, -7, 10, 10);

    // マスト
    stroke(101, 67, 33);
    strokeWeight(3);
    line(0, -15, 0, -40);

    pop();

    // 速度ベクトルを描画
    this.drawVelocityVectors(boatX, boatY, riverVelocity);

    // 情報表示
    this.displayInfo(canvasHeight, riverVelocity);
  }

  /**
   * 人を描画
   * @param {number} x X座標
   * @param {number} y Y座標（地面の位置）
   */
  drawPerson(x, y) {
    push();
    translate(x, y);

    // 体
    fill(50, 100, 200);
    noStroke();
    rect(-8, -50, 16, 30);

    // 頭
    fill(255, 220, 180);
    ellipse(0, -65, 20, 20);

    // 腕
    stroke(50, 100, 200);
    strokeWeight(4);
    line(-8, -45, -18, -30);
    line(8, -45, 18, -30);

    // 脚
    stroke(40, 60, 100);
    line(-5, -20, -8, 0);
    line(5, -20, 8, 0);

    pop();
  }

  /**
   * 速度ベクトルを描画
   * @param {number} boatX 船のX座標
   * @param {number} boatY 船のY座標
   * @param {number} riverVelocity 川の速度
   */
  drawVelocityVectors(boatX, boatY, riverVelocity) {
    const scale = 20; // 1 m/s = 20ピクセル

    // 船の速度ベクトル（左向き、緑）
    stroke(0, 255, 0);
    strokeWeight(3);
    const boatVectorLength = this.boatVelocity * scale;
    line(boatX, boatY - 40, boatX - boatVectorLength, boatY - 40);
    // 矢印
    fill(0, 255, 0);
    noStroke();
    triangle(
      boatX - boatVectorLength,
      boatY - 40,
      boatX - boatVectorLength + 10,
      boatY - 45,
      boatX - boatVectorLength + 10,
      boatY - 35
    );
    // ラベル
    fill(0, 255, 0);
    textAlign(CENTER, BOTTOM);
    textSize(14);
    text(
      `船: ${this.boatVelocity.toFixed(1)} m/s`,
      boatX - boatVectorLength / 2,
      boatY - 45
    );

    // 川の速度ベクトル（右向き、赤）
    stroke(255, 0, 0);
    strokeWeight(3);
    const riverVectorLength = riverVelocity * scale;
    line(boatX, boatY - 60, boatX + riverVectorLength, boatY - 60);
    // 矢印
    fill(255, 0, 0);
    noStroke();
    triangle(
      boatX + riverVectorLength,
      boatY - 60,
      boatX + riverVectorLength - 10,
      boatY - 65,
      boatX + riverVectorLength - 10,
      boatY - 55
    );
    // ラベル
    fill(255, 0, 0);
    textAlign(CENTER, BOTTOM);
    textSize(14);
    text(
      `川: ${riverVelocity.toFixed(1)} m/s`,
      boatX + riverVectorLength / 2,
      boatY - 65
    );

    // 合成速度ベクトル（黄色）
    const compositeVelocity = this.boatVelocity - riverVelocity;
    stroke(255, 255, 0);
    strokeWeight(4);
    const compositeVectorLength = Math.abs(compositeVelocity) * scale;
    if (compositeVelocity > 0) {
      // 左向き
      line(boatX, boatY - 80, boatX - compositeVectorLength, boatY - 80);
      fill(255, 255, 0);
      noStroke();
      triangle(
        boatX - compositeVectorLength,
        boatY - 80,
        boatX - compositeVectorLength + 10,
        boatY - 85,
        boatX - compositeVectorLength + 10,
        boatY - 75
      );
    } else if (compositeVelocity < 0) {
      // 右向き
      line(boatX, boatY - 80, boatX + compositeVectorLength, boatY - 80);
      fill(255, 255, 0);
      noStroke();
      triangle(
        boatX + compositeVectorLength,
        boatY - 80,
        boatX + compositeVectorLength - 10,
        boatY - 85,
        boatX + compositeVectorLength - 10,
        boatY - 75
      );
    } else {
      // 速度0の場合は点を描画
      fill(255, 255, 0);
      noStroke();
      ellipse(boatX, boatY - 80, 8, 8);
    }
    // ラベル
    fill(255, 255, 0);
    textAlign(CENTER, BOTTOM);
    textSize(14);
    text(`合成: ${compositeVelocity.toFixed(1)} m/s`, boatX, boatY - 85);
  }

  /**
   * 情報を表示
   * @param {number} canvasHeight キャンバスの高さ
   * @param {number} riverVelocity 川の速度
   */
  displayInfo(canvasHeight, riverVelocity) {
    const compositeVelocity = this.boatVelocity - riverVelocity;
    const rightX = canvasHeight * (16 / 9) - 20;

    fill(255);
    noStroke();
    textAlign(RIGHT, TOP);
    textSize(18);
    text(`時間: ${this.time.toFixed(2)} s`, rightX, 20);
    text(`船の速度: ${this.boatVelocity.toFixed(1)} m/s ←`, rightX, 50);
    text(`川の速度: ${riverVelocity.toFixed(1)} m/s →`, rightX, 80);

    let direction = "";
    if (compositeVelocity > 0) direction = " ←";
    else if (compositeVelocity < 0) direction = " →";

    text(
      `合成速度: ${Math.abs(compositeVelocity).toFixed(1)} m/s${direction}`,
      rightX,
      110
    );
    text(`移動距離: ${Math.abs(this.position).toFixed(2)} m`, rightX, 140);
  }

  /**
   * リセット
   */
  reset() {
    this.position = 0;
    this.time = 0;
    this.isMoving = false;
  }

  /**
   * 運動を開始
   */
  start() {
    this.isMoving = true;
  }

  /**
   * 運動を停止
   */
  stop() {
    this.isMoving = false;
  }

  /**
   * 船の速度を設定
   */
  setBoatVelocity(velocity) {
    this.boatVelocity = velocity;
  }
}

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
