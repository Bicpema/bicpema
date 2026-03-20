import { test, expect } from '@playwright/test'

/**
 * ドップラー効果 - E2Eテスト（画面操作）
 *
 * p5.js で自動アニメーションするシミュレーションの動作を検証する。
 */
test.describe('ドップラー効果 - 画面操作', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/simulations/doppler/')
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
