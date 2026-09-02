/**
 * 変圧器の巻数比から二次電圧の振幅を計算する。
 * V2 = V1 × (N2 / N1)
 * @param {number} primaryVoltage 一次電圧の振幅 V1
 * @param {number} primaryTurns 一次コイルの巻数 N1
 * @param {number} secondaryTurns 二次コイルの巻数 N2
 * @returns {number} 二次電圧の振幅 V2
 */
export function computeSecondaryVoltage(
  primaryVoltage,
  primaryTurns,
  secondaryTurns
) {
  return primaryVoltage * (secondaryTurns / primaryTurns);
}

/**
 * 変圧器の巻数比から二次電流の振幅を計算する。
 * I2 = I1 × (N1 / N2)。逆位相の場合は符号が反転する。
 * @param {number} primaryCurrentAmplitude 一次電流の振幅 I1
 * @param {number} primaryTurns 一次コイルの巻数 N1
 * @param {number} secondaryTurns 二次コイルの巻数 N2
 * @param {boolean} inPhase 同位相かどうか
 * @returns {number} 二次電流の振幅 I2（符号付き）
 */
export function computeSecondaryCurrentAmplitude(
  primaryCurrentAmplitude,
  primaryTurns,
  secondaryTurns,
  inPhase
) {
  const magnitude = primaryCurrentAmplitude * (primaryTurns / secondaryTurns);
  return inPhase ? magnitude : -magnitude;
}
