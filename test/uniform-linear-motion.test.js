import { describe, it, expect } from 'vitest'
import { CAR } from '../vite/simulations/uniform-linear-motion/js/class.js'

describe('CAR - 等速直線運動', () => {
  it('初期化できること', () => {
    const car = new CAR(0, 100, null, 3, [], [])
    expect(car.posx).toBe(0)
    expect(car.posy).toBe(100)
    expect(car.speed).toBe(3)
    expect(car.xarr).toEqual([])
    expect(car.varr).toEqual([])
  })

  it('update()でposx が増加すること', () => {
    const car = new CAR(0, 100, null, 3, [], [])
    car.update()
    // dx = 50 * speed / 60 = 50 * 3 / 60 = 2.5
    expect(car.posx).toBeCloseTo(2.5, 5)
  })

  it('速度が大きいほど移動量が多いこと', () => {
    const slow = new CAR(0, 100, null, 2, [], [])
    const fast = new CAR(0, 100, null, 6, [], [])
    slow.update()
    fast.update()
    expect(fast.posx).toBeGreaterThan(slow.posx)
  })

  it('複数ステップで累積移動すること', () => {
    const car = new CAR(0, 100, null, 3, [], [])
    car.update()
    car.update()
    car.update()
    // dx per frame = 2.5, total = 7.5
    expect(car.posx).toBeCloseTo(7.5, 5)
  })

  it('速度0のとき移動しないこと', () => {
    const car = new CAR(50, 100, null, 0, [], [])
    car.update()
    expect(car.posx).toBe(50)
  })
})
