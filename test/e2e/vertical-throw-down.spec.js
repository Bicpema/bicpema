import { test, expect } from '@playwright/test'

/**
 * 鉛直投げ下ろし運動 - E2Eテスト
 */
test.describe('鉛直投げ下ろし運動', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/simulations/vertical-throw-down/')
    await page.waitForSelector('canvas', { timeout: 10000 })
  })

  test('ページタイトルが正しいこと', async ({ page }) => {
    await expect(page).toHaveTitle('鉛直投げ下ろし運動')
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

  test('設定ボタンをクリックするとモーダルが表示されること', async ({ page }) => {
    await page.locator('#toggleModal').click()
    await expect(page.locator('#settingsModal')).toBeVisible()
  })

  test('開始ボタンをクリックすると一時停止ボタンに変わること', async ({ page }) => {
    const btn = page.locator('#playPauseButton')
    await btn.click()
    await expect(btn).toHaveText('一時停止')
  })
})
