/**
 * 船の速度入力の値が変更されたときの処理
 */
function onBoatVelocityChange() {
  let newVelocity = parseFloat(boatVelocityInput.value());
  // 入力値のバリデーション
  if (isNaN(newVelocity) || newVelocity < 0) {
    newVelocity = 0;
    boatVelocityInput.value(0);
  } else if (newVelocity > 10) {
    newVelocity = 10;
    boatVelocityInput.value(10);
  }
  if (!boat.isMoving) {
    boat.setBoatVelocity(newVelocity);
  }
}

/**
 * 川の速度入力の値が変更されたときの処理
 */
function onRiverVelocityChange() {
  let newVelocity = parseFloat(riverVelocityInput.value());
  // 入力値のバリデーション
  if (isNaN(newVelocity) || newVelocity < 0) {
    newVelocity = 0;
    riverVelocityInput.value(0);
  } else if (newVelocity > 10) {
    newVelocity = 10;
    riverVelocityInput.value(10);
  }
  if (!boat.isMoving) {
    riverVelocity = newVelocity;
  }
}

/**
 * リセットボタンが押されたときの処理
 */
function onReset() {
  const newBoatVelocity = parseFloat(boatVelocityInput.value());
  riverVelocity = parseFloat(riverVelocityInput.value());
  boat.setBoatVelocity(newBoatVelocity);
  boat.reset();
  boat.start();
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
