import { test, expect } from '@playwright/test'

/**
 * ウェーブマシン - E2Eテスト（画面操作）
 *
 * 開始・停止・加速・減速ボタンのフローを検証する。
 */
test.describe('ウェーブマシン - 画面操作', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/simulations/wave-machine/')
    await page.waitForSelector('canvas', { timeout: 10000 })
  })

  test('開始ボタンをクリックできること', async ({ page }) => {
    const btn = page.locator('#startButton')
    await expect(btn).toBeVisible()
    await btn.click()
    await expect(page.locator('canvas')).toBeVisible()
  })

  test('停止ボタンをクリックできること', async ({ page }) => {
    await page.locator('#startButton').click()
    await page.waitForTimeout(200)
    await page.locator('#stopButton').click()
    await expect(page.locator('canvas')).toBeVisible()
  })

  test('加速ボタンをクリックできること', async ({ page }) => {
    await page.locator('#startButton').click()
    await page.waitForTimeout(200)
    await page.locator('#accelerationButton').click()
    await expect(page.locator('canvas')).toBeVisible()
  })

  test('減速ボタンをクリックできること', async ({ page }) => {
    await page.locator('#startButton').click()
    await page.waitForTimeout(200)
    await page.locator('#decelerationButton').click()
    await expect(page.locator('canvas')).toBeVisible()
  })
})
