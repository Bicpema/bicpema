/**
 * 車オブジェクト
 */
class CAR {
  /**
   * @constructor
   * @param {number} x x方向の座標
   * @param {number} y y方向の座標
   * @param {img} i 車の画像
   * @param {number} v x方向の速度
   * @param {numberarr} xa 各時刻におけるx方向の座標xの配列
   * @param {numberarr} va 各時刻におけるx方向の速度vの配列
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
  update = () => {
    this.posx += (50 * this.speed) / 60;
  };

  /**
   * 軌跡の描画を行う。
   */
  drawTrajectory = () => {
    tint(255, 150);
    stroke(255, 0, 0);
    strokeWeight(3);
    for (let i = 0; i < this.xarr.length; i++) {
      if ((this.xarr[i]["y"] - this.xarr[0]["y"]) * 50 < this.posx) {
        image(this.img, (this.xarr[i]["y"] - this.xarr[0]["y"]) * 50 - this.img.width / 2, this.posy);
        line(
          (this.xarr[i]["y"] - this.xarr[0]["y"]) * 50,
          this.posy + this.img.height - 10,
          (this.xarr[i]["y"] - this.xarr[0]["y"]) * 50,
          this.posy + this.img.height + 10
        );
      }
    }
  };

  /**
   * 車の描画を行う。
   */
  drawCar = () => {
    tint(255);
    image(this.img, this.posx - this.img.width / 2, this.posy);
  };
}
