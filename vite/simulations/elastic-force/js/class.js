// 変位の表示しきい値 (m) ─ これ以下は変位・弾性力を表示しない
const DISPLACEMENT_THRESHOLD = 0.001;
// バネ色変化の基準変位 (m) ─ 伸び・縮みそれぞれの最大色変化量
const MAX_STRETCH_FOR_COLOR = 0.15;
const MAX_COMPRESSION_FOR_COLOR = 0.1;

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
   * @param {number} coilCount コイルの数
   */
  constructor(attachX, attachY, naturalLength, k, coilCount = 10) {
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
    this.handleRx = 42;
    this.handleRy = 26;
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
   * 自然長を示す点線を描画
   */
  drawNaturalLengthLine() {
    const naturalEndX = this.attachX + this.naturalLength;
    stroke(160);
    strokeWeight(1.5);
    drawingContext.setLineDash([10, 10]);
    line(this.attachX, this.attachY, naturalEndX, this.attachY);
    drawingContext.setLineDash([]);
  }

  /**
   * バネのコイル形状を描画
   */
  drawCoil() {
    const x1 = this.attachX;
    const y = this.attachY;
    const x2 = this.endX;
    const len = x2 - x1;

    if (len < 10) return;

    const amplitude = 22;
    const straightLen = Math.min(20, len * 0.08);
    const coilLen = len - 2 * straightLen;
    const steps = this.coilCount * 20;

    // バネの伸縮に応じて色を変える
    const dispM = this.displacement;
    let r, g, b;
    if (Math.abs(dispM) < 0.001) {
      r = 60;
      g = 100;
      b = 200;
    } else if (dispM > 0) {
      // 伸び：赤系
      const t = Math.min(dispM / MAX_STRETCH_FOR_COLOR, 1);
      r = 60 + Math.round(t * 180);
      g = Math.round(100 * (1 - t));
      b = Math.round(200 * (1 - t));
    } else {
      // 縮み：緑系
      const t = Math.min(-dispM / MAX_COMPRESSION_FOR_COLOR, 1);
      r = Math.round(60 * (1 - t));
      g = Math.round(100 + t * 120);
      b = Math.round(200 * (1 - t));
    }

    stroke(r, g, b);
    strokeWeight(2.5);
    noFill();

    beginShape();
    vertex(x1, y);
    vertex(x1 + straightLen, y);

    for (let i = 0; i <= steps; i++) {
      const t = i / steps;
      const xPos = x1 + straightLen + t * coilLen;
      const yPos = y + amplitude * Math.sin(2 * Math.PI * this.coilCount * t);
      vertex(xPos, yPos);
    }

    vertex(x2 - straightLen, y);
    vertex(x2, y);
    endShape();
  }

  /**
   * 先端ハンドル（手）を描画
   * @param {boolean} hovered ホバー中か
   */
  drawHandle(hovered) {
    const bg = hovered ? color(255, 240, 180) : color(255, 255, 255);
    fill(bg);
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
   * 変位と弾性力の数値を描画
   */
  drawForceInfo() {
    const dispM = this.displacement;
    const dispCm = dispM * 100;
    const F = this.forceMagnitude;

    if (Math.abs(dispM) < DISPLACEMENT_THRESHOLD) return;

    const infoX = this.endX + this.handleRx + 20;
    const infoY = this.endY;

    // 矢印で弾性力の向きを示す
    const arrowLen = Math.min(Math.abs(dispCm) * 2.5, 120);
    const arrowDir = dispM > 0 ? -1 : 1; // 縮む方向
    const arrowColor = dispM > 0 ? color(220, 60, 60) : color(40, 160, 80);
    stroke(arrowColor);
    strokeWeight(3);
    fill(arrowColor);

    const arrowStartX = this.endX;
    const arrowEndX = this.endX + arrowDir * arrowLen;
    line(arrowStartX, infoY, arrowEndX, infoY);
    // 矢印の先端
    const headSize = 10;
    triangle(
      arrowEndX,
      infoY,
      arrowEndX - arrowDir * headSize,
      infoY - headSize * 0.6,
      arrowEndX - arrowDir * headSize,
      infoY + headSize * 0.6
    );

    // 数値表示
    const labelX = this.endX + this.handleRx + 15;
    const labelY = this.endY - 35;
    noStroke();
    fill(40);
    textAlign(LEFT, CENTER);
    textSize(17);
    const xSign = dispCm > 0 ? "+" : "";
    text(`x = ${xSign}${dispCm.toFixed(1)} cm`, labelX, labelY);
    textSize(17);
    fill(dispM > 0 ? color(200, 50, 50) : color(30, 140, 60));
    text(`F = ${F.toFixed(2)} N`, labelX, labelY + 26);
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
