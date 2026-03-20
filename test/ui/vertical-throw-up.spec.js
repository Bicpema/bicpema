import { test, expect } from '@playwright/test'
import { mockFirebaseAssets } from '../helpers.js'

/**
 * 鉛直投げ上げ運動 - UIテスト（画面表示）
 *
 * ページを読み込んだときの初期画面表示が正しいことを検証する。
 * ナビ・ボタン・モーダル等のDOM初期状態を確認する。
 */
test.describe('鉛直投げ上げ運動 - 画面表示', () => {
  test.beforeEach(async ({ page }) => {
    await mockFirebaseAssets(page)
    await page.goto('/vite/simulations/vertical-throw-up/')
    await page.waitForLoadState('domcontentloaded')
  })

  test('ページタイトルが正しく表示されること', async ({ page }) => {
    await expect(page).toHaveTitle('鉛直投げ上げ運動')
  })

  test('ナビゲーションバーにシミュレーション名が表示されること', async ({ page }) => {
    await expect(page.locator('#navBar')).toContainText('鉛直投げ上げ運動')
  })

  test('設定モーダルが初期状態で非表示であること', async ({ page }) => {
    await expect(page.locator('#settingsModal')).toBeHidden()
  })

  test('開始ボタンが初期状態で「開始」と表示されること', async ({ page }) => {
    await expect(page.locator('#playPauseButton')).toHaveText('開始')
  })

  test('リセットボタンが表示されていること', async ({ page }) => {
    await expect(page.locator('#resetButton')).toBeVisible()
  })

  test('設定ボタンが表示されていること', async ({ page }) => {
    await expect(page.locator('#toggleModal')).toBeVisible()
  })

  test('設定モーダル内の初速度入力にデフォルト値が表示されること', async ({ page }) => {
    await page.locator('#toggleModal').click()
    await expect(page.locator('#velocityInput')).toHaveValue('30')
  })

  test('p5Canvasコンテナが存在すること', async ({ page }) => {
    await expect(page.locator('#p5Canvas')).toBeAttached()
  })
})
