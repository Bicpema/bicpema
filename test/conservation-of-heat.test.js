import { describe, it, expect } from 'vitest'
import {
  SPECIFIC_HEAT,
  heatCapacity,
  calcEquilibriumTemp,
  calcTempAtTime,
} from '../vite/simulations/conservation-of-heat-and-specific-heat/js/logic.js'

describe('熱量の保存と比熱 - ロジック', () => {
  describe('SPECIFIC_HEAT 定数', () => {
    it('アルミニウムの比熱が正しいこと', () => {
      expect(SPECIFIC_HEAT.Al).toBeCloseTo(0.901, 3)
    })

    it('鉄の比熱が正しいこと', () => {
      expect(SPECIFIC_HEAT.Fe).toBeCloseTo(0.448, 3)
    })

    it('銅の比熱が正しいこと', () => {
      expect(SPECIFIC_HEAT.Cu).toBeCloseTo(0.386, 3)
    })

    it('銀の比熱が正しいこと', () => {
      expect(SPECIFIC_HEAT.Ag).toBeCloseTo(0.236, 3)
    })
  })

  describe('heatCapacity(c, m)', () => {
    it('熱容量が C = c * m で計算されること', () => {
      // c=0.448, m=100g → C = 44.8 J/K
      expect(heatCapacity(0.448, 100)).toBeCloseTo(44.8, 5)
    })

    it('質量0のとき熱容量が0であること', () => {
      expect(heatCapacity(0.901, 0)).toBe(0)
    })

    it('質量が大きいほど熱容量が大きいこと', () => {
      expect(heatCapacity(0.448, 100)).toBeGreaterThan(heatCapacity(0.448, 50))
    })
  })

  describe('calcEquilibriumTemp(C_hot, C_cold, Thot0, Tcold0)', () => {
    it('同じ熱容量なら平均温度になること', () => {
      const Teq = calcEquilibriumTemp(1.0, 1.0, 400, 300)
      expect(Teq).toBeCloseTo(350, 5)
    })

    it('熱量保存則: C_hot*(Teq-Tcold0) = C_cold*(Thot0-Teq)', () => {
      const C_hot = 44.8, C_cold = 630, Thot0 = 368, Tcold0 = 288
      const Teq = calcEquilibriumTemp(C_hot, C_cold, Thot0, Tcold0)
      // 熱量保存: C_hot*(Teq - Tcold0) ≈ C_cold*(Thot0 - Teq)
      const qGain = C_cold * (Teq - Tcold0)
      const qLoss = C_hot * (Thot0 - Teq)
      expect(qGain).toBeCloseTo(qLoss, 3)
    })

    it('平衡温度がThot0とTcold0の間であること', () => {
      const Teq = calcEquilibriumTemp(50, 100, 500, 300)
      expect(Teq).toBeGreaterThan(300)
      expect(Teq).toBeLessThan(500)
    })
  })

  describe('calcTempAtTime(Teq, T0, k_eff, t)', () => {
    it('t=0のとき初期温度を返すこと', () => {
      expect(calcTempAtTime(350, 400, 0.02, 0)).toBeCloseTo(400, 5)
    })

    it('t→∞で平衡温度に近づくこと', () => {
      // k_eff=0.1, t=1000 → exp(-100) ≈ 0 → T ≈ Teq
      expect(calcTempAtTime(350, 400, 0.1, 1000)).toBeCloseTo(350, 3)
    })

    it('時間が経つにつれて高温物質が冷えること', () => {
      const Teq = 350, T0 = 400, k = 0.05
      const T1 = calcTempAtTime(Teq, T0, k, 10)
      const T2 = calcTempAtTime(Teq, T0, k, 20)
      // 高温物質（T0 > Teq）は時間とともに冷える
      expect(T1).toBeGreaterThan(T2)
      expect(T2).toBeGreaterThan(Teq)
    })

    it('時間が経つにつれて低温物質が温まること', () => {
      const Teq = 350, T0 = 300, k = 0.05
      const T1 = calcTempAtTime(Teq, T0, k, 10)
      const T2 = calcTempAtTime(Teq, T0, k, 20)
      // 低温物質（T0 < Teq）は時間とともに温まる
      expect(T1).toBeLessThan(T2)
      expect(T2).toBeLessThan(Teq)
    })
  })
})
