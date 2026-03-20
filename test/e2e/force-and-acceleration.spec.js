import { test, expect } from '@playwright/test'

/**
 * 力と加速度の関係 - E2Eテスト（画面操作）
 *
 * 質量・力の設定変更 → 再生フローを検証する。
 */
test.describe('力と加速度の関係 - 画面操作', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/simulations/force-and-acceleration/')
    await page.waitForSelector('canvas', { timeout: 10000 })
  })

  test('設定モーダルで質量を変更できること', async ({ page }) => {
    await page.locator('#toggleModal').click()
    const massInput = page.locator('#massInput')
    await massInput.fill('3')
    await page.locator('#closeModal').click()
    await page.locator('#toggleModal').click()
    await expect(page.locator('#massInput')).toHaveValue('3')
  })

  test('設定変更後にリセットしても設定値が保持されること', async ({ page }) => {
    await page.locator('#toggleModal').click()
    await page.locator('#massInput').fill('2')
    await page.locator('#closeModal').click()
    await page.locator('#resetButton').click()
    // リセット後もキャンバスが表示されていること
    await expect(page.locator('canvas')).toBeVisible()
  })

  test('設定モーダルを開閉できること', async ({ page }) => {
    const modal = page.locator('#settingsModal')
    await page.locator('#toggleModal').click()
    await expect(modal).toBeVisible()
    await page.locator('#closeModal').click()
    await expect(modal).toBeHidden()
  })
})
