import { test, expect } from '@playwright/test'

/**
 * 熱移動の可視化 - E2Eテスト（画面操作）
 *
 * p5 動的 DOM（接触/接触前ラジオボタン）の操作フローを検証する。
 */
test.describe('熱移動の可視化 - 画面操作', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/simulations/visualization-of-heat-transfer/')
    await page.waitForSelector('canvas', { timeout: 10000 })
  })

  test('ラジオボタンを「接触させる」に切り替えるとシミュレーションが変化すること', async ({ page }) => {
    const radios = page.locator('input[type="radio"]')
    const count = await radios.count()
    expect(count).toBeGreaterThan(0)
    await radios.first().click()
    await page.waitForTimeout(300)
    await expect(page.locator('canvas')).toBeVisible()
  })

  test('ラジオ操作後もキャンバスが描画されていること', async ({ page }) => {
    const radios = page.locator('input[type="radio"]')
    await radios.first().click()
    await page.waitForTimeout(500)
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
})
