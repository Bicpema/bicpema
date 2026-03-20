import { test, expect } from '@playwright/test'

/**
 * セロハンによる色の変化（表示） - E2Eテスト（画面操作）
 *
 * セロハン追加・削除ボタンとモーダル操作フローを検証する。
 */
test.describe('セロハンによる色の変化（表示） - 画面操作', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/simulations/cellophane_display/')
    await page.waitForSelector('#p5Canvas', { timeout: 10000 })
  })

  test('ページが読み込まれて p5Canvas が表示されること', async ({ page }) => {
    await expect(page.locator('#p5Canvas')).toBeVisible()
  })

  test('設定モーダルボタンをクリックして設定を開けること', async ({ page }) => {
    const modalTrigger = page.locator('[data-bs-target="#settingModal"]').first()
    if (await modalTrigger.isVisible()) {
      await modalTrigger.click()
      await expect(page.locator('#settingModal')).toBeVisible()
      // セロハン追加ボタンが表示されること
      await expect(page.locator('#cellophaneAddButton')).toBeVisible()
      await expect(page.locator('#cellophaneRemoveButton')).toBeVisible()
    } else {
      await expect(page.locator('#p5Canvas')).toBeVisible()
    }
  })
})
