import { state } from "./state.js";

/**
 * 物質Aのセレクトボックスの選択値を状態に反映する。
 */
export function onMaterialAChange() {
  state.materialA = parseInt(state.materialSelectA.value(), 10);
}

/**
 * 物質Bのセレクトボックスの選択値を状態に反映する。
 */
export function onMaterialBChange() {
  state.materialB = parseInt(state.materialSelectB.value(), 10);
}

/**
 * 物質Aの質量のセレクトボックスの選択値を状態に反映する。
 */
export function onMassAChange() {
  state.massA = parseInt(state.massSelectA.value(), 10);
}

/**
 * 物質Bの質量のセレクトボックスの選択値を状態に反映する。
 */
export function onMassBChange() {
  state.massB = parseInt(state.massSelectB.value(), 10);
}
