import { describe, it, expect } from 'vitest'
import {
  SPECIFIC_HEAT_TABLE,
  heatCapacity,
  deltaTemperature,
  calcTemperature,
} from '../vite/simulations/specific-heat-and-heat-capacity/js/logic.js'

describe('比熱と熱容量 - ロジック', () => {
  describe('SPECIFIC_HEAT_TABLE 定数', () => {
    it('アルミニウムの比熱が正しいこと（インデックス0）', () => {
      expect(SPECIFIC_HEAT_TABLE[0]).toBe(901)
    })

    it('鉄の比熱が正しいこと（インデックス1）', () => {
      expect(SPECIFIC_HEAT_TABLE[1]).toBe(448)
    })

    it('銅の比熱が正しいこと（インデックス2）', () => {
      expect(SPECIFIC_HEAT_TABLE[2]).toBe(386)
    })

    it('銀の比熱が正しいこと（インデックス3）', () => {
      expect(SPECIFIC_HEAT_TABLE[3]).toBe(236)
    })

    it('水銀の比熱が正しいこと（インデックス4）', () => {
      expect(SPECIFIC_HEAT_TABLE[4]).toBe(140)
    })
  })

  describe('heatCapacity(m, c)', () => {
    it('熱容量が m * c で計算されること', () => {
      // m=50g, c=901 J/(g·K) → C = 45050 J/K
      expect(heatCapacity(50, 901)).toBe(45050)
    })

    it('質量が2倍になると熱容量も2倍になること', () => {
      expect(heatCapacity(100, 448)).toBe(2 * heatCapacity(50, 448))
    })

    it('比熱が大きいほど熱容量が大きいこと', () => {
      expect(heatCapacity(50, 901)).toBeGreaterThan(heatCapacity(50, 448))
    })
  })

  describe('deltaTemperature(Q, m, c)', () => {
    it('温度上昇が Q / (m * c) で計算されること', () => {
      // Q=1000J, m=100g, c=4.2 J/(g·K) → ΔT = 1000 / 420 ≈ 2.381 K
      expect(deltaTemperature(1000, 100, 4.2)).toBeCloseTo(1000 / 420, 3)
    })

    it('熱量が大きいほど温度上昇が大きいこと', () => {
      expect(deltaTemperature(2000, 100, 4.2)).toBeGreaterThan(
        deltaTemperature(1000, 100, 4.2)
      )
    })

    it('比熱が大きいほど温度上昇が小さいこと（温まりにくい）', () => {
      expect(deltaTemperature(1000, 100, 4.2)).toBeLessThan(
        deltaTemperature(1000, 100, 0.5)
      )
    })

    it('質量が大きいほど温度上昇が小さいこと', () => {
      expect(deltaTemperature(1000, 200, 4.2)).toBeLessThan(
        deltaTemperature(1000, 100, 4.2)
      )
    })
  })

  describe('calcTemperature(T0, Q, m, c)', () => {
    it('加熱後の温度が T0 + ΔT で計算されること', () => {
      const T0 = 300, Q = 1000, m = 100, c = 4.2
      const expected = T0 + deltaTemperature(Q, m, c)
      expect(calcTemperature(T0, Q, m, c)).toBeCloseTo(expected, 5)
    })

    it('Q=0のとき温度が変化しないこと', () => {
      expect(calcTemperature(300, 0, 100, 4.2)).toBe(300)
    })

    it('初期温度T0が加算されること', () => {
      const T1 = calcTemperature(300, 1000, 100, 4.2)
      const T2 = calcTemperature(400, 1000, 100, 4.2)
      expect(T2 - T1).toBeCloseTo(100, 5)
    })
  })
})
