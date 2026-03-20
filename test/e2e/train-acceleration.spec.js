import { test, expect } from '@playwright/test'

/**
 * 電車の加速と減速 - E2Eテスト（画面操作）
 */
test.describe('電車の加速と減速 - 画面操作', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/vite/simulations/train-acceleration/')
    await page.waitForLoadState('domcontentloaded')
  })

  test('開始ボタンをクリックするとボタンテキストが変化すること', async ({ page }) => {
    const btn = page.locator('#playPauseButton')
    const before = await btn.textContent()
    await btn.click()
    const after = await btn.textContent()
    expect(after).not.toBe(before)
  })

  test('設定モーダルを開閉できること', async ({ page }) => {
    const modal = page.locator('#settingsModal')
    await page.locator('#toggleModal').click()
    await expect(modal).toBeVisible()
    await page.locator('#closeModal').click()
    await expect(modal).toBeHidden()
  })

  test('加速度入力値を変更して再生できること', async ({ page }) => {
    await page.locator('#toggleModal').click()
    await page.locator('#accelerationInput').fill('3')
    await page.locator('#closeModal').click()
    await page.locator('#playPauseButton').click()
    await expect(page.locator('#navBar')).toBeVisible()
  })

  test('リセットボタンで初期状態に戻ること', async ({ page }) => {
    const btn = page.locator('#playPauseButton')
    await btn.click()
    await page.locator('#resetButton').click()
    await expect(btn).toContainText('開始')
  })
})
