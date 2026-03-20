import { describe, it, expect } from 'vitest'
import {
  carnotEfficiency,
  thermalEfficiency,
  calcHeatOut,
} from '../vite/simulations/heat-engine/js/logic.js'

describe('熱機関 - ロジック', () => {
  describe('carnotEfficiency(T_hot, T_cold)', () => {
    it('カルノー効率が η = 1 - T_cold/T_hot で計算されること', () => {
      // T_hot=500K, T_cold=300K → η = 1 - 300/500 = 0.4
      expect(carnotEfficiency(500, 300)).toBeCloseTo(0.4, 5)
    })

    it('T_cold=0のとき効率が1（理想最大）になること', () => {
      expect(carnotEfficiency(500, 0)).toBe(1)
    })

    it('T_hot = T_cold のとき効率が0になること', () => {
      expect(carnotEfficiency(300, 300)).toBe(0)
    })

    it('低温熱源の温度が低いほど効率が高くなること', () => {
      const eff1 = carnotEfficiency(500, 300)
      const eff2 = carnotEfficiency(500, 200)
      expect(eff2).toBeGreaterThan(eff1)
    })

    it('高温熱源の温度が高いほど効率が高くなること', () => {
      const eff1 = carnotEfficiency(500, 300)
      const eff2 = carnotEfficiency(600, 300)
      expect(eff2).toBeGreaterThan(eff1)
    })
  })

  describe('thermalEfficiency(W, Q_in)', () => {
    it('熱効率が η = W / Q_in で計算されること', () => {
      // W=40J, Q_in=100J → η = 0.4
      expect(thermalEfficiency(40, 100)).toBeCloseTo(0.4, 5)
    })

    it('Q_in=0のとき効率が0を返すこと（ゼロ除算防止）', () => {
      expect(thermalEfficiency(0, 0)).toBe(0)
    })

    it('W=0のとき効率が0であること', () => {
      expect(thermalEfficiency(0, 100)).toBe(0)
    })

    it('W=Q_inのとき効率が1になること', () => {
      expect(thermalEfficiency(100, 100)).toBe(1)
    })
  })

  describe('calcHeatOut(Q_in, W)', () => {
    it('放出熱量が Q_out = Q_in - W で計算されること', () => {
      // Q_in=100J, W=40J → Q_out=60J
      expect(calcHeatOut(100, 40)).toBeCloseTo(60, 5)
    })

    it('W=0のとき全熱量が放出されること', () => {
      expect(calcHeatOut(100, 0)).toBe(100)
    })

    it('W=Q_inのとき放出熱量が0になること', () => {
      expect(calcHeatOut(100, 100)).toBe(0)
    })

    it('エネルギー保存: Q_in = W + Q_out', () => {
      const Q_in = 200, W = 80
      const Q_out = calcHeatOut(Q_in, W)
      expect(Q_in).toBeCloseTo(W + Q_out, 5)
    })
  })
})
