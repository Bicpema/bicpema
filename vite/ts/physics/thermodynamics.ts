/** 熱力学の計算（副作用のない純粋関数）。 */

import { AVOGADRO_CONSTANT, BOLTZMANN_CONSTANT } from "./constants.js";

/**
 * 熱容量。C = m c
 * @param mass - 質量 m
 * @param specificHeat - 比熱 c
 */
export function computeHeatCapacity(mass: number, specificHeat: number) {
  return mass * specificHeat;
}

/**
 * 与えた熱量による温度変化。ΔT = Q / (m c)
 * @returns 温度変化。熱容量が0以下のとき 0
 */
export function computeTemperatureChange(
  heat: number,
  mass: number,
  specificHeat: number
) {
  const capacity = computeHeatCapacity(mass, specificHeat);
  return capacity > 0 ? heat / capacity : 0;
}

/**
 * 熱平衡温度（熱の出入りが物体間のみの場合）。
 * T = (C1 T1 + C2 T2) / (C1 + C2)
 * @param c1 - 物体1の熱容量
 * @param t1 - 物体1の温度
 * @param c2 - 物体2の熱容量
 * @param t2 - 物体2の温度
 * @returns 熱平衡温度。熱容量の和が0以下のとき NaN
 */
export function computeEquilibriumTemperature(
  c1: number,
  t1: number,
  c2: number,
  t2: number
) {
  const total = c1 + c2;
  return total > 0 ? (c1 * t1 + c2 * t2) / total : NaN;
}

/**
 * 熱力学第一法則。ΔU = Q + W（Wは気体がされた仕事）
 */
export function computeInternalEnergyChange(
  heatIn: number,
  workDoneOn: number
) {
  return heatIn + workDoneOn;
}

/**
 * 熱機関の熱効率。e = W / Qin = (Qin − Qout) / Qin
 * @returns 熱効率。Qin が0以下のとき 0
 */
export function computeThermalEfficiency(heatIn: number, heatOut: number) {
  return heatIn > 0 ? (heatIn - heatOut) / heatIn : 0;
}

/**
 * 単原子分子理想気体の分子の二乗平均速度。√(3kT/m)
 * @param temperature - 絶対温度 T (K)
 * @param molarMass - モル質量 (kg/mol)
 */
export function computeRmsSpeed(temperature: number, molarMass: number) {
  const moleculeMass = molarMass / AVOGADRO_CONSTANT;
  return Math.sqrt((3 * BOLTZMANN_CONSTANT * temperature) / moleculeMass);
}
