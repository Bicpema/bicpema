import { describe, it, expect } from 'vitest'
import { SlopeCart } from '../vite/simulations/slope-cart-motion/js/class.js'

describe('SlopeCart - 斜面を下る台車', () => {
  it('初期化できること', () => {
    const cart = new SlopeCart(30, 1.1)
    expect(cart.angleDeg).toBe(30)
    expect(cart.slopeLengthM).toBe(1.1)
    expect(cart.time).toBe(0)
    expect(cart.s).toBe(0)
    expect(cart.v).toBe(0)
    expect(cart.isAtBottom).toBe(false)
  })

  it('加速度が正しく計算されること（a = g*sin(θ)）', () => {
    const cart = new SlopeCart(30, 1.1)
    // a = 9.8 * sin(30°) = 9.8 * 0.5 = 4.9 m/s²
    expect(cart.accel).toBeCloseTo(4.9, 3)
  })

  it('update()で変位と速度が正しく計算されること', () => {
    const cart = new SlopeCart(30, 5.0) // 長い斜面
    cart.update(1.0)
    // s = 0.5 * a * t^2 = 0.5 * 4.9 * 1 = 2.45 m
    expect(cart.s).toBeCloseTo(2.45, 3)
    // v = a * t = 4.9 * 1 = 4.9 m/s
    expect(cart.v).toBeCloseTo(4.9, 3)
    expect(cart.time).toBeCloseTo(1.0, 5)
  })

  it('斜面下端に達したら停止すること', () => {
    const cart = new SlopeCart(30, 1.1)
    // 十分な時間で更新
    for (let i = 0; i < 100; i++) cart.update(0.1)
    expect(cart.isAtBottom).toBe(true)
  })

  it('isAtBottomのときupdate()は状態を変えないこと', () => {
    const cart = new SlopeCart(30, 1.1)
    for (let i = 0; i < 100; i++) cart.update(0.1)
    const sBefore = cart.s
    cart.update(1.0)
    expect(cart.s).toBe(sBefore)
  })

  it('reset()で初期状態に戻ること', () => {
    const cart = new SlopeCart(30, 1.1)
    cart.update(1.0)
    cart.reset()
    expect(cart.time).toBe(0)
    expect(cart.s).toBe(0)
    expect(cart.v).toBe(0)
    expect(cart.isAtBottom).toBe(false)
  })

  it('setAngle()で角度と加速度が更新されること', () => {
    const cart = new SlopeCart(30, 1.1)
    cart.update(0.5)
    cart.setAngle(45)
    expect(cart.angleDeg).toBe(45)
    // a = 9.8 * sin(45°) ≈ 6.929 m/s²
    expect(cart.accel).toBeCloseTo(9.8 * Math.sin(Math.PI / 4), 3)
    // reset されているはず
    expect(cart.time).toBe(0)
    expect(cart.s).toBe(0)
  })

  it('45度の加速度が30度より大きいこと', () => {
    const cart30 = new SlopeCart(30, 5.0)
    const cart45 = new SlopeCart(45, 5.0)
    expect(cart45.accel).toBeGreaterThan(cart30.accel)
  })
})
