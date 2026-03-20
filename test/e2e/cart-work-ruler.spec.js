import { test, expect } from '@playwright/test'

/**
 * 力学台車が定規にする仕事 - E2Eテスト（画面操作）
 *
 * 質量・初速度・抵抗力を設定し、シミュレーションを実行→停止→
 * リセットする一連のフローを検証する。
 */
test.describe('力学台車が定規にする仕事 - 画面操作', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/simulations/cart-work-ruler/')
    await page.waitForSelector('canvas', { timeout: 10000 })
  })

  test('開始ボタンをクリックするとシミュレーションが起動すること', async ({ page }) => {
    const btn = page.locator('#playPauseButton')
    const before = await btn.textContent()
    await btn.click()
    const after = await btn.textContent()
    expect(after).not.toBe(before)
  })

  test('設定モーダルで質量・速度・力を変更できること', async ({ page }) => {
    await page.locator('#toggleModal').click()
    await page.locator('#massInput').fill('2')
    await page.locator('#velocityInput').fill('2')
    await page.locator('#forceInput').fill('15')
    await page.locator('#closeModal').click()
    // 変更後もキャンバスが表示されていること
    await expect(page.locator('canvas')).toBeVisible()
  })

  test('シミュレーション実行後にリセットができること', async ({ page }) => {
    await page.locator('#playPauseButton').click()
    // 少し待つ
    await page.waitForTimeout(500)
    await page.locator('#resetButton').click()
    await expect(page.locator('#playPauseButton')).toContainText('開始')
  })

  test('設定変更 → 実行 → リセットの一連フローが動作すること', async ({ page }) => {
    // 設定変更
    await page.locator('#toggleModal').click()
    await page.locator('#massInput').fill('2')
    await page.locator('#closeModal').click()
    // 実行
    await page.locator('#playPauseButton').click()
    await page.waitForTimeout(300)
    // リセット
    await page.locator('#resetButton').click()
    await expect(page.locator('canvas')).toBeVisible()
  })
})
