import { test, expect } from '@playwright/test'

/**
 * 斜面をくだる台車の運動 - E2Eテスト
 */
test.describe('斜面をくだる台車の運動', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/simulations/slope-cart-motion/')
    await page.waitForSelector('canvas', { timeout: 10000 })
  })

  test('ページタイトルが正しいこと', async ({ page }) => {
    await expect(page).toHaveTitle('斜面をくだる力学台車の運動')
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

  test('傾斜角入力フィールドが存在すること', async ({ page }) => {
    await page.locator('#toggleModal').click()
    await expect(page.locator('#angleInput')).toBeVisible()
  })
})
