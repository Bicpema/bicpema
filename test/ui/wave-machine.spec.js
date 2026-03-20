import { test, expect } from '@playwright/test'

/**
 * ウェーブマシン - UIテスト（画面表示）
 */
test.describe('ウェーブマシン - 画面表示', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/simulations/wave-machine/')
    await page.waitForSelector('canvas', { timeout: 10000 })
  })

  test('ページタイトルが正しく表示されること', async ({ page }) => {
    await expect(page).toHaveTitle('ウェーブマシン')
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

  test('開始ボタンが表示されていること', async ({ page }) => {
    await expect(page.locator('#startButton')).toBeVisible()
  })

  test('停止ボタンが表示されていること', async ({ page }) => {
    await expect(page.locator('#stopButton')).toBeVisible()
  })

  test('加速・減速ボタンが表示されていること', async ({ page }) => {
    await expect(page.locator('#accelerationButton')).toBeVisible()
    await expect(page.locator('#decelerationButton')).toBeVisible()
  })
})
