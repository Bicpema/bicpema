import { test, expect } from '@playwright/test'

/**
 * 速度の合成 - E2Eテスト（画面操作）
 *
 * 川の速度・船の速度スライダー操作とシミュレーションの実行フローを検証する。
 */
test.describe('速度の合成 - 画面操作', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/simulations/velocity-composition/')
    await page.waitForSelector('canvas', { timeout: 10000 })
  })

  test('開始ボタンをクリックすると「一時停止」ボタンに変わること', async ({ page }) => {
    const btn = page.locator('#playPauseButton')
    await expect(btn).toContainText('開始')
    await btn.click()
    await expect(btn).toContainText('一時停止')
  })

  test('一時停止ボタンをクリックすると「開始」ボタンに戻ること', async ({ page }) => {
    const btn = page.locator('#playPauseButton')
    await btn.click()
    await expect(btn).toContainText('一時停止')
    await btn.click()
    await expect(btn).toContainText('開始')
  })

  test('リセットボタンをクリックするとシミュレーションが初期状態に戻ること', async ({ page }) => {
    const btn = page.locator('#playPauseButton')
    await btn.click()
    await expect(btn).toContainText('一時停止')
    await page.locator('#resetButton').click()
    await expect(btn).toContainText('開始')
  })

  test('設定モーダルを開いて川の速度を変更できること', async ({ page }) => {
    await page.locator('#toggleModal').click()
    const slider = page.locator('#riverSpeedInput')
    await expect(slider).toBeVisible()
    await slider.evaluate(el => { el.value = '5' })
    await slider.dispatchEvent('input')
    await page.locator('#closeModal').click()
    await expect(page.locator('#settingsModal')).toBeHidden()
  })

  test('設定モーダルを開いて船の速度を変更できること', async ({ page }) => {
    await page.locator('#toggleModal').click()
    const slider = page.locator('#boatSpeedInput')
    await expect(slider).toBeVisible()
    await slider.evaluate(el => { el.value = '8' })
    await slider.dispatchEvent('input')
    await page.locator('#closeModal').click()
    await expect(page.locator('canvas')).toBeVisible()
  })

  test('設定変更 → 実行 → リセットの一連フローが動作すること', async ({ page }) => {
    await page.locator('#toggleModal').click()
    await page.locator('#riverSpeedInput').evaluate(el => { el.value = '7' })
    await page.locator('#riverSpeedInput').dispatchEvent('input')
    await page.locator('#closeModal').click()
    await page.locator('#playPauseButton').click()
    await page.waitForTimeout(300)
    await page.locator('#resetButton').click()
    await expect(page.locator('#playPauseButton')).toContainText('開始')
  })
})
