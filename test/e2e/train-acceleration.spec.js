import { test, expect } from '@playwright/test'

/**
 * 電車の加速と減速 - E2Eテスト
 */
test.describe('電車の加速と減速', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/simulations/train-acceleration/')
    await page.waitForSelector('canvas', { timeout: 10000 })
  })

  test('ページタイトルが正しいこと', async ({ page }) => {
    await expect(page).toHaveTitle('電車の加速と減速')
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

  test('加速度入力フィールドが存在すること', async ({ page }) => {
    await page.locator('#toggleModal').click()
    await expect(page.locator('#accelerationInput')).toBeVisible()
  })

  test('開始ボタンクリックでシミュレーションが起動すること', async ({ page }) => {
    const btn = page.locator('#playPauseButton')
    await btn.click()
    // ボタンテキストが変化していること
    await expect(btn).not.toHaveText('▶ 開始')
  })
})
