/** 2次元の点（座標系に依存しない単純な組） */
export interface Point {
  /** X座標 */
  x: number;
  /** Y座標 */
  y: number;
}

/** CoordinateSystemの生成オプション */
export interface CoordinateSystemOptions {
  /** 物理座標の原点に対応するピクセルのX座標（既定: 0） */
  originX?: number;
  /** 物理座標の原点に対応するピクセルのY座標（既定: 0） */
  originY?: number;
  /** X方向のスケール（物理量1あたりのピクセル数。既定: 1） */
  scaleX?: number;
  /** Y方向のスケール（物理量1あたりのピクセル数。省略時はscaleXと同じ） */
  scaleY?: number;
  /** 物理座標のY軸を上向きとして扱う（画面のY軸と反転する）か（既定: true） */
  flipY?: boolean;
}

/**
 * 物理座標（m, s など）とピクセル座標を相互変換する、p5非依存の座標系。
 * `drawGrid` / `drawAxes` / グラフ描画などが共通で必要とする
 * 「原点」「スケール」「Y軸の反転」を1か所にまとめる。
 *
 * 変換式（flipY が true の場合）:
 * - px = originX + x * scaleX
 * - py = originY - y * scaleY
 *
 * flipY が false の場合は py = originY + y * scaleY（画面座標のまま）。
 */
export class CoordinateSystem {
  /** 原点のピクセルX座標 */
  readonly originX: number;
  /** 原点のピクセルY座標 */
  readonly originY: number;
  /** X方向のスケール（px/単位） */
  readonly scaleX: number;
  /** Y方向のスケール（px/単位） */
  readonly scaleY: number;
  /** Y軸を上向きとして扱うか */
  readonly flipY: boolean;

  /**
   * 座標系を生成する。
   * @param options - 原点・スケール・Y軸反転の指定。scaleX/scaleYは0にできない
   */
  constructor({
    originX = 0,
    originY = 0,
    scaleX = 1,
    scaleY = scaleX,
    flipY = true
  }: CoordinateSystemOptions = {}) {
    if (scaleX === 0 || scaleY === 0) {
      throw new RangeError("scaleX と scaleY は 0 にできません");
    }
    this.originX = originX;
    this.originY = originY;
    this.scaleX = scaleX;
    this.scaleY = scaleY;
    this.flipY = flipY;
  }

  /**
   * 物理座標のXをピクセルのXへ変換する。
   * @param x - 物理座標のX
   * @returns ピクセルのX座標
   */
  toPxX(x: number): number {
    return this.originX + x * this.scaleX;
  }

  /**
   * 物理座標のYをピクセルのYへ変換する。
   * @param y - 物理座標のY
   * @returns ピクセルのY座標
   */
  toPxY(y: number): number {
    return this.originY + (this.flipY ? -y : y) * this.scaleY;
  }

  /**
   * 物理座標の点をピクセル座標へ変換する。
   * @param x - 物理座標のX
   * @param y - 物理座標のY
   * @returns ピクセル座標の点
   */
  toPx(x: number, y: number): Point {
    return { x: this.toPxX(x), y: this.toPxY(y) };
  }

  /**
   * ピクセルのXを物理座標のXへ変換する。
   * @param px - ピクセルのX座標
   * @returns 物理座標のX
   */
  toPhysX(px: number): number {
    return (px - this.originX) / this.scaleX;
  }

  /**
   * ピクセルのYを物理座標のYへ変換する。
   * @param py - ピクセルのY座標
   * @returns 物理座標のY
   */
  toPhysY(py: number): number {
    const v = (py - this.originY) / this.scaleY;
    return this.flipY ? -v : v;
  }

  /**
   * ピクセル座標の点を物理座標へ変換する（マウス位置の変換などに使う）。
   * @param px - ピクセルのX座標
   * @param py - ピクセルのY座標
   * @returns 物理座標の点
   */
  toPhys(px: number, py: number): Point {
    return { x: this.toPhysX(px), y: this.toPhysY(py) };
  }

  /**
   * X方向の物理的な長さをピクセル長へ変換する（符号なし）。
   * @param length - 物理的な長さ
   * @returns ピクセル長
   */
  lengthToPxX(length: number): number {
    return Math.abs(length * this.scaleX);
  }

  /**
   * Y方向の物理的な長さをピクセル長へ変換する（符号なし）。
   * @param length - 物理的な長さ
   * @returns ピクセル長
   */
  lengthToPxY(length: number): number {
    return Math.abs(length * this.scaleY);
  }

  /**
   * 指定した原点を保ったまま、スケールだけを変えた新しい座標系を返す。
   * @param scaleX - 新しいX方向のスケール
   * @param scaleY - 新しいY方向のスケール（省略時はscaleXと同じ）
   * @returns 新しい座標系
   */
  withScale(scaleX: number, scaleY: number = scaleX): CoordinateSystem {
    return new CoordinateSystem({
      originX: this.originX,
      originY: this.originY,
      scaleX,
      scaleY,
      flipY: this.flipY
    });
  }

  /**
   * ピクセルのX範囲に含まれる、原点を基準にした等間隔の物理座標Xを昇順で返す。
   * 原点を必ず含む位置から左右へ刻むため、既存の `drawGrid` の
   * 「原点から外側へグリッド線を引く」処理を置き換えられる。
   * @param minPx - 範囲の下限（ピクセル）
   * @param maxPx - 範囲の上限（ピクセル）
   * @param step - 物理座標での間隔（正の値）
   * @returns 物理座標Xの配列
   */
  gridValuesX(minPx: number, maxPx: number, step: number): number[] {
    return gridValues(
      this.toPhysX(Math.min(minPx, maxPx)),
      this.toPhysX(Math.max(minPx, maxPx)),
      step
    );
  }

  /**
   * ピクセルのY範囲に含まれる、原点を基準にした等間隔の物理座標Yを昇順で返す。
   * @param minPx - 範囲の下限（ピクセル）
   * @param maxPx - 範囲の上限（ピクセル）
   * @param step - 物理座標での間隔（正の値）
   * @returns 物理座標Yの配列
   */
  gridValuesY(minPx: number, maxPx: number, step: number): number[] {
    return gridValues(
      this.toPhysY(Math.min(minPx, maxPx)),
      this.toPhysY(Math.max(minPx, maxPx)),
      step
    );
  }
}

/**
 * 0を基準に step 刻みで並べた値のうち、[lo, hi] に含まれるものを昇順で返す。
 * @param a - 範囲の一端
 * @param b - 範囲のもう一端
 * @param step - 間隔（正の値）
 * @returns 範囲内の値の配列
 */
function gridValues(a: number, b: number, step: number): number[] {
  if (!(step > 0)) throw new RangeError("step は正の値にしてください");
  const lo = Math.min(a, b);
  const hi = Math.max(a, b);
  const eps = step * 1e-9;
  const first = Math.ceil((lo - eps) / step);
  const last = Math.floor((hi + eps) / step);
  const values: number[] = [];
  for (let i = first; i <= last; i++) values.push(i * step);
  return values;
}
