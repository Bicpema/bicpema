import { test, expect } from '@playwright/test'
import { mockFirebaseAssets } from '../helpers.js'

/**
 * 鉛直投げ上げ運動 - E2Eテスト（画面操作）
 *
 * ユーザーの操作フロー（ボタン・スライダー操作）と
 * それに伴うDOM状態変化を検証する。
 * Firebase アセットはモックして p5.js を確実に初期化させる。
 */
test.describe('鉛直投げ上げ運動 - 画面操作', () => {
  test.beforeEach(async ({ page }) => {
    await mockFirebaseAssets(page)
    await page.goto('/vite/simulations/vertical-throw-up/')
    // p5.js が setup() を完了し DOM イベントを登録するまで待機
    await page.waitForSelector('#p5Canvas canvas', { timeout: 15000 })
  })

  test('開始ボタンをクリックすると「一時停止」ボタンに変わること', async ({ page }) => {
    const btn = page.locator('#playPauseButton')
    await expect(btn).toContainText('開始')
    await btn.click()
    await expect(btn).toContainText('一時停止')
  })

  test('一時停止ボタンをクリックすると「再開」ボタンに変わること', async ({ page }) => {
    const btn = page.locator('#playPauseButton')
    await btn.click()
    await expect(btn).toContainText('一時停止')
    await btn.click()
    await expect(btn).toContainText('再開')
  })

  test('リセットボタンをクリックすると開始状態に戻ること', async ({ page }) => {
    const btn = page.locator('#playPauseButton')
    await btn.click()
    await expect(btn).toContainText('一時停止')
    await page.locator('#resetButton').click()
    await expect(btn).toContainText('開始')
  })

  test('設定モーダルを開いて初速度を変更して閉じると値が保持されること', async ({ page }) => {
    await page.locator('#toggleModal').click()
    await page.locator('#velocityInput').fill('20')
    await page.locator('#closeModal').click()
    await page.locator('#toggleModal').click()
    await expect(page.locator('#velocityInput')).toHaveValue('20')
  })

  test('設定モーダルを開閉できること', async ({ page }) => {
    const modal = page.locator('#settingsModal')
    await page.locator('#toggleModal').click()
    await expect(modal).toBeVisible()
    await page.locator('#closeModal').click()
    await expect(modal).toBeHidden()
  })
})
