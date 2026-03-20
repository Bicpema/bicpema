import { test, expect } from '@playwright/test'

/**
 * 鉛直投げ下ろし運動 - UIテスト（画面表示）
 */
test.describe('鉛直投げ下ろし運動 - 画面表示', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/vite/simulations/vertical-throw-down/')
    await page.waitForLoadState('domcontentloaded')
  })

  test('ページタイトルが正しく表示されること', async ({ page }) => {
    await expect(page).toHaveTitle('鉛直投げ下ろし運動')
  })

  test('ナビゲーションバーにシミュレーション名が表示されること', async ({ page }) => {
    await expect(page.locator('#navBar')).toContainText('鉛直投げ下ろし運動')
  })

  test('設定モーダルが初期状態で非表示であること', async ({ page }) => {
    await expect(page.locator('#settingsModal')).toBeHidden()
  })

  test('開始ボタンが初期状態で表示されること', async ({ page }) => {
    await expect(page.locator('#playPauseButton')).toBeVisible()
  })

  test('開始ボタンの初期テキストが「開始」を含むこと', async ({ page }) => {
    await expect(page.locator('#playPauseButton')).toContainText('開始')
  })

  test('リセットボタンが表示されていること', async ({ page }) => {
    await expect(page.locator('#resetButton')).toBeVisible()
  })

  test('設定ボタンが表示されていること', async ({ page }) => {
    await expect(page.locator('#toggleModal')).toBeVisible()
  })

  test('p5Canvasコンテナが存在すること', async ({ page }) => {
    await expect(page.locator('#p5Canvas')).toBeAttached()
  })
})
