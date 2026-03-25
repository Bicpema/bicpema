/**
 * 開始・停止ボタンの表示を切り替える。
 * @param {boolean} running シミュレーション実行中かどうか
 */
export function updateStartButton(running) {
  const btn = document.getElementById("startButton");
  if (!btn) {
    return;
  }
  if (running) {
    btn.textContent = "⏸ 停止";
    btn.classList.remove("btn-primary");
    btn.classList.add("btn-warning");
  } else {
    btn.textContent = "▶ 開始";
    btn.classList.remove("btn-warning");
    btn.classList.add("btn-primary");
  }
}

/**
 * 密度スライダーの値ラベルを更新する。
 * @param {number} density 密度の値
 */
export function updateDensityLabel(density) {
  const el = document.getElementById("densityValue");
  if (el) {
    el.textContent = density.toFixed(2);
  }
}
