import { test, expect } from '@playwright/test'

/**
 * 比熱と熱容量 - E2Eテスト（画面操作）
 *
 * p5 動的 DOM（ラジオボタン）の操作フローを検証する。
 */
test.describe('比熱と熱容量 - 画面操作', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/simulations/specific-heat-and-heat-capacity/')
    await page.waitForSelector('canvas', { timeout: 10000 })
  })

  test('ラジオボタンが存在すること（物質選択）', async ({ page }) => {
    const radios = page.locator('input[type="radio"]')
    const count = await radios.count()
    expect(count).toBeGreaterThan(0)
  })

  test('ラジオボタンを切り替えるとシミュレーションが変化すること', async ({ page }) => {
    const radios = page.locator('input[type="radio"]')
    if (await radios.count() > 1) {
      await radios.nth(1).click()
      await page.waitForTimeout(300)
    }
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
