import { test, expect } from '@playwright/test'

/**
 * 斜面をくだる台車の運動 - E2Eテスト（画面操作）
 *
 * 傾斜角の変更と台車の動き開始フローを検証する。
 */
test.describe('斜面をくだる台車の運動 - 画面操作', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/simulations/slope-cart-motion/')
    await page.waitForSelector('canvas', { timeout: 10000 })
  })

  test('設定モーダルを開閉できること', async ({ page }) => {
    const modal = page.locator('#settingsModal')
    await page.locator('#toggleModal').click()
    await expect(modal).toBeVisible()
    await page.locator('#closeModal').click()
    await expect(modal).toBeHidden()
  })

  test('傾斜角スライダーを変更できること', async ({ page }) => {
    await page.locator('#toggleModal').click()
    const input = page.locator('#angleInput')
    const before = await input.inputValue()
    await input.fill('45')
    const after = await input.inputValue()
    expect(after).not.toBe(before)
    expect(Number(after)).toBe(45)
  })

  test('リセットボタンをクリックしてもキャンバスが維持されること', async ({ page }) => {
    await page.locator('#resetButton').click()
    await expect(page.locator('canvas')).toBeVisible()
  })

  test('開始→リセットのフローが正常に動作すること', async ({ page }) => {
    // 開始ボタンが存在すれば操作可能な状態
    const startBtn = page.locator('#playPauseButton')
    if (await startBtn.isVisible()) {
      await startBtn.click()
      await page.locator('#resetButton').click()
      await expect(page.locator('canvas')).toBeVisible()
    }
  })
})
