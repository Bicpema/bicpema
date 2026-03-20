import { test, expect } from '@playwright/test'

/**
 * アルキメデスの原理 - UIテスト（画面表示）
 */
test.describe('アルキメデスの原理 - 画面表示', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/vite/simulations/archimedes-principle/')
    await page.waitForLoadState('domcontentloaded')
  })

  test('ページタイトルが正しく表示されること', async ({ page }) => {
    await expect(page).toHaveTitle('アルキメデスの原理')
  })

  test('ナビゲーションバーにシミュレーション名が表示されること', async ({ page }) => {
    await expect(page.locator('#navBar')).toContainText('アルキメデス')
  })

  test('開始ボタンが表示されていること', async ({ page }) => {
    await expect(page.locator('#startButton')).toBeVisible()
  })

  test('リセットボタンが表示されていること', async ({ page }) => {
    await expect(page.locator('#resetButton')).toBeVisible()
  })

  test('設定ボタンが表示されていること', async ({ page }) => {
    await expect(page.locator('#settingsButton')).toBeVisible()
  })

  test('密度スライダーが初期値を持つこと', async ({ page }) => {
    const slider = page.locator('#densitySlider')
    await expect(slider).toBeVisible()
    const val = await slider.inputValue()
    expect(Number(val)).toBeGreaterThan(0)
  })

  test('p5Canvasコンテナが存在すること', async ({ page }) => {
    await expect(page.locator('#p5Canvas')).toBeAttached()
  })
})
