import { test, expect } from '@playwright/test'

/**
 * 力と加速度の関係 - UIテスト（画面表示）
 */
test.describe('力と加速度の関係 - 画面表示', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/vite/simulations/force-and-acceleration/')
    await page.waitForLoadState('domcontentloaded')
  })

  test('ページタイトルが正しく表示されること', async ({ page }) => {
    await expect(page).toHaveTitle('力と加速度の関係')
  })

  test('ナビゲーションバーにシミュレーション名が表示されること', async ({ page }) => {
    await expect(page.locator('#navBar')).toContainText('力と加速度')
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

  test('質量入力フィールドが表示されデフォルト値を持つこと', async ({ page }) => {
    await page.locator('#toggleModal').click()
    const input = page.locator('#massInput')
    await expect(input).toBeVisible()
    const val = await input.inputValue()
    expect(Number(val)).toBeGreaterThan(0)
  })

  test('p5Canvasコンテナが存在すること', async ({ page }) => {
    await expect(page.locator('#p5Canvas')).toBeAttached()
  })
})
