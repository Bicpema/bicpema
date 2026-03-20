import { test, expect } from '@playwright/test'

/**
 * 力学台車が定規にする仕事 - E2Eテスト
 */
test.describe('力学台車が定規にする仕事', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/simulations/cart-work-ruler/')
    await page.waitForSelector('canvas', { timeout: 10000 })
  })

  test('ページタイトルが正しいこと', async ({ page }) => {
    await expect(page).toHaveTitle('力学台車が定規にする仕事')
  })

  test('キャンバスが生成されること', async ({ page }) => {
    await expect(page.locator('canvas')).toBeVisible()
  })

  test('開始ボタンが存在すること', async ({ page }) => {
    await expect(page.locator('#playPauseButton')).toBeVisible()
  })

  test('リセットボタンが存在すること', async ({ page }) => {
    await expect(page.locator('#resetButton')).toBeVisible()
  })

  test('設定モーダルが開閉できること', async ({ page }) => {
    await page.locator('#toggleModal').click()
    await expect(page.locator('#settingsModal')).toBeVisible()
    await page.locator('#closeModal').click()
    await expect(page.locator('#settingsModal')).toBeHidden()
  })

  test('開始ボタンをクリックするとシミュレーションが起動すること', async ({ page }) => {
    await page.locator('#playPauseButton').click()
    await expect(page.locator('canvas')).toBeVisible()
  })
})
