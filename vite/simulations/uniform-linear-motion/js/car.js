/**
 * 車オブジェクト
 */
export class CAR {
  /**
   * @constructor
   * @param {number} x x方向の座標
   * @param {number} y y方向の座標
   * @param {p5.Image} i 車の画像
   * @param {number} v x方向の速度
   * @param {Array} xa 各時刻におけるx方向の座標xの配列
   * @param {Array} va 各時刻におけるx方向の速度vの配列
   */
  constructor(x, y, i, v, xa, va) {
    this.posx = x;
    this.posy = y;
    this.img = i;
    this.speed = v;
    this.xarr = xa;
    this.varr = va;
  }

  /**
   * 座標をアップデートする。
   */
  update() {
    this.posx += (50 * this.speed) / 60;
  }

  /**
   * 軌跡の描画を行う。
   * @param {p5} p p5インスタンス
   */
  drawTrajectory(p) {
    p.tint(255, 150);
    p.stroke(255, 0, 0);
    p.strokeWeight(3);
    for (let i = 0; i < this.xarr.length; i++) {
      if ((this.xarr[i]["y"] - this.xarr[0]["y"]) * 50 < this.posx) {
        p.image(
          this.img,
          (this.xarr[i]["y"] - this.xarr[0]["y"]) * 50 - this.img.width / 2,
          this.posy
        );
        p.line(
          (this.xarr[i]["y"] - this.xarr[0]["y"]) * 50,
          this.posy + this.img.height - 10,
          (this.xarr[i]["y"] - this.xarr[0]["y"]) * 50,
          this.posy + this.img.height + 10
        );
      }
    }
  }

  /**
   * 車の描画を行う。
   * @param {p5} p p5インスタンス
   */
  drawCar(p) {
    p.tint(255);
    p.image(this.img, this.posx - this.img.width / 2, this.posy);
  }
}
