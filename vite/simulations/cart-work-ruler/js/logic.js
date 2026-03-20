// logic.js - 台車と定規のシミュレーション物理計算の純粋関数を提供するファイルです。

/**
 * 台車の接触フェーズにおける1ステップ分の物理更新を行う純粋関数。
 * @param {object} state 現在の状態
 * @param {string} state.phase フェーズ ('approach' | 'contact' | 'stopped')
 * @param {number} state.approachX_px 接近フェーズでの台車左端x座標 (px)
 * @param {number} state.velocity_ms 現在の速度 (m/s)
 * @param {number} state.penetration_m めり込み距離 (m)
 * @param {object} params パラメータ
 * @param {number} params.v0_ms 初速度 (m/s)
 * @param {number} params.force_N 抵抗力 (N)
 * @param {number} params.mass_kg 質量 (kg)
 * @param {number} params.pm ピクセル/メートル変換係数
 * @param {number} params.rulerInitLeft 定規の初期左端x座標 (px)
 * @param {number} params.cartW 台車の幅 (px)
 * @param {number} params.cartContactX 台車の接触開始x座標 (px)
 * @param {number} params.rulerInitLength 定規の初期長さ (px)
 * @param {number} dt タイムステップ (s)
 * @returns {object} 更新後の状態
 */
export function updatePhysics(state, params, dt) {
  const { phase, approachX_px, velocity_ms, penetration_m } = state;
  const { v0_ms, force_N, mass_kg, pm, rulerInitLeft, cartW, cartContactX, rulerInitLength } = params;

  if (phase === 'approach') {
    const newApproachX = approachX_px + v0_ms * pm * dt;
    if (newApproachX + cartW >= rulerInitLeft) {
      return {
        phase: 'contact',
        approachX_px: cartContactX,
        velocity_ms: v0_ms,
        penetration_m: 0,
      };
    }
    return { phase, approachX_px: newApproachX, velocity_ms, penetration_m };
  }

  if (phase === 'contact') {
    const decel = force_N / mass_kg;
    const dv = decel * dt;

    if (velocity_ms <= dv) {
      const tRem = velocity_ms / decel;
      const newPenetration = penetration_m + 0.5 * velocity_ms * tRem;
      return { phase: 'stopped', approachX_px, velocity_ms: 0, penetration_m: newPenetration };
    }

    const vNew = velocity_ms - dv;
    const newPenetration = penetration_m + 0.5 * (velocity_ms + vNew) * dt;
    const maxPen = rulerInitLength / pm;
    if (newPenetration > maxPen) {
      return { phase: 'stopped', approachX_px, velocity_ms: 0, penetration_m: maxPen };
    }
    return { phase, approachX_px, velocity_ms: vNew, penetration_m: newPenetration };
  }

  return state;
}

/**
 * 仕事量を計算する純粋関数。
 * W = F * d
 * @param {number} force_N 力 (N)
 * @param {number} penetration_m めり込み距離 = 移動距離 (m)
 * @returns {number} 仕事量 (J)
 */
export function calculateWork(force_N, penetration_m) {
  return force_N * penetration_m;
}
