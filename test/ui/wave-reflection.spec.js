import { test, expect } from '@playwright/test'

/**
 * 波の反射 - UIテスト（画面表示）
 */
test.describe('波の反射 - 画面表示', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/simulations/wave-reflection/')
    await page.waitForSelector('canvas', { timeout: 10000 })
  })

  test('ページタイトルが正しく表示されること', async ({ page }) => {
    await expect(page).toHaveTitle('波の反射')
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

  test('波の発射ボタンが表示されていること', async ({ page }) => {
    await expect(page.locator('#startButton')).toBeVisible()
  })

  test('一時停止・再開・リセットボタンが表示されていること', async ({ page }) => {
    await expect(page.locator('#stopButton')).toBeVisible()
    await expect(page.locator('#restartButton')).toBeVisible()
    await expect(page.locator('#resetButton')).toBeVisible()
  })

  test('設定モーダルが初期状態で非表示であること', async ({ page }) => {
    await expect(page.locator('#simulationSettingModal')).toBeHidden()
  })
})
