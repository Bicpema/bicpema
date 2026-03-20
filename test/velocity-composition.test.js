import { describe, it, expect } from 'vitest'
import { Boat } from '../vite/simulations/velocity-composition/js/class.js'

describe('Boat - 速度の合成', () => {
  it('初期化できること', () => {
    const boat = new Boat(5, 3)
    expect(boat.boatSpeed).toBe(5)
    expect(boat.riverSpeed).toBe(3)
    expect(boat.isMoving).toBe(false)
  })

  it('compositeSpeedが正しく計算されること', () => {
    const boat = new Boat(5, 3)
    expect(boat.compositeSpeed).toBe(8)
  })

  it('boat速度が負のとき合成速度が減ること', () => {
    // 船が上流方向（右向き: -, 川は左向き: +）
    const boat = new Boat(-3, 5) // v合 = 5 + (-3) = 2
    expect(boat.compositeSpeed).toBe(2)
  })

  it('速度が相殺されると静止すること', () => {
    const boat = new Boat(-5, 5) // v合 = 0
    expect(boat.compositeSpeed).toBe(0)
  })

  it('isMovingがfalseのときupdate()は位置を変えないこと', () => {
    const boat = new Boat(5, 3)
    const xBefore = boat.x
    boat.update(1.0)
    expect(boat.x).toBe(xBefore)
  })

  it('isMovingがtrueのときupdate()で位置が更新されること', () => {
    const boat = new Boat(5, 3)
    boat.isMoving = true
    const xBefore = boat.x
    boat.update(1.0)
    // compositeSpeed=8, PX_PER_MPS=20, dx = -8 * 20 * 1 = -160 (左向き)
    expect(boat.x).toBeCloseTo(xBefore - 160, 5)
  })

  it('reset()で初期状態に戻ること', () => {
    const boat = new Boat(5, 3)
    boat.isMoving = true
    boat.update(2.0)
    boat.reset(2, 4)
    expect(boat.boatSpeed).toBe(2)
    expect(boat.riverSpeed).toBe(4)
    expect(boat.isMoving).toBe(false)
  })

  it('川の速度が大きいほど合成速度が大きいこと', () => {
    const slow = new Boat(5, 1)
    const fast = new Boat(5, 10)
    expect(fast.compositeSpeed).toBeGreaterThan(slow.compositeSpeed)
  })
})
