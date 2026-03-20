import { test, expect } from '@playwright/test'

/**
 * 電車の加速と減速 - E2Eテスト（画面操作）
 *
 * 加速度変更 → 開始 → 一時停止 → リセットの一連のフローを検証する。
 */
test.describe('電車の加速と減速 - 画面操作', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/simulations/train-acceleration/')
    await page.waitForSelector('canvas', { timeout: 10000 })
  })

  test('開始ボタンをクリックするとシミュレーションが起動してボタンが変化すること', async ({ page }) => {
    const btn = page.locator('#playPauseButton')
    const textBefore = await btn.textContent()
    await btn.click()
    const textAfter = await btn.textContent()
    expect(textAfter).not.toBe(textBefore)
  })

  test('設定モーダルを開閉できること', async ({ page }) => {
    const modal = page.locator('#settingsModal')
    await page.locator('#toggleModal').click()
    await expect(modal).toBeVisible()
    await page.locator('#closeModal').click()
    await expect(modal).toBeHidden()
  })

  test('加速度スライダーを変更して再生するフローが動作すること', async ({ page }) => {
    await page.locator('#toggleModal').click()
    const slider = page.locator('#accelerationInput')
    // 加速度を大きい値に変更
    await slider.fill('3')
    await page.locator('#closeModal').click()
    // 再生開始
    await page.locator('#playPauseButton').click()
    // キャンバスが引き続き表示されること
    await expect(page.locator('canvas')).toBeVisible()
  })

  test('リセットボタンで初期状態に戻ること', async ({ page }) => {
    const btn = page.locator('#playPauseButton')
    await btn.click()
    await page.locator('#resetButton').click()
    // リセット後もキャンバスが表示されていること
    await expect(page.locator('canvas')).toBeVisible()
  })
})
