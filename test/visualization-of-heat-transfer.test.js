import { describe, it, expect } from 'vitest'
import {
  calcEquilibriumTemp,
  calcTempAtTime,
} from '../vite/simulations/visualization-of-heat-transfer/js/logic.js'

describe('熱移動の可視化 - ロジック', () => {
  describe('calcEquilibriumTemp(C_hot, C_cold, Thot0, Tcold0)', () => {
    it('同じ熱容量なら中間温度になること', () => {
      const Teq = calcEquilibriumTemp(2.0, 2.0, 373, 50)
      expect(Teq).toBeCloseTo((373 + 50) / 2, 5)
    })

    it('平衡温度が高温・低温の間に収まること', () => {
      const Teq = calcEquilibriumTemp(2.0, 2.0, 373, 50)
      expect(Teq).toBeGreaterThan(50)
      expect(Teq).toBeLessThan(373)
    })

    it('熱容量が大きい方が平衡温度を支配すること', () => {
      // 低温の熱容量が大きい → 平衡温度は低温寄りになる
      const Teq = calcEquilibriumTemp(1.0, 10.0, 373, 50)
      expect(Teq).toBeLessThan(100) // 低温寄り
    })

    it('熱量保存則が成立すること', () => {
      const C_hot = 2.0, C_cold = 2.0, Thot0 = 373, Tcold0 = 50
      const Teq = calcEquilibriumTemp(C_hot, C_cold, Thot0, Tcold0)
      const qLoss = C_hot * (Thot0 - Teq)
      const qGain = C_cold * (Teq - Tcold0)
      expect(qLoss).toBeCloseTo(qGain, 5)
    })
  })

  describe('calcTempAtTime(Teq, T0, k, t)', () => {
    it('t=0のとき初期温度を返すこと', () => {
      expect(calcTempAtTime(211.5, 373, 0.02, 0)).toBeCloseTo(373, 5)
    })

    it('時間経過で平衡温度へ近づくこと', () => {
      const Teq = 211.5, T0 = 373, k = 0.02
      const T50 = calcTempAtTime(Teq, T0, k, 50)
      const T100 = calcTempAtTime(Teq, T0, k, 100)
      // 高温物質は冷える
      expect(T50).toBeLessThan(T0)
      expect(T100).toBeLessThan(T50)
    })

    it('k=0のとき温度が変化しないこと', () => {
      // k=0 → exp(0) = 1 → T = Teq + (T0 - Teq) = T0
      expect(calcTempAtTime(211.5, 373, 0, 100)).toBeCloseTo(373, 5)
    })

    it('冷却定数kが大きいほど早く平衡に達すること', () => {
      const Teq = 211.5, T0 = 373, t = 50
      const T_slow = calcTempAtTime(Teq, T0, 0.01, t)
      const T_fast = calcTempAtTime(Teq, T0, 0.05, t)
      // fast は Teq に近い
      expect(Math.abs(T_fast - Teq)).toBeLessThan(Math.abs(T_slow - Teq))
    })
  })
})
