/**
 * 3D座標系を描画するクラス
 */
export class CoordinateSystem {
  /**
   * @constructor
   * @param {number} x x方向の長さ
   * @param {number} y y方向の長さ
   * @param {number} z z方向の長さ
   */
  constructor(x = 500, y = 500, z = 500) {
    this.x = x;
    this.y = y;
    this.z = z;
  }

  /**
   * x,y,z軸を描画する。
   * @param {*} p p5インスタンス。
   */
  line(p) {
    p.stroke(255, 0, 0);
    p.line(this.x, 0, 0, 0, 0, 0);
    p.stroke(0, 255, 0);
    p.line(0, this.y, 0, 0, 0, 0);
    p.stroke(0, 0, 255);
    p.line(0, 0, this.z, 0, 0, 0);
  }

  /**
   * x,y,z方向のスケールを描画するメソッド
   * @param {*} p p5インスタンス。
   */
  scale(p) {
    p.stroke(100, 100);
    for (let x = 50; x <= this.x; x += 50) {
      p.line(x, 0, 0, x, this.y, 0);
      p.line(x, 0, 0, x, 0, this.z);
    }
    for (let y = 50; y <= this.y; y += 50) {
      p.line(0, y, 0, this.x, y, 0);
      p.line(0, y, 0, 0, y, this.z);
    }
    for (let z = 50; z <= this.z; z += 50) {
      p.line(0, 0, z, this.x, 0, z);
      p.line(0, 0, z, 0, this.y, z);
    }
  }

  /**
   * x,y,z方向の軸ラベルを描画するメソッド
   * @param {*} p p5インスタンス。
   * @param {string} xLabel x方向のラベル
   * @param {string} yLabel y方向のラベル
   * @param {string} zLabel z方向のラベル
   * @param {number} size フォントサイズ
   */
  axisLabel(p, xLabel, yLabel, zLabel, size) {
    p.fill(0);
    p.textSize(size);

    p.push();
    p.translate(0, -size, 0);
    p.text(xLabel, this.x / 2, 0);
    p.pop();

    p.push();
    p.translate(-size, 0, 0);
    p.text(yLabel, 0, this.y / 2);
    p.pop();

    p.push();
    p.rotateY(p.PI / 2);
    p.translate(0, -size, 0);
    p.text(zLabel, -this.z / 2, 0);
    p.pop();
  }
}
