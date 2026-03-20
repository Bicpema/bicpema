import { test, expect } from '@playwright/test'

/**
 * 力と加速度の関係 - E2Eテスト（画面操作）
 */
test.describe('力と加速度の関係 - 画面操作', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/vite/simulations/force-and-acceleration/')
    await page.waitForLoadState('domcontentloaded')
  })

  test('設定モーダルで質量を変更して値が保持されること', async ({ page }) => {
    await page.locator('#toggleModal').click()
    await page.locator('#massInput').fill('3')
    await page.locator('#closeModal').click()
    await page.locator('#toggleModal').click()
    await expect(page.locator('#massInput')).toHaveValue('3')
  })

  test('設定モーダルを開閉できること', async ({ page }) => {
    const modal = page.locator('#settingsModal')
    await page.locator('#toggleModal').click()
    await expect(modal).toBeVisible()
    await page.locator('#closeModal').click()
    await expect(modal).toBeHidden()
  })

  test('設定変更後にリセットしてもページが正常に保たれること', async ({ page }) => {
    await page.locator('#toggleModal').click()
    await page.locator('#massInput').fill('2')
    await page.locator('#closeModal').click()
    await page.locator('#resetButton').click()
    await expect(page.locator('#navBar')).toBeVisible()
  })
})
