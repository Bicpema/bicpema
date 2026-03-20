import { describe, it, expect } from 'vitest'
import { updatePhysics, calculateWork } from '../vite/simulations/cart-work-ruler/js/logic.js'

const BASE_PARAMS = {
  v0_ms: 1.0,
  force_N: 10,
  mass_kg: 1.0,
  pm: 400,
  rulerInitLeft: 510,
  cartW: 155,
  cartContactX: 355, // RULER_INIT_LEFT - CART_W
  rulerInitLength: 220,
}

describe('updatePhysics - 台車と定規の物理更新', () => {
  it('approachフェーズ: 台車が前進すること', () => {
    const state = { phase: 'approach', approachX_px: 30, velocity_ms: 1.0, penetration_m: 0 }
    const next = updatePhysics(state, BASE_PARAMS, 0.1)
    // approachX_px = 30 + 1.0 * 400 * 0.1 = 70
    expect(next.approachX_px).toBeCloseTo(70, 3)
    expect(next.phase).toBe('approach')
    expect(next.penetration_m).toBe(0)
  })

  it('approachフェーズ: 定規に到達したらcontactに移行すること', () => {
    // approachX_px + cartW >= rulerInitLeft → 510
    const state = { phase: 'approach', approachX_px: 360, velocity_ms: 1.0, penetration_m: 0 }
    // 360 + 400*0.1 = 400 < 355? No. Actually 360 + cartW(155) = 515 > 510
    const state2 = { phase: 'approach', approachX_px: 354, velocity_ms: 1.0, penetration_m: 0 }
    // 354 + 155 = 509 < 510 → still approach
    const next1 = updatePhysics(state2, BASE_PARAMS, 0.001)
    // 354 + 1*400*0.001 = 354.4 + 155 = 509.4 < 510 → still approach
    expect(next1.phase).toBe('approach')
    // now push past the contact threshold
    const state3 = { phase: 'approach', approachX_px: 355, velocity_ms: 1.0, penetration_m: 0 }
    const next2 = updatePhysics(state3, BASE_PARAMS, 0.001)
    // 355 + 155 = 510 >= 510 → contact
    expect(next2.phase).toBe('contact')
    expect(next2.approachX_px).toBe(BASE_PARAMS.cartContactX)
    expect(next2.velocity_ms).toBe(1.0)
  })

  it('contactフェーズ: めり込み距離が増加すること', () => {
    const state = { phase: 'contact', approachX_px: 355, velocity_ms: 1.0, penetration_m: 0 }
    const next = updatePhysics(state, BASE_PARAMS, 0.1)
    // decel = 10/1 = 10, dv = 1.0, vNew = 0 → stops
    expect(next.phase).toBe('stopped')
    expect(next.velocity_ms).toBe(0)
    expect(next.penetration_m).toBeGreaterThan(0)
  })

  it('contactフェーズ: 速度が減少すること', () => {
    const state = { phase: 'contact', approachX_px: 355, velocity_ms: 5.0, penetration_m: 0 }
    const next = updatePhysics(state, BASE_PARAMS, 0.1)
    // decel=10, dv=1, vNew=4
    expect(next.velocity_ms).toBeCloseTo(4.0, 5)
    expect(next.phase).toBe('contact')
  })

  it('stoppedフェーズ: 状態が変化しないこと', () => {
    const state = { phase: 'stopped', approachX_px: 355, velocity_ms: 0, penetration_m: 0.1 }
    const next = updatePhysics(state, BASE_PARAMS, 0.1)
    expect(next).toEqual(state)
  })
})

describe('calculateWork - 仕事量の計算', () => {
  it('W = F * d が正しく計算されること', () => {
    expect(calculateWork(10, 0.5)).toBeCloseTo(5.0, 5)
  })

  it('移動距離が0のとき仕事量は0であること', () => {
    expect(calculateWork(100, 0)).toBe(0)
  })

  it('力が0のとき仕事量は0であること', () => {
    expect(calculateWork(0, 0.5)).toBe(0)
  })
})
