import { state } from "./state.js";
import { GRAPH_INTERVAL, MARKER_INTERVAL, PIXELS_PER_METER, MAX_TIME } from "./constants.js";

/**
 * 等加速度直線運動をする車オブジェクト
 */
export class Car {
  /**
   * @constructor
   * @param {number} initialVelocity 初速度 (m/s)
   * @param {number} acceleration 加速度 (m/s²)
   */
  constructor(initialVelocity, acceleration) {
    this.initialVelocity = initialVelocity;
    this.acceleration = acceleration;
    this.velocity = initialVelocity;
    this.position = 0; // m
    this.time = 0; // s
    this.isMoving = false;
    this.lastGraphUpdate = 0;
    this.lastMarkerTime = 0;
    /** @type {{x: number, px: number}[]} 等時間マーカーの仮想x座標リスト */
    this.markers = [];
  }

  /**
   * 位置・速度を更新する
   * @param {number} dt 時間刻み (秒)
   */
  update(dt) {
    if (!this.isMoving) return;

    this.time += dt;
    this.velocity = this.initialVelocity + this.acceleration * this.time;
    this.position =
      this.initialVelocity * this.time +
      0.5 * this.acceleration * this.time * this.time;

    // 時間が上限を超えたら停止
    if (this.time >= MAX_TIME) {
      this.time = MAX_TIME;
      this.velocity = this.initialVelocity + this.acceleration * this.time;
      this.position =
        this.initialVelocity * this.time +
        0.5 * this.acceleration * this.time * this.time;
      this.isMoving = false;
    }

    // グラフデータ記録
    if (this.time - this.lastGraphUpdate >= GRAPH_INTERVAL) {
      state.xtData.push({
        x: parseFloat(this.time.toFixed(3)),
        y: parseFloat(this.position.toFixed(3)),
      });
      state.vtData.push({
        x: parseFloat(this.time.toFixed(3)),
        y: parseFloat(this.velocity.toFixed(3)),
      });
      this.lastGraphUpdate = this.time;
    }

    // 等時間マーカー
    if (this.time - this.lastMarkerTime >= MARKER_INTERVAL) {
      this.markers.push({
        t: parseFloat(this.time.toFixed(2)),
        px: this.position * PIXELS_PER_METER,
      });
      this.lastMarkerTime = this.time;
    }
  }

  /**
   * 車とトラックを描画する
   * @param {p5} p p5インスタンス
   * @param {number} vH 仮想キャンバス高さ
   * @param {Object} options 描画オプション
   * @param {p5.Image} [options.carImage] 車の画像
   * @param {p5.Image} [options.groundImage] 地面画像
   * @param {boolean} [options.showMarkers] 等時間マーカーを表示するか
   */
  display(p, vH, options = {}) {
    const { carImage, groundImage, showMarkers = true } = options;

    const trackY = vH * 0.72;
    const groundY = vH * 0.82;
    const carWidth = 80;
    const carHeight = 40;
    const carPixelX = this.position * PIXELS_PER_METER;

    // 地面
    if (groundImage) {
      p.imageMode(p.CORNER);
      p.image(groundImage, 0, groundY, 1000, vH - groundY + 10);
    } else {
      p.fill(80, 60, 40);
      p.noStroke();
      p.rect(0, groundY, 1000, vH - groundY);
    }

    // トラック（路面線）
    p.stroke(200);
    p.strokeWeight(2);
    p.line(0, trackY, 1000, trackY);

    // 等時間マーカー
    if (showMarkers) {
      for (const marker of this.markers) {
        p.fill(255, 200, 50, 180);
        p.noStroke();
        p.ellipse(marker.px, trackY - carHeight / 2, 8, 8);
        p.fill(255, 200, 50);
        p.noStroke();
        p.textAlign(p.CENTER, p.BOTTOM);
        p.textSize(12);
        p.text(`${marker.t}s`, marker.px, trackY - carHeight / 2 - 4);
      }
    }

    // 車
    if (carImage) {
      p.imageMode(p.CENTER);
      p.image(carImage, carPixelX, trackY - carHeight / 2, carWidth, carHeight);
    } else {
      p.fill(220, 200, 50);
      p.noStroke();
      p.rect(
        carPixelX - carWidth / 2,
        trackY - carHeight,
        carWidth,
        carHeight,
        6
      );
      // タイヤ
      p.fill(40);
      p.ellipse(carPixelX - 22, trackY - 4, 18, 18);
      p.ellipse(carPixelX + 22, trackY - 4, 18, 18);
    }

    // 情報テキスト
    p.fill(255);
    p.noStroke();
    p.textAlign(p.RIGHT, p.TOP);
    p.textSize(18);
    const rightX = 980;
    p.text(`時間: ${this.time.toFixed(2)} s`, rightX, 20);
    p.text(`位置: ${this.position.toFixed(2)} m`, rightX, 50);
    p.text(`速度: ${this.velocity.toFixed(2)} m/s`, rightX, 80);
    p.text(`加速度: ${this.acceleration.toFixed(1)} m/s²`, rightX, 110);
    p.text(`初速度: ${this.initialVelocity.toFixed(1)} m/s`, rightX, 140);
  }

  /**
   * リセットする
   * @param {number} newInitialVelocity 新しい初速度
   * @param {number} newAcceleration 新しい加速度
   */
  reset(newInitialVelocity, newAcceleration) {
    this.initialVelocity = newInitialVelocity;
    this.acceleration = newAcceleration;
    this.velocity = newInitialVelocity;
    this.position = 0;
    this.time = 0;
    this.isMoving = false;
    this.lastGraphUpdate = 0;
    this.lastMarkerTime = 0;
    this.markers = [];
    state.xtData = [];
    state.vtData = [];
  }

  /**
   * 運動を開始する
   */
  start() {
    this.isMoving = true;
  }

  /**
   * 運動を停止する
   */
  stop() {
    this.isMoving = false;
  }
}
