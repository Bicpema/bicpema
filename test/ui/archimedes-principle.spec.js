import { test, expect } from '@playwright/test'

/**
 * アルキメデスの原理 - UIテスト（画面表示）
 */
test.describe('アルキメデスの原理 - 画面表示', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/simulations/archimedes-principle/')
    await page.waitForSelector('canvas', { timeout: 10000 })
  })

  test('ページタイトルが正しく表示されること', async ({ page }) => {
    await expect(page).toHaveTitle('アルキメデスの原理')
  })

  test('ナビゲーションバーにシミュレーション名が表示されること', async ({ page }) => {
    await expect(page.locator('#navBar')).toContainText('アルキメデス')
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

  test('密度スライダーが表示されていること', async ({ page }) => {
    const slider = page.locator('#densitySlider')
    await expect(slider).toBeVisible()
    const val = await slider.inputValue()
    expect(Number(val)).toBeGreaterThan(0)
  })
})
