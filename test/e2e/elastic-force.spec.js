import { test, expect } from '@playwright/test'

/**
 * 弾性力シミュレーション - E2Eテスト
 */
test.describe('弾性力', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/simulations/elastic-force/')
    await page.waitForSelector('canvas', { timeout: 10000 })
  })

  test('ページタイトルが正しいこと', async ({ page }) => {
    await expect(page).toHaveTitle('弾性力')
  })

  test('キャンバスが生成されること', async ({ page }) => {
    await expect(page.locator('canvas')).toBeVisible()
  })

  test('リセットボタンが存在すること', async ({ page }) => {
    await expect(page.locator('#resetButton')).toBeVisible()
  })

  test('設定ボタンをクリックするとモーダルが表示されること', async ({ page }) => {
    await page.locator('#toggleModal').click()
    await expect(page.locator('#settingsModal')).toBeVisible()
  })

  test('ばね定数スライダーが存在すること', async ({ page }) => {
    await page.locator('#toggleModal').click()
    await expect(page.locator('#springConstantInput')).toBeVisible()
  })

  test('モーダルを閉じるボタンが機能すること', async ({ page }) => {
    await page.locator('#toggleModal').click()
    await expect(page.locator('#settingsModal')).toBeVisible()
    await page.locator('#closeModal').click()
    await expect(page.locator('#settingsModal')).toBeHidden()
  })
})
