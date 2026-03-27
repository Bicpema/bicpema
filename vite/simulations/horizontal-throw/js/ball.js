import { state } from "./state.js";

// 3D シーン定数
const PLATFORM_W_M = 10; // 台の幅 (m)
const PLATFORM_THICK = 18; // 台の厚み (px) ─ 浮かせた薄い棚
const PLATFORM_D = 20; // 台の奥行き (px)
const GROUND_D = 30; // 地面の奥行き (px)
const GROUND_THICK = 16; // 地面の厚み (px)
const BALL_R = 14; // 球の半径 (px)
const ARROW_SCALE_3D = 3.5; // 速度矢印スケール
const GHOST_INTERVAL = 0.35; // 残像を残す時間間隔 (秒)
const GHOST_MAX = 35; // 残像の最大数
// カメラスケール固定基準値 (設定変更でズームしない)
const CAM_REF_H = 80; // 基準初期高さ (m)
const CAM_REF_V = 30; // 基準初速度 (m/s)

/**
 * Ballクラス
 * 水平投射運動をする物体を表現 (WebGL 3D)
 */
export class Ball {
  /**
   * @constructor
   * @param {number} initialHeight 初期の高さ (m)
   * @param {number} initialVelocity 初速度 (m/s) - 水平方向
   */
  constructor(initialHeight = 30, initialVelocity = 15) {
    this.initialHeight = initialHeight;
    this.initialVelocity = initialVelocity;
    this.x = 0;
    this.height = initialHeight;
    this.vx = initialVelocity;
    this.vy = 0;
    this.time = 0;
    this.g = 9.8;
    this.isMoving = false;
    this.trail = [];
    // 残像: {x, height, alpha} を共有、黄/青/赤の3球に使いまわす
    this.ghosts = [];
    this._lastGhostTime = 0;
  }

  /**
   * 位置を更新
   * @param {number} dt 時間刻み (秒)
   */
  update(dt) {
    if (!this.isMoving) return;

    this.time += dt;
    this.x = this.initialVelocity * this.time;
    this.height = this.initialHeight - 0.5 * this.g * this.time * this.time;
    this.vx = this.initialVelocity;
    this.vy = this.g * this.time;

    this.trail.push({ x: this.x, y: this.height });

    // 残像: 一定時間ごとにスナップショットを保存
    if (this.time - this._lastGhostTime >= GHOST_INTERVAL) {
      this.ghosts.push({ x: this.x, height: this.height });
      if (this.ghosts.length > GHOST_MAX) this.ghosts.shift();
      this._lastGhostTime = this.time;
    }

    if (this.height <= 0) {
      // 正確な着地座標に修正 (オーバーシュート補正)
      const landingT = Math.sqrt((2 * this.initialHeight) / this.g);
      this.x = this.initialVelocity * landingT;
      this.height = 0;
      this.isMoving = false;
    }
  }

