/**
 * 反射波クラスです。
 */
class ReflectedWave {
  /**
   * 反射波のコンストラクタです。
   * @param {number} x x座標。
   * @param {number} y y座標。
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

  calculate() {
    if (this.number < this.time - MEDIUM_QUANTITY) {
      if (fixedIs == false) {
        if (this.theta > -30) {
          this.theta--;
        }
      } else {
        if (this.theta < 30) {
          this.theta++;
        }
      }
    } else {
      this.theta = 0;
    }
    this.time += speed;
    this.posy = (height / 100) * sin(radians(6 * this.theta));
  }
}
