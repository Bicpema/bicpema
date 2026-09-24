/**
 * 密度スライダーの値ラベルを更新する。
 * @param {number} density 密度の値
 */
export function updateDensityLabel(density: number) {
  const el = document.getElementById("densityValue");
  if (el) {
    el.textContent = density.toFixed(2);
  }
}
