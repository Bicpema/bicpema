import { test, expect } from '@playwright/test'

/**
 * 電車の加速と減速 - UIテスト（画面表示）
 */
test.describe('電車の加速と減速 - 画面表示', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/vite/simulations/train-acceleration/')
    await page.waitForLoadState('domcontentloaded')
  })

  test('ページタイトルが正しく表示されること', async ({ page }) => {
    await expect(page).toHaveTitle('電車の加速と減速')
  })

  test('ナビゲーションバーにシミュレーション名が表示されること', async ({ page }) => {
    await expect(page.locator('#navBar')).toContainText('電車')
  })

  test('設定モーダルが初期状態で非表示であること', async ({ page }) => {
    await expect(page.locator('#settingsModal')).toBeHidden()
  })

  test('開始ボタンに初期テキスト「開始」が含まれること', async ({ page }) => {
    await expect(page.locator('#playPauseButton')).toContainText('開始')
  })

  test('リセットボタンが表示されていること', async ({ page }) => {
    await expect(page.locator('#resetButton')).toBeVisible()
  })

  test('加速度入力フィールドのデフォルト値が正の数であること', async ({ page }) => {
    await page.locator('#toggleModal').click()
    const input = page.locator('#accelerationInput')
    await expect(input).toBeVisible()
    const val = await input.inputValue()
    expect(Number(val)).toBeGreaterThan(0)
  })

  test('p5Canvasコンテナが存在すること', async ({ page }) => {
    await expect(page.locator('#p5Canvas')).toBeAttached()
  })
})
