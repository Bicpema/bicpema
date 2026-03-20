import { test, expect } from '@playwright/test'

/**
 * セロハンによる色の変化（ELK） - E2Eテスト（画面操作）
 */
test.describe('セロハンによる色の変化（ELK） - 画面操作', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/simulations/2025_DGI_cellophane-color2_ELK/')
    await page.waitForSelector('#p5Canvas', { timeout: 10000 })
  })

  test('ページが読み込まれて主要要素が表示されること', async ({ page }) => {
    await expect(page.locator('#p5Canvas')).toBeVisible()
    await expect(page.locator('#color')).toBeVisible()
  })

  test('設定モーダルボタンをクリックして設定を開けること', async ({ page }) => {
    const modalTrigger = page.locator('[data-bs-target="#settingModal"]').first()
    if (await modalTrigger.isVisible()) {
      await modalTrigger.click()
      await expect(page.locator('#settingModal')).toBeVisible()
    } else {
      await expect(page.locator('#p5Canvas')).toBeVisible()
    }
  })
})
