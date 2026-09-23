// element-function.js は仮想 DOM メソッド管理専用のファイルです。

import { state } from "./state.js";
import { computeThermodynamicState } from "./physics.js";
import { PISTON_INIT_X, DT_UNIT, DV_UNIT } from "./constants.js";
import {
  getCheckedRadioValue,
  setCheckedRadioByValue
} from "../../../js/bicpema-dom.js";

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

  setCheckedRadioByValue("qValue", "0");
}

/**
 * Q選択ラジオボタンが変更されたときの処理。
 */
export function onQRadioChange() {
  const selected = getCheckedRadioValue("qValue");
  if (selected === null) return;
  const step = parseInt(selected, 10);

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
