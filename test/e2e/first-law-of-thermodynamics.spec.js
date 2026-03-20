import { test, expect } from '@playwright/test'

/**
 * 熱力学第一法則 - E2Eテスト（画面操作）
 *
 * Q 入力ラジオボタンの操作フローを検証する。
 */
test.describe('熱力学第一法則 - 画面操作', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/simulations/first-law-of-thermodynamics/')
    await page.waitForSelector('canvas', { timeout: 10000 })
  })

  test('ラジオボタンが複数存在すること（Q=0 〜 5Q の選択肢）', async ({ page }) => {
    const radios = page.locator('input[type="radio"]')
    const count = await radios.count()
    expect(count).toBeGreaterThan(1)
  })

  test('ラジオボタンを切り替えてもキャンバスが維持されること', async ({ page }) => {
    const radios = page.locator('input[type="radio"]')
    // 異なる Q 値を選択する
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
