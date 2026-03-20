import { describe, it, expect } from 'vitest'
import { Ball } from '../vite/simulations/vertical-throw-up/js/class.js'

describe('Ball - 鉛直投げ上げ運動', () => {
  it('初期化できること', () => {
    const ball = new Ball(30)
    expect(ball.initialVelocity).toBe(30)
    expect(ball.time).toBe(0)
    expect(ball.height).toBe(0)
    expect(ball.velocity).toBe(30)
    expect(ball.isMoving).toBe(false)
  })

  it('isMovingがfalseのときupdate()は状態を変えないこと', () => {
    const ball = new Ball(20)
    ball.update(1.0)
    expect(ball.time).toBe(0)
    expect(ball.height).toBe(0)
  })

  it('start()後にupdate()で速度が正しく計算されること', () => {
    const ball = new Ball(20)
    ball.start()
    ball.update(1.0)
    // v = v0 - g*t = 20 - 9.8 = 10.2 m/s
    expect(ball.velocity).toBeCloseTo(10.2, 3)
  })

  it('start()後にupdate()で高さが正しく計算されること', () => {
    const ball = new Ball(20)
    ball.start()
    ball.update(1.0)
    // h = v0*t - 0.5*g*t^2 = 20 - 4.9 = 15.1 m
    expect(ball.height).toBeCloseTo(15.1, 3)
  })

  it('地面に到達したら停止すること', () => {
    const ball = new Ball(10)
    ball.start()
    // t = 2*v0/g ≈ 2.04s で地面に到達
    ball.update(3.0)
    expect(ball.height).toBe(0)
    expect(ball.isMoving).toBe(false)
  })

  it('reset()で初期状態に戻ること', () => {
    const ball = new Ball(10)
    ball.start()
    ball.update(0.5)
    ball.reset(15)
    expect(ball.time).toBe(0)
    expect(ball.height).toBe(0)
    expect(ball.velocity).toBe(15)
    expect(ball.initialVelocity).toBe(15)
    expect(ball.isMoving).toBe(false)
  })

  it('最高到達点が正しく計算されること', () => {
    const ball = new Ball(20)
    // maxHeight = v0^2 / (2*g) = 400 / 19.6 ≈ 20.408
    expect(ball.maxHeight).toBeCloseTo(20.408, 2)
  })

  it('stop()で運動が停止すること', () => {
    const ball = new Ball(20)
    ball.start()
    ball.update(0.5)
    ball.stop()
    const heightBefore = ball.height
    ball.update(0.5)
    expect(ball.height).toBe(heightBefore)
  })
})
