import { state } from "./state.js";

/**
 * Ballクラス
 * 鉛直投げ上げ運動をする物体を表現
 */
export class Ball {
  /**
   * @constructor
   * @param {number} initialVelocity 初速度 (m/s) - 上向きを正とする
   */
  constructor(initialVelocity = 30) {
    this.initialVelocity = initialVelocity;
    this.height = 0;
    this.velocity = initialVelocity;
    this.time = 0;
    this.g = 9.8;
    this.radius = 15;
    this.isMoving = false;
    this.maxHeight = (initialVelocity * initialVelocity) / (2 * this.g);
    this.history = [];
  }

  /**
   * 位置を更新
   * @param {number} dt 時間刻み (秒)
   */
  update(dt) {
    if (!this.isMoving) return;

    this.time += dt;
    this.velocity = this.initialVelocity - this.g * this.time;
    this.height =
      this.initialVelocity * this.time - 0.5 * this.g * this.time * this.time;

    if (this.height <= 0) {
      this.height = 0;
      this.velocity = 0;
      this.isMoving = false;
      return;
    }

    this.history.push({ t: this.time, y: this.height, v: this.velocity });
  }

  /**
   * ボールを描画
   * @param {p5} p p5インスタンス
   * @param {number} canvasHeight キャンバスの高さ
   */
  display(p, canvasHeight) {
    const groundHeight = 50;
    const ballX = 200;

    // 高さスケールを動的に計算（最高到達点がアニメーションエリアに収まるよう調整）
    const availableH = canvasHeight - groundHeight - this.radius * 2 - 30;
    const heightScale = (availableH * 0.85) / Math.max(this.maxHeight, 1);

    const ballY =
      canvasHeight - groundHeight - this.height * heightScale - this.radius;

    // 最高到達点の点線を描画
    const maxHeightY =
      canvasHeight - groundHeight - this.maxHeight * heightScale;
    p.stroke(80);
    p.strokeWeight(1.5);
    p.drawingContext.setLineDash([8, 8]);
    p.line(ballX + 30, maxHeightY, ballX + 310, maxHeightY);
    p.drawingContext.setLineDash([]);

    // 最高到達点の高さテキスト
    p.fill(50);
    p.noStroke();
    p.textAlign(p.LEFT, p.CENTER);
    p.textSize(14);
    p.text(
      `最高到達点: ${this.maxHeight.toFixed(1)} m`,
      ballX + 35,
      maxHeightY - 14
    );

    // ボール
    if (state.ballImage) {
      p.imageMode(p.CENTER);
      p.image(state.ballImage, ballX, ballY, this.radius * 2, this.radius * 2);
    } else {
      p.fill(255, 100, 100);
      p.noStroke();
      p.circle(ballX, ballY, this.radius * 2);
    }

    // ボールの右側に速度を描画
    p.fill(220, 60, 60);
    p.noStroke();
    p.textAlign(p.LEFT, p.CENTER);
    p.textSize(14);
    const velocityText =
      this.velocity >= 0
        ? `↑ ${this.velocity.toFixed(1)} m/s`
        : `↓ ${Math.abs(this.velocity).toFixed(1)} m/s`;
    p.text(velocityText, ballX + this.radius + 10, ballY);

    // 地面（左エリアのみ）
    if (state.groundImage) {
      p.imageMode(p.CORNER);
      p.image(
        state.groundImage,
        0,
        canvasHeight - groundHeight - 5,
        545,
        groundHeight
      );
    } else {
      p.stroke(100);
      p.strokeWeight(2);
      p.line(0, canvasHeight - groundHeight, 545, canvasHeight - groundHeight);
    }

    // 情報表示（左上）
    p.fill(50);
    p.noStroke();
    p.textAlign(p.LEFT, p.TOP);
    p.textSize(14);
    p.text(`時間: ${this.time.toFixed(2)} s`, 15, 65);
    p.text(`高さ: ${this.height.toFixed(2)} m`, 15, 88);
    p.text(`速度: ${this.velocity.toFixed(2)} m/s`, 15, 111);
    p.text(`初速: ${this.initialVelocity.toFixed(1)} m/s`, 15, 134);

    // グラフを描画
    this._drawGraphs(p, canvasHeight);
  }

  /**
   * y-t グラフと v-t グラフを描画
   * @param {p5} p p5インスタンス
   * @param {number} canvasHeight キャンバスの高さ
   */
  _drawGraphs(p, canvasHeight) {
    const maxTime = (2 * this.initialVelocity) / this.g;
    const v0 = this.initialVelocity;

    const graphX = 555;
    const graphW = 430;
    const graphGap = 28;
    const graphH = (canvasHeight - 40 - graphGap) / 2;
    const g1Y = 20;
    const g2Y = g1Y + graphH + graphGap;

    // y-t グラフ（位置 vs 時間）
    this._drawGraph(
      p,
      graphX,
      g1Y,
      graphW,
      graphH,
      maxTime,
      0,
      this.maxHeight,
      (t) => this.initialVelocity * t - 0.5 * this.g * t * t,
      this.history,
      "y",
      "y-t グラフ",
      "時間 t (s)",
      "高さ y (m)"
    );

    // v-t グラフ（速度 vs 時間）
    this._drawGraph(
      p,
      graphX,
      g2Y,
      graphW,
      graphH,
      maxTime,
      -v0,
      v0,
      (t) => this.initialVelocity - this.g * t,
      this.history,
      "v",
      "v-t グラフ",
      "時間 t (s)",
      "速度 v (m/s)"
    );
  }

