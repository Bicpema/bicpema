// class.js はクラス管理専用のファイルです。

import { PX_PER_M, MIN_SPRING_LENGTH, MAX_SPRING_LENGTH } from "./state.js";

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
export class Spring {
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

    // 先端ヒット判定の半径（仮想座標）
    this.hitR = 30;
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
   * マウスがバネ先端の上にあるか判定
   * @param {number} mx マウスX（仮想座標）
   * @param {number} my マウスY（仮想座標）
   * @returns {boolean}
   */
  isOverHandle(mx, my) {
    const dx = mx - this.endX;
    const dy = my - this.endY;
    return dx * dx + dy * dy <= this.hitR * this.hitR;
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
   * @param {*} p p5 インスタンス
   * @param {number} mx マウスX（仮想座標）
   */
  drag(p, mx) {
    if (!this.isDragging) return;
    const minEndX = this.attachX + MIN_SPRING_LENGTH;
    const maxEndX = this.attachX + MAX_SPRING_LENGTH;
    this.endX = p.constrain(mx + this.dragOffsetX, minEndX, maxEndX);
  }

  /**
   * ドラッグ終了
   */
  stopDrag() {
    this.isDragging = false;
  }

  /**
   * 自然長位置を示す縦の点線を描画
   * @param {*} p p5 インスタンス
   */
  drawNaturalLengthLine(p) {
    const nx = this.attachX + this.naturalLength;
    const y = this.attachY;
    p.stroke(180);
    p.strokeWeight(1.5);
    p.drawingContext.setLineDash([8, 8]);
    p.line(nx, y - 35, nx, y + 35);
    p.drawingContext.setLineDash([]);

    p.fill(150);
    p.noStroke();
    p.textAlign(p.CENTER, p.BOTTOM);
    p.textSize(13);
    p.text("自然長", nx, y - 38);
  }

  /**
   * バネのコイル形状（ジグザグ）を描画
   * @param {*} p p5 インスタンス
   */
  drawCoil(p) {
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

    p.stroke(40);
    p.strokeWeight(2.5);
    p.noFill();

    p.beginShape();
    p.curveVertex(x1, y);
    p.curveVertex(x1, y);
    p.curveVertex(x1 + straightLen, y);

    for (let i = 0; i < halfCoils; i++) {
      const cx = x1 + straightLen + (i + 0.5) * segLen;
      const cy = y + (i % 2 === 0 ? -amplitude : amplitude);
      p.curveVertex(cx, cy);
    }

    p.curveVertex(x2 - straightLen, y);
    p.curveVertex(x2, y);
    p.curveVertex(x2, y);
    p.endShape();
  }

  /**
   * 変位と弾性力の数値・矢印を描画
   * @param {*} p p5 インスタンス
   */
  drawForceInfo(p) {
    const dispM = this.displacement;
    const dispCm = dispM * 100;
    const F = this.forceMagnitude;

    if (Math.abs(dispM) < DISPLACEMENT_THRESHOLD) return;

    // 変位ラベル（バネの上）
    const labelX = (this.attachX + this.endX) / 2;
    const labelY = this.attachY - 42;
    p.noStroke();
    p.fill(0);
    p.textAlign(p.CENTER, p.CENTER);
    p.textSize(16);
    const xSign = dispCm > 0 ? "+" : "";
    p.text("x = " + xSign + dispCm.toFixed(1) + " cm", labelX, labelY);

    // 弾性力ラベル（バネの下）
    p.textSize(16);
    p.fill(200, 30, 30);
    p.text("F = " + F.toFixed(2) + " N", labelX, this.attachY + 46);

    // 弾性力の矢印（バネ先端から弾性力の向きへ）
    const arrowDir = dispM > 0 ? -1 : 1;
    const arrowLen = F * 20;
    const arrowStartX = this.endX;
    const arrowEndX = arrowStartX + arrowDir * arrowLen;
    p.stroke(200, 30, 30);
    p.strokeWeight(2.5);
    p.fill(200, 30, 30);
    p.line(arrowStartX, this.attachY, arrowEndX, this.attachY);
    const hs = 9;
    p.triangle(
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
   * @param {*} p p5 インスタンス
   */
  display(p) {
    this.drawNaturalLengthLine(p);
    this.drawCoil(p);
    this.drawForceInfo(p);
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
