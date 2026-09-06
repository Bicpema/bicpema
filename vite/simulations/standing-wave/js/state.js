// 定在波シミュレーション - 状態管理

import { MARGIN, WAVELENGTH } from "./constants.js";

export const state = {
  t: 0,
  wavelength: WAVELENGTH,
  A: 40,
  k: 0,
  omega: 0,
  v: 0,
  running: false,
  margin: MARGIN,
  innerW: 0,
  innerH: 0,
  rightFront: 0,
  leftFront: 0,
};
