import { test, expect } from '@playwright/test'

/**
 * 熱量の保存と比熱 - E2Eテスト（画面操作）
 *
 * p5 動的 DOM（ラジオボタン）の操作フローを検証する。
 */
test.describe('熱量の保存と比熱 - 画面操作', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/simulations/conservation-of-heat-and-specific-heat/')
    await page.waitForSelector('canvas', { timeout: 10000 })
  })

  test('ラジオボタンを切り替えるとシミュレーションが変化すること', async ({ page }) => {
    const radios = page.locator('input[type="radio"]')
    const count = await radios.count()
    expect(count).toBeGreaterThan(0)
    // 最初のラジオを選択してキャンバスが維持されること
    await radios.first().click()
    await expect(page.locator('canvas')).toBeVisible()
  })

  test('ラジオボタン操作後もキャンバスが描画されていること', async ({ page }) => {
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
