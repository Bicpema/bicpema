// element-function.js は仮想 DOM メソッド管理専用のファイルです。

import { state } from './state.js';

/**
 * 物質選択が変更されたときの処理。
 * @param {string} value - 選択された物質の値 (0:Al, 1:Fe, 2:Cu, 3:Ag)
 */
export function onMaterialChange(value) {
  state.selectedMaterial = value;
}

/**
 * 質量選択が変更されたときの処理。
 * @param {string} value - 選択された質量の値 (1:50g, 0:100g)
 */
export function onMassChange(value) {
  state.selectedMass = value;
}

/**
 * 接触状態が変更されたときの処理。
 * @param {string} value - 接触状態の値 (0:接触させる, 1:接触前に戻す)
 */
export function onContactStateChange(value) {
  state.contactState = value;
  if (value === '1') {
    resetSimulationState();
  }
}

/**
 * リセットボタンがクリックされたときの処理。
 */
export function onReset() {
  resetSimulationState();
  state.contactState = '1';
  const contactSelect = document.getElementById('contactStateSelect');
  if (contactSelect) contactSelect.value = '1';
}

/**
 * シミュレーションの温度状態をリセットする。
 */
function resetSimulationState() {
  state.t = 0;
  state.Thot = state.Thot0;
  state.Tcold = state.Tcold0;
}
