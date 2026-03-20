import { test, expect } from '@playwright/test'

/**
 * 熱量の保存と比熱 - UIテスト（画面表示）
 *
 * p5.js が動的に DOM 要素を生成するシミュレーション。
 * キャンバスの生成・描画状態とタイトルを検証する。
 */
test.describe('熱量の保存と比熱 - 画面表示', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/simulations/conservation-of-heat-and-specific-heat/')
    await page.waitForSelector('canvas', { timeout: 10000 })
  })

  test('ページタイトルが正しく表示されること', async ({ page }) => {
    await expect(page).toHaveTitle('熱量の保存と比熱')
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

  test('p5 が生成したラジオボタンが存在すること', async ({ page }) => {
    const radio = page.locator('input[type="radio"]').first()
    await expect(radio).toBeVisible()
  })
})
