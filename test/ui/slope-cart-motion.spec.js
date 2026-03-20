import { test, expect } from '@playwright/test'

/**
 * 斜面をくだる台車の運動 - UIテスト（画面表示）
 */
test.describe('斜面をくだる台車の運動 - 画面表示', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/vite/simulations/slope-cart-motion/')
    await page.waitForLoadState('domcontentloaded')
  })

  test('ページタイトルが正しく表示されること', async ({ page }) => {
    await expect(page).toHaveTitle('斜面をくだる力学台車の運動')
  })

  test('ナビゲーションバーにシミュレーション名が表示されること', async ({ page }) => {
    await expect(page.locator('#navBar')).toContainText('斜面')
  })

  test('設定モーダルが初期状態で非表示であること', async ({ page }) => {
    await expect(page.locator('#settingsModal')).toBeHidden()
  })

  test('設定ボタンが表示されていること', async ({ page }) => {
    await expect(page.locator('#toggleModal')).toBeVisible()
  })

  test('リセットボタンが表示されていること', async ({ page }) => {
    await expect(page.locator('#resetButton')).toBeVisible()
  })

  test('傾斜角入力フィールドのデフォルト値が正の数であること', async ({ page }) => {
    await page.locator('#toggleModal').click()
    const input = page.locator('#angleInput')
    await expect(input).toBeVisible()
    const val = await input.inputValue()
    expect(Number(val)).toBeGreaterThan(0)
  })

  test('p5Canvasコンテナが存在すること', async ({ page }) => {
    await expect(page.locator('#p5Canvas')).toBeAttached()
  })
})
