import { test, expect } from '@playwright/test'

/**
 * 速度の合成 - E2Eテスト
 */
test.describe('速度の合成', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/simulations/velocity-composition/')
    await page.waitForSelector('canvas', { timeout: 10000 })
  })

  test('ページタイトルが正しいこと', async ({ page }) => {
    await expect(page).toHaveTitle(/速度/)
  })

  test('キャンバスが生成されること', async ({ page }) => {
    await expect(page.locator('canvas')).toBeVisible()
  })

  test('ナビゲーションバーが表示されること', async ({ page }) => {
    await expect(page.locator('#navBar')).toBeVisible()
  })
})
