import { test, expect } from '@playwright/test'

/**
 * 力学台車が定規にする仕事 - E2Eテスト（画面操作）
 */
test.describe('力学台車が定規にする仕事 - 画面操作', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/vite/simulations/cart-work-ruler/')
    await page.waitForLoadState('domcontentloaded')
  })

  test('開始ボタンをクリックするとボタンテキストが変化すること', async ({ page }) => {
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
    await expect(page.locator('#navBar')).toBeVisible()
  })

  test('シミュレーション実行後にリセットが動作すること', async ({ page }) => {
    await page.locator('#playPauseButton').click()
    await page.waitForTimeout(300)
    await page.locator('#resetButton').click()
    await expect(page.locator('#playPauseButton')).toContainText('開始')
  })

  test('設定変更→実行→リセットの一連フローが動作すること', async ({ page }) => {
    await page.locator('#toggleModal').click()
    await page.locator('#massInput').fill('2')
    await page.locator('#closeModal').click()
    await page.locator('#playPauseButton').click()
    await page.waitForTimeout(300)
    await page.locator('#resetButton').click()
    await expect(page.locator('#navBar')).toBeVisible()
  })
})
