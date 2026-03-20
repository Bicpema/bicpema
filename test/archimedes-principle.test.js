import { describe, it, expect } from 'vitest'
import { Cylinder } from '../vite/simulations/archimedes-principle/js/class.js'

describe('Cylinder - アルキメデスの原理', () => {
  it('初期化できること', () => {
    const cyl = new Cylinder(500, 400, 60, 100, 1.0)
    expect(cyl.cx).toBe(500)
    expect(cyl.cy).toBe(400)
    expect(cyl.r).toBe(60)
    expect(cyl.h).toBe(100)
    expect(cyl.density).toBe(1.0)
    expect(cyl.vy).toBe(0)
    expect(cyl.dragging).toBe(false)
  })

  it('getSubmergedFraction() - 完全に水面より上の場合は0を返す', () => {
    const cyl = new Cylinder(500, 200, 60, 100, 1.0)
    // waterSurfaceY = 300; topY=100, bottomY=200 → bottomY(200) <= waterSurfaceY(300) → 0
    const frac = cyl.getSubmergedFraction(300)
    expect(frac).toBe(0)
  })

  it('getSubmergedFraction() - 完全に水中の場合は1を返す', () => {
    const cyl = new Cylinder(500, 500, 60, 100, 1.0)
    // waterSurfaceY = 300; topY=400, bottomY=500 → topY(400) >= waterSurfaceY(300) → 1
    const frac = cyl.getSubmergedFraction(300)
    expect(frac).toBe(1)
  })

  it('getSubmergedFraction() - 部分的に水中の場合', () => {
    const cyl = new Cylinder(500, 350, 60, 100, 1.0)
    // waterSurfaceY = 300; topY=250, bottomY=350
    // submergedFraction = (350 - 300) / 100 = 0.5
    const frac = cyl.getSubmergedFraction(300)
    expect(frac).toBeCloseTo(0.5, 5)
  })

  it('isOver() - 座標がシリンダー内にあるとき true を返す', () => {
    const cyl = new Cylinder(500, 400, 60, 100, 1.0)
    // 円柱の範囲: x=[440,560], y=[300,400]
    expect(cyl.isOver(500, 350)).toBe(true)
  })

  it('isOver() - 座標がシリンダー外にあるとき false を返す', () => {
    const cyl = new Cylinder(500, 400, 60, 100, 1.0)
    expect(cyl.isOver(700, 350)).toBe(false)
    expect(cyl.isOver(500, 500)).toBe(false)
  })

  it('update() - draggingがtrueのとき位置が変わらないこと', () => {
    const cyl = new Cylinder(500, 400, 60, 100, 1.0)
    cyl.dragging = true
    const cyBefore = cyl.cy
    cyl.update(300, 460, true)
    expect(cyl.cy).toBe(cyBefore)
  })

  it('update() - runningがfalseのとき位置が変わらないこと', () => {
    const cyl = new Cylinder(500, 400, 60, 100, 1.0)
    const cyBefore = cyl.cy
    cyl.update(300, 460, false)
    expect(cyl.cy).toBe(cyBefore)
  })
})
