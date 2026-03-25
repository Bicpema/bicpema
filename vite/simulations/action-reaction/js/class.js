// class.js はクラス管理専用のファイルです。

/**
 * Block クラス
 * 作用反作用の法則を示す物体
 */
export class Block {
  /**
   * @param {number} x 中心x座標（論理ピクセル）
   * @param {number} mass 質量 (kg)
   * @param {number[]} color RGB色配列 [r, g, b]
   * @param {string} label ラベル文字
   */
  constructor(x, mass, color, label) {
    this.initialX = x;
    this.x = x;
    this.mass = mass;
    this.color = color;
    this.label = label;
    this.velocity = 0;
    this.acceleration = 0;
    this.force = 0;

    this.W = 120;
    this.H = 90;
  }

  /** 左端x座標 */
  get leftEdge() {
    return this.x - this.W / 2;
  }

  /** 右端x座標 */
  get rightEdge() {
    return this.x + this.W / 2;
  }

  /**
   * 位置・速度を更新する
   * @param {number} dt 時間ステップ (s)
   * @param {number} pxPerMeter 1メートルあたりのピクセル数
   */
  update(dt, pxPerMeter) {
    this.acceleration = this.force / this.mass;
    this.velocity += this.acceleration * dt;
    this.x += this.velocity * pxPerMeter * dt;
  }

  /**
   * ブロックを描画する
   * @param {*} p p5インスタンス
   * @param {number} groundY 地面のy座標（論理ピクセル）
   * @param {*} font フォント（null可）
   */
  display(p, groundY, font) {
    p.push();

    // ブロック本体
    p.fill(...this.color);
    p.stroke(255, 255, 255, 80);
    p.strokeWeight(2);
    p.rect(this.leftEdge, groundY - this.H, this.W, this.H, 8);

    // ラベル
    p.fill(255);
    p.noStroke();
    if (font) p.textFont(font);
    p.textSize(42);
    p.textAlign(p.CENTER, p.CENTER);
    p.text(this.label, this.x, groundY - this.H / 2);

    // 質量ラベル
    p.fill(200);
    p.textSize(20);
    p.textAlign(p.CENTER, p.TOP);
    p.text(`${this.mass.toFixed(1)} kg`, this.x, groundY + 10);

    p.pop();
  }

  /**
   * 初期状態にリセットする
   */
  reset() {
    this.x = this.initialX;
    this.velocity = 0;
    this.force = 0;
    this.acceleration = 0;
  }
}

/**
 * Spring クラス
 * ブロック間の圧縮ばね
 */
export class Spring {
  /**
   * @param {number} k ばね定数 (N/m)
   * @param {number} naturalLengthPx 自然長（論理ピクセル）
   */
  constructor(k, naturalLengthPx) {
    this.k = k;
    this.naturalLengthPx = naturalLengthPx;
  }

  /**
   * ばねの現在の長さ (論理ピクセル) を返す
   * @param {Block} blockA
   * @param {Block} blockB
   * @returns {number}
   */
  getLength(blockA, blockB) {
    return blockB.leftEdge - blockA.rightEdge;
  }

  /**
   * ばね力の大きさ (N) を返す。圧縮時のみ正の値、伸長時は0。
   * @param {Block} blockA
   * @param {Block} blockB
   * @param {number} pxPerMeter 1メートルあたりのピクセル数
   * @returns {number}
   */
  getForce(blockA, blockB, pxPerMeter) {
    const compressionPx = this.naturalLengthPx - this.getLength(blockA, blockB);
    if (compressionPx <= 0) return 0;
    return this.k * (compressionPx / pxPerMeter);
  }

  /**
   * ばねを描画する（ジグザグ線）
   * @param {*} p p5インスタンス
   * @param {Block} blockA
   * @param {Block} blockB
   * @param {number} groundY 地面のy座標
   */
  display(p, blockA, blockB, groundY) {
    const x1 = blockA.rightEdge;
    const x2 = blockB.leftEdge;
    const y = groundY - blockA.H / 2;
    const len = x2 - x1;

    if (len <= 2) return;

    const coils = 8;
    const amp = Math.min(14, (len / coils) * 0.9);

    p.push();
    p.stroke(255, 220, 80);
    p.strokeWeight(3);
    p.noFill();
    p.beginShape();
    p.vertex(x1, y);
    for (let i = 0; i < coils * 2; i++) {
      const tx = x1 + (len * (i + 1)) / (coils * 2 + 1);
      const ty = y + (i % 2 === 0 ? -amp : amp);
      p.vertex(tx, ty);
    }
    p.vertex(x2, y);
    p.endShape();
    p.pop();
  }
}