  /**
   * 汎用グラフ描画メソッド
   */
  _drawGraph(
    p,
    gx,
    gy,
    gw,
    gh,
    maxX,
    minY,
    maxY,
    theoreticalFn,
    history,
    yKey,
    title,
    xLabel,
    yLabel
  ) {
    const padL = 52;
    const padR = 12;
    const padT = 26;
    const padB = 36;

    const plotX = gx + padL;
    const plotY = gy + padT;
    const plotW = gw - padL - padR;
    const plotH = gh - padT - padB;

    const mapX = (t) => plotX + (maxX > 0 ? (t / maxX) * plotW : 0);
    const mapY = (v) => plotY + plotH - ((v - minY) / (maxY - minY)) * plotH;

    // グラフ背景
    p.fill(245, 247, 250);
    p.noStroke();
    p.rect(gx, gy, gw, gh, 6);

    // プロットエリア背景
    p.fill(255);
    p.stroke(220);
    p.strokeWeight(1);
    p.rect(plotX, plotY, plotW, plotH);

    // タイトル
    p.fill(50);
    p.noStroke();
    p.textAlign(p.CENTER, p.TOP);
    p.textSize(13);
    p.text(title, gx + gw / 2, gy + 6);

    // グリッドライン
    const gridN = 4;
    p.stroke(230);
    p.strokeWeight(0.5);
    for (let i = 0; i <= gridN; i++) {
      const yv = minY + (maxY - minY) * (i / gridN);
      p.line(plotX, mapY(yv), plotX + plotW, mapY(yv));
      const xp = plotX + (i / gridN) * plotW;
      p.line(xp, plotY, xp, plotY + plotH);
    }

    // ゼロライン（v-t グラフで y=0 の破線）
    if (minY < 0 && maxY > 0) {
      p.stroke(160);
      p.strokeWeight(1);
      p.drawingContext.setLineDash([5, 5]);
      p.line(plotX, mapY(0), plotX + plotW, mapY(0));
      p.drawingContext.setLineDash([]);
    }

    // 軸線
    p.stroke(120);
    p.strokeWeight(1.5);
    p.line(plotX, plotY, plotX, plotY + plotH);
    p.line(plotX, plotY + plotH, plotX + plotW, plotY + plotH);

    // 目盛り数値
    p.fill(80);
    p.noStroke();
    p.textSize(11);
    p.textAlign(p.CENTER, p.TOP);
    for (let i = 0; i <= gridN; i++) {
      const t = maxX * (i / gridN);
      p.text(t.toFixed(1), mapX(t), plotY + plotH + 4);
    }
    p.textAlign(p.RIGHT, p.CENTER);
    for (let i = 0; i <= gridN; i++) {
      const val = minY + (maxY - minY) * (i / gridN);
      p.text(val.toFixed(0), plotX - 4, mapY(val));
    }

    // 軸ラベル
    p.fill(60);
    p.noStroke();
    p.textAlign(p.CENTER, p.BOTTOM);
    p.textSize(12);
    p.text(xLabel, plotX + plotW / 2, gy + gh - 3);

    p.push();
    p.translate(gx + 12, plotY + plotH / 2);
    p.rotate(-p.HALF_PI);
    p.textAlign(p.CENTER, p.CENTER);
    p.textSize(12);
    p.text(yLabel, 0, 0);
    p.pop();

    // 理論曲線（薄いグレー）
    const steps = 100;
    p.stroke(200);
    p.strokeWeight(1.5);
    p.noFill();
    p.beginShape();
    for (let i = 0; i <= steps; i++) {
      const t = maxX * (i / steps);
      const val = theoreticalFn(t);
      p.vertex(mapX(t), p.constrain(mapY(val), plotY, plotY + plotH));
    }
    p.endShape();

    // 実際の軌跡（青）
    if (history.length > 1) {
      p.stroke(70, 130, 200);
      p.strokeWeight(2);
      p.noFill();
      p.beginShape();
      for (const pt of history) {
        p.vertex(mapX(pt.t), p.constrain(mapY(pt[yKey]), plotY, plotY + plotH));
      }
      p.endShape();
    }

    // 現在地点（赤い点）
    if (this.time > 0) {
      const clampedT = Math.min(this.time, maxX);
      const val = theoreticalFn(clampedT);
      p.fill(220, 50, 50);
      p.noStroke();
      p.circle(mapX(clampedT), p.constrain(mapY(val), plotY, plotY + plotH), 9);
    }
  }

  /**
   * リセット
   * @param {number} newVelocity 新しい初速度
   */
  reset(newVelocity) {
    this.initialVelocity = newVelocity;
    this.height = 0;
    this.velocity = newVelocity;
    this.time = 0;
    this.isMoving = false;
    this.maxHeight = (newVelocity * newVelocity) / (2 * this.g);
    this.history = [];
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
