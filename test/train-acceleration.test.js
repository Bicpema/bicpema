import { describe, it, expect } from 'vitest'
import { Train, TRAIN_HALF_W } from '../vite/simulations/train-acceleration/js/class.js'

describe('Train - 電車の加速', () => {
  it('初期化できること', () => {
    const train = new Train(333)
    expect(train.startX).toBe(333)
    expect(train.x).toBe(333)
    expect(train.velocity).toBe(0)
    expect(train.trackOffset).toBe(0)
  })

  it('update()で速度と位置が正しく更新されること', () => {
    const train = new Train(0)
    // dt=1s, a=2 m/s², pxPerMeter=50, vw=1000
    train.update(1.0, 2.0, 50, 1000)
    expect(train.velocity).toBeCloseTo(2.0, 5)
    // dx = v * pxPerMeter * dt = 2 * 50 * 1 = 100px
    expect(train.x).toBeCloseTo(100, 5)
    expect(train.trackOffset).toBeCloseTo(100, 5)
  })

  it('速度が負にならないこと（減速時）', () => {
    const train = new Train(0)
    train.velocity = 1.0
    train.update(1.0, -5.0, 50, 1000)
    expect(train.velocity).toBe(0)
  })

  it('複数ステップ更新が累積されること', () => {
    const train = new Train(0)
    train.update(1.0, 2.0, 50, 1000)
    train.update(1.0, 2.0, 50, 1000)
    // after 2s: v = 4 m/s, x = 100 + 200 = 300px
    expect(train.velocity).toBeCloseTo(4.0, 5)
    expect(train.x).toBeCloseTo(300, 5)
  })

  it('右端を超えたら左端に折り返すこと', () => {
    const train = new Train(0)
    train.x = 1101 // > vw(1000) + TRAIN_HALF_W(100)
    train.update(0.001, 0, 50, 1000)
    expect(train.x).toBe(-TRAIN_HALF_W)
  })

  it('reset()で初期状態に戻ること', () => {
    const train = new Train(300)
    train.update(3.0, 5.0, 50, 1000)
    train.reset()
    expect(train.x).toBe(300)
    expect(train.velocity).toBe(0)
    expect(train.trackOffset).toBe(0)
  })
})
