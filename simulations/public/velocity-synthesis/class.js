/**
 * 船のクラス
 */
export class Ship {
  /**
   * 船のコンストラクター。
   * @param {p5Instance} p p5インスタンス
   * @param {number} v 数値
   */
  constructor(p, v) {
    this.p = p;
    this.velocity = v;
    this.posX = 500;
    this.posY = 150;
    this.relativeVelocityArrow = new ParallelArrow(p, 200);
    this.shipVelocityArrow = new ParallelArrow(p, 175);
    this.waveVelocityArrow = new ParallelArrow(p, 225);
    this.relativeVelocity = 0;
  }
  /**
   * 相対速度の計算をします。
   * @param {number} shipVelocity 船の速度
   * @param {number} waveVelocity 波の速度
   */
  calcRelativeVelocity(shipVelocity, waveVelocity) {
    this.velocity = shipVelocity;
    this.relativeVelocity = waveVelocity + this.velocity;
  }
  /**
   * 座標を更新します。
   */
  update() {
    this.posX += this.relativeVelocity / 2;
  }
  /**
   * 船を描画します。
   * @param {number} shipVelocity 船の速度
   * @param {number} waveVelocity 波の速度
   */
  draw(shipVelocity, waveVelocity) {
    this.p.fill(255);
    this.p.rect(this.posX - 50, this.posY, 100, 100);
    this.relativeVelocityArrow.draw(
      this.posX,
      this.posX + this.relativeVelocity * 100,
      "合成速度：" + this.relativeVelocity + "m/s"
    );
    this.p.stroke(255, 0, 0);
    this.shipVelocityArrow.draw(this.posX, this.posX + shipVelocity * 100, "船の速度：" + shipVelocity + "m/s");
    this.p.stroke(0, 0, 255);
    this.waveVelocityArrow.draw(this.posX, this.posX + waveVelocity * 100, "波の速度：" + waveVelocity + "m/s");
  }
}

/**
 * 波のクラス
 */
export class Wave {
  /**
   * 波のコンストラクター。
   * @param {p5Instance} p p5インスタンス
   * @param {number} y y座標
   */
  constructor(p, y) {
    this.p = p;
    this.velocity = 0;
    this.posX = 0;
    this.posY = y;
  }
  /**
   * 座標を更新します。
   * @param {number} waveVelocity 波の速度
   */
  update(waveVelocity) {
    this.velocity = waveVelocity;
    this.posX += this.velocity / 2;
  }
  /**
   * 波を描画します。
   */
  draw() {
    this.p.line(this.posX - 90, this.posY - 20, this.posX - 30, this.posY - 20);
    this.p.line(this.posX - 60, this.posY, this.posX, this.posY);
    this.p.line(this.posX - 90, this.posY + 20, this.posX - 30, this.posY + 20);
  }
}

/**
 * 平行な矢印クラス
 */
export class ParallelArrow {
  /**
   *
   * @param {p5Instance} p p5インスタンス
   * @param {number} y y座標
   */
  constructor(p, y) {
    this.p = p;
    this.posY = y;
  }
  /**
   * 平行な線を描画します。
   * @param {number} referencePoint 基準となる点
   * @param {number} connectionPoint 繋ぐ点
   * @param {string} text 線付近に書くテキスト
   */
  draw(referencePoint, connectionPoint, text) {
    this.p.strokeWeight(5);
    this.p.line(referencePoint, this.posY, connectionPoint, this.posY);
    if (referencePoint < connectionPoint) {
      this.p.line(connectionPoint, this.posY - 10, connectionPoint + 10, this.posY);
      this.p.line(connectionPoint, this.posY + 10, connectionPoint + 10, this.posY);
      this.p.noStroke();
      this.p.fill(0);
      this.p.text(text, connectionPoint + 75, this.posY - 4);
    } else {
      this.p.line(connectionPoint, this.posY - 10, connectionPoint - 10, this.posY);
      this.p.line(connectionPoint, this.posY + 10, connectionPoint - 10, this.posY);
      this.p.noStroke();
      this.p.fill(0);
      this.p.text(text, connectionPoint - 75, this.posY - 4);
    }
  }
}
