/**
 * 媒質クラスです。
 */
export class Medium {
  /**
   * コンストラクタです。
   * @param {number} x x方向の位置。
   * @param {number} y y方向の位置。
   * @param {number} n 媒質の番号。
   * @param {IncidentWave[]} incidentWave 入射波の配列。
   * @param {ReflectedWave[]} reflectedWave 反射波の配列。
   * @param {number} mediumQuantity 媒質の数。
   */
  constructor(x, y, n, incidentWave, reflectedWave, mediumQuantity) {
    this.posx = x;
    this.posy = y;
    this.number = n;
    this.incidentWave = incidentWave;
    this.reflectedWave = reflectedWave;
    this.mediumQuantity = mediumQuantity;
  }

  /**
   * 媒質における変位を計算します。
   */
  calculate() {
    let sum = 0;
    for (let i = 0; i < this.incidentWave.length; i++) {
      if (i % this.mediumQuantity == this.number) {
        sum += this.incidentWave[i].posy;
      }
    }
    for (let i = 0; i < this.reflectedWave.length; i++) {
      if (i % this.mediumQuantity == this.number) {
        sum += this.reflectedWave[i].posy;
      }
    }
    this.posy = sum;
  }

  /**
   * 媒質を表示します。
   */
  display() {
    strokeWeight(5);
    stroke(0);
    line(
      this.posx + 100,
      this.posy + height / 2,
      (this.number * (width - 200)) / this.mediumQuantity + 100,
      height / 2
    );
    strokeWeight(1);
    noStroke();
    fill(255, 255, 0);
    ellipse(this.posx + 100, this.posy + height / 2, 10, 10);
  }
}
