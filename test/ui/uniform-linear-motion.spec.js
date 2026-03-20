import { test, expect } from '@playwright/test'

/**
 * 等速直線運動をする模型自動車のようす - UIテスト（画面表示）
 */
test.describe('等速直線運動 - 画面表示', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/simulations/uniform-linear-motion/')
    await page.waitForSelector('canvas', { timeout: 10000 })
  })

  test('ページタイトルが正しく表示されること', async ({ page }) => {
    await expect(page).toHaveTitle('等速直線運動をする模型自動車のようす')
  })

  test('ナビゲーションバーにシミュレーション名が表示されること', async ({ page }) => {
    await expect(page.locator('#navBar')).toContainText('等速直線運動')
  })

  test('キャンバスが正の幅と高さで生成されること', async ({ page }) => {
    const dims = await page.evaluate(() => {
      const c = document.querySelector('canvas')
      return { w: c?.width, h: c?.height }
    })
    expect(dims.w).toBeGreaterThan(0)
    expect(dims.h).toBeGreaterThan(0)
  })

  test('キャンバスに何かが描画されていること', async ({ page }) => {
    const hasNonEmpty = await page.evaluate(() => {
      const c = document.querySelector('canvas')
      if (!c) return false
      const ctx = c.getContext('2d')
      if (!ctx) return false
      const { data } = ctx.getImageData(0, 0, c.width, c.height)
      return data.some(v => v !== 0)
    })
    expect(hasNonEmpty).toBe(true)
  })

  test('p5Canvas 要素が存在すること', async ({ page }) => {
    await expect(page.locator('#p5Canvas')).toBeVisible()
  })
})
