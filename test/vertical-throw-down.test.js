import { describe, it, expect } from 'vitest'
import { Ball } from '../vite/simulations/vertical-throw-down/js/class.js'

describe('Ball - 鉛直投げ下ろし運動', () => {
  it('初期化できること', () => {
    const ball = new Ball(50, 0)
    expect(ball.initialHeight).toBe(50)
    expect(ball.initialVelocity).toBe(0)
    expect(ball.height).toBe(50)
    expect(ball.velocity).toBe(0)
    expect(ball.time).toBe(0)
    expect(ball.isMoving).toBe(false)
  })

  it('isMovingがfalseのときupdate()は状態を変えないこと', () => {
    const ball = new Ball(50, 0)
    ball.update(1.0)
    expect(ball.time).toBe(0)
    expect(ball.height).toBe(50)
  })

  it('start()後にupdate()で速度が正しく計算されること（自由落下）', () => {
    const ball = new Ball(100, 0)
    ball.start()
    ball.update(1.0)
    // v = v0 + g*t = 0 + 9.8*1 = 9.8 m/s
    expect(ball.velocity).toBeCloseTo(9.8, 3)
  })

  it('start()後にupdate()で高さが正しく計算されること', () => {
    const ball = new Ball(100, 0)
    ball.start()
    ball.update(1.0)
    // h = h0 - (v0*t + 0.5*g*t^2) = 100 - 4.9 = 95.1 m
    expect(ball.height).toBeCloseTo(95.1, 3)
  })

  it('初速度がある場合の速度計算が正しいこと', () => {
    const ball = new Ball(100, 5)
    ball.start()
    ball.update(1.0)
    // v = v0 + g*t = 5 + 9.8 = 14.8 m/s
    expect(ball.velocity).toBeCloseTo(14.8, 3)
  })

  it('地面近くで停止すること', () => {
    const ball = new Ball(10, 0)
    ball.start()
    ball.update(5.0)
    // height <= 1 で停止
    expect(ball.height).toBe(1)
    expect(ball.isMoving).toBe(false)
  })

  it('reset()で初期状態に戻ること', () => {
    const ball = new Ball(50, 0)
    ball.start()
    ball.update(1.0)
    ball.reset(80)
    expect(ball.initialHeight).toBe(80)
    expect(ball.height).toBe(80)
    expect(ball.velocity).toBe(0) // initialVelocity
    expect(ball.time).toBe(0)
    expect(ball.isMoving).toBe(false)
  })

  it('stop()で運動が停止すること', () => {
    const ball = new Ball(100, 0)
    ball.start()
    ball.update(0.5)
    ball.stop()
    const heightBefore = ball.height
    ball.update(0.5)
    expect(ball.height).toBe(heightBefore)
  })
})
