// 波の反射シミュレーション - 状態管理

export const state = {
  t: 0,
  k: 0,
  omega: 0,
  v: 0,
  A: 0,
  running: false,
  reflectX: 0,
  front: 0,
  mode: "free", // "free" or "fixed"
};
