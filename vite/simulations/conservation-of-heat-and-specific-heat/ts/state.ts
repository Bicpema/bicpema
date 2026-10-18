import {
  SPECIFIC_HEAT_ALUMINUM,
  SPECIFIC_HEAT_COPPER,
  SPECIFIC_HEAT_IRON,
  SPECIFIC_HEAT_SILVER,
  SPECIFIC_HEAT_WATER
} from "../../../ts/physics/constants.js";
export const state = {
  // 初期温度 [K]
  Thot0: 273 + 95,
  Tcold0: 273 + 15,

  // 熱容量
  C_hot: 0,
  C_cold: 0,

  // 比熱 [J/(g·K)]
  c_Al: SPECIFIC_HEAT_ALUMINUM,
  c_Fe: SPECIFIC_HEAT_IRON,
  c_Cu: SPECIFIC_HEAT_COPPER,
  c_Ag: SPECIFIC_HEAT_SILVER,
  c_w: SPECIFIC_HEAT_WATER,
  c_now: 0,

  // 質量 [g]
  m_Light: 50,
  m_Heavy: 100,
  m_Water: 150,
  m_now: 0,

  // 冷却定数
  heatK: 0.02,

  // 描画用
  cols: 7,
  rows: 6,
  ballR: 8,

  t: 0,

  // 現在温度
  Thot: 0,
  Tcold: 0,
  Teq: 0,

  // グラフ用
  gx: 0,
  gy: 0,
  gw: 0,
  gh: 0,
  tMax: 300,
  Tmin: 250,
  Tmax: 400,

  // 画像
  boxImg: null as p5.Image | null
};
