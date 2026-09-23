// physics.ts は積み上げられた本にはたらく力（重力・垂直抗力とそれぞれの反作用）を
// 計算する専用のファイルです。描画は行いません。

/** 1冊の本にはたらく力の計算結果（すべてN） */
export interface BookForces {
  /** 重力（地球が本を引く力）。反作用の「本が地球を引く力」も同じ大きさになる */
  weight: number;
  /**
   * 本が下から受ける垂直抗力（机、または下の本が支える力）。
   * 反作用の「本が下面を押す力」も同じ大きさになる
   */
  normalFromBelow: number;
}

/**
 * 積み上げられた本それぞれにはたらく重力・垂直抗力を計算する。
 *
 * 本は水平方向にずれず、鉛直方向のみを考える静止状態を仮定する。
 * i冊目（0始まり、0が最下段）は自分自身を含めて自分より上に乗っている
 * (bookCount - i)冊分の重さをすべて支える必要があるため、
 * 最下段に近いほど垂直抗力は大きくなり、重力とは一致しなくなる。
 * 一方、最上段の本には他に力がはたらかないため、重力と垂直抗力は必ず一致する
 * （ただし、これは「たまたま釣り合っている」だけで作用反作用の関係ではない）。
 *
 * @param bookCount 積み上げられている本の冊数
 * @param massPerBook 本1冊あたりの質量 (kg)
 * @param gravity 重力加速度 (m/s^2)
 * @returns インデックス0（最下段）から順に並んだ力の配列
 */
export function computeBookForces(
  bookCount: number,
  massPerBook: number,
  gravity: number
): BookForces[] {
  const forces: BookForces[] = [];
  const weight = massPerBook * gravity;

  for (let i = 0; i < bookCount; i += 1) {
    const booksSupportedAbove = bookCount - i; // 自分自身を含め、自分が支えている本の冊数
    forces.push({
      weight,
      normalFromBelow: weight * booksSupportedAbove
    });
  }

  return forces;
}

/**
 * 現在の本の状態から、描画に必要な力の最大値（矢印のスケール計算に使う）を求める。
 * 垂直抗力は最下段が最大になるため、配列の先頭（存在すれば）を見れば十分。
 * @param forces computeBookForcesの結果
 */
export function getMaxForceValue(forces: BookForces[]): number {
  if (forces.length === 0) return 0;
  // 最下段（インデックス0）の垂直抗力が全体の最大値になる
  return Math.max(forces[0].normalFromBelow, forces[0].weight);
}
