/**
 * ばね定数スライダーの値が変更されたときの処理
 */
function onSpringConstantChange() {
  const k = parseInt(springConstantInput.value());
  springConstantDisplay.html(`${k} N/m`);
  for (const spring of springs) {
    spring.updateK(k);
  }
}

/**
 * リセットボタンが押されたときの処理
 */
function onReset() {
  for (const spring of springs) {
    spring.reset();
  }
}

/**
 * モーダルを表示/非表示
 */
function onToggleModal() {
  const currentDisplay = settingsModal.style("display");
  if (currentDisplay === "none") {
    settingsModal.style("display", "block");
  } else {
    settingsModal.style("display", "none");
  }
}

/**
 * モーダルを閉じる
 */
function onCloseModal() {
  settingsModal.style("display", "none");
}
