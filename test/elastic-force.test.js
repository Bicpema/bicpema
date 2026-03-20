import { describe, it, expect } from 'vitest'
import { Spring } from '../vite/simulations/elastic-force/js/class.js'

describe('Spring - 弾性力', () => {
  it('初期化できること', () => {
    const spring = new Spring(135, 175, 280, 20)
    expect(spring.attachX).toBe(135)
    expect(spring.naturalLength).toBe(280)
    expect(spring.k).toBe(20)
    expect(spring.endX).toBe(135 + 280)
    expect(spring.isDragging).toBe(false)
  })

  it('currentLengthが自然長と等しいこと（初期状態）', () => {
    const spring = new Spring(135, 175, 280, 20)
    expect(spring.currentLength).toBe(280)
  })

  it('displacementが0であること（初期状態）', () => {
    const spring = new Spring(135, 175, 280, 20)
    expect(spring.displacement).toBeCloseTo(0, 5)
  })

  it('伸びた場合のdisplacementが正であること', () => {
    const spring = new Spring(0, 0, 400, 20) // PX_PER_M=400, naturalLength=400px = 1m
    spring.endX = 800 // 伸び: 400px = 1m
    expect(spring.displacement).toBeCloseTo(1.0, 5)
  })

  it('縮んだ場合のdisplacementが負であること', () => {
    const spring = new Spring(0, 0, 400, 20)
    spring.endX = 200 // 縮み: 200px = 0.5m
    expect(spring.displacement).toBeCloseTo(-0.5, 5)
  })

  it('forceMagnitudeが正しく計算されること（F = k*|x|）', () => {
    const spring = new Spring(0, 0, 400, 20) // PX_PER_M=400
    spring.endX = 800 // displacement = 1m
    // F = 20 * 1 = 20 N
    expect(spring.forceMagnitude).toBeCloseTo(20, 5)
  })

  it('reset()で自然長に戻ること', () => {
    const spring = new Spring(135, 175, 280, 20)
    spring.endX = 600
    spring.reset()
    expect(spring.endX).toBe(135 + 280)
    expect(spring.isDragging).toBe(false)
  })

  it('updateK()でばね定数を更新できること', () => {
    const spring = new Spring(135, 175, 280, 20)
    spring.updateK(50)
    expect(spring.k).toBe(50)
  })

  it('startDrag()でドラッグ状態になること', () => {
    const spring = new Spring(135, 175, 280, 20)
    spring.startDrag(300)
    expect(spring.isDragging).toBe(true)
    expect(spring.dragOffsetX).toBe(spring.endX - 300)
  })

  it('stopDrag()でドラッグ状態が解除されること', () => {
    const spring = new Spring(135, 175, 280, 20)
    spring.startDrag(300)
    spring.stopDrag()
    expect(spring.isDragging).toBe(false)
  })
})
