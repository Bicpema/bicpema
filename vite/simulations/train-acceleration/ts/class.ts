// class.ts はクラス管理専用のファイルです。

/**
 * Trainクラス
 * 等加速度直線運動をする電車の速さと位置を管理する。速さは負にならない（後退しない）。
 */
export class Train {
  /** 速さ v (m/s)。0以上 */
  velocity = 0;
  /** 初期位置からの移動距離 x (m)。右が正 */
  position = 0;

  /**
   * 時間 dt だけ運動を進める（v = v0 + at）。
   * 減速の途中で速さが0になる場合は、その時点で停止し、以降は動かない。
   * @param dt - 時間ステップ (s)
   * @param acceleration - 加速度 (m/s²)。正で加速、負で減速
   */
  step(dt: number, acceleration: number): void {
    const next = this.velocity + acceleration * dt;
    if (next >= 0) {
      this.position += ((this.velocity + next) / 2) * dt;
      this.velocity = next;
      return;
    }
    // dt の途中で停止する（acceleration < 0）。停止までの距離は v² / 2|a|
    this.position += (this.velocity * this.velocity) / (2 * -acceleration);
    this.velocity = 0;
  }

  /** 初期状態（位置0・速さ0）へ戻す */
  reset(): void {
    this.velocity = 0;
    this.position = 0;
  }
}