  /**
   * WebGL 3D で物体を描画
   * @param {p5} p p5インスタンス
   */
  display(p) {
    // --- スケール計算 (カメラ固定: 常に基準最大値で S を決定) ---
    const refMaxT = Math.sqrt((2 * CAM_REF_H) / this.g);
    const refMaxX_m = CAM_REF_V * refMaxT;
    const refTotalW_m = refMaxX_m + PLATFORM_W_M;
    const margin = 0.78;
    const scaleW = (p.width * margin) / refTotalW_m;
    const scaleH = (p.height * margin) / CAM_REF_H;
    const S = Math.min(scaleW, scaleH); // px/m (固定)

    // 実際のシーン寸法 (S は固定だが配置はパラメータに追従)
    const maxT = Math.sqrt((2 * this.initialHeight) / this.g);
    const maxX_m = this.initialVelocity * maxT;

    const platformW_px = PLATFORM_W_M * S;
    const h0_px = this.initialHeight * S;
    const maxX_px = maxX_m * S;

    // 座標変換: 打ち出し点 (y=0) が台の上面
    // WebGL: 右=+x, 下=+y
    const toBx = (xm) => xm * S;
    // 物理軌跡の y 座標 (地面 = h0_px)
    const toByPhys = (ym) => (this.initialHeight - ym) * S;
    // 球の視覚的中心 y 座標 = 物理位置から BALL_R 分上にオフセット
    // → 台の上面 (y=0) に球の底が触れるときの球中心は y = -BALL_R
    // → 地面の上面 (y=h0_px) に球の底が触れるときの球中心は y = h0_px - BALL_R
    const toBy = (ym) => toByPhys(ym) - BALL_R;

    const bx = toBx(this.x);
    const by = toBy(this.height);
    // x方向球の固定 y (打ち出し高さ, 台上面に乗った状態)
    const xBallY = toBy(this.initialHeight); // = -BALL_R

    // シーン中心をキャンバス中心へ
    const cx = (maxX_px - platformW_px) / 2;
    const cy = (h0_px - BALL_R) / 2;

    // --- シーン変換 ---
    p.push();
    p.translate(-cx, -cy, 0);

    // ライティング
    p.ambientLight(160, 160, 165);
    p.directionalLight(255, 255, 248, -0.5, -1, -0.5);

    // --- 地面 (白い薄い box) ---
    // 上面を y = h0_px に揃える
    p.push();
    p.translate((maxX_px - platformW_px) / 2, h0_px + GROUND_THICK / 2, 0);
    p.fill(245, 245, 245);
    p.noStroke();
    p.box(maxX_px + platformW_px + 40, GROUND_THICK, GROUND_D);
    p.pop();

    // --- 台: 浮かせた薄い白い長方形 ---
    // 上面を y = 0 に揃える (台中心 y = PLATFORM_THICK/2)
    p.push();
    p.translate(-platformW_px / 2, PLATFORM_THICK / 2, 0);
    p.fill(225, 228, 238);
    p.noStroke();
    p.box(platformW_px, PLATFORM_THICK, PLATFORM_D);
    p.pop();

    // --- 軌跡 (黄色細い線) ---
    if (this.trail.length > 1) {
      p.noFill();
      p.stroke(255, 220, 50, 140);
      p.strokeWeight(2);
      p.beginShape();
      for (const pos of this.trail) {
        p.vertex(toBx(pos.x), toBy(pos.y), 0);
      }
      p.endShape();
    }

    // === 残像の格子線 (各ghost位置でx/y方向の変位を可視化) ─ 白固定 ===
    p.strokeWeight(0.8);
    p.noFill();
    for (const g of this.ghosts) {
      const gx = toBx(g.x);
      const gyViz = toBy(g.height);

      // x-ghost を通る垂直線
      p.stroke(255, 255, 255, 75);
      p.line(gx, xBallY - BALL_R * 0.5, 0, gx, h0_px, 0);

      // y-ghost を通る水平線
      p.stroke(255, 255, 255, 75);
      p.line(-platformW_px, gyViz, 0, maxX_px + 20, gyViz, 0);
    }

    // === 残像球 (黄/緑/黄を同じスナップショットから描画, 固定アルファ) ===
    const GHOST_ALPHA = 160;
    const r = BALL_R * 0.65;
    for (const g of this.ghosts) {
      const gx = toBx(g.x);
      const gyViz = toBy(g.height);

      // 黄色残像 (メイン球, 放物線上)
      p.push();
      p.translate(gx, gyViz, 0);
      p.fill(255, 215, 30, GHOST_ALPHA);
      p.noStroke();
      p.sphere(r);
      p.pop();

      // 緑残像 (x方向球: y固定 = xBallY)
      p.push();
      p.translate(gx, xBallY, 0);
      p.fill(50, 210, 80, GHOST_ALPHA);
      p.noStroke();
      p.sphere(r);
      p.pop();

      // 黄残像 (y方向球: x=0 固定)
      p.push();
      p.translate(0, gyViz, 0);
      p.fill(240, 190, 30, GHOST_ALPHA);
      p.noStroke();
      p.sphere(r);
      p.pop();
    }

    // === x方向ガイドライン (水平, 緑) ===
    p.push();
    p.stroke(50, 210, 80, 100);
    p.strokeWeight(1.5);
    p.noFill();
    p.line(0, xBallY, 0, bx, xBallY, 0);
    p.pop();

    // === y方向ガイドライン (垂直, 黄) ===
    p.push();
    p.stroke(240, 200, 30, 100);
    p.strokeWeight(1.5);
    p.noFill();
    p.line(0, xBallY, 0, 0, by, 0);
    p.pop();

    // === x方向球 (緑, y = xBallY 固定) ===
    p.push();
    p.translate(bx, xBallY, 0);
    p.fill(50, 215, 85, 235);
    p.noStroke();
    p.sphere(BALL_R * 0.88);
    p.pop();

    // === y方向球 (黄色, x=0 固定) ===
    p.push();
    p.translate(0, by, 0);
    p.fill(245, 205, 35, 235);
    p.noStroke();
    p.sphere(BALL_R * 0.88);
    p.pop();

    // === 接続補助線 (main球 → x球 / main球 → y球) ===
    p.push();
    p.stroke(255, 255, 255, 65);
    p.strokeWeight(1);
    p.noFill();
    p.line(bx, by, 0, bx, xBallY, 0); // main → x球
    p.line(bx, by, 0, 0, by, 0); // main → y球
    p.pop();

    // === メイン球 (黄色) ===
    p.push();
    p.translate(bx, by, 0);
    p.fill(255, 215, 30);
    p.noStroke();
    p.sphere(BALL_R);

    // 速度矢印
    if (this.time > 0) {
      const vxLen = this.vx * ARROW_SCALE_3D;
      const vyLen = this.vy * ARROW_SCALE_3D;
      drawArrow3D(p, 0, 0, 0, vxLen, 0, 0, p.color(50, 215, 85, 230)); // vx → 緑
      drawArrow3D(p, 0, 0, 0, 0, vyLen, 0, p.color(245, 205, 35, 230)); // vy → 黄
    }
    p.pop();

    // === ラベル ===
    if (state.font) {
      p.textFont(state.font);
      p.textAlign(p.CENTER, p.CENTER);
      const labelSize = Math.max(12, S * 1.6);

      // x方向ラベル (緑)
      p.push();
      p.translate(bx, xBallY - BALL_R * 2.2, 0);
      p.fill(80, 220, 100);
      p.noStroke();
      p.textSize(labelSize);
      p.text("x方向", 0, 0);
      p.pop();

      // y方向ラベル (黄)
      p.push();
      p.translate(-BALL_R * 3.5, by, 0);
      p.fill(245, 210, 60);
      p.noStroke();
      p.textSize(labelSize);
      p.text("y方向", 0, 0);
      p.pop();
    }

    p.pop(); // シーン変換終了

    // === HUD ===
    drawHUD(p, this);
  }

