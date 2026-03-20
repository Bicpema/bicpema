import { test, expect } from '@playwright/test'

/**
 * 力学台車が定規にする仕事 - UIテスト（画面表示）
 */
test.describe('力学台車が定規にする仕事 - 画面表示', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/vite/simulations/cart-work-ruler/')
    await page.waitForLoadState('domcontentloaded')
  })

  test('ページタイトルが正しく表示されること', async ({ page }) => {
    await expect(page).toHaveTitle('力学台車が定規にする仕事')
  })

  test('ナビゲーションバーが表示されること', async ({ page }) => {
    await expect(page.locator('#navBar')).toBeVisible()
  })

  test('設定モーダルが初期状態で非表示であること', async ({ page }) => {
    await expect(page.locator('#settingsModal')).toBeHidden()
  })

  test('開始ボタンに「開始」が含まれること', async ({ page }) => {
    await expect(page.locator('#playPauseButton')).toContainText('開始')
  })

  test('リセットボタンが表示されていること', async ({ page }) => {
    await expect(page.locator('#resetButton')).toBeVisible()
  })

  test('設定モーダル内に質量・速度・力の入力フィールドが存在すること', async ({ page }) => {
    await page.locator('#toggleModal').click()
    await expect(page.locator('#massInput')).toBeVisible()
    await expect(page.locator('#velocityInput')).toBeVisible()
    await expect(page.locator('#forceInput')).toBeVisible()
  })

  test('p5Canvasコンテナが存在すること', async ({ page }) => {
    await expect(page.locator('#p5Canvas')).toBeAttached()
  })
})
