// elementFunction.jsは仮想DOMメソッド管理専用のファイルです。

/**
 * 質量入力が変更されたときの処理
 */
function onMassChange() {
  let m = parseFloat(massInput.value());
  if (isNaN(m) || m < 0.5) {
    m = 0.5;
    massInput.value(0.5);
  } else if (m > 5) {
    m = 5;
    massInput.value(5);
  }
  cart.mass = m;
  cart.reset();
}

/**
 * リセットボタンが押されたときの処理
 */
function onReset() {
  cart.reset();
}

/**
 * 設定モーダルを開閉するときの処理
 */
function onToggleModal() {
  const currentDisplay = settingsModal.style("display");
  settingsModal.style("display", currentDisplay === "none" ? "block" : "none");
}

/**
 * 設定モーダルを閉じるときの処理
 */
function onCloseModal() {
  settingsModal.style("display", "none");
}