  /**
   * リセット
   */
  reset(newHeight, newVelocity) {
    this.initialHeight = newHeight;
    this.initialVelocity = newVelocity;
    this.x = 0;
    this.height = newHeight;
    this.vx = newVelocity;
    this.vy = 0;
    this.time = 0;
    this.isMoving = false;
    this.trail = [];
    this.ghosts = [];
    this._lastGhostTime = 0;
  }

  start() {
    this.isMoving = true;
  }

  stop() {
    this.isMoving = false;
  }
}

/**
 * 3D矢印を描画する (軸方向のみ対応の簡易実装)
 * @param {p5} p
 * @param {number} x1,y1,z1 始点
 * @param {number} x2,y2,z2 終点
 * @param {p5.Color} color
 */
function drawArrow3D(p, x1, y1, z1, x2, y2, z2, color) {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const dz = z2 - z1;
  const len = Math.sqrt(dx * dx + dy * dy + dz * dz);
  if (len < 1) return;

  p.push();
  p.stroke(color);
  p.strokeWeight(2.5);
  p.line(x1, y1, z1, x2, y2, z2);

  // 矢頭: 終点に小さな cone
  p.noStroke();
  p.fill(color);
  p.translate(x2, y2, z2);
  // 矢頭を矢印方向に回転させる
  if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > Math.abs(dz)) {
    // x軸方向
    p.rotateZ(-p.HALF_PI * Math.sign(dx));
  } else if (Math.abs(dy) >= Math.abs(dx)) {
    // y軸方向 (cone はデフォルトでy軸方向に延びる)
    if (dy < 0) p.rotateZ(p.PI);
  }
  p.cone(4, 12);
  p.pop();
}

/**
 * HUD テキスト (WebGL内でカメラ変換なしに描画)
 */
function drawHUD(p, ball) {
  if (!state.font) return;

  p.push();
  // WebGL でHUDを描画: カメラをリセットして正射影風に
  p.ortho(-p.width / 2, p.width / 2, -p.height / 2, p.height / 2, -1000, 1000);
  p.camera();

  p.noLights();
  p.noStroke();
  p.textFont(state.font);
  p.textAlign(p.LEFT, p.TOP);

  const fontSize = Math.max(13, p.width * 0.018);
  p.textSize(fontSize);
  const lineH = fontSize * 1.5;
  const lx = -p.width / 2 + 15;
  const ty = -p.height / 2 + 15;

  // vx ラベル (緑)
  p.fill(80, 220, 100);
  p.text(`→ vx = ${ball.vx.toFixed(1)} m/s`, lx, ty);
  // vy ラベル (黄)
  p.fill(240, 205, 50);
  p.text(`↓ vy = ${ball.vy.toFixed(1)} m/s`, lx, ty + lineH);

  // 右上: 情報
  p.textAlign(p.RIGHT, p.TOP);
  p.fill(220, 220, 230);
  const rx = p.width / 2 - 15;
  p.text(`時間: ${ball.time.toFixed(2)} s`, rx, ty);
  p.text(`水平距離: ${ball.x.toFixed(2)} m`, rx, ty + lineH);
  p.text(`高さ: ${ball.height.toFixed(2)} m`, rx, ty + lineH * 2);
  p.text(`初速: ${ball.initialVelocity.toFixed(1)} m/s`, rx, ty + lineH * 3);
  p.text(`初高さ: ${ball.initialHeight.toFixed(0)} m`, rx, ty + lineH * 4);

  p.pop();
}
