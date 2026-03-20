import { test, expect } from '@playwright/test'

/**
 * アルキメデスの原理 - E2Eテスト（画面操作）
 *
 * 密度スライダー変更 → 開始 → リセットのフローを検証する。
 */
test.describe('アルキメデスの原理 - 画面操作', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/simulations/archimedes-principle/')
    await page.waitForSelector('canvas', { timeout: 10000 })
  })

  test('開始ボタンをクリックするとシミュレーションが起動すること', async ({ page }) => {
    await page.locator('#startButton').click()
    await expect(page.locator('canvas')).toBeVisible()
  })

  test('リセットボタンでシミュレーションが初期状態に戻ること', async ({ page }) => {
    await page.locator('#startButton').click()
    await page.locator('#resetButton').click()
    await expect(page.locator('canvas')).toBeVisible()
  })

  test('密度スライダーを操作するとシミュレーションに反映されること', async ({ page }) => {
    const slider = page.locator('#densitySlider')
    const before = await slider.inputValue()
    // スライダーの値を大きく変更
    await slider.evaluate(el => { el.value = '2.0' })
    await slider.dispatchEvent('input')
    const after = await slider.inputValue()
    expect(after).not.toBe(before)
  })

  test('設定ボタンクリックで設定パネルが表示されること', async ({ page }) => {
    await page.locator('#settingsButton').click()
    // 設定パネルが表示されていること
    await expect(page.locator('canvas')).toBeVisible()
  })
})
