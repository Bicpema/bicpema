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
 * Springクラス
 * バネを表現するクラス
 */
class Spring {
  /**
   * @constructor
   * @param {number} x バネの基点のx座標
   * @param {number} y バネの基点のy座標
   * @param {number} naturalLength バネの自然長
   * @param {number} springConstant バネ定数
   */
  constructor(x, y, naturalLength, springConstant) {
    this.baseX = x;
    this.baseY = y;
    this.naturalLength = naturalLength;
    this.springConstant = springConstant;
    this.endX = x + naturalLength;
    this.endY = y;
    this.isDragging = false;
  }

  /**
   * バネの伸びを計算
   * @returns {number} バネの伸び
   */
  getExtension() {
    // 引っ張りのみを扱うため、負の値は0にする
    return Math.max(0, dist(this.baseX, this.baseY, this.endX, this.endY) - this.naturalLength);
  }

  /**
   * 弾性力を計算
   * @returns {number} 弾性力の大きさ
   */
  getElasticForce() {
    return this.springConstant * this.getExtension();
  }

  /**
   * マウスが端点の近くにあるかチェック
   * @param {number} mx マウスのx座標
   * @param {number} my マウスのy座標
   * @returns {boolean} 端点の近くにあるか
   */
  isNearEnd(mx, my) {
    const d = dist(mx, my, this.endX, this.endY);
    return d < 20;
  }

  /**
   * ドラッグ開始
   */
  startDrag() {
    this.isDragging = true;
  }

  /**
   * ドラッグ終了
   */
  stopDrag() {
    this.isDragging = false;
  }

  /**
   * ドラッグ中の更新
   * @param {number} mx マウスのx座標
   * @param {number} my マウスのy座標
   */
  updateDrag(mx, my) {
    if (this.isDragging) {
      // 右側にのみ引っ張れるようにする
      if (mx > this.baseX + this.naturalLength) {
        this.endX = mx;
        this.endY = my;
      } else {
        this.endX = this.baseX + this.naturalLength;
        this.endY = this.baseY;
      }
    }
  }

  /**
   * バネを描画
   */
  draw() {
    push();
    
    // バネのコイル部分を描画
    stroke(255);
    strokeWeight(2);
    noFill();
    
    const numCoils = 10;
    const coilWidth = 15;
    const currentLength = dist(this.baseX, this.baseY, this.endX, this.endY);
    const segmentLength = currentLength / numCoils;
    
    const angle = atan2(this.endY - this.baseY, this.endX - this.baseX);
    
    beginShape();
    for (let i = 0; i <= numCoils; i++) {
      const x = this.baseX + cos(angle) * i * segmentLength;
      const y = this.baseY + sin(angle) * i * segmentLength;
      const perpX = -sin(angle);
      const perpY = cos(angle);
      const offset = sin(i * PI) * coilWidth;
      vertex(x + perpX * offset, y + perpY * offset);
    }
    endShape();
    
    // 端点を描画（ドラッグ可能な点）
    fill(this.isDragging ? color(255, 100, 100) : color(100, 150, 255));
    stroke(255);
    strokeWeight(2);
    circle(this.endX, this.endY, 20);
    
    // 弾性力の矢印を描画
    const MIN_EXTENSION_THRESHOLD = 0.1;
    const extension = this.getExtension();
    if (extension > MIN_EXTENSION_THRESHOLD) {
      const force = this.getElasticForce();
      const arrowLength = map(force, 0, 100, 0, 100);
      
      // 矢印は左向き（復元力の方向）
      const arrowStartX = this.endX;
      const arrowStartY = this.endY;
      const arrowEndX = this.endX - arrowLength;
      const arrowEndY = this.endY;
      
      stroke(255, 200, 0);
      strokeWeight(3);
      line(arrowStartX, arrowStartY, arrowEndX, arrowEndY);
      
      // 矢印の先端
      const arrowSize = 10;
      fill(255, 200, 0);
      noStroke();
      triangle(
        arrowEndX, arrowEndY,
        arrowEndX + arrowSize, arrowEndY - arrowSize / 2,
        arrowEndX + arrowSize, arrowEndY + arrowSize / 2
      );
      
      // 力の大きさを表示
      fill(255, 200, 0);
      noStroke();
      textAlign(CENTER, CENTER);
      textSize(14);
      text(`F = ${force.toFixed(1)} N`, arrowEndX - 30, arrowStartY - 20);
    }
    
    pop();
  }
}
