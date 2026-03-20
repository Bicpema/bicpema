import { test, expect } from '@playwright/test'

/**
 * 等速直線運動 - E2Eテスト
 */
test.describe('等速直線運動', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/simulations/uniform-linear-motion/')
    await page.waitForSelector('canvas', { timeout: 10000 })
  })

  test('ページタイトルが正しいこと', async ({ page }) => {
    await expect(page).toHaveTitle('等速直線運動をする模型自動車のようす')
  })

  test('キャンバスが生成されること', async ({ page }) => {
    await expect(page.locator('canvas')).toBeVisible()
  })

  test('ナビゲーションバーが表示されること', async ({ page }) => {
    await expect(page.locator('#navBar')).toBeVisible()
  })
})
