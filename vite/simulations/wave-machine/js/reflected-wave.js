/**
 * 反射波クラスです。
 */
export class ReflectedWave {
  /**
   * 反射波のコンストラクタです。
   * @param {number} x x座標。
   * @param {number} y y座標。
   * @param {number} t 時間。
   * @param {number} n 番号。
   * @param {boolean} f 固定状態。
   * @param {number} mediumQuantity 媒質の数。
   */
  constructor(x, y, t, n, f, mediumQuantity) {
    this.time = 0;
    this.posx = x;
    this.posy = y;
    this.theta = t;
    this.number = n;
    this.fixed = f;
    this.mediumQuantity = mediumQuantity;
  }

  /**
   * 変位を計算します。
   * @param {number} speed 波の進行速度。
   * @param {boolean} fixedIs 固定状態。
   */
  calculate(speed, fixedIs) {
    if (this.number < this.time - this.mediumQuantity) {
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
