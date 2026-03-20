import { describe, it, expect } from 'vitest'
import {
  calcInternalEnergyChange,
  calcWork,
  calcGasTemperature,
} from '../vite/simulations/first-law-of-thermodynamics/js/logic.js'

describe('熱力学第一法則 - ロジック', () => {
  describe('calcInternalEnergyChange(Q, W)', () => {
    it('ΔU = Q - W が正しく計算されること', () => {
      // Q=100, W=40 → ΔU = 60
      expect(calcInternalEnergyChange(100, 40)).toBeCloseTo(60, 5)
    })

    it('断熱変化（Q=0）ではΔU = -W になること', () => {
      expect(calcInternalEnergyChange(0, 30)).toBeCloseTo(-30, 5)
    })

    it('等積変化（W=0）ではΔU = Q になること', () => {
      expect(calcInternalEnergyChange(100, 0)).toBeCloseTo(100, 5)
    })

    it('Q > W のとき内部エネルギーが増加すること', () => {
      expect(calcInternalEnergyChange(100, 40)).toBeGreaterThan(0)
    })

    it('Q < W のとき内部エネルギーが減少すること', () => {
      expect(calcInternalEnergyChange(10, 40)).toBeLessThan(0)
    })

    it('Q = W のとき内部エネルギーが変化しないこと（等温変化）', () => {
      expect(calcInternalEnergyChange(50, 50)).toBe(0)
    })
  })

  describe('calcWork(P, deltaV)', () => {
    it('W = P * ΔV が正しく計算されること', () => {
      expect(calcWork(1.0, 30)).toBeCloseTo(30, 5)
    })

    it('ΔV=0（等積変化）のとき仕事が0であること', () => {
      expect(calcWork(1.0, 0)).toBe(0)
    })

    it('P=0のとき仕事が0であること', () => {
      expect(calcWork(0, 30)).toBe(0)
    })

    it('ΔVが大きいほど仕事が大きいこと', () => {
      expect(calcWork(1.0, 60)).toBeGreaterThan(calcWork(1.0, 30))
    })
  })

  describe('calcGasTemperature(T0, step, dT_unit)', () => {
    it('step=0のとき基底温度を返すこと', () => {
      expect(calcGasTemperature(1.5, 0, 0.3)).toBeCloseTo(1.5, 5)
    })

    it('温度がstep * dT_unit 分だけ増加すること', () => {
      // T0=1.5, step=3, dT_unit=0.3 → T = 1.5 + 3*0.3 = 2.4
      expect(calcGasTemperature(1.5, 3, 0.3)).toBeCloseTo(2.4, 5)
    })

    it('ステップが増えるほど温度が上がること', () => {
      const T1 = calcGasTemperature(1.5, 1, 0.3)
      const T5 = calcGasTemperature(1.5, 5, 0.3)
      expect(T5).toBeGreaterThan(T1)
    })

    it('dT_unitが大きいほど温度上昇が急になること', () => {
      const T_slow = calcGasTemperature(1.5, 3, 0.1)
      const T_fast = calcGasTemperature(1.5, 3, 0.5)
      expect(T_fast).toBeGreaterThan(T_slow)
    })
  })
})
