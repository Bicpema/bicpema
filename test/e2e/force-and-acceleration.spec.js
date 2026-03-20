import { test, expect } from '@playwright/test'

/**
 * 力と加速度の関係 - E2Eテスト
 */
test.describe('力と加速度の関係', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/simulations/force-and-acceleration/')
    await page.waitForSelector('canvas', { timeout: 10000 })
  })

  test('ページタイトルが正しいこと', async ({ page }) => {
    await expect(page).toHaveTitle('力と加速度の関係')
  })

  test('キャンバスが生成されること', async ({ page }) => {
    await expect(page.locator('canvas')).toBeVisible()
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

  test('質量入力フィールドが存在すること', async ({ page }) => {
    await page.locator('#toggleModal').click()
    await expect(page.locator('#massInput')).toBeVisible()
  })
})
