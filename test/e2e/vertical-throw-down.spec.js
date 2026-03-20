import { test, expect } from '@playwright/test'

/**
 * 鉛直投げ下ろし運動 - E2Eテスト（画面操作）
 */
test.describe('鉛直投げ下ろし運動 - 画面操作', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/simulations/vertical-throw-down/')
    await page.waitForSelector('canvas', { timeout: 10000 })
  })

  test('開始ボタンをクリックすると「一時停止」ボタンに変わること', async ({ page }) => {
    const btn = page.locator('#playPauseButton')
    await btn.click()
    await expect(btn).toHaveText('一時停止')
  })

  test('一時停止後にリセットすると開始状態に戻ること', async ({ page }) => {
    const btn = page.locator('#playPauseButton')
    await btn.click()
    await page.locator('#resetButton').click()
    await expect(btn).toHaveText('開始')
  })

  test('設定モーダルで投げ下ろし高さを変更できること', async ({ page }) => {
    await page.locator('#toggleModal').click()
    const heightInput = page.locator('#heightInput')
    await heightInput.fill('80')
    await page.locator('#closeModal').click()
    await page.locator('#toggleModal').click()
    await expect(page.locator('#heightInput')).toHaveValue('80')
  })

  test('設定モーダルを開閉できること', async ({ page }) => {
    const modal = page.locator('#settingsModal')
    await page.locator('#toggleModal').click()
    await expect(modal).toBeVisible()
    await page.locator('#closeModal').click()
    await expect(modal).toBeHidden()
  })
})
