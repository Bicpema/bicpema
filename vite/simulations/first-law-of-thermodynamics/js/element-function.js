// element-function.js は仮想 DOM メソッド管理専用のファイルです。

import { state } from "./state.js";
import { computeThermodynamicState } from "./physics.js";

// 座標は元の820px幅から仮想1000px幅にスケール済み (×1000/820 ≈ 1.22)
const PISTON_INIT_X = 512; // 元: 420
const DT_UNIT = 0.3;
const DV_UNIT = 37; // 元: 30、仮想1000px幅へのスケール値

/**
 * リセットボタンがクリックされたときの処理。
 */
export function onResetButtonClick() {
  state.step = 0;
  state.Q = 0;
  state.W = 0;
  state.dU = 0;
  state.T = state.T0;
  state.pistonX_target = PISTON_INIT_X;

  const qRadios = document.querySelectorAll('input[name="qValue"]');
  qRadios.forEach((r) => {
    r.checked = r.value === "0";
  });
}

/**
 * 設定モーダルの表示を切り替える。
 */
export function onToggleModalClick() {
  const modal = document.getElementById("settingsModal");
  modal.style.display = modal.style.display === "none" ? "block" : "none";
}

/**
 * 設定モーダルを閉じる。
 */
export function onCloseModalClick() {
  document.getElementById("settingsModal").style.display = "none";
}

/**
 * Q選択ラジオボタンが変更されたときの処理。
 */
export function onQRadioChange() {
  const selected = document.querySelector('input[name="qValue"]:checked');
  if (!selected) return;
  const step = parseInt(selected.value, 10);

  const { Q, W, dU, T, pistonXTarget } = computeThermodynamicState(
    step,
    state.T0,
    PISTON_INIT_X,
    DT_UNIT,
    DV_UNIT
  );

  state.step = step;
  state.Q = Q;
  state.W = W;
  state.dU = dU;
  state.T = T;
  state.pistonX_target = pistonXTarget;
}
