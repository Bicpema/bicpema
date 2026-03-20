import { test, expect } from '@playwright/test'

/**
 * 鉛直投げ上げ運動 - E2Eテスト（画面操作）
 *
 * ユーザーの操作フロー（ボタン・スライダー操作）と
 * それに伴う状態変化を検証する。
 */
test.describe('鉛直投げ上げ運動 - 画面操作', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/simulations/vertical-throw-up/')
    await page.waitForSelector('canvas', { timeout: 10000 })
  })

  test('開始ボタンをクリックすると「一時停止」ボタンに変わること', async ({ page }) => {
    const btn = page.locator('#playPauseButton')
    await expect(btn).toHaveText('開始')
    await btn.click()
    await expect(btn).toHaveText('一時停止')
  })

  test('一時停止ボタンをクリックすると「開始」ボタンに戻ること', async ({ page }) => {
    const btn = page.locator('#playPauseButton')
    await btn.click()
    await expect(btn).toHaveText('一時停止')
    await btn.click()
    await expect(btn).toHaveText('開始')
  })

  test('リセットボタンをクリックするとシミュレーションが初期状態に戻ること', async ({ page }) => {
    const btn = page.locator('#playPauseButton')
    // 開始 → リセット → 開始ボタンが再表示される
    await btn.click()
    await expect(btn).toHaveText('一時停止')
    await page.locator('#resetButton').click()
    await expect(btn).toHaveText('開始')
  })

  test('設定モーダルを開いて初速度を変更して閉じると反映されること', async ({ page }) => {
    await page.locator('#toggleModal').click()
    const input = page.locator('#velocityInput')
    await input.fill('20')
    await page.locator('#closeModal').click()
    // モーダルが閉じられた後、再び開いて値が保持されていること
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
