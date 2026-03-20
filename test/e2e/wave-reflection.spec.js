import { test, expect } from '@playwright/test'

/**
 * 波の反射 - E2Eテスト（画面操作）
 *
 * 波の発射・停止・リセットフローと設定変更を検証する。
 */
test.describe('波の反射 - 画面操作', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/simulations/wave-reflection/')
    await page.waitForSelector('canvas', { timeout: 10000 })
  })

  test('波の発射ボタンをクリックするとシミュレーションが動作すること', async ({ page }) => {
    await page.locator('#startButton').click()
    await expect(page.locator('canvas')).toBeVisible()
  })

  test('一時停止してから再開できること', async ({ page }) => {
    await page.locator('#startButton').click()
    await page.waitForTimeout(300)
    await page.locator('#stopButton').click()
    await page.waitForTimeout(200)
    await page.locator('#restartButton').click()
    await expect(page.locator('canvas')).toBeVisible()
  })

  test('リセットボタンでシミュレーションが初期化されること', async ({ page }) => {
    await page.locator('#startButton').click()
    await page.waitForTimeout(300)
    await page.locator('#resetButton').click()
    await expect(page.locator('canvas')).toBeVisible()
  })

  test('設定モーダルを開いて反射の種類を変更できること', async ({ page }) => {
    await page.locator('button[data-bs-target="#simulationSettingModal"]').click()
    await expect(page.locator('#simulationSettingModal')).toBeVisible()
    await page.locator('#reflectSelect').selectOption('自由端反射')
    await page.locator('[data-bs-dismiss="modal"]').click()
    await expect(page.locator('#simulationSettingModal')).toBeHidden()
  })

  test('設定モーダルで波の速度と振幅を変更できること', async ({ page }) => {
    await page.locator('button[data-bs-target="#simulationSettingModal"]').click()
    await page.locator('#speedInput').fill('2')
    await page.locator('#amplitudeInput').fill('2')
    await page.locator('[data-bs-dismiss="modal"]').click()
    await expect(page.locator('canvas')).toBeVisible()
  })
})
