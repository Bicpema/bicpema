import { test, expect } from '@playwright/test'

/**
 * セロハンによる色の変化（2Dアニメーション） - UIテスト（画面表示）
 */
test.describe('セロハンによる色の変化（アニメーション） - 画面表示', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/simulations/cellophane-color-2D_animation/')
    await page.waitForSelector('#p5Canvas', { timeout: 10000 })
  })

  test('ページタイトルが正しく表示されること', async ({ page }) => {
    await expect(page).toHaveTitle('セロハンによる色を変化を観察するシミュレーション')
  })

  test('p5Canvas 要素が存在すること', async ({ page }) => {
    await expect(page.locator('#p5Canvas')).toBeVisible()
  })

  test('スクリーンショットボタンが表示されていること', async ({ page }) => {
    await expect(page.locator('#screenshotButton')).toBeVisible()
  })

  test('設定モーダルが初期状態で非表示であること', async ({ page }) => {
    await expect(page.locator('#settingModal')).toBeHidden()
  })

  test('色表示エリアが存在すること', async ({ page }) => {
    await expect(page.locator('#color')).toBeVisible()
  })
})
