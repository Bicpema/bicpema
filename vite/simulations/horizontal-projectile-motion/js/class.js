/**
 * Ballクラス
 * 水平投射運動をする物体を表現
 */
class Ball {
  /**
   * @constructor
   * @param {number} initialVelocity 初速度 (m/s) - 水平方向
   */
  constructor(initialVelocity = 15) {
    this.initialVelocity = initialVelocity;
    this.x = 0; // 水平方向の位置 (m)
    this.y = 0; // 鉛直方向の位置 (m) - 下向きを正とする
    this.vx = initialVelocity; // 水平方向の速度 (m/s)
    this.vy = 0; // 鉛直方向の速度 (m/s)
    this.time = 0;
    this.g = 9.8; // 重力加速度 (m/s^2)
    this.radius = 15; // ボールの半径 (ピクセル)
    this.isMoving = false;
    this.platformHeight = 3; // 台の高さ (m)
    
    // ストロボ写真用の軌跡を保存
    this.trajectory = [];
    this.strobeInterval = 0.2; // ストロボの間隔 (秒)
    this.lastStrobeTime = 0;
  }

  /**
   * 位置を更新
   * @param {number} dt 時間刻み (秒)
   */
  update(dt) {
    if (!this.isMoving) return;

    this.time += dt;
    
    // 等速直線運動 (水平方向)
    this.x = this.vx * this.time;
    
    // 自由落下運動 (鉛直方向)
    this.vy = this.g * this.time;
    this.y = 0.5 * this.g * this.time * this.time;

    // ストロボ写真の記録
    if (this.time - this.lastStrobeTime >= this.strobeInterval) {
      this.trajectory.push({ x: this.x, y: this.y, time: this.time });
      this.lastStrobeTime = this.time;
    }

    // 地面に到達したら停止
    if (this.y >= this.platformHeight) {
      this.y = this.platformHeight;
      this.isMoving = false;
    }
  }

  /**
   * ボールを3Dで描画
   */
  display() {
    const scale = 50; // スケール (ピクセル/m)
    
    push();
    
    // 白い台を描画
    push();
    fill(255);
    translate(-width / 4, 0, 0);
    box(50, 20, 50);
    pop();
    
    // グリッド線を描画 (一定時間ごとに)
    this.drawGrid(scale);
    
    // 投影円を描画
    this.drawProjectionCircles(scale);
    
    // ストロボ写真の軌跡を描画
    this.drawTrajectory(scale);
    
    // 現在のボール位置
    push();
    fill(255, 204, 0); // 黄色
    noStroke();
    translate(
      this.x * scale - width / 4 + 25,
      this.y * scale,
      0
    );
    sphere(this.radius);
    pop();
    
    pop();
  }

  /**
   * グリッド線を描画
   * @param {number} scale スケール
   */
  drawGrid(scale) {
    stroke(100, 100, 100);
    strokeWeight(1);
    
    // 縦方向の線 (一定時間ごと)
    const timeInterval = 0.2; // 0.2秒ごと
    for (let t = 0; t <= 3; t += timeInterval) {
      const x = this.vx * t * scale - width / 4 + 25;
      const maxY = 0.5 * this.g * t * t * scale;
      if (maxY > 200) continue; // 画面外は描画しない
      
      push();
      stroke(150, 150, 150);
      strokeWeight(1);
      line(x, 0, 0, x, maxY, 0);
      pop();
    }
    
    // 横方向の線 (一定の高さごと)
    for (let h = 0; h <= this.platformHeight; h += 0.5) {
      const y = h * scale;
      const maxX = width / 2;
      
      push();
      stroke(150, 150, 150);
      strokeWeight(1);
      line(-width / 4 + 25, y, 0, maxX, y, 0);
      pop();
    }
  }

  /**
   * 投影円を描画 (等速直線運動と自由落下運動)
   * @param {number} scale スケール
   */
  drawProjectionCircles(scale) {
    if (!this.isMoving && this.time === 0) return;
    
    const numCircles = 8;
    const interval = this.strobeInterval;
    
    for (let i = 0; i <= numCircles; i++) {
      const t = i * interval;
      if (t > this.time) break;
      
      const x = this.vx * t * scale - width / 4 + 25;
      const y = 0.5 * this.g * t * t * scale;
      
      if (y > 200) continue;
      
      // 横方向の点線の円 (等速直線運動) - 手動で点線を描画
      push();
      noFill();
      stroke(255, 100, 100, 150);
      strokeWeight(2);
      translate(x, 0, 0);
      rotateX(HALF_PI);
      this.drawDashedCircle(this.radius * 2);
      pop();
      
      // 縦方向の点線の円 (自由落下運動) - 手動で点線を描画
      push();
      noFill();
      stroke(100, 100, 255, 150);
      strokeWeight(2);
      translate(-width / 4 + 25, y, 0);
      rotateY(HALF_PI);
      this.drawDashedCircle(this.radius * 2);
      pop();
    }
  }

  /**
   * 点線の円を描画するヘルパー関数
   * @param {number} diameter 円の直径
   */
  drawDashedCircle(diameter) {
    const segments = 24; // 円を分割する数
    const dashLength = 3; // 線の数
    const radius = diameter / 2;
    
    for (let i = 0; i < segments; i++) {
      if (i % 2 === 0) { // 交互に線を描画
        const angle1 = (i / segments) * TWO_PI;
        const angle2 = ((i + 1) / segments) * TWO_PI;
        const x1 = cos(angle1) * radius;
        const y1 = sin(angle1) * radius;
        const x2 = cos(angle2) * radius;
        const y2 = sin(angle2) * radius;
        line(x1, y1, x2, y2);
      }
    }
  }

  /**
   * ストロボ写真の軌跡を描画
   * @param {number} scale スケール
   */
  drawTrajectory(scale) {
    for (let point of this.trajectory) {
      push();
      fill(255, 204, 0, 180); // 黄色 (半透明)
      noStroke();
      translate(
        point.x * scale - width / 4 + 25,
        point.y * scale,
        0
      );
      sphere(this.radius * 0.8);
      pop();
    }
  }

  /**
   * リセット
   * @param {number} newVelocity 新しい初速度
   */
  reset(newVelocity) {
    this.initialVelocity = newVelocity;
    this.x = 0;
    this.y = 0;
    this.vx = newVelocity;
    this.vy = 0;
    this.time = 0;
    this.isMoving = false;
    this.trajectory = [];
    this.lastStrobeTime = 0;
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
