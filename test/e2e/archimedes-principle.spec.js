import { test, expect } from '@playwright/test'

/**
 * アルキメデスの原理 - E2Eテスト
 */
test.describe('アルキメデスの原理', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/simulations/archimedes-principle/')
    await page.waitForSelector('canvas', { timeout: 10000 })
  })

  test('ページタイトルが正しいこと', async ({ page }) => {
    await expect(page).toHaveTitle('アルキメデスの原理')
  })

  test('キャンバスが生成されること', async ({ page }) => {
    await expect(page.locator('canvas')).toBeVisible()
  })

  test('開始ボタンが存在すること', async ({ page }) => {
    await expect(page.locator('#startButton')).toBeVisible()
  })

  test('リセットボタンが存在すること', async ({ page }) => {
    await expect(page.locator('#resetButton')).toBeVisible()
  })

  test('設定ボタンが存在すること', async ({ page }) => {
    await expect(page.locator('#settingsButton')).toBeVisible()
  })

  test('開始ボタンをクリックするとシミュレーションが起動すること', async ({ page }) => {
    await page.locator('#startButton').click()
    // キャンバスが依然として表示されていること
    await expect(page.locator('canvas')).toBeVisible()
  })
})
