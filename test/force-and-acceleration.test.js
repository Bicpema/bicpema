import { describe, it, expect } from 'vitest'
import { Cart } from '../vite/simulations/force-and-acceleration/js/class.js'

describe('Cart - 力と加速度の関係', () => {
  it('初期化できること', () => {
    const cart = new Cart(250, 1.0)
    expect(cart.initialX).toBe(250)
    expect(cart.x).toBe(250)
    expect(cart.mass).toBe(1.0)
    expect(cart.velocity).toBe(0)
    expect(cart.force).toBe(0)
    expect(cart.acceleration).toBe(0)
  })

  it('rightEdgeが正しく計算されること', () => {
    const cart = new Cart(250, 1.0)
    expect(cart.rightEdge).toBe(250 + cart.BODY_W / 2)
  })

  it('leftEdgeが正しく計算されること', () => {
    const cart = new Cart(250, 1.0)
    expect(cart.leftEdge).toBe(250 - cart.BODY_W / 2)
  })

  it('update()で加速度が正しく計算されること（F = ma）', () => {
    const cart = new Cart(0, 2.0)
    cart.force = 4.0
    cart.update(1.0, 60)
    // a = F/m = 4/2 = 2 m/s²
    expect(cart.acceleration).toBeCloseTo(2.0, 5)
  })

  it('update()で速度が正しく更新されること', () => {
    const cart = new Cart(0, 1.0)
    cart.force = 1.0 // a = 1 m/s²
    cart.update(1.0, 60)
    expect(cart.velocity).toBeCloseTo(1.0, 5)
  })

  it('update()で位置が正しく更新されること', () => {
    const cart = new Cart(0, 1.0)
    cart.force = 1.0
    cart.update(1.0, 60)
    // v = 1 m/s, dx = v * pxPerMeter * dt = 1 * 60 * 1 = 60px
    expect(cart.x).toBeCloseTo(60, 5)
  })

  it('速度が負にならないこと', () => {
    const cart = new Cart(100, 1.0)
    cart.velocity = 0.5
    cart.force = -10.0 // 逆向きの力
    cart.update(1.0, 60)
    expect(cart.velocity).toBe(0)
  })

  it('reset()で初期状態に戻ること', () => {
    const cart = new Cart(250, 1.0)
    cart.force = 5.0
    cart.update(1.0, 60)
    cart.reset()
    expect(cart.x).toBe(250)
    expect(cart.velocity).toBe(0)
    expect(cart.force).toBe(0)
    expect(cart.acceleration).toBe(0)
  })

  it('質量が大きいほど加速度が小さいこと', () => {
    const light = new Cart(0, 1.0)
    const heavy = new Cart(0, 5.0)
    light.force = 10
    heavy.force = 10
    light.update(1.0, 60)
    heavy.update(1.0, 60)
    expect(light.acceleration).toBeGreaterThan(heavy.acceleration)
  })
})
