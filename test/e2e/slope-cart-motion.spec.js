import { test, expect } from '@playwright/test'

/**
 * 斜面をくだる台車の運動 - E2Eテスト（画面操作）
 */
test.describe('斜面をくだる台車の運動 - 画面操作', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/vite/simulations/slope-cart-motion/')
    await page.waitForLoadState('domcontentloaded')
  })

  test('設定モーダルを開閉できること', async ({ page }) => {
    const modal = page.locator('#settingsModal')
    await page.locator('#toggleModal').click()
    await expect(modal).toBeVisible()
    await page.locator('#closeModal').click()
    await expect(modal).toBeHidden()
  })

  test('傾斜角入力フィールドの値を変更できること', async ({ page }) => {
    await page.locator('#toggleModal').click()
    const input = page.locator('#angleInput')
    await input.fill('45')
    await expect(input).toHaveValue('45')
  })

  test('リセットボタンをクリックしてもページが正常に保たれること', async ({ page }) => {
    await page.locator('#resetButton').click()
    await expect(page.locator('#navBar')).toBeVisible()
  })

  test('開始→リセットのフローが正常に動作すること', async ({ page }) => {
    const startBtn = page.locator('#playPauseButton')
    if (await startBtn.isVisible()) {
      await startBtn.click()
      await page.locator('#resetButton').click()
      await expect(page.locator('#navBar')).toBeVisible()
    }
  })
})
