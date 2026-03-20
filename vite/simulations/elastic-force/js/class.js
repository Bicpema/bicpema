// 変位の表示しきい値 (m) ─ これ以下は変位・弾性力を表示しない
const DISPLACEMENT_THRESHOLD = 0.001;
// バネコイルの振幅（上下の高さ px）
const SPRING_COIL_AMPLITUDE = 20;
// バネ両端の直線部分の長さ（px）
const SPRING_STRAIGHT_SEGMENT = 18;

/**
 * Springクラス
 * 弾性力シミュレーションにおけるバネを表現する
 */
class Spring {
  /**
   * @constructor
   * @param {number} attachX バネの壁側端点 X座標（仮想座標）
   * @param {number} attachY バネの壁側端点 Y座標（仮想座標）
   * @param {number} naturalLength バネの自然長（ピクセル）
   * @param {number} k ばね定数 (N/m)
   * @param {number} coilCount コイルの数（偶数）
   */
  constructor(attachX, attachY, naturalLength, k, coilCount = 12) {
    this.attachX = attachX;
    this.attachY = attachY;
    this.naturalLength = naturalLength;
    this.k = k;
    this.coilCount = coilCount;

    // バネの先端（引っ張る側）の位置
    this.endX = attachX + naturalLength;
    this.endY = attachY;

    // ドラッグ状態
    this.isDragging = false;
    this.dragOffsetX = 0;

    // 先端ハンドルのサイズ（仮想座標）
    this.handleRx = 40;
    this.handleRy = 24;
  }

  /**
   * バネの現在の長さ (px)
   * @returns {number}
   */
  get currentLength() {
    return this.endX - this.attachX;
  }

  /**
   * 伸び・縮み (m)
   * 正：伸び、負：縮み
   * @returns {number}
   */
  get displacement() {
    return (this.currentLength - this.naturalLength) / PX_PER_M;
  }

  /**
   * 弾性力の大きさ (N)
   * F = k * |x|
   * @returns {number}
   */
  get forceMagnitude() {
    return this.k * Math.abs(this.displacement);
  }

  /**
   * マウスがハンドル（手）の上にあるか判定
   * @param {number} mx マウスX（仮想座標）
   * @param {number} my マウスY（仮想座標）
   * @returns {boolean}
   */
  isOverHandle(mx, my) {
    const dx = (mx - this.endX) / this.handleRx;
    const dy = (my - this.endY) / this.handleRy;
    return dx * dx + dy * dy <= 1;
  }

  /**
   * ドラッグ開始
   * @param {number} mx マウスX（仮想座標）
   */
  startDrag(mx) {
    this.isDragging = true;
    this.dragOffsetX = this.endX - mx;
  }

  /**
   * ドラッグ中の位置更新
   * @param {number} mx マウスX（仮想座標）
   */
  drag(mx) {
    if (!this.isDragging) return;
    const minEndX = this.attachX + MIN_SPRING_LENGTH;
    const maxEndX = this.attachX + MAX_SPRING_LENGTH;
    this.endX = constrain(mx + this.dragOffsetX, minEndX, maxEndX);
  }

  /**
   * ドラッグ終了
   */
  stopDrag() {
    this.isDragging = false;
  }

  /**
   * 自然長位置を示す縦の点線を描画
   */
  drawNaturalLengthLine() {
    const nx = this.attachX + this.naturalLength;
    const y = this.attachY;
    stroke(180);
    strokeWeight(1.5);
    drawingContext.setLineDash([8, 8]);
    line(nx, y - 35, nx, y + 35);
    drawingContext.setLineDash([]);

    fill(150);
    noStroke();
    textAlign(CENTER, BOTTOM);
    textSize(13);
    text("自然長", nx, y - 38);
  }

  /**
   * バネのコイル形状（ジグザグ）を描画
   */
  drawCoil() {
    const x1 = this.attachX;
    const y = this.attachY;
    const x2 = this.endX;
    const len = x2 - x1;

    if (len < 10) return;

    const amplitude = SPRING_COIL_AMPLITUDE;
    const straightLen = SPRING_STRAIGHT_SEGMENT;
    const coilLen = len - 2 * straightLen;
    // coilCount個のコイル = coilCount*2 個のピーク
    const halfCoils = this.coilCount * 2;
    const segLen = coilLen / halfCoils;

    stroke(40);
    strokeWeight(2.5);
    noFill();

    beginShape();
    curveVertex(x1, y);
    curveVertex(x1, y);
    curveVertex(x1 + straightLen, y);

    for (let i = 0; i < halfCoils; i++) {
      const cx = x1 + straightLen + (i + 0.5) * segLen;
      const cy = y + (i % 2 === 0 ? -amplitude : amplitude);
      curveVertex(cx, cy);
    }

    curveVertex(x2 - straightLen, y);
    curveVertex(x2, y);
    curveVertex(x2, y);
    endShape();
  }

  /**
   * 先端ハンドル（手）を描画
   * @param {boolean} hovered ホバー中か
   */
  drawHandle(hovered) {
    fill(hovered ? color(255, 245, 180) : 255);
    stroke(0);
    strokeWeight(2);
    ellipse(this.endX, this.endY, this.handleRx * 2, this.handleRy * 2);

    fill(0);
    noStroke();
    textAlign(CENTER, CENTER);
    textSize(20);
    text("手", this.endX, this.endY);
  }

  /**
   * 変位と弾性力の数値・矢印を描画
   */
  drawForceInfo() {
    const dispM = this.displacement;
    const dispCm = dispM * 100;
    const F = this.forceMagnitude;

    if (Math.abs(dispM) < DISPLACEMENT_THRESHOLD) return;

    // 変位ラベル（バネの上）
    const labelX = (this.attachX + this.endX) / 2;
    const labelY = this.attachY - 42;
    noStroke();
    fill(0);
    textAlign(CENTER, CENTER);
    textSize(16);
    const xSign = dispCm > 0 ? "+" : "";
    text("x = " + xSign + dispCm.toFixed(1) + " cm", labelX, labelY);

    // 弾性力ラベル（バネの下）
    textSize(16);
    fill(200, 30, 30);
    text("F = " + F.toFixed(2) + " N", labelX, this.attachY + 46);

    // 弾性力の矢印（ハンドルから自然長方向へ）
    const arrowDir = dispM > 0 ? -1 : 1;
    const arrowLen = Math.min(F * 20, 120);
    const arrowStartX =
      this.endX + (dispM > 0 ? this.handleRx : -this.handleRx);
    const arrowEndX = arrowStartX + arrowDir * arrowLen;
    stroke(200, 30, 30);
    strokeWeight(2.5);
    fill(200, 30, 30);
    line(arrowStartX, this.attachY, arrowEndX, this.attachY);
    const hs = 9;
    triangle(
      arrowEndX,
      this.attachY,
      arrowEndX - arrowDir * hs,
      this.attachY - hs * 0.6,
      arrowEndX - arrowDir * hs,
      this.attachY + hs * 0.6
    );
  }

  /**
   * バネ全体を描画
   * @param {boolean} hovered ハンドルがホバー中か
   */
  display(hovered) {
    this.drawNaturalLengthLine();
    this.drawCoil();
    this.drawHandle(hovered);
    this.drawForceInfo();
  }

  /**
   * バネを自然長の状態にリセット
   */
  reset() {
    this.endX = this.attachX + this.naturalLength;
    this.endY = this.attachY;
    this.isDragging = false;
  }

  /**
   * ばね定数を更新
   * @param {number} newK 新しいばね定数 (N/m)
   */
  updateK(newK) {
    this.k = newK;
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
