// class.jsはクラス管理専用のファイルです。

// クラスの定義方法の例
// class ExampleClass{
//     constructor(p1,p2){
//         this.property1 =p1;
//         this.property2 =p2;
//     }
//     exampleMethod(){
//         this.property1 += this.property2
//     }
// }

/////////////////////////// 以上の記述は不必要であれば削除してください。/////////////////////////////////

// 以下にクラスを定義してください。

/**
 * Objectクラス - 水中の物体を表現するクラス
 */
class FloatingObject {
  constructor(x, y, size, density) {
    this.x = x;
    this.y = y;
    this.size = size; // 物体のサイズ（半径）
    this.density = density; // 密度 (g/cm³)
    this.vy = 0; // Y方向の速度
    this.isDragging = false;
    this.offsetX = 0;
    this.offsetY = 0;
  }

  // 物理演算を更新
  updatePhysics(waterY, waterDensity) {
    if (this.isDragging) {
      this.vy = 0;
      return;
    }

    const g = 0.2; // 重力加速度（シミュレーション用）
    const damping = 0.95; // 減衰係数

    // 物体の体積（球として計算）
    const volume = (4 / 3) * PI * pow(this.size, 3);

    // 物体の質量
    const mass = this.density * volume;

    // 重力
    const gravity = mass * g;

    // 浮力の計算（物体が水中にある部分の体積に基づく）
    let buoyancy = 0;
    const objectBottom = this.y + this.size;
    const objectTop = this.y - this.size;

    if (objectBottom > waterY) {
      // 水中にある部分の高さを計算
      let submergedHeight = 0;

      if (objectTop > waterY) {
        // 完全に水中
        submergedHeight = this.size * 2;
      } else {
        // 部分的に水中
        submergedHeight = objectBottom - waterY;
      }

      // 水中にある部分の体積の割合
      const submergedRatio = submergedHeight / (this.size * 2);

      // 浮力 = 水の密度 × 排除した水の体積 × 重力加速度
      buoyancy = waterDensity * volume * submergedRatio * g;
    }

    // 正味の力
    const netForce = gravity - buoyancy;

    // 加速度
    const acceleration = netForce / mass;

    // 速度を更新
    this.vy += acceleration;
    this.vy *= damping;

    // 位置を更新
    this.y += this.vy;

    // 水面での制限（完全に浮かぶ場合）
    if (this.density < waterDensity) {
      const floatDepth = (this.density / waterDensity) * (this.size * 2);
      if (this.y + this.size > waterY + floatDepth) {
        this.y = waterY + floatDepth - this.size;
        this.vy *= -0.3; // バウンド
      }
    }

    // 底での制限
    const bottomY = 520;
    if (this.y + this.size > bottomY) {
      this.y = bottomY - this.size;
      this.vy *= -0.3;
    }
  }

  // 物体を描画
  display(waterY) {
    push();

    // 密度に応じて色を変更
    let objectColor;
    if (this.density < 0.5) {
      objectColor = color(255, 200, 100); // 軽い: オレンジ
    } else if (this.density < 1.0) {
      objectColor = color(200, 150, 255); // 中程度: 紫
    } else if (this.density < 1.5) {
      objectColor = color(100, 150, 255); // やや重い: 青
    } else {
      objectColor = color(150, 150, 150); // 重い: 灰色
    }

    fill(objectColor);
    stroke(100);
    strokeWeight(3);

    if (this.isDragging) {
      stroke(255, 255, 0);
      strokeWeight(5);
    }

    circle(this.x, this.y, this.size * 2);

    // 密度を表示
    fill(0);
    noStroke();
    textSize(14);
    text(`${this.density.toFixed(2)} g/cm³`, this.x, this.y);

    pop();

    // 力の矢印を描画
    this.displayForces(waterY);
  }

  // 力の矢印を描画
  displayForces(waterY) {
    const g = 0.2;
    const volume = (4 / 3) * PI * pow(this.size, 3);
    const mass = this.density * volume;
    const gravity = mass * g;

    const arrowScale = 100;
    const centerX = this.x;
    const centerY = this.y;

    // 重力（下向き・赤）
    this.drawArrow(
      centerX,
      centerY,
      centerX,
      centerY + gravity * arrowScale,
      color(255, 100, 100),
      `重力 ${gravity.toFixed(1)} N`
    );

    // 浮力（上向き・青）- 水中にある場合のみ
    const objectBottom = this.y + this.size;
    const objectTop = this.y - this.size;

    if (objectBottom > waterY) {
      let submergedHeight = 0;

      if (objectTop > waterY) {
        submergedHeight = this.size * 2;
      } else {
        submergedHeight = objectBottom - waterY;
      }

      const submergedRatio = submergedHeight / (this.size * 2);
      const waterDensity = 1.0; // 水の密度
      const buoyancy = waterDensity * volume * submergedRatio * g;

      this.drawArrow(
        centerX,
        centerY,
        centerX,
        centerY - buoyancy * arrowScale,
        color(100, 150, 255),
        `浮力 ${buoyancy.toFixed(1)} N`
      );
    }
  }

  // 矢印を描画
  drawArrow(x1, y1, x2, y2, col, label) {
    if (abs(y2 - y1) < 1) return; // 矢印が小さすぎる場合は描画しない

    push();
    stroke(col);
    strokeWeight(3);
    fill(col);

    line(x1, y1, x2, y2);

    const angle = atan2(y2 - y1, x2 - x1);
    const arrowSize = 10;
    translate(x2, y2);
    rotate(angle);
    triangle(0, 0, -arrowSize, -arrowSize / 2, -arrowSize, arrowSize / 2);

    pop();

    push();
    fill(col);
    noStroke();
    textSize(12);
    textAlign(LEFT, CENTER);
    text(label, x2 + 15, (y1 + y2) / 2);
    pop();
  }

  // マウスオーバー判定
  isMouseOver(mx, my) {
    const d = dist(mx, my, this.x, this.y);
    return d < this.size;
  }

  // ドラッグ開始
  startDrag(mx, my) {
    this.isDragging = true;
    this.offsetX = mx - this.x;
    this.offsetY = my - this.y;
  }

  // ドラッグ更新
  updateDrag(mx, my) {
    if (this.isDragging) {
      this.x = mx - this.offsetX;
      this.y = my - this.offsetY;

      // 画面内に制限
      this.x = constrain(this.x, this.size + 50, 950 - this.size);
      this.y = constrain(this.y, this.size + 50, 520 - this.size);
    }
  }

  // ドラッグ終了
  stopDrag() {
    this.isDragging = false;
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
