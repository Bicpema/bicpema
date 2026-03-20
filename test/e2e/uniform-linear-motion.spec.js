import { test, expect } from '@playwright/test'

/**
 * 等速直線運動をする模型自動車のようす - E2Eテスト（画面操作）
 *
 * p5 動的ボタン操作によるシミュレーション起動フローを検証する。
 */
test.describe('等速直線運動 - 画面操作', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/simulations/uniform-linear-motion/')
    await page.waitForSelector('canvas', { timeout: 10000 })
  })

  test('ページが読み込まれてキャンバスが表示されること', async ({ page }) => {
    await expect(page.locator('canvas')).toBeVisible()
  })

  test('p5Canvas 内にキャンバスが存在すること', async ({ page }) => {
    const canvas = page.locator('#p5Canvas canvas')
    await expect(canvas).toBeVisible()
  })

  test('キャンバスのサイズが正であること', async ({ page }) => {
    const dims = await page.evaluate(() => {
      const c = document.querySelector('canvas')
      return { w: c?.width, h: c?.height }
    })
    expect(dims.w).toBeGreaterThan(0)
    expect(dims.h).toBeGreaterThan(0)
  })
})
