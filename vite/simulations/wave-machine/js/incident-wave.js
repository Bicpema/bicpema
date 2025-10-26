/**
 * 入射波クラスです。
 */
export class IncidentWave {
  /**
   * コンストラクタです。
   * @param {number} x x方向の位置。
   * @param {number} y y方向の位置。
   * @param {number} t 時間。
   * @param {number} n 番号。
   * @param {boolean} f 固定状態。
   */
  constructor(x, y, t, n, f) {
    this.time = 0;
    this.posx = x;
    this.posy = y;
    this.theta = t;
    this.number = n;
    this.fixed = f;
  }

  /**
   * 変位を計算します。
   * @param {number} speed 波の進行速度。
   */
  calculate(speed) {
    if (this.number < this.time) {
      if (this.theta > -30) {
        this.theta--;
      }
    } else {
      this.theta = 0;
    }
    this.time += speed;
    this.posy = (height / 100) * sin(radians(6 * this.theta));
  }
}
